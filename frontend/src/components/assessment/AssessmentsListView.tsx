import React, { useState } from 'react';
import { AssessmentAttempt } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SystemCheckModal } from './SystemCheckModal';
import { FileCode2, Play, CheckCircle2, Clock, Plus, Share2 } from 'lucide-react';

interface AssessmentsListViewProps {
  assessments: AssessmentAttempt[];
  onTakeAssessment: (assessment: AssessmentAttempt) => void;
  onRefresh: () => void;
}

export const AssessmentsListView: React.FC<AssessmentsListViewProps> = ({
  assessments,
  onTakeAssessment,
  onRefresh,
}) => {
  const [selectedForCheck, setSelectedForCheck] = useState<AssessmentAttempt | null>(null);

  const getAssessmentStatusBadge = (status: AssessmentAttempt['status']) => {
    switch (status) {
      case 'In Progress':
        return <Badge variant="medium">In Progress</Badge>;
      case 'Graded':
      case 'Reviewed':
        return <Badge variant="success">{status}</Badge>;
      case 'Timed out':
        return <Badge variant="warning">Timed out</Badge>;
      case 'Submitted':
        return <Badge variant="warning">Submitted</Badge>;
      case 'Invited':
        return <Badge variant="neutral">Invited</Badge>;
      case 'Expired':
        return <Badge variant="neutral">Expired</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const inProgressCount = assessments.filter((a) => a.status === 'In Progress').length;
  const completedCount = assessments.filter(
    (a) => a.status === 'Graded' || a.status === 'Reviewed' || a.status === 'Submitted'
  ).length;

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Async Evaluation & Automated Screening
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Async Assessments</h1>
            <p className="text-body text-muted mt-1">
              Timed technical screenings with automated test harness execution and integrity signals.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              if (assessments.length > 0) setSelectedForCheck(assessments[0]);
            }}
            className="flex items-center space-x-2"
          >
            <Play size={15} className="fill-white" />
            <span>Launch Candidate Assessment</span>
          </Button>
        </div>

        {/* Overview Metric Strip */}
        <div className="grid grid-cols-4 gap-6 py-2 border-b border-divider pb-6">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Total Campaigns</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">
              {assessments.length} <span className="text-[13px] font-sans font-normal text-muted">screenings</span>
            </div>
            <div className="text-[12px] text-muted mt-1 font-mono">
              Async take-home & automated loops
            </div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">In Progress</div>
            <div className="text-[26px] font-semibold text-[#D14509] mt-1 font-mono">
              {inProgressCount}
            </div>
            <div className="text-[12px] text-muted mt-1">Active candidate countdowns</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Submitted & Evaluated</div>
            <div className="text-[26px] font-semibold text-emerald-700 mt-1 font-mono">
              {completedCount}
            </div>
            <div className="text-[12px] text-muted mt-1">Automatic test validation complete</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Integrity Telemetry</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono flex items-center space-x-1.5 text-emerald-700">
              <CheckCircle2 size={20} />
              <span className="text-[18px]">Focus Monitored</span>
            </div>
            <div className="text-[12px] text-muted mt-1 font-mono">Paste detection & blur events</div>
          </div>
        </div>

        {/* Assessment Campaigns Table */}
        <div className="mt-4 border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-5 font-medium">Candidate</th>
                <th className="py-3 px-5 font-medium">Assessment Title</th>
                <th className="py-3 px-5 font-medium">Allocated Time</th>
                <th className="py-3 px-5 font-medium">Questions</th>
                <th className="py-3 px-5 font-medium">Status</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors duration-150"
                >
                  <td className="py-4 px-5">
                    <div className="font-semibold text-ink text-[14px]">{a.candidateName}</div>
                    <div className="text-[12px] text-muted">{a.candidateEmail}</div>
                  </td>
                  <td className="py-4 px-5 font-medium text-[14px] text-ink">{a.assessmentTitle}</td>
                  <td className="py-4 px-5 font-mono text-[13px] text-muted">
                    {a.totalTimeMinutes} minutes
                  </td>
                  <td className="py-4 px-5 font-mono text-[13px] text-muted">
                    {a.questionIds.length} problems
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-2">
                      {getAssessmentStatusBadge(a.status)}
                      {a.score !== undefined && (
                        <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {a.score}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedForCheck(a)}
                      className="space-x-1"
                    >
                      <Play size={12} />
                      <span>Take Assessment</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedForCheck && (
        <SystemCheckModal
          isOpen={!!selectedForCheck}
          onClose={() => setSelectedForCheck(null)}
          onProceed={() => {
            const item = selectedForCheck;
            setSelectedForCheck(null);
            onTakeAssessment(item);
          }}
        />
      )}
    </div>
  );
};

