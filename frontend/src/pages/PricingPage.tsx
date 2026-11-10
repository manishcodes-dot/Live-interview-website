import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Minus, ArrowRight, Zap, Building2, Users, ChevronDown, ChevronUp } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For individuals and small teams trying CodeRoom.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceNote: 'Free forever',
    ctaLabel: 'Get started free',
    ctaHref: '/create-org',
    highlighted: false,
    icon: Zap,
    features: [
      '3 live interview sessions / month',
      '1 async assessment campaign / month',
      '5 questions in your library',
      'JavaScript, Python runtime',
      'Visible test cases only',
      'Basic scorecard (no rubric)',
      '1 interviewer seat',
      'Community support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For growing engineering orgs running structured loops.',
    monthlyPrice: 79,
    yearlyPrice: 59,
    priceNote: 'per seat / month',
    ctaLabel: 'Start 14-day trial',
    ctaHref: '/create-org',
    highlighted: true,
    icon: Users,
    features: [
      'Unlimited live interview sessions',
      'Unlimited async assessments',
      'Unlimited question library',
      'All 7 languages + runtimes',
      'Hidden test harnesses (unlimited)',
      'Full rubric scorecard & synthesis',
      'Up to 25 interviewer seats',
      'WebSocket collaborative editor',
      'Integrity signals dashboard',
      'Team analytics & pass-rate trends',
      'Priority email support',
      'SSO (Google, Okta)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large teams with compliance, SLA, and custom needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    priceNote: 'Custom pricing',
    ctaLabel: 'Contact Sales',
    ctaHref: 'mailto:sales@coderoom.dev',
    highlighted: false,
    icon: Building2,
    features: [
      'Everything in Team',
      'Unlimited seats',
      'Dedicated microVM execution plane',
      'Custom domain (room.yourcompany.com)',
      'SCIM provisioning & RBAC',
      'ATS integrations (Greenhouse, Lever)',
      'Candidate data residency (EU / US)',
      'SOC 2 Type II report on request',
      'Custom SLA & uptime guarantee',
      'Dedicated customer success manager',
      'Onboarding & interviewer training',
      'Custom contract & invoicing',
    ],
  },
];

const COMPARISON_ROWS = [
  { category: 'Sessions', feature: 'Live interview rooms', starter: '3 / month', team: 'Unlimited', enterprise: 'Unlimited' },
  { category: 'Sessions', feature: 'Async assessments', starter: '1 / month', team: 'Unlimited', enterprise: 'Unlimited' },
  { category: 'Sessions', feature: 'Session duration cap', starter: '60 min', team: '4 hours', enterprise: 'Unlimited' },
  { category: 'Execution', feature: 'Supported languages', starter: 'JS, Python', team: 'All 7', enterprise: 'All 7 + custom' },
  { category: 'Execution', feature: 'MicroVM isolation', starter: true, team: true, enterprise: true },
  { category: 'Execution', feature: 'Execution wall clock', starter: '10s', team: '10s', enterprise: 'Configurable' },
  { category: 'Questions', feature: 'Question library size', starter: '5 questions', team: 'Unlimited', enterprise: 'Unlimited' },
  { category: 'Questions', feature: 'Hidden test cases', starter: false, team: true, enterprise: true },
  { category: 'Questions', feature: 'Multi-question sessions', starter: false, team: true, enterprise: true },
  { category: 'Evaluation', feature: 'Structured scorecard', starter: 'Basic', team: 'Full rubric', enterprise: 'Full rubric + custom' },
  { category: 'Evaluation', feature: 'Integrity signals', starter: false, team: true, enterprise: true },
  { category: 'Evaluation', feature: 'Team analytics', starter: false, team: true, enterprise: true },
  { category: 'Collaboration', feature: 'Real-time code sync', starter: true, team: true, enterprise: true },
  { category: 'Collaboration', feature: 'Whiteboard', starter: true, team: true, enterprise: true },
  { category: 'Collaboration', feature: 'In-room video & chat', starter: true, team: true, enterprise: true },
  { category: 'Collaboration', feature: 'Editor lock', starter: false, team: true, enterprise: true },
  { category: 'Security', feature: 'SSO (Google, Okta)', starter: false, team: true, enterprise: true },
  { category: 'Security', feature: 'SCIM provisioning', starter: false, team: false, enterprise: true },
  { category: 'Security', feature: 'Data residency (EU/US)', starter: false, team: false, enterprise: true },
  { category: 'Support', feature: 'Support channel', starter: 'Community', team: 'Priority email', enterprise: 'Dedicated CSM' },
];

