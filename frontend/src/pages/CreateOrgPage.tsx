import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export function CreateOrgPage() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('51-250');
  const [timeZone, setTimeZone] = useState('UTC');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the terms of service.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    await new Promise((r) => setTimeout(r, 900));

    // Redirect to platform as Org Admin
    navigate('/app');
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
        <span className="text-[14px] text-muted">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#D14509] hover:underline font-medium">
            Sign in
          </Link>
        </span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[540px]">
          <div className="mb-8">
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Organization Setup · Section 3.4
            </div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight mt-1">
              Create your organization workspace
            </h1>
            <p className="text-[14px] text-muted mt-2">
              As the creator of this organization, you will automatically be assigned the <strong>Admin</strong> role.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border border-divider rounded-[8px] p-8 bg-white shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Technologies"
                  className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] bg-white text-ink focus:outline-none focus:border-[#D14509]"
                >
                  <option value="1-20">1 - 20 employees</option>
                  <option value="21-50">21 - 50 employees</option>
                  <option value="51-250">51 - 250 employees</option>
                  <option value="251-1000">251 - 1,000 employees</option>
                  <option value="1000+">1,000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Default Time Zone
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] bg-white text-ink focus:outline-none focus:border-[#D14509]"
                >
                  <option value="UTC">UTC (Universal Coordinated)</option>
                  <option value="America/New_York">US Eastern (ET)</option>
                  <option value="America/Los_Angeles">US Pacific (PT)</option>
                  <option value="Europe/London">Europe / London (GMT/BST)</option>
                  <option value="Asia/Singapore">Asia / Singapore (SGT)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-divider grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Chen"
                  className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@acme.com"
                  className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Admin Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 12 characters"
                className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] font-mono text-muted mt-1 block">
                Must be at least 12 characters and check against breached password registries.
              </span>
            </div>

            <label className="pt-2 flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 text-[#D14509] rounded border-divider cursor-pointer w-4 h-4"
              />
              <span className="text-[13px] text-muted leading-tight">
                I agree to the <Link to="/terms" target="_blank" className="text-[#D14509] hover:underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-[#D14509] hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            {error && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-[12px]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full space-x-2"
            >
              <span>Create Organization & Start</span>
              <ArrowRight size={14} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

