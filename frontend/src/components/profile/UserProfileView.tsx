import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Button } from '../common/Button';
import {
  User,
  Mail,
  Shield,
  Key,
  Clock,
  Building2,
  Laptop,
  Bell,
  Code2,
  CheckCircle2,
  Save,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileViewProps {
  currentRole: UserRole;
  userName: string;
  userEmail: string;
  onUpdateProfile?: (updated: { name: string; email: string }) => void;
  onNotify?: (msg: { type: 'success' | 'error' | 'info'; title?: string; message: string }) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentRole,
  userName,
  userEmail,
  onUpdateProfile,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'preferences'>('general');

  // General Form State
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [jobTitle, setJobTitle] = useState('Senior Staff Systems Engineer');
  const [team, setTeam] = useState('Distributed Systems & Execution Plane');
  const [organization, setOrganization] = useState('Acme Corporation');
  const [timeZone, setTimeZone] = useState('UTC');
  const [bio, setBio] = useState(
    'Leading backend and systems architecture interview loops. Passionate about concurrent programming, distributed consensus, and fair evaluations.'
  );

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Preferences Form State
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('vs-dark');
  const [editorKeybinding, setEditorKeybinding] = useState<'standard' | 'vim' | 'emacs'>('standard');
  const [fontSize, setFontSize] = useState('14');
  const [defaultLanguage, setDefaultLanguage] = useState('typescript');
  const [notifyBeforeInterview, setNotifyBeforeInterview] = useState(true);
  const [notifyAssessmentSubmit, setNotifyAssessmentSubmit] = useState(true);
  const [notifyScorecardDue, setNotifyScorecardDue] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onUpdateProfile) {
        onUpdateProfile({ name, email });
      }
      if (onNotify) {
        onNotify({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your personal information and profile settings have been saved.',
        });
      }
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 12) {
      setPasswordError('New password must be at least 12 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onNotify) {
        onNotify({
          type: 'success',
          title: 'Password Changed',
          message: 'Your account password has been successfully updated.',
        });
      }
    }, 600);
  };

  const handleSavePreferences = () => {
    if (onNotify) {
      onNotify({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Editor and notification preferences updated.',
      });
    }
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1100px] mx-auto px-12 py-10 space-y-8">
        {/* Profile Card Header */}
        <div className="border border-divider rounded-[8px] p-6 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-full bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] flex items-center justify-center text-[22px] font-bold font-mono shadow-inner">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-[22px] font-semibold text-ink tracking-tight">{name}</h1>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/30">
                  {currentRole}
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[13px] text-muted mt-1 flex items-center space-x-3">
                <span>{email}</span>
                <span>•</span>
                <span>{organization}</span>
                <span>•</span>
                <span>{jobTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[12px] font-mono text-muted bg-[#FAFAFA] border border-divider px-3 py-1.5 rounded-[6px]">
            <Clock size={13} className="text-[#D14509]" />
            <span>Time Zone: {timeZone}</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-8 border-b border-divider">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 text-[14px] font-medium transition-colors relative flex items-center space-x-2 ${
              activeTab === 'general' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <User size={15} />
            <span>Personal Info</span>
            {activeTab === 'general' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-[14px] font-medium transition-colors relative flex items-center space-x-2 ${
              activeTab === 'security' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <Shield size={15} />
            <span>Security & Password</span>
            {activeTab === 'security' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 text-[14px] font-medium transition-colors relative flex items-center space-x-2 ${
              activeTab === 'preferences' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <Code2 size={15} />
            <span>Editor & Notifications</span>
            {activeTab === 'preferences' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>
        </div>

        {/* ─── TAB 1: General Info ────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-5">
              <h3 className="text-[16px] font-semibold text-ink border-b border-divider pb-3">
                Account Details
              </h3>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Work Email (Locked)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-muted bg-[#FAFAFA] cursor-not-allowed font-mono"
                  />
                  <span className="text-[11px] text-muted mt-1 block">
                    Contact your Org Admin to modify your work email address.
                  </span>
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Team / Department
                  </label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Organization
                  </label>
                  <div className="flex items-center space-x-2">
                    <Building2 size={16} className="text-muted" />
                    <span className="text-[14px] font-semibold text-ink">{organization}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509] cursor-pointer"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST / EDT)</option>
                    <option value="America/Chicago">America/Chicago (CST / CDT)</option>
                    <option value="America/Denver">America/Denver (MST / MDT)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
                    <option value="Europe/London">Europe/London (GMT / BST)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET / CEST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                  Interviewer Bio & Introduction
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Displayed to candidates during room introduction..."
                  className="w-full p-3 border border-divider rounded-[6px] text-[13px] text-ink focus:outline-none focus:border-[#D14509] leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-divider flex items-center justify-end">
                <Button type="submit" variant="primary" disabled={isSaving} className="space-x-1.5">
                  <Save size={14} />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ─── TAB 2: Security & Password ─────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password Change */}
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-4">
              <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
                <Key size={17} className="text-[#D14509]" />
                <span>Change Password</span>
              </div>

              {passwordError && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center space-x-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center space-x-2">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  <span>Password updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    New Password (Min 12 characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[14px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                    Update Password
                  </Button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink">
                  <Shield size={17} className="text-[#D14509]" />
                  <span>Two-Factor Authentication (2FA)</span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {mfaEnabled ? 'Enabled & Enforced' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div className="space-y-1 max-w-xl">
                  <div className="text-[14px] font-semibold text-ink">
                    Time-based One-Time Password (TOTP)
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed">
                    A 6-digit verification code from your authenticator app (Google Authenticator, 1Password, or Okta Verify) is required whenever signing in from a new browser session.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onNotify) {
                      onNotify({
                        type: 'info',
                        title: 'TOTP Configuration',
                        message: 'Your TOTP device is managed by company security policy.',
                      });
                    }
                  }}
                >
                  Manage Authenticator
                </Button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-4">
              <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
                <Laptop size={17} className="text-[#D14509]" />
                <span>Active Login Sessions</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 border border-divider rounded-[6px] bg-[#FAFAFA]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[12px]">
                      ✓
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-ink flex items-center space-x-2">
                        <span>Current Browser Session</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Active Now
                        </span>
                      </div>
                      <div className="text-[12px] text-muted font-mono">
                        Windows 11 · Chrome 130 · IP: 192.0.2.18
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] font-mono text-muted">Session ID: sess-918a</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: Editor & Notifications ──────────────────────────────── */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-6">
              <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
                <Code2 size={17} className="text-[#D14509]" />
                <span>In-Room Monaco Editor Defaults</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Editor Theme
                  </label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value as any)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                  >
                    <option value="vs-dark">Dark (VS Dark)</option>
                    <option value="light">Light (Clean White)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Keybinding Mode
                  </label>
                  <select
                    value={editorKeybinding}
                    onChange={(e) => setEditorKeybinding(e.target.value as any)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                  >
                    <option value="standard">Standard (Monaco)</option>
                    <option value="vim">Vim Emulation</option>
                    <option value="emacs">Emacs Emulation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Font Size
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                  >
                    <option value="13">13px - Compact</option>
                    <option value="14">14px - Default</option>
                    <option value="15">15px - Medium</option>
                    <option value="16">16px - Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1.5">
                    Default Coding Language
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full h-10 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                  >
                    <option value="javascript">JavaScript (Node 20)</option>
                    <option value="typescript">TypeScript 5.3</option>
                    <option value="python">Python 3.12</option>
                    <option value="go">Go 1.22</option>
                    <option value="java">Java 21 LTS</option>
                    <option value="cpp">C++20 (GCC 13)</option>
                    <option value="csharp">C# (.NET 8)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-4">
              <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
                <Bell size={17} className="text-[#D14509]" />
                <span>Email Notifications & Reminders</span>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyBeforeInterview}
                    onChange={(e) => setNotifyBeforeInterview(e.target.checked)}
                    className="mt-1 rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                  />
                  <div>
                    <div className="text-[14px] font-medium text-ink">
                      15-minute Pre-Interview Room Alert
                    </div>
                    <div className="text-[12px] text-muted">
                      Receive an email calendar prompt 15 minutes before scheduled live coding sessions.
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyAssessmentSubmit}
                    onChange={(e) => setNotifyAssessmentSubmit(e.target.checked)}
                    className="mt-1 rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                  />
                  <div>
                    <div className="text-[14px] font-medium text-ink">
                      Async Assessment Submissions
                    </div>
                    <div className="text-[12px] text-muted">
                      Get notified when a candidate submits an async test or runs out of allocated time.
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyScorecardDue}
                    onChange={(e) => setNotifyScorecardDue(e.target.checked)}
                    className="mt-1 rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                  />
                  <div>
                    <div className="text-[14px] font-medium text-ink">
                      Pending Scorecard SLA Reminders
                    </div>
                    <div className="text-[12px] text-muted">
                      Receive a prompt if an interview evaluation is pending 24 hours after session completion.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-divider flex items-center justify-end">
                <Button variant="primary" size="sm" onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

