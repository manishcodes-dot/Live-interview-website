import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Clock, FileCode2 } from 'lucide-react';

interface CandidateThankYouViewProps {
  candidateName: string;
  role: string;
  sessionType: 'Live' | 'Async';
}

export const CandidateThankYouView: React.FC<CandidateThankYouViewProps> = ({
  candidateName,
  role,
  sessionType,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink select-none">
      {/* Top Header */}
      <header className="h-16 px-8 border-b border-divider flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </div>
        <span className="text-[12px] font-mono text-muted">Session Complete</span>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[560px] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF3EB] flex items-center justify-center mx-auto text-[#D14509]">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">
              Thank you, {candidateName}!
            </h1>
            <p className="text-[15px] text-muted mt-2">
              Your {sessionType === 'Live' ? 'live technical interview' : 'technical assessment'} for the{' '}
              <strong className="text-ink">{role}</strong> position has concluded.
            </p>
          </div>

          <div className="p-6 rounded-[8px] border border-divider bg-[#FAFAFA] text-left space-y-4">
            <h2 className="text-[14px] font-semibold text-ink uppercase font-mono tracking-wider">
              What happens next
            </h2>
            <div className="space-y-3 text-[13px] text-muted leading-relaxed">
              <div className="flex items-start space-x-2.5">
                <FileCode2 size={16} className="text-[#D14509] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Code Preservation:</strong> Your final code submissions and test harness execution logs have been encrypted and saved securely for the hiring team.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Human Evaluation:</strong> CodeRoom scorecards are evaluated directly by engineering interviewers using standard rubrics. Automated disqualification is never used.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock size={16} className="text-[#D14509] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Recruiter Follow-up:</strong> The talent team will review your evaluation and reach out regarding subsequent steps in the hiring process.
                </span>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-muted font-mono">
            You may now safely close this browser window.
          </p>
        </div>
      </div>
    </div>
  );
};

