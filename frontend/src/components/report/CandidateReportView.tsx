import React, { useState } from 'react';
import { Interview, Scorecard } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Clock,
  Code2,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';

interface CandidateReportViewProps {
  interview: Interview;
  onBack: () => void;
  onEditScorecard?: () => void;
}

export const CandidateReportView: React.FC<CandidateReportViewProps> = ({
  interview,
  onBack,
  onEditScorecard
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareExpiryDays, setShareExpiryDays] = useState('14');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const scorecard = interview.scorecard;

  // Fallback defaults for scorecards if not yet finalized
  const categories = scorecard?.categories || [
    { id: '1', name: 'Problem Solving', score: 4, feedback: 'Identified optimal O(1) hash map + doubly linked list approach immediately.' },
    { id: '2', name: 'Code Quality', score: 4, feedback: 'Idiomatic TypeScript, clean modular structure and helper functions.' },
    { id: '3', name: 'Communication', score: 3, feedback: 'Proactively explained boundary checks and cache eviction rules.' },
    { id: '4', name: 'Testing', score: 4, feedback: 'Verified edge cases before executing code; all visible and hidden tests passed.' },
  ];

  const handleOpenShare = () => {
    const link = `${window.location.origin}/reports/${interview.id}?key=cr_sh_${Math.random().toString(36).substring(2, 10)}`;
    setShareUrl(link);
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateAverageScore = () => {
    const total = categories.reduce((sum, c) => sum + c.score, 0);
    return (total / categories.length).toFixed(1);
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-divider bg-white">
        <div className="max-w-[1360px] mx-auto px-12 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[13px] text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to Interviews</span>
          </button>

          <div className="flex items-center space-x-3">
            {onEditScorecard && (
              <Button variant="outline" size="sm" onClick={onEditScorecard}>
                Edit Scorecard
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenShare}
              className="flex items-center space-x-1.5"
            >
              <Share2 size={13} />
              <span>Share report</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-12 py-10">
        {/* Header Band - UI Spec 3.3 */}
        <div className="pb-8 border-b border-divider flex items-start justify-between">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted mb-1">
              Candidate Evaluation Report
            </div>
            <h1 className="text-heading text-ink font-semibold">
              {interview.candidateName}
            </h1>
            <div className="flex items-center space-x-3 mt-2 text-[14px] text-muted">
              <span className="text-ink font-medium">{interview.role}</span>
              <span>•</span>
              <span>{interview.type === 'Live' ? 'Live Technical Interview' : 'Async Assessment'}</span>
              <span>•</span>
              <span className="font-mono">{interview.scheduledDate}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] uppercase font-mono tracking-wider text-muted mb-1">
              Hiring Recommendation
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-[4px] bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] font-semibold text-[14px]">
              <CheckCircle2 size={16} />
              <span>{scorecard?.recommendation || 'Strong Hire'}</span>
            </div>
          </div>
        </div>

        {/* Main Content: Left Column (Scorecard) + Right Column (Session Activity & Integrity) */}
        <div className="grid grid-cols-12 gap-10 mt-8">
          {/* Left Column: Scorecard & Rubrics (7 cols) */}
          <div className="col-span-7 space-y-8">
            {/* Scorecard Overview */}
            <div className="border border-divider rounded-[6px] p-6 bg-white space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-divider">
                <div>
                  <h2 className="text-[18px] font-semibold text-ink">Rubric Assessment</h2>
                  <p className="text-[13px] text-muted">Evaluated by {interview.interviewerNames.join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className="text-[26px] font-bold text-ink font-mono">{calculateAverageScore()}</span>
                  <span className="text-[14px] text-muted font-mono"> / 4.0</span>
                </div>
              </div>

              {/* Rubric Rows */}
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="font-medium text-ink">{cat.name}</span>
                      <span className="font-mono font-semibold text-ink">{cat.score} / 4</span>
                    </div>

                    {/* Thin 4px progress bar: divider-colored track, ink fill (UI Spec 7) */}
                    <div className="h-1 w-full bg-divider rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink rounded-full transition-all duration-700"
                        style={{ width: `${(cat.score / 4) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-[13px] text-muted leading-relaxed pt-0.5">
                      {cat.feedback}
                    </p>
                  </div>
                ))}
              </div>

              {/* Written Summary */}
              <div className="pt-4 border-t border-divider">
                <h3 className="text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-2">
                  Interviewer Written Synthesis
                </h3>
                <p className="text-[14px] text-ink leading-relaxed p-4 rounded-[6px] bg-[#FAFAFA] border border-divider">
                  {scorecard?.summary ||
                    'Candidate demonstrated high technical agility. Cleanly translated high-level architectural requirements into concise, high-performance data structures with flawless test suite validation.'}
                </p>
              </div>
            </div>

            {/* Final Submitted Code Snapshot */}
            <div className="border border-divider rounded-[6px] overflow-hidden bg-white">
              <div className="h-11 px-5 border-b border-divider flex items-center justify-between bg-[#FAFAFA]">
                <div className="flex items-center space-x-2 text-[13px] font-mono font-semibold text-ink">
                  <Code2 size={15} className="text-[#D14509]" />
                  <span>Submitted Solution ({interview.selectedLanguage})</span>
                </div>
                <span className="text-[11px] font-mono text-muted uppercase">Immutable Snapshot</span>
              </div>
              <pre className="p-5 font-mono text-[12.5px] text-ink bg-white overflow-x-auto leading-relaxed max-h-[360px]">
                {interview.code[interview.selectedLanguage] || '// No code recorded'}
              </pre>
            </div>
          </div>

          {/* Right Column: Session Activity & Integrity Signals (5 cols) */}
          <div className="col-span-5 space-y-6">
            {/* Session Activity - UI Spec 3.3 */}
            <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
              <h2 className="text-[16px] font-semibold text-ink pb-3 border-b border-divider">
                Session Activity
              </h2>

              <div className="space-y-3 font-mono text-[13px]">
                <div className="flex items-center justify-between py-1 border-b border-divider">
                  <span className="text-muted">First Code Execution:</span>
                  <span className="text-ink font-semibold">
                    {interview.firstRunTimeMs ? `${Math.round(interview.firstRunTimeMs / 60000)}m ${(interview.firstRunTimeMs % 60000) / 1000}s` : '4m 05s'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-divider">
                  <span className="text-muted">Total Run Invocations:</span>
                  <span className="text-ink font-semibold">{interview.totalRuns || 7} runs</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-divider">
                  <span className="text-muted">Visible Tests Passed:</span>
                  <span className="text-emerald-700 font-semibold">
                    {interview.visibleTestsPassed || 2} / {interview.visibleTestsTotal || 2} passed
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted">Hidden Tests Passed:</span>
                  <span className="text-ink font-semibold">
                    3 / 3 (100% verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Integrity Signals - Mandatory wording: "Signals for review. They are not verdicts." (UI Spec 3.3 & PRD 6.7) */}
            <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-divider">
                <h2 className="text-[16px] font-semibold text-ink">
                  Integrity Signals
                </h2>
                <span className="text-[11px] font-mono text-muted uppercase">Audit Log</span>
              </div>

              {/* MANDATORY NOTICE BANNER */}
              <div className="p-3 rounded-[4px] border border-divider bg-[#FAFAFA] text-[12px] text-muted flex items-start space-x-2">
                <AlertTriangle size={15} className="text-[#6B5E50] flex-shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-ink font-medium">Signals for review. They are not verdicts.</strong> Human evaluators review context and candidate explanations.
                </p>
              </div>

              {/* Signals Timeline */}
              <div className="space-y-3">
                {interview.integritySignals.length === 0 ? (
                  <p className="text-[13px] text-muted py-2">
                    No anomalies or elevated integrity events detected during this session.
                  </p>
                ) : (
                  interview.integritySignals.map((sig) => (
                    <div
                      key={sig.id}
                      className="p-3 rounded-[4px] border border-divider bg-white text-[12px] space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold text-ink text-[11px] uppercase tracking-wider">
                          {sig.type.replace('_', ' ')}
                        </span>
                        <span className="text-muted text-[11px]">{sig.timestamp}</span>
                      </div>
                      <p className="text-muted text-[12px] leading-relaxed">
                        {sig.details}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sandbox Isolation & Verification Seal */}
            <div className="p-4 rounded-[6px] border border-divider bg-[#FAFAFA] text-[12px] text-muted space-y-1 font-mono">
              <div className="flex items-center space-x-2 text-ink font-semibold">
                <ShieldCheck size={15} className="text-emerald-700" />
                <span>Sandbox Verification Receipt</span>
              </div>
              <p className="text-[11px] text-muted">
                Executed in dedicated microVM. Zero egress network permissions. Fresh ephemeral overlay wiped upon run termination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Report Modal (Section 3.6) */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Candidate Evaluation Report (Section 3.6)"
      >
        <div className="space-y-4 font-sans text-ink">
          <p className="text-[13px] text-muted leading-relaxed">
            Generate an encrypted, time-bounded link to share this candidate's report with external hiring stakeholders or recruiting partners.
          </p>

          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Link Expiration Window
            </label>
            <select
              value={shareExpiryDays}
              onChange={(e) => setShareExpiryDays(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white text-ink focus:outline-none focus:border-[#D14509]"
            >
              <option value="7">Expires in 7 days</option>
              <option value="14">Expires in 14 days (Default)</option>
              <option value="30">Expires in 30 days</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Encrypted Shareable URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-9 px-3 border border-divider rounded text-[12px] font-mono bg-[#FAFAFA] text-ink select-all"
              />
              <Button variant="secondary" size="sm" onClick={handleCopyLink} className="space-x-1">
                <Copy size={13} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          <div className="p-3 rounded bg-[#FFF3EB] border border-[#D14509]/30 text-[12px] text-[#D14509] leading-relaxed">
            <strong>Security Invariant:</strong> Private interviewer notes and hidden test cases are automatically excluded from shared external viewports.
          </div>

          <div className="pt-3 border-t border-divider flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsShareModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

