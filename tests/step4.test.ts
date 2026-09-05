import Decimal from 'decimal.js';
import { serverDb } from '../src/server/db';
import { RewardCycleEngine } from '../src/server/services/rewardCycleEngine';
import { ReferralEngine } from '../src/server/services/referralEngine';
import { SettingsService } from '../src/server/config/settingsService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('  MINEPRO STEP 4 AUTOMATED TEST SUITE');
  console.log('  Testing Reward Cycle Engine, Claims & Multi-Level Referrals');
  console.log('======================================================\n');

  // ----------------------------------------------------
  // SUITE 1: REWARD CYCLE ENGINE
  // ----------------------------------------------------
  console.log('📦 [1/2] TESTING REWARD CYCLE ENGINE & CLAIMS...');

  // Test 1: Decimal Reward Calculation
  const calculatedReward = RewardCycleEngine.calculateReward('500.00000000', '3.00');
  assert(
    calculatedReward.equals(new Decimal('15.00000000')),
    'Reward Calculation uses Decimal and yields exact $15.00 for $500 at 3.00%',
    `Got: ${calculatedReward.toString()}`
  );

  // Test 2: Cycle Creation
  const testUser = await serverDb.user.create({
    data: {
      email: 'test_miner@minepro.network',
      username: 'test_miner_99',
      fullName: 'Test Miner',
      passwordHash: 'hash',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'TEST-MINER-99',
      referredById: null,
    },
  });

  await serverDb.wallet.create({
    data: {
      userId: testUser.id,
      balance: '1000.00000000',
      totalDeposited: '1000.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '500.00000000',
      totalEarned: '0.00000000',
      totalReferral: '0.00000000',
      lockedBalance: '0.00000000',
    },
  });

  const testInv = await serverDb.investment.create({
    data: {
      userId: testUser.id,
      planId: 'plan_standard',
      amount: '500.00000000',
      dailyReward: '15.00000000',
      totalEarned: '0.00000000',
      claimsCount: 0,
      status: 'ACTIVE',
      activatedAt: new Date().toISOString(),
      lastClaimAt: null,
      nextClaimAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    },
  });

  const cycle1 = await RewardCycleEngine.createInitialCycle(testInv.id, testUser.id);
  assert(cycle1.cycleNumber === 1, 'Initial Cycle created with cycleNumber = 1');
  assert(cycle1.status === 'RUNNING', 'Initial Cycle status is RUNNING');
  assert(cycle1.rewardAmount === '15.00000000', 'Authoritative rewardAmount matches plan rate');

  // Test 3: Correct start/end timestamps
  const startMs = new Date(cycle1.cycleStartedAt).getTime();
  const endMs = new Date(cycle1.cycleEndsAt).getTime();
  const expectedDurationHours = await SettingsService.getCycleDurationHours();
  const actualDurationHours = (endMs - startMs) / (3600 * 1000);
  assert(
    Math.abs(actualDurationHours - expectedDurationHours) < 0.01,
    `Cycle start/end timestamps match configured duration (${expectedDurationHours} hours)`
  );

  // Test 4: Cycle NOT claimable before completion (server clock)
  let prematureClaimRejected = false;
  try {
    await RewardCycleEngine.executeRewardClaim(cycle1.id, testUser.id);
  } catch (err: any) {
    if (err.message.includes('CYCLE_STILL_RUNNING')) {
      prematureClaimRejected = true;
    }
  }
  assert(prematureClaimRejected, 'Cycle NOT claimable before completion (Server clock enforced)');

  // Test 5: Prevent Duplicate Initial Cycle Creation
  const duplicateCycle = await RewardCycleEngine.createInitialCycle(testInv.id, testUser.id);
  assert(duplicateCycle.id === cycle1.id, 'Duplicate initial cycle creation prevented');

  // Test 6: Advance cycle clock to completed
  await serverDb.rewardCycle.update({
    where: { id: cycle1.id },
    data: {
      cycleEndsAt: new Date(Date.now() - 5000).toISOString(), // Ended 5 seconds ago
    },
  });

  // Test 7: Successful Claim After Completion
  const claimResult = await RewardCycleEngine.executeRewardClaim(cycle1.id, testUser.id, '192.168.1.1');
  assert(claimResult.success, 'Successful claim executed after cycle completion');
  assert(claimResult.claimReference.startsWith('RWD-'), 'Unique claim reference formatted with RWD-');
  assert(claimResult.rewardAmount === '15.00000000', 'Exact authoritative reward credited ($15.00)');

  // Test 8: Balance Updated
  const updatedWallet = await serverDb.wallet.findUnique({ where: { userId: testUser.id } });
  assert(
    updatedWallet?.balance === '1015.00000000',
    'User wallet balance atomically updated from $1000.00 to $1015.00',
    `Got: ${updatedWallet?.balance}`
  );
  assert(
    updatedWallet?.totalEarned === '15.00000000',
    'Wallet totalEarned updated to $15.00'
  );

  // Test 9: REWARD Transaction Created
  const rewardTrx = await serverDb.transaction.findUnique({ where: { reference: claimResult.transactionReference } });
  assert(rewardTrx !== null, 'REWARD ledger transaction created in database');
  assert(rewardTrx?.type === 'CYCLE_REWARD', 'Transaction type is CYCLE_REWARD');
  assert(rewardTrx?.netAmount === '15.00000000', 'Transaction amount matches reward');

  // Test 10: Duplicate Claim Rejected (Idempotency)
  let duplicateClaimRejected = false;
  try {
    await RewardCycleEngine.executeRewardClaim(cycle1.id, testUser.id);
  } catch (err: any) {
    if (err.message.includes('ALREADY_CLAIMED')) {
      duplicateClaimRejected = true;
    }
  }
  assert(duplicateClaimRejected, 'Duplicate claim rejected for already claimed cycle');

  // Test 11: Next Cycle Created
  assert(claimResult.nextCycle !== null, 'Next cycle created automatically');
  assert(claimResult.nextCycle?.cycleNumber === 2, 'Next cycle has cycleNumber = 2');
  assert(claimResult.nextCycle?.status === 'RUNNING', 'Next cycle status is RUNNING');

  // Test 12: Missed claim policy configurable
  const policy = await SettingsService.getMissedClaimPolicy();
  assert(policy === 'CLAIM_REQUIRED', `Missed claim policy configured as ${policy}`);

  // ----------------------------------------------------
  // SUITE 2: REFERRAL SYSTEM & MULTI-LEVEL REWARDS
  // ----------------------------------------------------
  console.log('\n👥 [2/2] TESTING REFERRAL ENGINE & MULTI-LEVEL REWARDS...');

  // Test 13: Referral Code Validation & Self-Referral Rejected
  let selfRefRejected = false;
  try {
    await ReferralEngine.registerReferralRelationship(testUser.id, testUser.referralCode);
  } catch (err: any) {
    if (err.message.includes('SELF_REFERRAL_FORBIDDEN')) {
      selfRefRejected = true;
    }
  }
  assert(selfRefRejected, 'Self-referral rejected server-side');

  // Test 14: Invalid Referral Code Rejected
  let invalidCodeRejected = false;
  try {
    await ReferralEngine.registerReferralRelationship(testUser.id, 'NON-EXISTENT-CODE');
  } catch (err: any) {
    if (err.message.includes('INVALID_REFERRAL_CODE')) {
      invalidCodeRejected = true;
    }
  }
  assert(invalidCodeRejected, 'Invalid referral code rejected server-side');

  // Test 15: Create Referral Hierarchy: UplineA -> UplineB -> NewBuyer
  const uplineA = await serverDb.user.create({
    data: {
      email: 'upline_a@minepro.network',
      username: 'upline_a',
      fullName: 'Upline A (Level 2)',
      passwordHash: 'hash',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'REF-UPLINE-A',
      referredById: null,
    },
  });
  await serverDb.wallet.create({
    data: {
      userId: uplineA.id,
      balance: '100.00000000',
      totalDeposited: '100.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '100.00000000',
      totalEarned: '0.00000000',
      totalReferral: '0.00000000',
      lockedBalance: '0.00000000',
    },
  });

  const uplineB = await serverDb.user.create({
    data: {
      email: 'upline_b@minepro.network',
      username: 'upline_b',
      fullName: 'Upline B (Level 1)',
      passwordHash: 'hash',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'REF-UPLINE-B',
      referredById: null,
    },
  });
  await serverDb.wallet.create({
    data: {
      userId: uplineB.id,
      balance: '100.00000000',
      totalDeposited: '100.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '100.00000000',
      totalEarned: '0.00000000',
      totalReferral: '0.00000000',
      lockedBalance: '0.00000000',
    },
  });

  // Link uplineB under uplineA
  await ReferralEngine.registerReferralRelationship(uplineB.id, uplineA.referralCode);

  const buyer = await serverDb.user.create({
    data: {
      email: 'buyer@minepro.network',
      username: 'buyer_node',
      fullName: 'Buyer Node',
      passwordHash: 'hash',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'REF-BUYER',
      referredById: null,
    },
  });
  await serverDb.wallet.create({
    data: {
      userId: buyer.id,
      balance: '1000.00000000',
      totalDeposited: '1000.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '1000.00000000',
      totalEarned: '0.00000000',
      totalReferral: '0.00000000',
      lockedBalance: '0.00000000',
    },
  });

  // Link buyer under uplineB (so uplineB is Level 1, uplineA is Level 2)
  await ReferralEngine.registerReferralRelationship(buyer.id, uplineB.referralCode);

  // Verify multi-level traversal edges
  const edges = await serverDb.referralRelationship.findMany({ where: { downlineUserId: buyer.id } });
  assert(edges.length === 2, 'Multi-level upline hierarchy established (2 upline levels for buyer)');

  const l1Edge = edges.find((e) => e.level === 1);
  const l2Edge = edges.find((e) => e.level === 2);
  assert(l1Edge?.uplineUserId === uplineB.id, 'Level 1 upline is correctly upline_b');
  assert(l2Edge?.uplineUserId === uplineA.id, 'Level 2 upline is correctly upline_a');

  // Test 16: Multi-level referral reward calculation for $1,000 investment
  // Configured default: Level 1 = 7.00% ($70.00), Level 2 = 3.00% ($30.00)
  const qualifyingAmount = '1000.00000000';
  const eventId = 'inv_buyer_test_1000';
  const refResult = await ReferralEngine.processQualifyingRewards(buyer.id, qualifyingAmount, eventId);

  assert(refResult.rewardsCreated.length === 2, 'Multi-level rewards created for both active uplines');

  const l1Reward = refResult.rewardsCreated.find((r) => r.level === 1);
  const l2Reward = refResult.rewardsCreated.find((r) => r.level === 2);

  assert(
    l1Reward?.rewardAmount === '70.00000000' && l1Reward.beneficiaryId === uplineB.id,
    'Level 1 referrer received exact 7.00% ($70.00) calculated with Decimal'
  );
  assert(
    l2Reward?.rewardAmount === '30.00000000' && l2Reward.beneficiaryId === uplineA.id,
    'Level 2 referrer received exact 3.00% ($30.00) calculated with Decimal'
  );

  // Test 17: Referral Wallets and Transactions Created
  const wB = await serverDb.wallet.findUnique({ where: { userId: uplineB.id } });
  assert(wB?.balance === '170.00000000', 'Level 1 wallet balance credited from $100.00 to $170.00');

  const wA = await serverDb.wallet.findUnique({ where: { userId: uplineA.id } });
  assert(wA?.balance === '130.00000000', 'Level 2 wallet balance credited from $100.00 to $130.00');

  const refTrxB = await serverDb.transaction.findUnique({ where: { reference: l1Reward?.transactionReference } });
  assert(refTrxB !== null && refTrxB.type === 'REFERRAL_REWARD', 'REFERRAL_REWARD transaction created for Level 1');

  // Test 18: Duplicate Referral Reward Prevented
  const duplicateRefResult = await ReferralEngine.processQualifyingRewards(buyer.id, qualifyingAmount, eventId);
  assert(
    duplicateRefResult.rewardsCreated.length === 0,
    'Duplicate referral rewards prevented for same qualifying event'
  );

  // Test 19: Referral Dashboard Summary Output
  const summary = await ReferralEngine.getDashboardSummary(uplineA.id);
  assert(summary.totalReferrals > 0, 'Referral dashboard returns valid total referrals count');
  assert(summary.levelCounts.level2 >= 1, 'Referral dashboard shows Level 2 count >= 1');
  assert(parseFloat(summary.totalReferralEarnings) >= 30, 'Referral dashboard shows total earnings >= $30.00');

  console.log('\n======================================================');
  console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
