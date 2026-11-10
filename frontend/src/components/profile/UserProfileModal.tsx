import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Modal } from '../common/Modal';
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
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  userName: string;
  userEmail: string;
  onUpdateProfile?: (updated: { name: string; email: string }) => void;
  onNotify?: (msg: { type: 'success' | 'error' | 'info'; title?: string; message: string }) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  userName,
  userEmail,
  onUpdateProfile,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'preferences'>('general');

  // General Form State
  const [name, setName] = useState(userName);
  const [email] = useState(userEmail);
  const [jobTitle, setJobTitle] = useState('Senior Staff Systems Engineer');
  const [team, setTeam] = useState('Distributed Systems & Execution Plane');
  const [organization] = useState('Acme Corporation');
  const [timeZone, setTimeZone] = useState('UTC');
  const [bio, setBio] = useState(
    'Leading backend and systems architecture interview loops. Focused on concurrent programming and fair evaluations.'
  );

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
      onClose();
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
          message: 'Your account password has been updated.',
        });
      }
    }, 500);
  };

  const handleSavePreferences = () => {
    if (onNotify) {
      onNotify({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Editor defaults and email notifications updated.',
      });
    }
    onClose();
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile & Account Settings" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* User Identity Mini Banner */}
        <div className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-divider rounded-[6px]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] flex items-center justify-center text-[16px] font-bold font-mono">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-ink text-[16px]">{name}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/30">
                  {currentRole}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center space-x-0.5">
                  <ShieldCheck size={11} />
                  <span>Verified</span>
                </span>
              </div>
              <div className="text-[12px] text-muted font-mono mt-0.5">{email} · {organization}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-6 border-b border-divider">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 text-[13px] font-medium transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'general' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <User size={14} />
            <span>Personal Info</span>
            {activeTab === 'general' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 text-[13px] font-medium transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'security' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <Shield size={14} />
            <span>Security & Password</span>
            {activeTab === 'security' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-2.5 text-[13px] font-medium transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'preferences' ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            <Code2 size={14} />
            <span>Editor & Notifications</span>
            {activeTab === 'preferences' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D14509]" />
            )}
          </button>
        </div>

        {/* ─── TAB 1: General Info ────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Work Email (Locked)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full h-9 px-3 border border-divider rounded-[4px] text-[13px] text-muted bg-[#FAFAFA] cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Team / Department
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Time Zone (for calendar scheduling)
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded-[4px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
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

              <div className="col-span-2">
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Interviewer Bio & Introduction (Shared with candidate on welcome screen)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509] leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-divider flex items-center justify-end space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* ─── TAB 2: Security & Password ─────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div className="text-[13px] font-semibold text-ink flex items-center space-x-1.5">
                <Key size={14} className="text-[#D14509]" />
                <span>Change Password (Min 12 characters)</span>
              </div>

              {passwordError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center space-x-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-center space-x-2">
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span>Password updated successfully.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="12+ characters"
                    className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="secondary" size="sm" disabled={isSaving}>
                  Update Password
                </Button>
              </div>
            </form>

            {/* 2FA Status */}
            <div className="p-3 border border-divider rounded-[6px] bg-[#FAFAFA] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-ink flex items-center space-x-1.5">
                  <Shield size={14} className="text-emerald-700" />
                  <span>Two-Factor Authentication (TOTP)</span>
                </div>
                <div className="text-[12px] text-muted mt-0.5">
                  Authenticator app code required on new device sign-ins.
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Enabled
              </span>
            </div>

            {/* Active Session */}
            <div className="p-3 border border-divider rounded-[6px] bg-[#FAFAFA] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-ink flex items-center space-x-1.5">
                  <Laptop size={14} className="text-[#D14509]" />
                  <span>Active Browser Session</span>
                </div>
                <div className="text-[12px] text-muted font-mono mt-0.5">
                  Windows 11 · Chrome · IP: 192.0.2.18
                </div>
              </div>
              <span className="text-[11px] font-mono text-muted">sess-918a</span>
            </div>
          </div>
        )}

        {/* ─── TAB 3: Editor & Notifications ──────────────────────────────── */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Editor Theme
                </label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value as any)}
                  className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                >
                  <option value="vs-dark">VS Dark</option>
                  <option value="light">Clean Light</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Keybinding Mode
                </label>
                <select
                  value={editorKeybinding}
                  onChange={(e) => setEditorKeybinding(e.target.value as any)}
                  className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                >
                  <option value="standard">Standard</option>
                  <option value="vim">Vim</option>
                  <option value="emacs">Emacs</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                >
                  <option value="13">13px</option>
                  <option value="14">14px</option>
                  <option value="15">15px</option>
                  <option value="16">16px</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Default Language
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full h-8 px-2.5 border border-divider rounded-[4px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-divider space-y-2">
              <div className="text-[12px] font-semibold text-ink">Email Notifications</div>
              <label className="flex items-center space-x-2.5 text-[13px] text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyBeforeInterview}
                  onChange={(e) => setNotifyBeforeInterview(e.target.checked)}
                  className="rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                />
                <span>Email alert 15 minutes before scheduled live coding session</span>
              </label>

              <label className="flex items-center space-x-2.5 text-[13px] text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyAssessmentSubmit}
                  onChange={(e) => setNotifyAssessmentSubmit(e.target.checked)}
                  className="rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                />
                <span>Notify when a candidate completes an async assessment</span>
              </label>

              <label className="flex items-center space-x-2.5 text-[13px] text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyScorecardDue}
                  onChange={(e) => setNotifyScorecardDue(e.target.checked)}
                  className="rounded border-divider text-[#D14509] focus:ring-[#D14509]"
                />
                <span>Scorecard SLA reminder (24 hours post-interview)</span>
              </label>
            </div>

            <div className="pt-3 border-t border-divider flex items-center justify-end space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

