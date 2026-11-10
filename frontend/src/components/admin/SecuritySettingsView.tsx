import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Shield, Lock, Key, Bot, Eye, Server, Cpu, Check, ShieldCheck } from 'lucide-react';

export const SecuritySettingsView: React.FC = () => {
  // Access & Auth state
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [mfaPolicy, setMfaPolicy] = useState<'all' | 'admin_only' | 'optional'>('all');
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState('8');
  const [allowedDomains, setAllowedDomains] = useState('acme.corp, acme.io');

  // AI Policy & Notices
  const [aiPolicy, setAiPolicy] = useState<'disallowed' | 'disclosure' | 'in_platform'>('disclosure');
  const [candidateNotice, setCandidateNotice] = useState(
    'Notice: During this technical interview, code edits, test execution metrics, and editor paste volume are recorded for evaluation review. Webcam and microphone data are never analyzed algorithmically. Signals are for human review, not automated verdicts.'
  );

  // Sandbox & MicroVM Resource Limits (Merged from Platform Settings)
  const [cpuLimit, setCpuLimit] = useState('1 vCPU (cgroup quota)');
  const [memoryLimit, setMemoryLimit] = useState('512 MB (tmpfs included)');
  const [wallTime, setWallTime] = useState('10 seconds');
  const [networkPolicy, setNetworkPolicy] = useState('Disabled by default (No NIC)');

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Administration · Security & Infrastructure
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">
              Security, Auth & Sandbox Policies
            </h1>
            <p className="text-body text-muted mt-1">
              Configure SAML Single Sign-On, MFA enforcement, code execution microVM ceilings, and candidate transparency notices.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleSave}>
            {saved ? 'Policies Saved' : 'Save Security Policies'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* SAML Single Sign-On (A-05) */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink">
                <Lock size={17} className="text-[#D14509]" />
                <span>Single Sign-On (SAML 2.0 / OIDC)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Connected: Okta
              </span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                SAML Identity Provider Metadata URL
              </label>
              <input
                type="text"
                readOnly
                value="https://acme.okta.com/app/exk482a/sso/saml/metadata"
                className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono bg-[#FAFAFA] text-ink"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-[14px] font-semibold text-ink">Enforce SSO for All Staff</div>
                <div className="text-[12px] text-muted">
                  Disable standard password logins. Password reset bypass will be prohibited.
                </div>
              </div>
              <input
                type="checkbox"
                checked={ssoEnforced}
                onChange={(e) => setSsoEnforced(e.target.checked)}
                className="w-4 h-4 text-[#D14509] rounded border-divider cursor-pointer"
              />
            </div>
          </div>

          {/* MFA Enforcement (A-04) */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
            <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink border-b border-divider pb-3">
              <Key size={17} className="text-[#D14509]" />
              <span>Multi-Factor Authentication Policy (A-04)</span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                MFA Requirement Scope
              </label>
              <select
                value={mfaPolicy}
                onChange={(e) => setMfaPolicy(e.target.value as any)}
                className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white focus:outline-none focus:border-[#D14509]"
              >
                <option value="all">Require for all staff (Interviewers & Admins)</option>
                <option value="admin_only">Require only for Admins</option>
                <option value="optional">Optional for all</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Idle Session Timeout
                </label>
                <select
                  value={sessionTimeoutHours}
                  onChange={(e) => setSessionTimeoutHours(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white"
                >
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours (Default)</option>
                  <option value="24">24 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Allowed Email Domains
                </label>
                <input
                  type="text"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono text-ink"
                />
              </div>
            </div>
          </div>

          {/* Sandbox & Code Execution Ceilings (Merged & Admin Only) */}
          <div className="col-span-2 border border-divider rounded-[6px] p-6 bg-white space-y-5">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink">
                <Server size={17} className="text-[#D14509]" />
                <span>MicroVM Sandbox & Code Execution Ceilings</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck size={12} />
                <span>Isolated Guest Kernel Active</span>
              </span>
            </div>

            <p className="text-[13px] text-muted leading-relaxed">
              Candidate code runs inside isolated ephemeral microVMs. Configure resource caps to prevent infinite loops, memory leaks, and network attacks.
            </p>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Per-Run CPU Ceiling
                </label>
                <input
                  type="text"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono text-ink focus:outline-none focus:border-[#D14509]"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Hard cgroup quota per runner.
                </span>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Guest Memory Ceiling
                </label>
                <input
                  type="text"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono text-ink focus:outline-none focus:border-[#D14509]"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Includes ephemeral tmpfs.
                </span>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Execution Timeout
                </label>
                <input
                  type="text"
                  value={wallTime}
                  onChange={(e) => setWallTime(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono text-ink focus:outline-none focus:border-[#D14509]"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Clean kill for infinite loops.
                </span>
              </div>

              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Sandbox Network Model
                </label>
                <input
                  type="text"
                  value={networkPolicy}
                  onChange={(e) => setNetworkPolicy(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] font-mono text-ink focus:outline-none focus:border-[#D14509]"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  vsock only. No external NIC.
                </span>
              </div>
            </div>
          </div>

          {/* AI Assistance Policy (A-06) */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
            <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink border-b border-divider pb-3">
              <Bot size={17} className="text-[#D14509]" />
              <span>AI Assistance Policy (A-06)</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'disallowed',
                  title: 'Not Allowed',
                  desc: 'AI autocomplete and LLM prompts disabled in editor. Candidate warned if external pasting occurs.',
                },
                {
                  id: 'disclosure',
                  title: 'Allowed with Disclosure (Recommended)',
                  desc: 'Candidate may use AI assistance if disclosed. Autocomplete telemetry surfaced on timeline.',
                },
                {
                  id: 'in_platform',
                  title: 'Provided in-Platform',
                  desc: 'Built-in sandboxed assistant widget enabled for all candidates with identical context.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-[6px] border flex items-start space-x-3 cursor-pointer transition-colors ${
                    aiPolicy === opt.id
                      ? 'border-[#D14509] bg-[#FFF3EB]'
                      : 'border-divider hover:bg-[#FFF7F1]'
                  }`}
                >
                  <input
                    type="radio"
                    name="aiPolicy"
                    value={opt.id}
                    checked={aiPolicy === opt.id}
                    onChange={() => setAiPolicy(opt.id as any)}
                    className="mt-1 text-[#D14509]"
                  />
                  <div>
                    <div className="font-semibold text-ink text-[13px]">{opt.title}</div>
                    <div className="text-[12px] text-muted">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Candidate Monitoring Notice Editor */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
            <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink border-b border-divider pb-3">
              <Eye size={17} className="text-[#D14509]" />
              <span>Candidate Monitoring & Transparency Notice</span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Start-Screen Disclosure Text
              </label>
              <textarea
                rows={4}
                value={candidateNotice}
                onChange={(e) => setCandidateNotice(e.target.value)}
                className="w-full p-2.5 border border-divider rounded text-[13px] font-sans text-ink focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] text-muted font-mono mt-1 block">
                Mandatory legal wording: "Signals for review. They are not verdicts."
              </span>
            </div>

            <div className="p-3 rounded bg-[#FAFAFA] border border-divider text-[12px] text-muted leading-relaxed">
              <strong>Compliance note:</strong> Candidates review and acknowledge this exact notice during the pre-session system check before entering live coding rooms or assessments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
