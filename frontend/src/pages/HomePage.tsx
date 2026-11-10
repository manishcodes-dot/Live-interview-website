import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, ArrowRight, CheckCircle2, Shield, Zap, Users, Code2,
  Terminal, Lock, BarChart2, ChevronRight, Star, Globe, Menu, X
} from 'lucide-react';
import { Cabinet, Laptop, Hub, Loupe, Plot, Padlock } from '@lucasmarkes/hairline/react';
import { Marquee } from '../components/ui/marquee';

const FEATURES = [
  {
    figure: Cabinet,
    title: 'Isolated Cloud Sandboxes',
    description: 'Every interview runs in its own private microVM with pinned runtimes and zero network leaks.',
  },
  {
    figure: Laptop,
    title: 'Multi-Language Editor',
    description: 'Full Monaco editor supporting Python, TypeScript, Java, C++, and Go with instant execution.',
  },
  {
    figure: Hub,
    title: 'Real-Time Collaboration',
    description: 'Instant bi-directional code sync, audio/video calls, and an interactive shared whiteboard.',
  },
  {
    figure: Loupe,
    title: 'Integrity Signals',
    description: 'Unobtrusive alerts for copy-paste events and tab switching without invasive surveillance.',
  },
  {
    figure: Plot,
    title: 'Structured Scorecards',
    description: 'Standardized rubrics and team synthesis to make fair, consistent, and bias-free hiring decisions.',
  },
  {
    figure: Padlock,
    title: 'Hidden Test Cases',
    description: 'Secret automated test suites validate edge cases without leaking solution criteria to candidates.',
  },
];

const STATS = [
  { value: '1.4s', label: 'Median sandbox cold-start' },
  { value: '7', label: 'Supported languages' },
  { value: '100%', label: 'MicroVM isolation' },
  { value: '<30ms', label: 'WebSocket latency' },
];

const TESTIMONIALS_ROW_1 = [
  {
    quote: 'Cut our setup time from 20 minutes to under 2. The sandbox cold-start is legitimately fast — candidates aren\'t waiting around.',
    role: 'Staff Infrastructure Engineer',
    org: 'Enterprise Security Unicorn',
    initials: 'SI',
  },
  {
    quote: 'The hidden test harness is a game-changer. We author once and reuse across loops. Integrity signals helped us understand behavior without punishment.',
    role: 'Principal Systems Architect',
    org: 'High-Growth Fintech',
    initials: 'PA',
  },
  {
    quote: 'Finally a platform that treats scorecards as a first-class product. Hiring decisions are more consistent and defensible across our team.',
    role: 'Director of Engineering',
    org: 'Developer Platform SaaS',
    initials: 'DE',
  },
  {
    quote: 'Real-time sync over WebSocket feels like pairing locally in VS Code. Latency is consistently under 30ms even for overseas candidates.',
    role: 'Lead Backend Architect',
    org: 'Cloud Infrastructure Provider',
    initials: 'BA',
  },
];

const TESTIMONIALS_ROW_2 = [
  {
    quote: 'Firecracker microVM isolation gave our InfoSec and compliance teams immediate peace of mind. Zero container escapes, zero network bleed.',
    role: 'VP of Information Security',
    org: 'Series C HealthTech',
    initials: 'IS',
  },
  {
    quote: 'Candidates love having zero software to download or accounts to create. They click the private link, run a 30s check, and jump straight into code.',
    role: 'Senior Technical Recruiter',
    org: 'Global Product Design Co.',
    initials: 'TR',
  },
  {
    quote: 'Our candidate pass rate consistency jumped 35%. Objective test suites remove the "interviewer mood" variance completely.',
    role: 'Head of Core Platform',
    org: 'Distributed Database Startup',
    initials: 'CP',
  },
  {
    quote: 'No biometric surveillance, no creepy webcams. Just clean integrity telemetry and an editor that works. It\'s the honest way to interview.',
    role: 'Engineering Manager',
    org: 'Payments Infrastructure',
    initials: 'EM',
  },
];

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Pricing', href: '/pricing' },
];