const FAQS = [
  {
    q: 'Is the Starter plan really free forever?',
    a: 'Yes. No credit card required, no time limit. You get 3 live sessions and 1 async assessment per month on the free tier indefinitely. Upgrade only when you need more volume or advanced features.',
  },
  {
    q: 'What counts as a "seat" on the Team plan?',
    a: 'A seat is an interviewer account — someone who schedules rooms, views scorecards, and authors questions. Candidates don\'t count as seats and are never charged.',
  },
  {
    q: 'Can I try Team features before paying?',
    a: 'Absolutely. The 14-day Team trial gives you full access to hidden test harnesses, all 7 languages, unlimited sessions, and the rubric scorecard. No card needed until the trial ends.',
  },
  {
    q: 'How is the code execution actually isolated?',
    a: 'Each run spins up a dedicated Firecracker microVM (the same technology behind AWS Lambda). The guest has no network interface, no host filesystem access, and is wiped immediately after the run. Hidden test inputs and expected outputs are evaluated server-side and never sent to the client.',
  },
  {
    q: 'Do you store candidate code after the session?',
    a: 'Yes — the final code snapshot is retained as part of the immutable session record, accessible only to interviewers on your team. Candidates can request deletion under GDPR / CCPA at any time.',
  },
  {
    q: 'What ATS integrations does Enterprise support?',
    a: 'We currently have native integrations for Greenhouse and Lever, with Workday and Ashby in private beta. Custom webhook-based integrations are available on all Enterprise contracts.',
  },
];

const categories = [...new Set(COMPARISON_ROWS.map((r) => r.category))];

const CellValue: React.FC<{ value: string | boolean }> = ({ value }) => {
  if (value === true) return <CheckCircle2 size={16} className="text-emerald-700 mx-auto" />;
  if (value === false) return <Minus size={14} className="text-muted mx-auto opacity-50" />;
  return <span className="text-[13px] text-ink font-medium">{value}</span>;
};

