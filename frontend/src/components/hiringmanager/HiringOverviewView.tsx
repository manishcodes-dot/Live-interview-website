import React, { useState } from 'react';
import { Interview } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CandidateCompareView } from '../candidates/CandidateCompareView';
import {
  Briefcase,
  Users,
  FileCheck2,
  Clock,
  ArrowLeftRight,
  FileText,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

interface HiringOverviewViewProps {
  interviews: Interview[];
  onViewReport: (interview: Interview) => void;
}

export const HiringOverviewView: React.FC<HiringOverviewViewProps> = ({
  interviews,
  onViewReport,
}) => {
  // Extract distinct roles
  const roles = Array.from(new Set(interviews.map((i) => i.role)));
  const [selectedRole, setSelectedRole] = useState<string>(roles[0] || 'All Roles');
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [isComparing, setIsComparing] = useState(false);

  const roleInterviews = selectedRole === 'All Roles'
    ? interviews
    : interviews.filter((i) => i.role === selectedRole);

  const inProcess = roleInterviews.filter((i) => i.status === 'Scheduled' || i.status === 'Live').length;
  const reportsReady = roleInterviews.filter((i) => i.status === 'Completed').length;
  const scorecardsPending = roleInterviews.filter((i) => i.status === 'Scorecard Due').length;

  const toggleSelect = (id: string) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const candidatesToCompare = interviews.filter((i) => selectedCandidates.has(i.id));

  if (isComparing) {
    return (
      <CandidateCompareView
        candidates={candidatesToCompare}
        onBack={() => setIsComparing(false)}
      />
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Hiring Manager Workspace · Section 7.3
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Hiring Role Overview</h1>
            <p className="text-body text-muted mt-1">
              Review rubric distributions, compare candidates side by side, and monitor hiring pipeline progress.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {selectedCandidates.size >= 2 && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsComparing(true)}
                className="space-x-2"
              >
                <ArrowLeftRight size={15} />
                <span>Compare Selected ({selectedCandidates.size})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Role Selector Strip (Section 7.3) */}
        <div className="flex items-center space-x-3 p-3 rounded-[6px] border border-divider bg-[#FAFAFA]">
          <div className="flex items-center space-x-2 text-[13px] font-semibold text-ink px-2">
            <Briefcase size={16} className="text-[#D14509]" />
            <span>Target Role:</span>
          </div>

          <button
            onClick={() => setSelectedRole('All Roles')}
            className={`px-3 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors ${
              selectedRole === 'All Roles'
                ? 'bg-ink text-white font-semibold'
                : 'bg-white text-muted hover:text-ink border border-divider'
            }`}
          >
            All Roles ({interviews.length})
          </button>

          {roles.map((r) => {
            const count = interviews.filter((i) => i.role === r).length;
            const isSel = selectedRole === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors ${
                  isSel
                    ? 'bg-ink text-white font-semibold'
                    : 'bg-white text-muted hover:text-ink border border-divider'
                }`}
              >
                <span>{r}</span>
                <span className="ml-1.5 font-mono text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Candidates in Process</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">{inProcess}</div>
            <span className="text-[12px] text-muted">Scheduled or in live round</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Scorecards Outstanding</div>
            <div className="text-[26px] font-semibold text-amber-700 mt-1 font-mono">{scorecardsPending}</div>
            <span className="text-[12px] text-muted">Pending interviewer evaluation</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Decision-Ready Reports</div>
            <div className="text-[26px] font-semibold text-emerald-700 mt-1 font-mono">{reportsReady}</div>
            <span className="text-[12px] text-muted">Completed scorecards & code</span>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Plan Quota (Team)</div>
            <div className="text-[15px] font-semibold text-ink mt-2 flex items-center justify-between">
              <span>{interviews.length} / 50 sessions</span>
              <span className="text-emerald-700 font-mono text-[12px]">In quota</span>
            </div>
            <div className="w-full bg-[#FAFAFA] h-1.5 rounded-full mt-2 overflow-hidden border border-divider">
              <div
                className="bg-[#D14509] h-full rounded-full"
                style={{ width: `${Math.min(100, (interviews.length / 50) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Candidates Evaluation Table with Rubric Summaries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">
              Candidate Rubric Breakdown & Recommendations
            </h2>
            <span className="text-[12px] text-muted font-mono">
              Select 2+ candidates to compare side by side (F-26)
            </span>
          </div>

          <div className="border border-divider rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-4 w-10">Select</th>
                  <th className="py-3 px-5 font-medium">Candidate</th>
                  <th className="py-3 px-5 font-medium">Role</th>
                  <th className="py-3 px-5 font-medium">Problem Solving</th>
                  <th className="py-3 px-5 font-medium">Code Quality</th>
                  <th className="py-3 px-5 font-medium">Testing</th>
                  <th className="py-3 px-5 font-medium">Recommendation</th>
                  <th className="py-3 px-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {roleInterviews.map((iv) => {
                  const isChecked = selectedCandidates.has(iv.id);
                  const ps = iv.scorecard?.categories.find((c) => c.name.includes('Problem'));
                  const cq = iv.scorecard?.categories.find((c) => c.name.includes('Quality'));
                  const tst = iv.scorecard?.categories.find((c) => c.name.includes('Testing'));

                  return (
                    <tr
                      key={iv.id}
                      className={`border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors ${
                        isChecked ? 'bg-[#FFF9F5]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(iv.id)}
                          className="rounded border-divider text-[#D14509] focus:ring-[#D14509] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-ink text-[14px]">{iv.candidateName}</div>
                        <div className="text-[12px] text-muted">{iv.candidateEmail}</div>
                      </td>
                      <td className="py-3.5 px-5 text-[14px] text-ink">{iv.role}</td>
                      <td className="py-3.5 px-5 font-mono text-[13px]">
                        {ps ? (
                          <span className="font-semibold text-ink">{ps.score}/4</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[13px]">
                        {cq ? (
                          <span className="font-semibold text-ink">{cq.score}/4</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[13px]">
                        {tst ? (
                          <span className="font-semibold text-ink">{tst.score}/4</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono">
                        {iv.scorecard?.recommendation ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[12px] font-semibold border ${
                              iv.scorecard.recommendation.includes('No Hire')
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {iv.scorecard.recommendation}
                          </span>
                        ) : (
                          <Badge variant="neutral">{iv.status}</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {iv.status === 'Completed' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewReport(iv)}
                            className="space-x-1"
                          >
                            <FileText size={12} />
                            <span>Report</span>
                          </Button>
                        ) : (
                          <span className="text-[12px] text-muted font-mono">{iv.status}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

