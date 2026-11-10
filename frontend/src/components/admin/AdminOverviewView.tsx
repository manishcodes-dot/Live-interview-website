import React from 'react';
import { UserProfile, AuditLogEntry, Interview } from '../../types';
import { Button } from '../common/Button';
import {
  Shield,
  Users,
  Activity,
  CreditCard,
  Server,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface AdminOverviewViewProps {
  staff: UserProfile[];
  auditLogs: AuditLogEntry[];
  interviews: Interview[];
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  staff,
  auditLogs,
  interviews,
  onNavigateTab,
}) => {
  const activeStaffCount = staff.filter((s) => s.status === 'active').length;
  const pendingInvites = staff.filter((s) => s.status === 'invited').length;
  const mfaMissingCount = staff.filter((s) => !s.mfaEnabled && s.status === 'active').length;
  const liveRoomsNow = interviews.filter((i) => i.status === 'Live').length;

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Organization Administration · Section 8.1
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Admin Control Center</h1>
            <p className="text-body text-muted mt-1">
              Organization governance, security enforcement, people directory, and system health.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[12px] font-mono px-2.5 py-1 rounded bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509]">
              Org: Acme Corporation
            </span>
          </div>
        </div>

        {/* 6 Key Overview Cards (Section 8.1) */}
        <div className="grid grid-cols-3 gap-6">
          {/* 1. People Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <Users size={16} className="text-[#D14509]" />
                  <span>People & Staff</span>
                </div>
                <span className="text-[11px] font-mono text-muted">{staff.length} seats</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">{activeStaffCount}</span>
                <span className="text-[13px] text-muted">active staff</span>
              </div>
              <div className="mt-2 text-[12px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Pending invitations:</span>
                  <span className="font-mono text-ink">{pendingInvites}</span>
                </div>
                <div className="flex justify-between">
                  <span>Without MFA:</span>
                  <span className={`font-mono font-semibold ${mfaMissingCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {mfaMissingCount} users
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('people')}
              className="text-[12px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2 border-t border-divider"
            >
              <span>Manage People Directory</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 2. Security Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <Shield size={16} className="text-[#D14509]" />
                  <span>Security & Auth</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Enforced
                </span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">100%</span>
                <span className="text-[13px] text-muted">SSO coverage</span>
              </div>
              <div className="mt-2 text-[12px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>SAML SSO Provider:</span>
                  <span className="font-mono text-ink">Okta / Google</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed sign-ins (24h):</span>
                  <span className="font-mono text-emerald-700">0 locked</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('security')}
              className="text-[12px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2 border-t border-divider"
            >
              <span>Configure Security Policies</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 3. Usage & Billing Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <CreditCard size={16} className="text-[#D14509]" />
                  <span>Plan & Quotas</span>
                </div>
                <span className="text-[11px] font-mono text-muted">Team Tier</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">{interviews.length}</span>
                <span className="text-[13px] text-muted">/ 50 sessions used</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-[#FAFAFA] h-2 rounded-full overflow-hidden border border-divider">
                  <div
                    className="bg-[#D14509] h-full rounded-full"
                    style={{ width: `${Math.min(100, (interviews.length / 50) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-muted font-mono mt-1">
                  <span>Cycle renewal: Dec 1, 2026</span>
                  <span>14 seats active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('billing')}
              className="text-[12px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2 border-t border-divider"
            >
              <span>View Usage Breakdown</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 4. Execution Sandbox Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <Server size={16} className="text-[#D14509]" />
                  <span>Execution Sandbox Cluster</span>
                </div>
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Healthy</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">1.4s</span>
                <span className="text-[13px] text-muted">median start</span>
              </div>
              <div className="mt-2 text-[12px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Warm VM pool:</span>
                  <span className="font-mono text-ink">24 ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Queue position:</span>
                  <span className="font-mono text-emerald-700">0 wait</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-divider text-[11px] text-muted font-mono">
              Firecracker microVM isolation active (zero network)
            </div>
          </div>

          {/* 5. Live Activity Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <Activity size={16} className="text-[#D14509]" />
                  <span>Live Platform Activity</span>
                </div>
                <span className="text-[11px] font-mono text-[#D14509] bg-[#FFF3EB] px-1.5 py-0.5 rounded border border-[#D14509]/30">
                  Active
                </span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">{liveRoomsNow}</span>
                <span className="text-[13px] text-muted">live rooms now</span>
              </div>
              <div className="mt-2 text-[12px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Scheduled today:</span>
                  <span className="font-mono text-ink">3 sessions</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed loops:</span>
                  <span className="font-mono text-ink">{interviews.filter(i => i.status === 'Completed').length} total</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('data')}
              className="text-[12px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2 border-t border-divider"
            >
              <span>Data Retention & Erasure</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 6. Integrations Card */}
          <div className="p-5 rounded-[6px] border border-divider bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink">
                  <Lock size={16} className="text-[#D14509]" />
                  <span>Integrations & Keys</span>
                </div>
                <span className="text-[11px] font-mono text-muted">2 Connected</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-[28px] font-semibold text-ink font-mono">2</span>
                <span className="text-[13px] text-muted">webhooks active</span>
              </div>
              <div className="mt-2 text-[12px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Greenhouse ATS:</span>
                  <span className="font-mono text-emerald-700">Syncing</span>
                </div>
                <div className="flex justify-between">
                  <span>API Keys issued:</span>
                  <span className="font-mono text-ink">2 keys</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('integrations')}
              className="text-[12px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2 border-t border-divider"
            >
              <span>Manage Integrations & API Keys</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Recent Audit Log Strip (Section 8.1 & 8.5) */}
        <div className="border border-divider rounded-[6px] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-divider pb-3">
            <div className="flex items-center space-x-2">
              <FileCheck2 size={18} className="text-[#D14509]" />
              <h2 className="text-[15px] font-semibold text-ink">Recent Audit Ledger Activity (Last 10 Events)</h2>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-[13px] text-[#D14509] hover:underline font-medium flex items-center space-x-1"
            >
              <span>View Full Immutable Audit Log</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-divider text-[13px]">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between hover:bg-[#FFF7F1] px-2 rounded transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[11px] text-muted">{log.timestamp}</span>
                  <span className="font-medium text-ink">{log.action}</span>
                  <span className="text-muted text-[12px]">by {log.actor} ({log.role})</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-muted">{log.target}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {log.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

