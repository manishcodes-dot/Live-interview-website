import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export function AcceptInvitePage() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();

  // Invite state
  const isExpired = token === 'expired';
  const assignedEmail = 'elena.in@acme.corp';
  const assignedRole = 'Interviewer';
  const assignedBy = 'Marcus Vance (Admin)';

  // Form states
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('Staff Engineer');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Role Request Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState('Admin');
  const [requestReason, setRequestReason] = useState('');
  const [roleRequestSent, setRoleRequestSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMessage('You must accept the terms of service to create your account.');
      return;
    }
    if (password.length < 12) {
      setErrorMessage('Password must be at least 12 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    await new Promise((r) => setTimeout(r, 800));

    // Redirect to staff app
    navigate('/app');
  };

  const handleSendRoleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleRequestSent(true);
    setTimeout(() => {
      setIsRoleModalOpen(false);
      setRoleRequestSent(false);
    }, 1500);
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
        <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
              C
            </div>
            <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-[460px] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-[24px] font-semibold text-ink tracking-tight">This invitation has expired</h1>
            <p className="text-[14px] text-muted leading-relaxed">
              Staff invitations expire after 7 days. Please ask an administrator at your organization to resend an invite.
            </p>
            <Link to="/signin" className="inline-block pt-2 text-[#D14509] font-medium hover:underline text-[14px]">
              Return to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </Link>
        <span className="text-[13px] text-muted font-mono">
          Acme Corporation · Staff Invitation
        </span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[500px]">
          <div className="mb-8">
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Accept Invitation · Section 3.3
            </div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight mt-1">
              Set up your staff account
            </h1>
            <p className="text-[14px] text-muted mt-2">
              You’ve been invited to join the CodeRoom workspace for Acme Corporation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border border-divider rounded-[8px] p-8 bg-white shadow-sm space-y-4">
            {/* Email (Locked) */}
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Work Email (Locked)
              </label>
              <input
                type="email"
                readOnly
                value={assignedEmail}
                className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] font-mono bg-[#FAFAFA] text-muted cursor-not-allowed"
              />
            </div>

            {/* Read-Only Assigned Role Box (Roles Spec Section 7) */}
            <div className="p-3.5 rounded-[6px] border border-divider bg-[#FFFDFB] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted">Assigned Role</div>
                <div className="text-[14px] font-semibold text-ink mt-0.5">
                  {assignedRole} <span className="text-[12px] text-muted font-normal">(by {assignedBy})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="text-[12px] text-[#D14509] hover:underline font-medium"
              >
                Request a different role
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Staff Backend Engineer"
                className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
              />
            </div>

            {/* Password (12+ chars rule) */}
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Set Account Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 12 characters"
                className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-muted mt-1">
                <span>Must be at least 12 characters</span>
                <span className={password.length >= 12 ? 'text-emerald-700 font-semibold' : 'text-muted'}>
                  {password.length}/12 chars
                </span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="pt-2 flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 text-[#D14509] rounded border-divider cursor-pointer w-4 h-4"
              />
              <span className="text-[13px] text-muted leading-tight">
                I accept the <Link to="/terms" target="_blank" className="text-[#D14509] hover:underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-[#D14509] hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            {errorMessage && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-[12px]">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              Complete Account Setup
            </Button>
          </form>
        </div>
      </div>

      {/* Role Request Modal (Section 3.3) */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Request a Different Role (Section 3.3)"
      >
        <form onSubmit={handleSendRoleRequest} className="space-y-4">
          <p className="text-[13px] text-muted">
            To maintain security, staff roles cannot be self-selected. Submitting this form sends an approval request to your organization's administrators.
          </p>

          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Requested Role
            </label>
            <select
              value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white focus:outline-none focus:border-[#D14509]"
            >
              <option value="Admin">Admin (Full Platform Governance & Settings)</option>
              <option value="Interviewer">Interviewer (Conduct Interviews & Evaluations)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Reason for Request
            </label>
            <textarea
              rows={3}
              required
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="e.g. I am authoring questions for our distributed systems hiring loop..."
              className="w-full p-2.5 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
            />
          </div>

          {roleRequestSent && (
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px]">
              Request dispatched to Marcus Vance. You may continue onboarding with your current role.
            </div>
          )}

          <div className="pt-3 border-t border-divider flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Request to Admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

