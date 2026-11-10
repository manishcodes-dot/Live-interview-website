import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { SignInPage } from './pages/SignInPage';
import { BookDemoPage } from './pages/BookDemoPage';
import { SecurityPage } from './pages/SecurityPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CandidateJoinPage } from './pages/CandidateJoinPage';
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import { CreateOrgPage } from './pages/CreateOrgPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Marketing site pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/demo" element={<Navigate to="/pricing" replace />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Authentication & Onboarding flows (Spec Section 3 & 4) */}
        <Route path="/join/:token" element={<CandidateJoinPage />} />
        <Route path="/invite/:token" element={<AcceptInvitePage />} />
        <Route path="/create-org" element={<CreateOrgPage />} />
        <Route path="/signup" element={<CreateOrgPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* SaaS platform application */}
        <Route path="/app/*" element={<App />} />

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