export const HomePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      {/* ── Navigation (Full-width edge-to-edge, compact h-14, zero awkward gap) ── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-divider shadow-sm transition-all duration-200">
        <div className="w-full px-6 sm:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[13px] shadow-sm">
              C
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-ink">CodeRoom</span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[14px] text-muted hover:text-ink transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-muted hover:text-ink transition-colors font-medium"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop CTA actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              to="/signin"
              className="text-[14px] text-muted hover:text-ink font-medium transition-colors px-2 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/app"
              className="h-9 px-4 rounded-[6px] bg-[#D14509] border border-[#D14509] hover:border-[#b83c07] hover:bg-[#b83c07] text-white text-[13.5px] font-semibold inline-flex items-center justify-center space-x-1.5 transition-all shadow-sm"
            >
              <span>Open platform</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle & Quick CTA */}
          <div className="flex sm:hidden items-center space-x-2">
            <Link
              to="/app"
              className="h-9 px-3.5 rounded-[6px] bg-[#D14509] border border-[#D14509] hover:border-[#b83c07] hover:bg-[#b83c07] text-white text-[12px] font-semibold inline-flex items-center justify-center space-x-1 transition-colors shadow-sm"
            >
              <span>Launch</span>
              <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-[6px] border border-divider flex items-center justify-center text-ink hover:bg-[#FAF8F5] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-divider bg-white/98 backdrop-blur-md px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-md">
            <div className="flex flex-col space-y-2 pb-3 border-b border-divider text-[14px]">
              {NAV_LINKS.map((link) =>
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-muted hover:text-ink font-medium py-1"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-muted hover:text-ink font-medium py-1"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
            <div className="flex items-center justify-between pt-1 text-[13px]">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-ink font-medium"
              >
                Staff Sign In
              </Link>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D14509] font-medium"
              >
                Open Platform →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero (Calculated height with zero excess top gap) ── */}
      <section className="min-h-[calc(100vh-56px)] flex flex-col justify-center items-center py-8 sm:py-10 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-[44px] sm:text-[60px] md:text-[64px] font-semibold tracking-tight text-ink leading-[1.12] mb-6 max-w-4xl mx-auto">
          The technical interview platform built for{' '}
          <span className="relative inline-block text-[#D14509]">
            <span>honest evaluation.</span>
            <svg
              className="absolute -bottom-1.5 sm:-bottom-2.5 left-0 w-full h-[10px] sm:h-[13px] text-[#D14509] overflow-visible pointer-events-none"
              viewBox="0 0 300 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M3 10C75 2.5 210 2.5 297 8"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                pathLength="100"
                className="animate-draw-underline"
              />
            </svg>
          </span>
        </h1>

        <p className="text-[18px] text-muted leading-relaxed max-w-2xl mx-auto mb-10">
          Live coding rooms with real-time collaboration, isolated microVM sandboxes, hidden test harnesses, and structured scorecards — in one product, for engineering teams that care about accuracy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12">
          <Link
            to="/app"
            className="h-12 px-7 rounded-[8px] bg-[#D14509] text-white text-[15px] font-semibold flex items-center space-x-2 hover:bg-[#b83c07] transition-all hover:-translate-y-[1px] shadow-sm"
          >
            <Play size={15} className="fill-white" />
            <span>Open CodeRoom — it's free</span>
          </Link>
          <Link
            to="/pricing"
            className="h-12 px-7 rounded-[8px] border border-divider text-ink text-[15px] font-medium flex items-center space-x-2 hover:bg-[#FFF7F1] hover:border-[#6B5E50] transition-colors"
          >
            <span>See pricing</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Trust bar */}
        <p className="text-[13px] text-muted font-mono">
          No credit card required · GDPR compliant · SOC 2 Type II (in progress)
        </p>
      </section>

      {/* ── Product Screenshot / Terminal Demo ── */}
      <section className="min-h-screen flex flex-col justify-center px-6 max-w-6xl mx-auto py-12">
        <div className="rounded-[12px] border border-divider bg-white shadow-xl overflow-hidden">
          {/* Fake browser chrome */}
          <div className="h-10 bg-[#FAFAFA] border-b border-divider flex items-center px-4 space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-[#E5E1DB]"></div>
              <div className="w-3 h-3 rounded-full bg-[#E5E1DB]"></div>
              <div className="w-3 h-3 rounded-full bg-[#D14509]/60"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-6 bg-white border border-divider rounded-full max-w-xs mx-auto flex items-center px-3">
                <span className="text-[12px] font-mono text-muted">app.coderoom.dev/room/int-001</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#D14509]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D14509] animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider">Active</span>
            </div>
          </div>

          {/* Simulated app preview */}
          <div className="flex h-[460px]">
            {/* Left: Question Panel */}
            <div className="w-64 border-r border-divider p-4 space-y-3 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Question</span>
                <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/20">Medium</span>
              </div>
              <h3 className="text-[16px] font-semibold text-ink leading-tight">LRU Cache Implementation</h3>
              <p className="text-[12px] text-muted leading-relaxed">Design a data structure that follows the Least Recently Used cache constraints with O(1) get and put operations.</p>
              <div className="pt-2 border-t border-divider space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted font-semibold">Constraints</div>
                {['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', 'At most 2×10⁵ calls'].map(c => (
                  <div key={c} className="text-[11px] font-mono text-ink">• {c}</div>
                ))}
              </div>
            </div>

            {/* Center: Editor */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
              <div className="h-10 border-b border-divider flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[12px] font-mono font-semibold text-ink">solution.ts</span>
                  <span className="text-[11px] font-mono text-muted border border-divider px-1.5 py-0.5 rounded">TypeScript 5.x</span>
                </div>
                <div className="h-7 px-3 rounded bg-[#D14509] text-white text-[12px] font-semibold flex items-center space-x-1">
                  <Play size={11} className="fill-white" />
                  <span>Run</span>
                </div>
              </div>
              <div className="flex-1 p-4 font-mono text-[12px] overflow-hidden bg-white">
                {[
                  { indent: 0, text: 'class LRUCache {', color: 'text-ink' },
                  { indent: 1, text: 'private capacity: number;', color: 'text-muted' },
                  { indent: 1, text: 'private map: Map<number, number>;', color: 'text-muted' },
                  { indent: 0, text: '', color: '' },
                  { indent: 1, text: 'constructor(capacity: number) {', color: 'text-ink' },
                  { indent: 2, text: 'this.capacity = capacity;', color: 'text-muted' },
                  { indent: 2, text: 'this.map = new Map();', color: 'text-muted' },
                  { indent: 1, text: '}', color: 'text-muted' },
                  { indent: 0, text: '', color: '' },
                  { indent: 1, text: 'get(key: number): number {', color: 'text-ink' },
                  { indent: 2, text: 'if (!this.map.has(key)) return -1;', color: 'text-[#D14509]' },
                  { indent: 2, text: 'const value = this.map.get(key)!;', color: 'text-muted' },
                  { indent: 2, text: 'this.map.delete(key);', color: 'text-muted' },
                  { indent: 2, text: 'this.map.set(key, value);', color: 'text-muted' },
                  { indent: 2, text: 'return value;', color: 'text-muted' },
                  { indent: 1, text: '}', color: 'text-muted' },
                ].map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 text-right pr-3 text-[#E5E1DB] select-none flex-shrink-0">{i + 1}</span>
                    <span className={`${line.color}`} style={{ paddingLeft: `${line.indent * 16}px` }}>{line.text}</span>
                  </div>
                ))}
              </div>
              {/* Console */}
              <div className="h-28 border-t border-divider p-3 bg-white font-mono text-[11px] space-y-1">
                <div className="text-muted text-[10px] uppercase tracking-wider font-semibold border-b border-divider pb-1 mb-2">Output</div>
                <div className="text-emerald-700">✓ Case 1: Basic Put & Get — Passed (11ms)</div>
                <div className="text-emerald-700">✓ Case 2: Overwrite Existing Key — Passed (8ms)</div>
                <div className="text-muted">◉ 3 hidden tests: 3 / 3 passed</div>
              </div>
            </div>

            {/* Right: Video + Notes */}
            <div className="w-56 border-l border-divider flex-shrink-0 flex flex-col">
              {/* Video tiles */}
              <div className="p-3 border-b border-divider space-y-2">
                {['Elena Rostova', 'Ines Becker'].map((name, i) => (
                  <div key={name} className="h-20 rounded-[6px] border border-divider bg-[#FAFAFA] flex flex-col justify-between p-2">
                    <span className="text-[11px] font-semibold text-ink bg-white/90 px-1.5 py-0.5 rounded w-fit border border-divider">{name}</span>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono text-muted">{i === 0 ? 'Candidate' : 'Interviewer'}</span>
                      <div className="w-6 h-6 rounded-full bg-white border border-divider flex items-center justify-center text-[10px] font-bold text-ink">
                        {name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-3">
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted font-semibold mb-1.5">Private Notes</div>
                <div className="text-[11px] text-muted leading-relaxed">
                  Strong on data structure selection. Identified O(1) requirement immediately. Good edge-case awareness on capacity = 1.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-divider bg-[#FAFAFA] py-12 px-6 mb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-[36px] font-bold text-ink font-mono tracking-tight">{s.value}</div>
              <div className="text-[13px] text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="min-h-screen flex flex-col justify-center px-6 max-w-6xl mx-auto py-8 sm:py-10 scroll-mt-16">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-[11px] uppercase font-mono tracking-wider text-[#D14509] font-semibold mb-1.5">Platform capabilities</div>
          <h2 className="text-[28px] sm:text-[34px] font-semibold text-ink tracking-tight leading-tight">
            Everything your engineering team needs.<br className="hidden sm:inline" /> Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {FEATURES.map((feat) => {
            const Figure = feat.figure;
            return (
              <div
                key={feat.title}
                className="p-4 sm:p-5 rounded-[8px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-24 sm:h-28 mb-3 flex items-center justify-center overflow-hidden">
                    <div className="w-full max-w-[150px] sm:max-w-[170px] flex items-center justify-center">
                      <Figure intensity={0.6} theme="light" className="w-full" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-ink mb-1 group-hover:text-[#D14509] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Workflow / How Inviting & Joining Works (One Page Full-Height Centered) ── */}
      <section id="workflow" className="min-h-screen flex flex-col justify-center px-6 max-w-6xl mx-auto py-8 sm:py-12 scroll-mt-16">
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-[11px] uppercase font-mono tracking-wider text-[#D14509] font-semibold mb-2">
            Workflow
          </div>
          <h2 className="text-[28px] sm:text-[34px] font-semibold text-ink tracking-tight">
            How Inviting & Joining Works
          </h2>
          <p className="text-[13.5px] sm:text-[14.5px] text-muted max-w-2xl mx-auto mt-2">
            A frictionless, zero-setup workflow. Interviewers generate a secure single-use link, candidates join in one click with zero software download or login.
          </p>
        </div>

        {/* Desktop 4-Step Cards Strip with Centered Arrow Dividers */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-2.5 lg:gap-3.5">
          {/* Step 01 */}
          <div className="p-5 lg:p-6 rounded-[10px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="text-[13px] font-mono font-semibold text-[#D14509] mb-3">01</div>
              <h3 className="text-[15px] lg:text-[16px] font-semibold text-ink mb-2">Schedule the room</h3>
              <p className="text-[12.5px] lg:text-[13px] text-muted leading-relaxed">
                Enter candidate name, target role, question set, and language preference. An isolated microVM sandbox is created in 1.4s.
              </p>
            </div>
          </div>

          {/* Connector Arrow 1 */}
          <div className="flex items-center justify-center text-muted/30 px-0.5 select-none" aria-hidden="true">
            <ChevronRight size={18} />
          </div>

          {/* Step 02 */}
          <div className="p-5 lg:p-6 rounded-[10px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="text-[13px] font-mono font-semibold text-[#D14509] mb-3">02</div>
              <h3 className="text-[15px] lg:text-[16px] font-semibold text-ink mb-2">Share private invite</h3>
              <p className="text-[12.5px] lg:text-[13px] text-muted leading-relaxed">
                Copy the single-use token link or dispatch an automated email invite. No candidate account or password is ever required.
              </p>
            </div>
          </div>

          {/* Connector Arrow 2 */}
          <div className="flex items-center justify-center text-muted/30 px-0.5 select-none" aria-hidden="true">
            <ChevronRight size={18} />
          </div>

          {/* Step 03 */}
          <div className="p-5 lg:p-6 rounded-[10px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="text-[13px] font-mono font-semibold text-[#D14509] mb-3">03</div>
              <h3 className="text-[15px] lg:text-[16px] font-semibold text-ink mb-2">Candidate clicks & joins</h3>
              <p className="text-[12.5px] lg:text-[13px] text-muted leading-relaxed">
                Candidate opens the link in any modern browser, completes a 30-second automated system check, and enters immediately.
              </p>
            </div>
          </div>

          {/* Connector Arrow 3 */}
          <div className="flex items-center justify-center text-muted/30 px-0.5 select-none" aria-hidden="true">
            <ChevronRight size={18} />
          </div>

          {/* Step 04 */}
          <div className="p-5 lg:p-6 rounded-[10px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="text-[13px] font-mono font-semibold text-[#D14509] mb-3">04</div>
              <h3 className="text-[15px] lg:text-[16px] font-semibold text-ink mb-2">Code, run & collaborate</h3>
              <p className="text-[12.5px] lg:text-[13px] text-muted leading-relaxed">
                Both enter the live room with synchronized Monaco editor, microVM execution, real-time audio/video, and interactive whiteboard.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile 4-Step Cards */}
        <div className="grid grid-cols-1 md:hidden gap-3.5">
          {[
            {
              step: '01',
              title: 'Schedule the room',
              desc: 'Enter candidate name, target role, question set, and language preference. An isolated microVM sandbox is created in 1.4s.',
            },
            {
              step: '02',
              title: 'Share private invite',
              desc: 'Copy the single-use token link or dispatch an automated email invite. No candidate account or password is ever required.',
            },
            {
              step: '03',
              title: 'Candidate clicks & joins',
              desc: 'Candidate opens the link in any modern browser, completes a 30-second automated system check, and enters immediately.',
            },
            {
              step: '04',
              title: 'Code, run & collaborate',
              desc: 'Both enter the live room with synchronized Monaco editor, microVM execution, real-time audio/video, and interactive whiteboard.',
            },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-[10px] border border-divider bg-white flex flex-col justify-between">
              <div>
                <div className="text-[12px] font-mono font-semibold text-[#D14509] mb-2">{item.step}</div>
                <h3 className="text-[15px] font-semibold text-ink mb-1">{item.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials (MagicUI Dual Opposite Marquee - One Page Full-Height Centered) ── */}
      <section className="min-h-screen flex flex-col justify-center bg-[#FAFAFA] border-y border-divider py-10 sm:py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <div className="text-[12px] uppercase font-mono tracking-wider text-[#D14509] font-semibold mb-2.5">From engineering teams</div>
          <h2 className="text-[30px] sm:text-[34px] font-semibold text-ink tracking-tight">Used by engineers who care about signal quality</h2>
          <p className="text-[13.5px] text-muted max-w-xl mx-auto mt-2">
            Verified feedback from engineering leaders and systems architects evaluating candidates with CodeRoom.
          </p>
        </div>

        {/* Dual Opposing Direction Marquee Tracks */}
        <div className="relative flex w-full flex-col items-center justify-center gap-3.5 overflow-hidden">
          {/* Row 1 - scrolling left */}
          <Marquee pauseOnHover className="[--duration:36s]">
            {TESTIMONIALS_ROW_1.map((t, idx) => (
              <div
                key={idx}
                className="w-[270px] sm:w-[310px] h-[142px] p-4 rounded-[8px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between flex-shrink-0 select-none"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-[#D14509] fill-[#D14509]" />
                    ))}
                  </div>
                  <p className="text-[12px] text-ink leading-relaxed line-clamp-3">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-2.5 pt-2 border-t border-divider">
                  <div className="w-7 h-7 rounded-full bg-[#FFF3EB] border border-[#D14509]/20 flex items-center justify-center text-[10px] font-semibold text-[#D14509] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold text-ink truncate">{t.role}</div>
                    <div className="text-[10.5px] text-muted truncate">{t.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>

          {/* Row 2 - scrolling in reverse (opposite direction) */}
          <Marquee reverse pauseOnHover className="[--duration:36s]">
            {TESTIMONIALS_ROW_2.map((t, idx) => (
              <div
                key={idx}
                className="w-[270px] sm:w-[310px] h-[142px] p-4 rounded-[8px] border border-divider bg-white hover:border-[#D14509]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between flex-shrink-0 select-none"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-[#D14509] fill-[#D14509]" />
                    ))}
                  </div>
                  <p className="text-[12px] text-ink leading-relaxed line-clamp-3">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-2.5 pt-2 border-t border-divider">
                  <div className="w-7 h-7 rounded-full bg-[#FFF3EB] border border-[#D14509]/20 flex items-center justify-center text-[10px] font-semibold text-[#D14509] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold text-ink truncate">{t.role}</div>
                    <div className="text-[10.5px] text-muted truncate">{t.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>

          {/* Side fade gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10"></div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 max-w-3xl mx-auto text-center mb-24">
        <h2 className="text-[38px] font-semibold text-ink tracking-tight mb-4 leading-tight">
          Start running better interviews today.
        </h2>
        <p className="text-[16px] text-muted mb-8">
          Free for up to 3 live sessions per month. No credit card. No vendor lock-in.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/app"
            className="h-12 px-8 rounded-[8px] bg-[#D14509] text-white text-[15px] font-semibold flex items-center space-x-2 hover:bg-[#b83c07] transition-all hover:-translate-y-[1px] shadow-sm"
          >
            <span>Open CodeRoom</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/pricing"
            className="h-12 px-8 rounded-[8px] border border-divider text-ink text-[15px] font-medium flex items-center hover:bg-[#FFF7F1] transition-colors"
          >
            View pricing →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-divider px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[11px]">C</div>
              <span className="text-[16px] font-semibold tracking-tight text-ink">CodeRoom</span>
            </div>
            <p className="text-[13px] text-muted max-w-xs">Live technical interviews and async assessments, built for engineering accuracy.</p>
          </div>

          <div className="grid grid-cols-3 gap-12 text-[13px]">
            <div className="space-y-3">
              <div className="font-semibold text-ink text-[12px] uppercase font-mono tracking-wider">Product</div>
              <div><a href="#features" className="text-muted hover:text-ink transition-colors">Features</a></div>
              <div><a href="#workflow" className="text-muted hover:text-ink transition-colors">Workflow</a></div>
              <div><Link to="/pricing" className="text-muted hover:text-ink transition-colors">Pricing</Link></div>
              <div><Link to="/app" className="text-muted hover:text-ink transition-colors">Live App</Link></div>
            </div>
            <div className="space-y-3">
              <div className="font-semibold text-ink text-[12px] uppercase font-mono tracking-wider">Access</div>
              <div><Link to="/signin" className="text-muted hover:text-ink transition-colors">Staff Sign in</Link></div>
              <div><Link to="/create-org" className="text-muted hover:text-ink transition-colors">Create Org (Admin)</Link></div>
              <div><Link to="/join/int-001" className="text-muted hover:text-ink transition-colors">Candidate View</Link></div>
              <div><Link to="/pricing" className="text-muted hover:text-ink transition-colors">Compare Plans</Link></div>
            </div>
            <div className="space-y-3">
              <div className="font-semibold text-ink text-[12px] uppercase font-mono tracking-wider">Legal & Trust</div>
              <div><Link to="/privacy" className="text-muted hover:text-ink transition-colors">Privacy Policy</Link></div>
              <div><Link to="/terms" className="text-muted hover:text-ink transition-colors">Terms of Service</Link></div>
              <div><Link to="/security" className="text-muted hover:text-ink transition-colors">Security Architecture</Link></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-divider flex items-center justify-between text-[12px] text-muted font-mono">
          <span>© 2026 CodeRoom, Inc. All rights reserved.</span>
          <div className="flex items-center space-x-1.5">
            <Globe size={12} />
            <span>English</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

