import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Interview } from '../../types';
import { NewInterviewModal } from './NewInterviewModal';
import { Play, FileText, CheckCircle2, Plus, Calendar, Clock, ArrowRight, Link2, Copy, Check } from 'lucide-react';

interface InterviewsDashboardProps {
  interviews: Interview[];
  onSelectInterview: (interview: Interview) => void;
  onViewReport: (interview: Interview) => void;
  onFillScorecard: (interview: Interview) => void;
  onRefresh: () => void;
}

export const InterviewsDashboard: React.FC<InterviewsDashboardProps> = ({
  interviews,
  onSelectInterview,
  onViewReport,
  onFillScorecard,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Scorecards due'>('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCandidateLink = (interviewId: string) => {
    const url = `${window.location.origin}/join/${interviewId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(interviewId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabInterviews = interviews.filter((interview) => {
    if (activeTab === 'Upcoming') {
      return interview.status === 'Scheduled' || interview.status === 'Live' || interview.status === 'Draft';
    }
    if (activeTab === 'Completed') {
      return interview.status === 'Completed' || interview.status === 'Archived';
    }
    if (activeTab === 'Scorecards due') {
      return interview.status === 'Scorecard Due' || interview.status === 'Ended';
    }
    return true;
  });

  const displayedInterviews = tabInterviews
    .filter((i) => !filterRole || i.role.toLowerCase().includes(filterRole.toLowerCase()))
    .filter((i) => !filterStatus || i.status === filterStatus)
    .filter((i) => !filterSearch || i.candidateName.toLowerCase().includes(filterSearch.toLowerCase()) || i.candidateEmail.toLowerCase().includes(filterSearch.toLowerCase()));

  const getStatusBadge = (status: Interview['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/30 text-[12px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D14509] animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">Live</span>
          </span>
        );
      case 'Scheduled':
        return <Badge variant="neutral">Scheduled</Badge>;
      case 'Scorecard Due':
        return <Badge variant="warning">Scorecard Due</Badge>;
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      <div className="max-w-[1360px] mx-auto px-12 py-10">
        {/* Header Row */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <h1 className="text-heading text-ink font-semibold">Technical Interviews</h1>
            <p className="text-body text-muted mt-1">
              Live coding rooms, real-time microVM sandboxes, and structured evaluations.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New interview</span>
            </Button>
          </div>
        </div>

        {/* Metric Highlights Strip */}
        <div className="grid grid-cols-4 gap-6 py-6 border-b border-divider">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Upcoming Sessions</div>
            <div className="text-[24px] font-semibold text-ink mt-1 font-mono">
              {interviews.filter(i => i.status === 'Scheduled' || i.status === 'Draft').length}
            </div>
          </div>
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Scheduled Today</div>
            <div className="text-[24px] font-semibold text-ink mt-1">
              {interviews.filter(i => i.status === 'Scheduled').length}
            </div>
          </div>
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Scorecards Pending</div>
            <div className="text-[24px] font-semibold text-ink mt-1">
              {interviews.filter(i => i.status === 'Scorecard Due').length}
            </div>
          </div>
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Sandbox Isolation</div>
            <div className="text-[24px] font-semibold text-ink mt-1 flex items-center space-x-1.5 text-emerald-700">
              <CheckCircle2 size={20} />
              <span className="text-[18px]">100% MicroVM</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-8 pt-6 border-b border-divider">
          {(['Upcoming', 'Completed', 'Scorecards due'] as const).map((tab) => {
            const isActive = activeTab === tab;
            let count = 0;
            if (tab === 'Upcoming') count = interviews.filter(i => i.status === 'Scheduled' || i.status === 'Live').length;
            if (tab === 'Completed') count = interviews.filter(i => i.status === 'Completed').length;
            if (tab === 'Scorecards due') count = interviews.filter(i => i.status === 'Scorecard Due').length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-medium transition-colors relative flex items-center space-x-2 ${
                  isActive ? 'text-ink font-semibold' : 'text-muted hover:text-ink'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#FFF7F1] border border-divider text-muted">
                  {count}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters Bar (F-29: Dashboard filters by role, status, candidate) */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="h-9 px-3 border border-divider rounded-[6px] text-[13px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509] w-64 bg-white"
            />
            <input
              type="text"
              placeholder="Filter by role (e.g. Distributed)..."
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9 px-3 border border-divider rounded-[6px] text-[13px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509] w-52 bg-white"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 border border-divider rounded-[6px] text-[13px] text-ink focus:outline-none focus:border-[#D14509] bg-white cursor-pointer"
            >
              <option value="">All statuses</option>
              <option value="Live">Live</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Scorecard Due">Scorecard Due</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {(filterSearch || filterRole || filterStatus) && (
            <button
              onClick={() => {
                setFilterSearch('');
                setFilterRole('');
                setFilterStatus('');
              }}
              className="text-[13px] text-[#D14509] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-5 font-medium">Candidate</th>
                <th className="py-3 px-5 font-medium">Role</th>
                <th className="py-3 px-5 font-medium">Type</th>
                <th className="py-3 px-5 font-medium">Scheduled Date</th>
                <th className="py-3 px-5 font-medium">Status</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedInterviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted text-[14px]">
                    No interviews match current filters in {activeTab}.
                  </td>
                </tr>
              ) : (
                displayedInterviews.map((interview, idx) => (
                  <tr
                    key={interview.id}
                    className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-ink text-[14px]">{interview.candidateName}</div>
                      <div className="text-[12px] text-muted">{interview.candidateEmail}</div>
                    </td>
                    <td className="py-4 px-5 text-[14px] text-ink font-medium">
                      {interview.role}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-mono border border-divider text-muted">
                        {interview.type === 'Live' ? 'Live Room' : 'Async Assessment'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[13px] font-mono text-muted">
                      <div className="flex items-center space-x-1.5">
                        <Calendar size={13} className="text-muted" />
                        <span>{interview.scheduledDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {getStatusBadge(interview.status)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {interview.status === 'Live' && (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopyCandidateLink(interview.id)}
                            className="space-x-1"
                            title="Copy candidate invite link"
                          >
                            {copiedId === interview.id ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 size={12} />
                                <span>Copy Link</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onSelectInterview(interview)}
                            className="space-x-1.5"
                          >
                            <Play size={12} className="fill-white" />
                            <span>Join Room</span>
                          </Button>
                        </div>
                      )}
                      {interview.status === 'Scheduled' && (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopyCandidateLink(interview.id)}
                            className="space-x-1"
                            title="Copy candidate invite link"
                          >
                            {copiedId === interview.id ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 size={12} />
                                <span>Copy Link</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectInterview(interview)}
                            className="space-x-1"
                          >
                            <span>Enter Room</span>
                            <ArrowRight size={13} />
                          </Button>
                        </div>
                      )}
                      {interview.status === 'Completed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewReport(interview)}
                          className="space-x-1.5 text-ink"
                        >
                          <FileText size={13} />
                          <span>View Report</span>
                        </Button>
                      )}
                      {interview.status === 'Scorecard Due' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onFillScorecard(interview)}
                          className="space-x-1.5 border-[#D14509]/30 text-[#D14509] hover:bg-[#FFF3EB]"
                        >
                          <FileText size={13} />
                          <span>Fill Scorecard</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          onRefresh();
        }}
      />
    </div>
  );
};

