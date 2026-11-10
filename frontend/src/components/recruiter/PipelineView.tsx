import React, { useState } from 'react';
import { Interview, AssessmentAttempt } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NewInterviewModal } from '../dashboard/NewInterviewModal';
import {
  Calendar,
  Clock,
  Plus,
  Send,
  Users,
  FileCheck2,
  AlertCircle,
  FileText,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface PipelineViewProps {
  interviews: Interview[];
  assessments: AssessmentAttempt[];
  onSelectInterview: (interview: Interview) => void;
  onViewReport: (interview: Interview) => void;
  onRefresh: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  interviews,
  assessments,
  onSelectInterview,
  onViewReport,
  onRefresh,
}) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [interviewerFilter, setInterviewerFilter] = useState('');

  // Metrics
  const interviewsThisWeek = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Live').length;
  const assessmentsAwaiting = assessments.filter((a) => a.status === 'Invited' || a.status === 'Not Started').length;
  const scorecardsOverdue = interviews.filter((i) => i.status === 'Scorecard Due').length;
  const reportsReady = interviews.filter((i) => i.status === 'Completed').length;

  // Pipeline Stages (Section 7.2)
  const stages = [
    {
      name: 'Invited / Draft',
      items: interviews.filter((i) => i.status === 'Draft' || i.status === 'Scheduled'),
      color: 'border-blue-200 bg-blue-50/50 text-blue-800',
    },
    {
      name: 'In Progress / Live',
      items: interviews.filter((i) => i.status === 'Live'),
      color: 'border-orange-200 bg-[#FFF3EB] text-[#D14509]',
    },
    {
      name: 'Scorecards Pending',
      items: interviews.filter((i) => i.status === 'Scorecard Due' || i.status === 'Ended'),
      color: 'border-amber-200 bg-amber-50/50 text-amber-800',
    },
    {
      name: 'Ready for Review',
      items: interviews.filter((i) => i.status === 'Completed'),
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
    },
  ];

  const filteredInterviews = interviews
    .filter((i) => !roleFilter || i.role.toLowerCase().includes(roleFilter.toLowerCase()))
    .filter((i) => !interviewerFilter || i.interviewerNames.some((n) => n.toLowerCase().includes(interviewerFilter.toLowerCase())));

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Recruiter Workspace · Section 7.2
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Candidate Pipeline Board</h1>
            <p className="text-body text-muted mt-1">
              End-to-end recruitment stages: scheduling, live room participation, and scorecard tracking.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="md" onClick={() => setIsNewModalOpen(true)} className="space-x-2">
              <Plus size={16} />
              <span>New interview</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Interviews Scheduled</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">{interviewsThisWeek}</div>
            <span className="text-[12px] text-muted">Active interview loops</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Assessments Pending</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">{assessmentsAwaiting}</div>
            <span className="text-[12px] text-muted">Awaiting candidate start</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Scorecards Overdue</div>
            <div className="text-[26px] font-semibold text-amber-700 mt-1 font-mono flex items-center space-x-1.5">
              <span>{scorecardsOverdue}</span>
              {scorecardsOverdue > 0 && <AlertCircle size={16} className="text-amber-600" />}
            </div>
            <span className="text-[12px] text-muted">Awaiting interviewer rating</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Reports Ready for Review</div>
            <div className="text-[26px] font-semibold text-emerald-700 mt-1 font-mono flex items-center space-x-1.5">
              <span>{reportsReady}</span>
              <FileCheck2 size={16} className="text-emerald-700" />
            </div>
            <span className="text-[12px] text-muted">Completed with full scorecard</span>
          </div>
        </div>

        {/* Kanban Stages Board */}
        <div>
          <div className="text-[14px] font-semibold text-ink mb-3 flex items-center justify-between">
            <span>Pipeline Stages</span>
            <span className="text-[12px] text-muted font-normal font-mono">Real-time candidate transition</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {stages.map((stage) => (
              <div key={stage.name} className="border border-divider rounded-[6px] bg-[#FAFAFA] flex flex-col min-h-[340px]">
                <div className={`px-4 py-2.5 border-b font-medium text-[13px] flex items-center justify-between rounded-t-[6px] ${stage.color}`}>
                  <span>{stage.name}</span>
                  <span className="font-mono text-[12px] font-semibold bg-white/70 px-1.5 py-0.5 rounded">
                    {stage.items.length}
                  </span>
                </div>

                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {stage.items.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-muted text-[12px] font-mono italic">
                      Empty stage
                    </div>
                  ) : (
                    stage.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-[6px] border border-divider bg-white hover:border-[#D14509]/50 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
                        onClick={() => {
                          if (item.status === 'Completed') onViewReport(item);
                          else onSelectInterview(item);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ink text-[13px] group-hover:text-[#D14509] transition-colors">
                            {item.candidateName}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1 rounded bg-[#FAFAFA] border border-divider text-muted">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-[12px] text-muted truncate">{item.role}</div>
                        <div className="text-[11px] font-mono text-muted flex items-center space-x-1">
                          <Users size={11} />
                          <span>{item.interviewerNames[0] || 'Unassigned'}</span>
                        </div>
                        {item.scorecard?.recommendation && (
                          <div className="text-[11px] font-mono font-semibold text-[#D14509] pt-1 border-t border-divider/60">
                            ★ {item.scorecard.recommendation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Organization Interviews Table */}
        <div className="space-y-4 pt-4 border-t border-divider">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">All Organization Interviews (Recruiter View)</h2>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Filter by role..."
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8 px-2.5 border border-divider rounded text-[13px] w-44 focus:outline-none focus:border-[#D14509]"
              />
              <input
                type="text"
                placeholder="Filter by interviewer..."
                value={interviewerFilter}
                onChange={(e) => setInterviewerFilter(e.target.value)}
                className="h-8 px-2.5 border border-divider rounded text-[13px] w-44 focus:outline-none focus:border-[#D14509]"
              />
            </div>
          </div>

          <div className="border border-divider rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-5 font-medium">Candidate</th>
                  <th className="py-3 px-5 font-medium">Role</th>
                  <th className="py-3 px-5 font-medium">Interviewers</th>
                  <th className="py-3 px-5 font-medium">Scheduled Date</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((iv) => (
                  <tr key={iv.id} className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-ink text-[14px]">{iv.candidateName}</div>
                      <div className="text-[12px] text-muted">{iv.candidateEmail}</div>
                    </td>
                    <td className="py-3.5 px-5 text-[14px] text-ink">{iv.role}</td>
                    <td className="py-3.5 px-5 text-[13px] font-mono text-muted">
                      {iv.interviewerNames.join(', ')}
                    </td>
                    <td className="py-3.5 px-5 text-[13px] font-mono text-muted">{iv.scheduledDate}</td>
                    <td className="py-3.5 px-5">
                      <Badge variant={iv.status === 'Live' ? 'live' : iv.status === 'Completed' ? 'success' : 'neutral'}>
                        {iv.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      {iv.status === 'Completed' ? (
                        <Button variant="secondary" size="sm" onClick={() => onViewReport(iv)} className="space-x-1">
                          <FileText size={12} />
                          <span>View Report</span>
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => onSelectInterview(iv)} className="space-x-1">
                          <span>Enter Room</span>
                          <ArrowRight size={12} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NewInterviewModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={() => {
          setIsNewModalOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
};

