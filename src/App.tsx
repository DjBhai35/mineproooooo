import { useState, useEffect } from 'react';
import { PublicLayout } from './layouts/PublicLayout';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public views
import { PublicViewBlueprint } from './views/PublicViewBlueprint';
import { AboutView } from './views/public/AboutView';
import { PlansView } from './views/public/PlansView';
import { HowItWorksView } from './views/public/HowItWorksView';
import { FaqView } from './views/public/FaqView';
import { ContactView } from './views/public/ContactView';
import { RiskDisclosureView } from './views/public/RiskDisclosureView';
import { TermsView } from './views/public/TermsView';
import { PrivacyView } from './views/public/PrivacyView';

// Blueprints and Showcases
import { UserDashboardBlueprint } from './views/UserDashboardBlueprint';
import { ReferralsView } from './views/user/ReferralsView';
import { AdminPanelBlueprint } from './views/AdminPanelBlueprint';
import { AuthViewBlueprint } from './views/AuthViewBlueprint';
import { DesignSystemShowcase } from './views/DesignSystemShowcase';
import { ArchitectureBlueprint } from './views/ArchitectureBlueprint';
import { LayoutMode } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<LayoutMode>('public');
  const [activeNav, setActiveNav] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userRoute, setUserRoute] = useState('dashboard');
  const [adminRoute, setAdminRoute] = useState('admin-dashboard');

  // Detect URL path on initial mount
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path === 'login') {
      setAuthMode('login');
      setCurrentMode('auth');
    } else if (path === 'register') {
      setAuthMode('register');
      setCurrentMode('auth');
    } else if (path === 'about') {
      setCurrentMode('public');
      setActiveNav('about');
    } else if (path === 'plans') {
      setCurrentMode('public');
      setActiveNav('plans');
    } else if (path === 'how-it-works') {
      setCurrentMode('public');
      setActiveNav('how-it-works');
    } else if (path === 'faq') {
      setCurrentMode('public');
      setActiveNav('faq');
    } else if (path === 'contact') {
      setCurrentMode('public');
      setActiveNav('contact');
    } else if (path === 'risk-disclosure') {
      setCurrentMode('public');
      setActiveNav('risk-disclosure');
    } else if (path === 'terms') {
      setCurrentMode('public');
      setActiveNav('terms');
    } else if (path === 'privacy') {
      setCurrentMode('public');
      setActiveNav('privacy');
    }
  }, []);

  const handleNavigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route === 'login' || route === 'register') {
      setAuthMode(route as 'login' | 'register');
      setCurrentMode('auth');
      window.history.pushState({}, '', `/${route}`);
      return;
    }

    setCurrentMode('public');
    setActiveNav(route);
    const newPath = route === 'home' ? '/' : `/${route}`;
    window.history.pushState({}, '', newPath);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setCurrentMode('auth');
    window.history.pushState({}, '', `/${mode}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="minepro-app-root">
      {/* View Rendering based on Current Mode & Active Route */}
      {currentMode === 'public' && (
        <PublicLayout
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onAuthClick={handleOpenAuth}
          onOpenBlueprint={(mode) => setCurrentMode(mode as LayoutMode)}
        >
          {activeNav === 'home' && (
            <PublicViewBlueprint
              onNavigate={handleNavigate}
              onGetStarted={() => handleOpenAuth('register')}
              onExplorePlans={() => handleNavigate('plans')}
              onSelectPlan={() => handleOpenAuth('register')}
            />
          )}

          {activeNav === 'about' && (
            <AboutView
              onExplorePlans={() => handleNavigate('plans')}
              onGetStarted={() => handleOpenAuth('register')}
            />
          )}

          {activeNav === 'plans' && (
            <PlansView
              onSelectPlan={() => handleOpenAuth('register')}
              onGetStarted={() => handleOpenAuth('register')}
            />
          )}

          {activeNav === 'how-it-works' && (
            <HowItWorksView
              onGetStarted={() => handleOpenAuth('register')}
              onExplorePlans={() => handleNavigate('plans')}
            />
          )}

          {activeNav === 'faq' && (
            <FaqView
              onContactSupport={() => handleNavigate('contact')}
            />
          )}

          {activeNav === 'contact' && (
            <ContactView
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {activeNav === 'risk-disclosure' && (
            <RiskDisclosureView
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {activeNav === 'terms' && (
            <TermsView
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {activeNav === 'privacy' && (
            <PrivacyView
              onBackToHome={() => handleNavigate('home')}
            />
          )}
        </PublicLayout>
      )}

      {currentMode === 'auth' && (
        <AuthLayout 
          title={authMode === 'login' ? 'Access Your Mining Node' : 'Create Your Mining Account'}
          subtitle={authMode === 'login' ? 'Secure authentication with cryptographic session validation' : 'Start your 24-hour deterministic reward cycles'}
          onBackToHome={() => handleNavigate('home')}
        >
          <AuthViewBlueprint
            initialMode={authMode}
            onSuccess={() => setCurrentMode('user')}
            onBackToHome={() => handleNavigate('home')}
          />
        </AuthLayout>
      )}

      {currentMode === 'user' && (
        <UserLayout
          activeRoute={userRoute}
          onNavigate={(route) => setUserRoute(route)}
          onLogout={() => handleNavigate('home')}
          userName="Ahmad Sikander"
        >
          {userRoute === 'referrals' ? (
            <ReferralsView />
          ) : (
            <UserDashboardBlueprint
              onQuickAction={(action) => {
                if (action === 'invest') {
                  handleNavigate('plans');
                } else if (action === 'transactions') {
                  // Keep on dashboard or switch if needed
                }
              }}
              onOpenPlans={() => handleNavigate('plans')}
            />
          )}
        </UserLayout>
      )}

      {currentMode === 'admin' && (
        <AdminLayout
          activeRoute={adminRoute}
          onNavigate={(route) => setAdminRoute(route)}
          onLogout={() => handleNavigate('home')}
        >
          <AdminPanelBlueprint />
        </AdminLayout>
      )}

      {currentMode === 'design-system' && (
        <div className="container-xl py-4">
          <div className="mb-3">
            <button
              onClick={() => handleNavigate('home')}
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left" /> Back to Public View
            </button>
          </div>
          <DesignSystemShowcase />
        </div>
      )}

      {currentMode === 'blueprint' && (
        <div className="container-xl py-4">
          <div className="mb-3">
            <button
              onClick={() => handleNavigate('home')}
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left" /> Back to Public View
            </button>
          </div>
          <ArchitectureBlueprint />
        </div>
      )}
    </div>
  );
}
