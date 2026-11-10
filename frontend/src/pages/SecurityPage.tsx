import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Server, Eye, FileCheck2, Cpu } from 'lucide-react';

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
        <Link to="/security" className="text-ink font-semibold">
          Security
        </Link>
        <Link to="/privacy" className="text-muted hover:text-ink">
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

export function SecurityPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <PolicyNav />
      <div className="max-w-[760px] mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-[8px] bg-[#FFF3EB] flex items-center justify-center mb-4">
            <Shield size={24} className="text-[#D14509]" />
          </div>
          <h1 className="text-[32px] font-semibold text-ink tracking-tight">Security & Isolation Architecture</h1>
          <p className="text-[15px] text-muted mt-2">
            Detailed overview of how CodeRoom isolates code execution, protects candidate privacy, and complies with enterprise standards.
          </p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-ink">
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Server size={18} className="text-[#D14509]" />
              <h2 className="text-[18px] font-semibold">MicroVM Execution Isolation (PRD IS-1)</h2>
            </div>
            <p className="text-muted leading-relaxed">
              Every code execution runs in an ephemeral microVM sandbox managed through Firecracker. Guest microVMs have zero external network connectivity by default, strictly bounded CPU and memory allocations (512 MB standard, 4 GB maximum), and an isolated virtual socket (vsock) interface. Once a program completes or triggers a resource threshold, the microVM is destroyed immediately.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Eye size={18} className="text-[#D14509]" />
              <h2 className="text-[18px] font-semibold">Hidden Test Invariant (PRD IS-7)</h2>
            </div>
            <p className="text-muted leading-relaxed">
              In CodeRoom, hidden test case inputs and expected outputs are strictly evaluated inside a separate grading sandbox on the server. Hidden I/O data is cryptographically stripped before any telemetry reaches the client browser. Candidates only ever observe aggregate pass counts (e.g., "5 of 6 tests passed") and standard error categorizations (Wrong Answer, Time Limit Exceeded).
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Lock size={18} className="text-[#D14509]" />
              <h2 className="text-[18px] font-semibold">Data Encryption & Token Scoping</h2>
            </div>
            <p className="text-muted leading-relaxed">
              All communications are encrypted using TLS 1.3 in transit and AES-256 at rest. Candidate session links use time-bounded cryptographically signed tokens strictly scoped to the assigned interview session ID, prohibiting cross-session or organizational administrative access.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-3">
              <FileCheck2 size={18} className="text-[#D14509]" />
              <h2 className="text-[18px] font-semibold">Immutable Audit Logs (F-31)</h2>
            </div>
            <p className="text-muted leading-relaxed">
              Administrative actions, data export events, candidate record purges, and scorecard submissions are appended to an immutable audit ledger. Organization admins can export full SOC2-compliant compliance logs directly from the administration dashboard.
            </p>
          </section>

          <div className="border border-divider rounded-[8px] p-6 bg-[#FAFAFA]">
            <h3 className="font-semibold text-ink mb-1.5">Vulnerability Disclosure Program</h3>
            <p className="text-muted text-[14px]">
              We take security disclosures seriously. If you identify an isolation vulnerability or security flaw, please contact us at{' '}
              <span className="text-[#D14509] font-mono">security@coderoom.dev</span>. We guarantee a triage response within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