export const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      {/* ── Navbar ── */}
      <header className="border-b border-divider bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 select-none">
            <div className="w-7 h-7 rounded-[6px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[13px]">C</div>
            <span className="text-[17px] font-semibold tracking-tight text-ink">CodeRoom</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-[14px]">
            <Link to="/" className="text-muted hover:text-ink transition-colors font-medium">Features</Link>
            <Link to="/pricing" className="text-ink font-semibold">Pricing</Link>
            <a href="#" className="text-muted hover:text-ink transition-colors font-medium">Docs</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/signin" className="text-[14px] text-muted hover:text-ink font-medium hidden sm:block">Sign in</Link>
            <Link to="/app" className="h-9 px-4 rounded-[6px] bg-[#D14509] text-white text-[14px] font-semibold flex items-center space-x-1.5 hover:bg-[#b83c07] transition-colors">
              <span>Get started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="text-[12px] uppercase font-mono tracking-wider text-[#D14509] font-semibold mb-4">Pricing</div>
        <h1 className="text-[44px] font-semibold text-ink tracking-tight leading-tight mb-4">
          Simple pricing for every team size.
        </h1>
        <p className="text-[17px] text-muted max-w-xl mx-auto mb-10">
          Start free. Upgrade when you need more sessions, hidden tests, or seats. No hidden fees, no per-run charges.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center border border-divider rounded-[8px] p-1 bg-[#FAFAFA]">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${billing === 'monthly' ? 'bg-white text-ink shadow-sm border border-divider' : 'text-muted hover:text-ink'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-4 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors flex items-center space-x-1.5 ${billing === 'yearly' ? 'bg-white text-ink shadow-sm border border-divider' : 'text-muted hover:text-ink'}`}
          >
            <span>Yearly</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">Save 25%</span>
          </button>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-[10px] border flex flex-col overflow-hidden transition-shadow ${
                  plan.highlighted
                    ? 'border-[#D14509] shadow-lg shadow-[#D14509]/10 ring-1 ring-[#D14509]/20'
                    : 'border-divider hover:shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="h-8 bg-[#D14509] flex items-center justify-center text-white text-[12px] font-semibold uppercase tracking-wider font-mono">
                    Most popular
                  </div>
                )}

                <div className={`p-7 flex-1 ${plan.highlighted ? 'bg-white' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[18px] font-bold text-ink">{plan.name}</div>
                      <p className="text-[13px] text-muted mt-1 leading-snug max-w-[200px]">{plan.tagline}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-[#D14509]' : 'bg-[#FFF3EB]'}`}>
                      <Icon size={18} className={plan.highlighted ? 'text-white' : 'text-[#D14509]'} />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-divider">
                    {price !== null ? (
                      <div className="flex items-end space-x-1.5">
                        <span className="text-[40px] font-bold text-ink font-mono leading-none">
                          ${price === 0 ? '0' : price}
                        </span>
                        {price > 0 && (
                          <span className="text-[13px] text-muted pb-1">{plan.priceNote}</span>
                        )}
                        {price === 0 && (
                          <span className="text-[13px] text-emerald-700 pb-1 font-medium">{plan.priceNote}</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[28px] font-bold text-ink font-mono">Custom</div>
                    )}
                    {billing === 'yearly' && price !== null && price > 0 && (
                      <p className="text-[12px] text-muted mt-1 font-mono">
                        Billed ${price * 12 * 1} annually · saves ${(79 - 59) * 12}/seat/yr
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.ctaHref}
                    className={`w-full h-10 rounded-[6px] text-[14px] font-semibold flex items-center justify-center space-x-2 mb-6 transition-all ${
                      plan.highlighted
                        ? 'bg-[#D14509] text-white hover:bg-[#b83c07] hover:-translate-y-[1px]'
                        : 'bg-white text-ink border border-divider hover:bg-[#FFF7F1] hover:border-ink'
                    }`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight size={13} />
                  </a>

                  {/* Features list */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start space-x-2.5 text-[13px] text-ink">
                        <CheckCircle2 size={14} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#D14509]' : 'text-emerald-700'}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Feature Comparison Table ── */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-semibold text-ink tracking-tight">Full feature comparison</h2>
          <p className="text-[15px] text-muted mt-2">Every capability, across every plan.</p>
        </div>

        <div className="border border-divider rounded-[8px] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-[#FAFAFA] border-b border-divider">
            <div className="p-4 text-[12px] uppercase font-mono tracking-wider text-muted font-semibold">Feature</div>
            {PLANS.map((p) => (
              <div key={p.id} className={`p-4 text-center ${p.highlighted ? 'bg-[#FFF3EB]' : ''}`}>
                <div className={`text-[14px] font-bold ${p.highlighted ? 'text-[#D14509]' : 'text-ink'}`}>{p.name}</div>
              </div>
            ))}
          </div>

          {/* Grouped rows */}
          {categories.map((cat) => (
            <div key={cat}>
              <div className="px-4 py-2 bg-[#FAFAFA] border-b border-divider text-[11px] uppercase font-mono tracking-wider text-muted font-semibold">
                {cat}
              </div>
              {COMPARISON_ROWS.filter((r) => r.category === cat).map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 border-b border-divider last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]/40'}`}
                >
                  <div className="p-3.5 text-[13px] text-ink font-medium">{row.feature}</div>
                  <div className="p-3.5 text-center"><CellValue value={row.starter} /></div>
                  <div className="p-3.5 text-center bg-[#FFF3EB]/30"><CellValue value={row.team} /></div>
                  <div className="p-3.5 text-center"><CellValue value={row.enterprise} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 max-w-3xl mx-auto mb-24">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-semibold text-ink tracking-tight">Frequently asked questions</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-divider rounded-[6px] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FFF7F1] transition-colors"
              >
                <span className="text-[15px] font-semibold text-ink pr-4">{faq.q}</span>
                {openFaq === idx
                  ? <ChevronUp size={17} className="text-muted flex-shrink-0" />
                  : <ChevronDown size={17} className="text-muted flex-shrink-0" />
                }
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-[14px] text-muted leading-relaxed border-t border-divider pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Enterprise CTA ── */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="rounded-[10px] border border-divider bg-[#FAFAFA] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider text-[#D14509] font-semibold mb-2">Enterprise</div>
            <h3 className="text-[24px] font-semibold text-ink mb-2">Need a custom contract or compliance review?</h3>
            <p className="text-[14px] text-muted leading-relaxed max-w-lg">
              Dedicated execution planes, SCIM, ATS integrations, custom SLA, and a customer success manager included. Speak with our team.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/app"
              className="h-11 px-7 rounded-[8px] bg-ink text-white text-[14px] font-semibold flex items-center space-x-2 hover:bg-[#1a1410] transition-colors"
            >
              <span>Get started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-divider px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[13px] text-muted">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[10px]">C</div>
            <span className="font-semibold text-ink">CodeRoom</span>
            <span>· © 2026</span>
          </div>
          <div className="flex items-center space-x-6 text-[12px]">
            <Link to="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-ink transition-colors">Terms</Link>
            <Link to="/security" className="hover:text-ink transition-colors">Security</Link>
            <a href="mailto:sales@coderoom.dev" className="hover:text-ink transition-colors">Contact Sales</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

