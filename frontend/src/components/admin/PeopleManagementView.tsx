import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AdminAPI } from '../../services/api';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Mail,
  UserX,
} from 'lucide-react';

interface PeopleManagementViewProps {
  staff: UserProfile[];
  onRefresh: () => void;
  onNotify?: (msg: { type: 'success' | 'error' | 'info'; title?: string; message: string }) => void;
}

export const PeopleManagementView: React.FC<PeopleManagementViewProps> = ({
  staff,
  onRefresh,
  onNotify,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Interviewer');
  const [inviteTeam, setInviteTeam] = useState('Core Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pending Role Requests
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-01',
      userName: 'Devon Lee',
      userEmail: 'devon.l@acme.corp',
      currentRole: 'Interviewer' as UserRole,
      requestedRole: 'Admin' as UserRole,
      reason: 'Need administrator access to configure candidate webhooks and audit log integrations.',
      submittedAt: 'Today at 09:15 UTC',
    },
  ]);

  // Deactivate state
  const [deactivatingUser, setDeactivatingUser] = useState<UserProfile | null>(null);
  const [replacementInterviewer, setReplacementInterviewer] = useState('Ines Becker');

  const notify = (msg: { type: 'success' | 'error' | 'info'; title?: string; message: string }) => {
    if (onNotify) onNotify(msg);
    else if (msg.type === 'error') alert(`${msg.title || 'Error'}: ${msg.message}`);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSubmitting(true);
    try {
      await AdminAPI.inviteStaff({
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
        team: inviteTeam,
      });
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
      onRefresh();
      notify({
        type: 'success',
        title: 'Invitation Sent',
        message: `Invite link generated and emailed to ${inviteEmail} for role ${inviteRole}.`,
      });
    } catch (err: any) {
      notify({
        type: 'error',
        title: 'Invite Failed',
        message: err.message || 'Failed to send invitation',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    // Check rule: last admin cannot be demoted
    const admins = staff.filter((s) => (s.role === 'Admin' || (s.role as any) === 'Org Admin') && s.status === 'active');
    const target = staff.find((s) => s.id === userId);
    if ((target?.role === 'Admin' || (target?.role as any) === 'Org Admin') && newRole !== 'Admin' && admins.length <= 1) {
      notify({
        type: 'error',
        title: 'Action Blocked',
        message: 'Cannot demote the last active Admin. Appoint another Admin first.',
      });
      return;
    }

    try {
      await AdminAPI.updateStaff(userId, { role: newRole });
      onRefresh();
      notify({
        type: 'info',
        title: 'Role Updated',
        message: `${target?.name || 'Staff member'}'s role changed to ${newRole}. Permissions updated immediately.`,
      });
    } catch (err: any) {
      notify({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update role',
      });
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUser) return;
    const admins = staff.filter((s) => (s.role === 'Admin' || (s.role as any) === 'Org Admin') && s.status === 'active');
    if ((deactivatingUser.role === 'Admin' || (deactivatingUser.role as any) === 'Org Admin') && admins.length <= 1) {
      notify({
        type: 'error',
        title: 'Action Blocked',
        message: 'Cannot deactivate the last active Admin. Appoint another Admin first.',
      });
      return;
    }

    try {
      await AdminAPI.updateStaff(deactivatingUser.id, { status: 'deactivated' });
      const name = deactivatingUser.name;
      setDeactivatingUser(null);
      onRefresh();
      notify({
        type: 'success',
        title: 'User Deactivated',
        message: `${name} has been deactivated and removed from active interview rosters.`,
      });
    } catch (err: any) {
      notify({
        type: 'error',
        title: 'Deactivation Failed',
        message: err.message || 'Failed to deactivate user',
      });
    }
  };

  const handleApproveRequest = async (reqId: string, userEmail: string, newRole: UserRole) => {
    const target = staff.find((s) => s.email === userEmail);
    if (target) {
      await handleChangeRole(target.id, newRole);
    }
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
    notify({
      type: 'success',
      title: 'Role Request Approved',
      message: `Approved ${newRole} access for ${userEmail}.`,
    });
  };

  const handleDeclineRequest = (reqId: string, userEmail: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
    notify({
      type: 'info',
      title: 'Request Declined',
      message: `Role change request for ${userEmail} was declined.`,
    });
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Administration · Section 8.2
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Staff & Access Directory</h1>
            <p className="text-body text-muted mt-1">
              Invite team members, assign role permissions, require MFA, and manage active sessions.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsInviteModalOpen(true)}
            className="space-x-2"
          >
            <UserPlus size={16} />
            <span>Invite staff member</span>
          </Button>
        </div>

        {/* Pending Role Change Requests (Spec Section 3.3, 7) */}
        {pendingRequests.length > 0 && (
          <div className="border border-amber-200 bg-amber-50/40 rounded-[6px] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-[14px] font-semibold text-ink">
                  Pending Role Change Requests ({pendingRequests.length})
                </h3>
              </div>
              <span className="text-[12px] text-muted font-mono">Requires Org Admin Approval</span>
            </div>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-divider rounded-[6px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-ink text-[14px]">{req.userName}</span>
                      <span className="text-muted text-[13px]">({req.userEmail})</span>
                      <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#FAFAFA] border border-divider text-muted">
                        Current: {req.currentRole}
                      </span>
                      <span className="text-[12px] text-muted">→</span>
                      <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#FFF3EB] text-[#D14509] font-medium border border-[#D14509]/30">
                        Requested: {req.requestedRole}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted italic">"{req.reason}"</p>
                    <div className="text-[11px] font-mono text-muted">Submitted {req.submittedAt}</div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleDeclineRequest(req.id, req.userEmail)}
                      className="h-8 px-3 rounded-[6px] border border-divider text-muted hover:text-ink hover:bg-neutral-50 text-[13px] font-medium transition-colors"
                    >
                      Decline
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveRequest(req.id, req.userEmail, req.requestedRole)}
                    >
                      Approve & Update Role
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Table */}
        <div className="border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-5 font-medium">Name & Email</th>
                <th className="py-3 px-5 font-medium">Role</th>
                <th className="py-3 px-5 font-medium">Team</th>
                <th className="py-3 px-5 font-medium">MFA Status</th>
                <th className="py-3 px-5 font-medium">Status</th>
                <th className="py-3 px-5 font-medium">Last Active</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="font-semibold text-ink text-[14px]">{u.name}</div>
                    <div className="text-[12px] text-muted">{u.email}</div>
                  </td>

                  <td className="py-4 px-5">
                    <select
                      value={u.role === 'Admin' || (u.role as any) === 'Org Admin' ? 'Admin' : 'Interviewer'}
                      disabled={u.status === 'deactivated'}
                      onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                      className="text-[13px] font-medium text-ink bg-white border border-divider rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-[#D14509]"
                    >
                      <option value="Interviewer">Interviewer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>

                  <td className="py-4 px-5 text-[13px] font-mono text-muted">{u.team || 'General'}</td>

                  <td className="py-4 px-5 text-[12px] font-mono">
                    {u.mfaEnabled ? (
                      <span className="text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 size={13} />
                        <span>Enabled</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center space-x-1">
                        <AlertCircle size={13} />
                        <span>Not Configured</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5">
                    <Badge
                      variant={
                        u.status === 'active'
                          ? 'success'
                          : u.status === 'invited'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-5 text-[13px] font-mono text-muted">{u.lastActive}</td>

                  <td className="py-4 px-5 text-right">
                    {u.status !== 'deactivated' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setDeactivatingUser(u)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 space-x-1"
                      >
                        <UserX size={12} />
                        <span>Deactivate</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal (A-01) */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Staff Member (A-01)"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="engineer@acme.corp"
              className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Assign Role <span className="text-red-500">*</span>
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509]"
              >
                <option value="Interviewer">Interviewer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Team Unit
              </label>
              <input
                type="text"
                value={inviteTeam}
                onChange={(e) => setInviteTeam(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
              />
            </div>
          </div>

          <p className="text-[12px] text-muted">
            The user will receive a 7-day secure sign-up link. Multi-factor auth will be prompted upon first sign-in per company policy.
          </p>

          <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate User Modal (A-03) */}
      {deactivatingUser && (
        <Modal
          isOpen={!!deactivatingUser}
          onClose={() => setDeactivatingUser(null)}
          title={`Deactivate ${deactivatingUser.name} (A-03)`}
        >
          <div className="space-y-4">
            <p className="text-[14px] text-muted leading-relaxed">
              Deactivating <strong className="text-ink">{deactivatingUser.name}</strong> will instantly revoke their active sessions and prevent future sign-ins. Past interview scorecards and notes remain preserved in the audit log.
            </p>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Reassign Upcoming Interviews To:
              </label>
              <select
                value={replacementInterviewer}
                onChange={(e) => setReplacementInterviewer(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white focus:outline-none focus:border-[#D14509]"
              >
                {staff
                  .filter((s) => s.id !== deactivatingUser.id && s.status === 'active')
                  .map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeactivatingUser(null)}>
                Cancel
              </Button>
              <button
                onClick={handleDeactivate}
                className="h-9 px-4 rounded-[6px] bg-red-600 hover:bg-red-700 text-white font-semibold text-[13px] transition-colors"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

