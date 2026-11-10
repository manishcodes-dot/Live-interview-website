import React, { useState } from 'react';
import { Interview } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FileText,
  ArrowLeftRight,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Award,
} from 'lucide-react';
import { CandidateCompareView } from './CandidateCompareView';

interface CandidatesViewProps {
  interviews: Interview[];
  onViewReport: (interview: Interview) => void;
  onNavigateToInterviews?: () => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  interviews,
  onViewReport,
  onNavigateToInterviews,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isComparing, setIsComparing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendationFilter, setRecommendationFilter] = useState('');

  // Strictly filter only candidates who have completed an interview & have an evaluation report
  const completedCandidates = interviews.filter((i) => i.status === 'Completed');

  const filteredCandidates = completedCandidates
    .filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.candidateName.toLowerCase().includes(q) ||
        c.candidateEmail.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    })
    .filter((c) => {
      if (!recommendationFilter) return true;
      return c.scorecard?.recommendation === recommendationFilter;
    });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCandidates = completedCandidates.filter((i) => selectedIds.has(i.id));

  if (isComparing) {
    return (
      <CandidateCompareView
        candidates={selectedCandidates}
        onBack={() => setIsComparing(false)}
      />
    );
  }

  // Summary counts
  const strongHireCount = completedCandidates.filter(
    (c) => c.scorecard?.recommendation === 'Strong Hire'
  ).length;
  const hireCount = completedCandidates.filter(
    (c) => c.scorecard?.recommendation === 'Hire'
  ).length;

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Candidate Intelligence & Archive
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Candidate Directory</h1>
            <p className="text-body text-muted mt-1">
              Historical evaluation archive of candidates who have completed technical interviews. Access submitted code, rubrics, and detailed reports.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedIds.size >= 2 && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsComparing(true)}
                className="space-x-2"
              >
                <ArrowLeftRight size={15} />
                <span>Compare Selected ({selectedIds.size})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">
              Completed Interviews
            </div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">
              {completedCandidates.length}
            </div>
            <div className="text-[12px] text-muted mt-1">All reports generated</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">
              Strong Hire Ratings
            </div>
            <div className="text-[26px] font-semibold text-[#D14509] mt-1 font-mono">
              {strongHireCount}
            </div>
            <div className="text-[12px] text-muted mt-1">Top tier technical benchmarks</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">
              Hire Recommendations
            </div>
            <div className="text-[26px] font-semibold text-emerald-700 mt-1 font-mono">
              {hireCount}
            </div>
            <div className="text-[12px] text-muted mt-1">Cleared rubric thresholds</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white flex flex-col justify-between">
            <div>
              <div className="text-[12px] uppercase font-mono tracking-wider text-muted">
                Active Coding Rooms
              </div>
              <div className="text-[12px] text-muted mt-1">
                Looking for live or upcoming rooms?
              </div>
            </div>
            {onNavigateToInterviews && (
              <button
                onClick={onNavigateToInterviews}
                className="text-[13px] text-[#D14509] font-medium hover:underline flex items-center space-x-1 pt-2"
              >
                <span>Go to Interviews Tab</span>
                <ExternalLink size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative w-80">
              <Search size={14} className="absolute left-3 top-3 text-muted" />
              <input
                type="text"
                placeholder="Search completed candidate or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 border border-divider rounded-[6px] text-[13px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509]"
              />
            </div>

            <select
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="h-9 px-3 border border-divider rounded-[6px] text-[13px] text-ink bg-white focus:outline-none focus:border-[#D14509] cursor-pointer"
            >
              <option value="">All Recommendations</option>
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="No Hire">No Hire</option>
            </select>
          </div>

          {(searchQuery || recommendationFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRecommendationFilter('');
              }}
              className="text-[13px] text-[#D14509] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Candidate Evaluation Directory Table */}
        <div className="border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-4 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-5 font-medium">Candidate</th>
                <th className="py-3 px-5 font-medium">Role</th>
                <th className="py-3 px-5 font-medium">Format</th>
                <th className="py-3 px-5 font-medium">Evaluated By</th>
                <th className="py-3 px-5 font-medium">Completed Date</th>
                <th className="py-3 px-5 font-medium">Scorecard Verdict</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-muted">
                        <FileText size={20} />
                      </div>
                      <div className="font-semibold text-ink text-[15px]">No Completed Interviews Found</div>
                      <p className="text-[13px] text-muted leading-relaxed">
                        Candidates will appear here once their interview session has ended and their evaluation report is generated. Active rooms are located in the Interviews tab.
                      </p>
                      {onNavigateToInterviews && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={onNavigateToInterviews}
                          className="mt-2"
                        >
                          View Interviews & Active Rooms
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((cand) => {
                  const isSelected = selectedIds.has(cand.id);
                  const recommendation = cand.scorecard?.recommendation;

                  return (
                    <tr
                      key={cand.id}
                      className={`border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors duration-150 ${
                        isSelected ? 'bg-[#FFF9F5]' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(cand.id)}
                          className="rounded border-divider text-[#D14509] focus:ring-[#D14509] cursor-pointer"
                          title="Select to compare side-by-side"
                        />
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-ink text-[14px]">
                          {cand.candidateName}
                        </div>
                        <div className="text-[12px] text-muted">{cand.candidateEmail}</div>
                      </td>

                      <td className="py-4 px-5 text-[14px] text-ink font-medium">
                        {cand.role}
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-mono border border-divider text-muted">
                          {cand.type === 'Live' ? 'Live Coding' : 'Async Assessment'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-[13px] text-muted">
                        {cand.interviewerNames?.join(', ') || 'Staff Reviewer'}
                      </td>

                      <td className="py-4 px-5 text-[13px] font-mono text-muted">
                        <div className="flex items-center space-x-1.5">
                          <Calendar size={13} className="text-muted" />
                          <span>{cand.scheduledDate.split('(')[0].trim()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {recommendation ? (
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[12px] font-semibold font-mono ${
                              recommendation === 'Strong Hire'
                                ? 'bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/30'
                                : recommendation === 'Hire'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            <Award size={12} />
                            <span>{recommendation}</span>
                          </span>
                        ) : (
                          <span className="text-[12px] font-mono text-muted">Evaluation Complete</span>
                        )}
                      </td>

                      {/* Strictly only "View Report" action - no room buttons */}
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewReport(cand)}
                          className="space-x-1.5 text-ink hover:text-[#D14509]"
                        >
                          <FileText size={13} />
                          <span>View Report</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
