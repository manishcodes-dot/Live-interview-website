import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck } from 'lucide-react';

function PolicyNav() {
  return (
    <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2.5">
        <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
          C
        </div>
        <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
      </Link>
      <div className="flex items-center space-x-6 text-[14px]">
        <Link to="/security" className="text-muted hover:text-ink">
          Security
        </Link>
        <Link to="/privacy" className="text-ink font-semibold">
          Privacy
        </Link>
        <Link to="/terms" className="text-muted hover:text-ink">
          Terms
        </Link>
        <Link
          to="/signin"
          className="h-9 px-4 border border-divider rounded-[6px] flex items-center text-ink hover:bg-[#FFF7F1] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <PolicyNav />
      <div className="max-w-[760px] mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-[8px] bg-[#FFF3EB] flex items-center justify-center mb-4">
            <FileText size={24} className="text-[#D14509]" />
          </div>
          <h1 className="text-[32px] font-semibold text-ink tracking-tight">Privacy Policy</h1>
          <p className="text-[14px] text-muted mt-2">Effective date: November 2, 2026</p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="text-[18px] font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted">
              We collect information provided directly by organizations and their candidate participants: names, corporate email addresses, submitted code solutions, interview session recordings, interviewer evaluation rubrics, and diagnostic signals (window focus events and paste volume). We strictly do not capture biometric signatures, facial recognition data, or keystroke acoustic audio.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">2. Integrity Signals Transparency (F-27)</h2>
            <p className="text-muted">
              During technical assessments, CodeRoom records objective events such as clipboard paste sizes and browser tab focus changes. In adherence to Section 9 of our specification, candidates are notified upfront before initiating their session. All integrity metrics are labeled explicitly for hiring teams as: <strong className="text-ink">"Signals for review. They are not verdicts."</strong> Automated disqualification is never permitted.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">3. Data Retention & Right to Erasure (F-30)</h2>
            <p className="text-muted">
              By default, interview recordings, playback replays, and candidate scorecards are retained for 12 months. Organization administrators can enforce custom retention windows or trigger immediate erasure requests. Upon execution of an erasure request, all corresponding code files, logs, and database rows are purged within 30 days and permanently documented in the immutable audit log.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">4. No AI Model Training on Candidate Submissions</h2>
            <p className="text-muted">
              Candidate code, solutions, transcripts, and evaluation remarks are never utilized to train third-party foundation models without explicit contractual enterprise consent.
            </p>
          </section>

          <div className="border border-divider rounded-[8px] p-6 bg-[#FAFAFA]">
            <p className="text-[14px] text-muted">
              For privacy inquiries or data subject access requests under GDPR/CCPA, please contact{' '}
              <span className="text-[#D14509] font-mono">privacy@coderoom.dev</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

