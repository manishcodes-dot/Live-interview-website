import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </Link>
        <Link to="/signin" className="text-[14px] text-muted hover:text-ink flex items-center space-x-1">
          <ArrowLeft size={14} />
          <span>Back to sign in</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {submitted ? (
            <div className="border border-divider rounded-[8px] p-8 bg-white shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h1 className="text-[20px] font-semibold text-ink tracking-tight">Reset Link Dispatched</h1>
              <p className="text-[14px] text-muted leading-relaxed">
                If that account exists in CodeRoom, we sent a password reset link to <strong className="text-ink">{email}</strong>. The link expires in 30 minutes.
              </p>
              <div className="pt-2">
                <Link to="/signin" className="text-[13px] text-[#D14509] hover:underline font-medium">
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-[26px] font-semibold text-ink tracking-tight">Reset your password</h1>
                <p className="text-[14px] text-muted mt-2">
                  Enter your work email and we'll send you an encrypted link to reset your credentials.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="border border-divider rounded-[8px] p-8 bg-white shadow-sm space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-ink mb-1.5">Work email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Send Reset Instructions
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

