import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaStep) {
      if (!email || !password) {
        setError('Please enter your work email and password.');
        return;
      }
      setIsLoading(true);
      setError('');
      await new Promise((r) => setTimeout(r, 600));

      if (email && password.length >= 6) {
        // If admin or company requires MFA (Section 4.1), ask for TOTP code
        if (email.includes('admin') || email.includes('marcus')) {
          setMfaStep(true);
          setIsLoading(false);
        } else {
          navigate('/app');
        }
      } else {
        setError('Email or password is incorrect.');
        setIsLoading(false);
      }
    } else {
      // MFA Verification Step (Section 3.2: POST /v1/auth/mfa/verify)
      if (mfaCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code.');
        return;
      }
      setIsLoading(true);
      setError('');
      await new Promise((r) => setTimeout(r, 600));
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      {/* Navigation */}
      <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </Link>
        <span className="text-[14px] text-muted space-x-2">
          <span>Need an account?</span>
          <Link to="/create-org" className="text-[#D14509] hover:underline font-medium">
            Create Org
          </Link>
        </span>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-semibold text-ink tracking-tight">Staff Sign in</h1>
            <p className="text-[14px] text-muted mt-2">
              Candidates access their room directly via their secure invitation link.
            </p>
          </div>

          <div className="border border-divider rounded-[8px] p-8 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!mfaStep ? (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-ink mb-1.5">
                      Work email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="interviewer@company.com"
                      className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509] transition-colors"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[13px] font-medium text-ink">Password</label>
                      <Link to="/forgot-password" className="text-[12px] text-[#D14509] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509] transition-colors"
                      autoComplete="current-password"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] text-[13px] leading-relaxed">
                    <strong>Two-Factor Authentication Required:</strong> Enter the 6-digit verification code from your authenticator app.
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink mb-1.5">
                      Authenticator TOTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full h-10 px-3 border border-divider rounded-[6px] text-[18px] font-mono tracking-widest text-center text-ink focus:outline-none focus:border-[#D14509]"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-600 text-[12px]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#D14509] hover:bg-[#b83c07] disabled:opacity-60 text-white font-semibold rounded-[6px] text-[14px] transition-colors"
              >
                {isLoading ? 'Verifying...' : mfaStep ? 'Verify & Continue' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 relative flex items-center">
              <div className="flex-1 border-t border-divider" />
              <span className="px-3 text-[12px] text-muted">or continue with SSO</span>
              <div className="flex-1 border-t border-divider" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="h-10 border border-divider rounded-[6px] text-[13px] font-medium text-ink hover:bg-[#FFF7F1] transition-colors flex items-center justify-center space-x-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="h-10 border border-divider rounded-[6px] text-[13px] font-medium text-ink hover:bg-[#FFF7F1] transition-colors flex items-center justify-center space-x-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.378 0H2.622C1.172 0 0 1.172 0 2.622v18.756C0 22.828 1.172 24 2.622 24h18.756C22.828 24 24 22.828 24 21.378V2.622C24 1.172 22.828 0 21.378 0zM7.2 20.4H3.6V9h3.6v11.4zM5.4 7.44a2.16 2.16 0 110-4.32 2.16 2.16 0 010 4.32zM20.4 20.4h-3.6v-5.556c0-1.322-.024-3.024-1.842-3.024-1.842 0-2.124 1.44-2.124 2.928V20.4H9.24V9h3.456v1.56h.048c.48-.912 1.656-1.872 3.408-1.872 3.648 0 4.32 2.4 4.32 5.52L20.4 20.4z" />
                </svg>
                <span>SAML SSO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

