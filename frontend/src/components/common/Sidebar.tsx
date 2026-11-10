import React from 'react';
import {
  Video,
  FileCode2,
  BookOpen,
  Users,
  Settings,
  ShieldCheck,
  Server,
  Play,
  Briefcase,
  GitBranch,
  Shield,
  CreditCard,
  FileCheck2,
  Lock,
  Trash2,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { UserRole } from '../../types';
import { Link } from 'react-router-dom';

export type NavItem =
  | 'interviews'
  | 'assessments'
  | 'questions'
  | 'candidates'
  | 'pipeline'
  | 'hiring_overview'
  | 'admin_overview'
  | 'admin_people'
  | 'admin_security'
  | 'admin_billing'
  | 'admin_audit'
  | 'admin_data'
  | 'admin_integrations'
  | 'settings';

interface SidebarProps {
  activeTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  userName?: string;
  userEmail?: string;
  onOpenProfile?: () => void;
}

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  userName = 'Ines Becker',
  userEmail = 'ines.becker@acme.corp',
  onOpenProfile,
}) => {
  // Navigation item sets for Interviewer and Admin
  const getNavItemsForRole = (): NavItemConfig[] => {
    if (currentRole === 'Interviewer') {
      return [
        { id: 'interviews' as NavItem, label: 'Interviews', icon: Video },
        { id: 'assessments' as NavItem, label: 'Assessments', icon: FileCode2 },
        { id: 'questions' as NavItem, label: 'Question Library', icon: BookOpen },
        { id: 'candidates' as NavItem, label: 'Candidates & Reports', icon: Users },
      ];
    }

    // Admin role
    return [
      { id: 'admin_overview' as NavItem, label: 'Admin Overview', icon: LayoutDashboard },
      { id: 'admin_people' as NavItem, label: 'People & Access', icon: Users },
      { id: 'admin_security' as NavItem, label: 'Security & Sandbox', icon: Shield },
      { id: 'admin_billing' as NavItem, label: 'Usage & Quotas', icon: CreditCard },
      { id: 'admin_audit' as NavItem, label: 'Audit Ledger', icon: FileCheck2 },
      { id: 'admin_data' as NavItem, label: 'Data & Retention', icon: Trash2 },
      { id: 'admin_integrations' as NavItem, label: 'Integrations & API', icon: Lock },
      { id: 'interviews' as NavItem, label: 'All Interviews', icon: Video },
      { id: 'questions' as NavItem, label: 'Question Bank', icon: BookOpen },
    ];
  };

  const navItems = getNavItemsForRole();
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="w-[230px] flex-shrink-0 h-screen bg-white border-r border-divider flex flex-col justify-between select-none">
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-14 px-5 border-b border-divider flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[11px]">
              C
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-ink">CodeRoom</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-divider text-muted">
            Acme
          </span>
        </div>

        {/* User Role Switcher */}
        <div className="p-3 border-b border-divider bg-[#FAFAFA] space-y-2">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1">
              Active Role
            </div>
            <select
              value={currentRole === 'Admin' ? 'Admin' : 'Interviewer'}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="w-full h-8 px-2 border border-divider rounded-[4px] text-[12px] font-semibold text-ink bg-white focus:outline-none focus:border-[#D14509] cursor-pointer shadow-sm"
            >
              <option value="Interviewer">Interviewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="pt-2 border-t border-divider flex items-center justify-between text-[11px]">
            <Link
              to="/join/int-001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D14509] hover:underline flex items-center space-x-1 font-medium"
            >
              <span>Candidate Link</span>
              <span>↗</span>
            </Link>
            <Link
              to="/signin"
              className="text-muted hover:text-ink flex items-center space-x-1"
              title="Sign out"
            >
              <LogOut size={11} />
              <span>Sign out</span>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-2 pt-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted font-mono flex items-center justify-between">
            <span>{currentRole} Views</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full h-9 px-3 rounded-[6px] flex items-center justify-between text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#FFF3EB] text-[#D14509] font-semibold'
                    : 'text-ink hover:bg-[#FFF7F1] hover:text-ink'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon size={15} className={isActive ? 'text-[#D14509]' : 'text-muted'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-[#D14509]/30 text-[#D14509]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sandbox & Isolation Status Footer + User Profile Pop-up Trigger */}
      <div className="border-t border-divider bg-white flex-shrink-0">
        {/* Execution Plane Stats (as in user screenshot) */}
        <div className="p-3.5 pb-2 text-[10px] text-muted leading-tight font-mono space-y-1">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <div className="flex items-center space-x-1.5 text-ink font-mono font-medium">
              <Server size={12} className="text-muted" />
              <span>Execution Plane</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          </div>
          <div className="flex justify-between">
            <span>MicroVMs:</span>
            <span className="text-ink font-medium">24 Warm</span>
          </div>
          <div className="flex justify-between">
            <span>Latency:</span>
            <span className="text-ink font-medium">1.4s</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-muted pt-1 border-t border-divider">
            <ShieldCheck size={11} className="text-emerald-700" />
            <span>Isolated Sandbox Active</span>
          </div>
        </div>

        {/* User Profile Footer Button - Click to POP UP Modal */}
        <div className="p-2 border-t border-divider bg-[#FAFAFA]">
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-full flex items-center justify-between p-2 rounded-[6px] hover:bg-[#FFF3EB] border border-transparent hover:border-[#D14509]/30 transition-all group text-left cursor-pointer"
            title="Click to view and edit your profile"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] flex items-center justify-center text-[11px] font-bold font-mono group-hover:bg-[#D14509] group-hover:text-white transition-colors flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-ink group-hover:text-[#D14509] transition-colors leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-muted font-mono truncate mt-0.5">
                  {currentRole} · Profile ↗
                </div>
              </div>
            </div>
            <User size={13} className="text-muted group-hover:text-[#D14509] transition-colors flex-shrink-0 ml-1" />
          </button>
        </div>
      </div>
    </aside>
  );
};
