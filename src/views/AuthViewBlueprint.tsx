import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Alert } from '../components/ui/Alert';

interface AuthViewBlueprintProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onBackToHome?: () => void;
}

export const AuthViewBlueprint: React.FC<AuthViewBlueprintProps> = ({
  initialMode = 'login',
  onSuccess,
  onBackToHome,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
    setAuthSuccessMsg(false);
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('REF-MINEPRO-77');
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccessMsg(true);
      setTimeout(() => {
        onSuccess?.();
      }, 900);
    }, 600);
  };

  return (
    <div>
      {/* Mode Switcher Pills */}
      <div className="d-flex p-1 rounded-3 bg-light border mb-4">
        <button
          type="button"
          onClick={() => { setMode('login'); setAuthSuccessMsg(false); }}
          className={`btn btn-sm flex-fill fw-bold rounded-2 ${
            mode === 'login' ? 'bg-white shadow-sm text-dark' : 'text-muted'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setAuthSuccessMsg(false); }}
          className={`btn btn-sm flex-fill fw-bold rounded-2 ${
            mode === 'register' ? 'bg-white shadow-sm text-dark' : 'text-muted'
          }`}
        >
          Create Account
        </button>
      </div>

      {authSuccessMsg && (
        <Alert type="success" title="Session Authenticated">
          {mode === 'login' ? 'Authorizing secure session...' : 'Account created! Redirecting...'}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <FormInput
            label="Username"
            placeholder="e.g. SatoshiMiner"
            icon="bi-person"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <FormInput
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon="bi-envelope"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter secure password"
          icon="bi-key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightAddon={
            <button
              type="button"
              className="btn btn-link p-0 text-muted"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          }
          helperText={mode === 'register' ? 'Minimum 8 characters with letters & numbers' : undefined}
          required
        />

        {mode === 'register' && (
          <FormInput
            label="Referral Code (Optional)"
            placeholder="Enter sponsor referral code"
            icon="bi-gift"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            helperText="Connects you to multi-level affiliate node rewards"
          />
        )}

        <div className="d-flex align-items-center justify-content-between mb-4 small">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
            <label className="form-check-label text-muted" htmlFor="rememberMe">
              Remember node
            </label>
          </div>
          {mode === 'login' && (
            <a href="#forgot" className="text-decoration-none text-success fw-semibold">
              Forgot password?
            </a>
          )}
        </div>

        <Button
          variant="black"
          size="md"
          fullWidth
          type="submit"
          isLoading={isLoading}
        >
          {mode === 'login' ? 'Sign In to MinePro' : 'Register & Start Mining'}
        </Button>
      </form>

      <div className="mt-4 pt-3 border-top text-center text-muted small">
        {mode === 'login' ? (
          <span>
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="btn btn-link p-0 text-success fw-bold text-decoration-none"
            >
              Sign Up Now
            </button>
          </span>
        ) : (
          <span>
            Already registered with MinePro?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="btn btn-link p-0 text-success fw-bold text-decoration-none"
            >
              Sign In
            </button>
          </span>
        )}
      </div>

      {onBackToHome && (
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="btn btn-link text-muted small text-decoration-none hover-text-success"
          >
            <i className="bi bi-arrow-left me-1" /> Return to Public Website
          </button>
        </div>
      )}
    </div>
  );
};
