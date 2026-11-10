import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

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
        <Link to="/privacy" className="text-muted hover:text-ink">
          Privacy
        </Link>
        <Link to="/terms" className="text-ink font-semibold">
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

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <PolicyNav />
      <div className="max-w-[760px] mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-[8px] bg-[#FFF3EB] flex items-center justify-center mb-4">
            <FileText size={24} className="text-[#D14509]" />
          </div>
          <h1 className="text-[32px] font-semibold text-ink tracking-tight">Terms of Service</h1>
          <p className="text-[14px] text-muted mt-2">Last updated: November 2, 2026</p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="text-[18px] font-semibold mb-3">1. Scope of Service</h2>
            <p className="text-muted">
              CodeRoom provides software-as-a-service infrastructure enabling synchronous live technical coding interviews, asynchronous coding assessments, isolated execution sandboxes, and structured rubric scoring for enterprise recruitment teams.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">2. Acceptable Sandbox Usage</h2>
            <p className="text-muted">
              Users agree not to exploit sandbox microVM execution instances to conduct network denial-of-service attacks, cryptocurrency mining, privilege escalations, or unauthorized port scanning. Attempted sandbox escape attempts result in automatic session termination and IP isolation.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">3. Intellectual Property Rights</h2>
            <p className="text-muted">
              Organizations retain full ownership of proprietary question libraries, custom evaluation rubrics, and candidate review archives. CodeRoom retains rights to proprietary sandbox orchestration engines, compiler kernels, and platform UI assets.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold mb-3">4. Availability & SLA Commitments</h2>
            <p className="text-muted">
              CodeRoom targets 99.9% uptime for live interview rooms and sandbox execution clusters. System maintenance windows are announced at least 48 hours in advance through status dashboards.
            </p>
          </section>

          <div className="border border-divider rounded-[8px] p-6 bg-[#FAFAFA]">
            <p className="text-[14px] text-muted">
              For commercial contract inquiries or custom master service agreements, contact{' '}
              <span className="text-[#D14509] font-mono">legal@coderoom.dev</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

