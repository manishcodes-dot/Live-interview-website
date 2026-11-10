import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function BookDemoPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Please enter a valid work email address.';
    if (!form.company.trim()) e.company = 'Company name is required.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(false);
    setIsLoading(false);
    setSubmitted(true);
  };

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => {
      const n = { ...er };
      delete n[field];
      return n;
    });
  };

  const inputClass = (field: string) =>
    `w-full h-10 px-3 border ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-divider focus:border-[#D14509]'
    } rounded-[6px] text-[14px] text-ink placeholder:text-muted focus:outline-none transition-colors`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
        <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
              C
            </div>
            <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
          </Link>
          <Link to="/" className="text-[14px] text-muted hover:text-ink">
            Back to home
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-[480px]">
            <div className="w-16 h-16 rounded-full bg-[#FFF3EB] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-[#D14509]" />
            </div>
            <h1 className="text-[28px] font-semibold text-ink tracking-tight mb-3">
              Demo requested!
            </h1>
            <p className="text-[15px] text-muted leading-relaxed mb-6">
              Thank you, <strong className="text-ink">{form.name}</strong>. A technical architect will contact{' '}
              <strong className="text-ink">{form.email}</strong> within one business day to arrange your personalized walkthrough.
            </p>
            <Link
              to="/"
              className="inline-flex items-center h-10 px-6 bg-[#D14509] hover:bg-[#b83c07] text-white font-semibold rounded-[6px] text-[14px] transition-colors"
            >
              Return to CodeRoom Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </Link>
        <div className="flex items-center space-x-6 text-[14px]">
          <Link to="/pricing" className="text-muted hover:text-ink">
            Pricing
          </Link>
          <Link to="/signin" className="text-muted hover:text-ink">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[500px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-ink tracking-tight">Book a live platform demo</h1>
            <p className="text-[15px] text-muted mt-2">
              See how CodeRoom's isolated microVMs, real-time collaboration, and structured rubrics transform your technical hiring pipeline.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 border border-divider rounded-[8px] p-8 bg-white shadow-sm">
            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={setField('name')}
                placeholder="Sarah Chen"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">
                Work email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={setField('email')}
                placeholder="sarah@company.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">
                Company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={setField('company')}
                placeholder="Linear Labs"
                className={inputClass('company')}
              />
              {errors.company && <p className="text-red-500 text-[12px] mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">
                What does your engineering team need? <span className="text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={form.message}
                onChange={setField('message')}
                rows={3}
                placeholder="We conduct ~40 technical rounds/mo across distributed teams and need strict Firecracker isolation..."
                className="w-full px-3 py-2 border border-divider rounded-[6px] text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-[#D14509] resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#D14509] hover:bg-[#b83c07] disabled:opacity-60 text-white font-semibold rounded-[6px] text-[14px] transition-colors flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Submitting request...' : 'Schedule demo with engineer'}</span>
              <ArrowRight size={15} />
            </button>
            <p className="text-[12px] text-muted text-center pt-1">
              No credit card required. We respond within one business day.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

