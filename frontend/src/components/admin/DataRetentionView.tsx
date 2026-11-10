import React, { useState } from 'react';
import { Button } from '../common/Button';
import { AdminAPI } from '../../services/api';
import { Trash2, Download, ShieldAlert, CheckCircle2, Lock, Clock } from 'lucide-react';

export const DataRetentionView: React.FC = () => {
  const [retentionPeriod, setRetentionPeriod] = useState('12');
  const [legalHoldEnabled, setLegalHoldEnabled] = useState(false);
  const [purgeEmail, setPurgeEmail] = useState('');
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccessMessage, setPurgeSuccessMessage] = useState<string | null>(null);

  const handleCandidatePurge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purgeEmail.trim()) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently purge all recordings, submissions, and scorecard evaluations for ${purgeEmail}? This action is irreversible and compliant with GDPR Article 17.`
    );
    if (!confirmed) return;

    setIsPurging(true);
    setPurgeSuccessMessage(null);
    try {
      const res = await AdminAPI.purgeCandidate(purgeEmail.trim());
      setPurgeSuccessMessage(`Candidate data successfully purged. Immutable audit ID: ${res.auditEntry.id}`);
      setPurgeEmail('');
    } catch (err: any) {
      alert(err.message || 'Failed to purge candidate');
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Compliance & Retention · Section 8.6
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Data Retention & Candidate Erasure</h1>
            <p className="text-body text-muted mt-1">
              Configure data lifecycle windows, trigger GDPR/CCPA candidate deletions, and apply legal holds.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#FAFAFA] border border-divider text-muted">
            Data Region: US-East (N. Virginia)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Retention Windows */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-5">
            <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink border-b border-divider pb-3">
              <Clock size={17} className="text-[#D14509]" />
              <span>Automated Lifecycle Expiry</span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Candidate Code & Recording Retention Window
              </label>
              <select
                value={retentionPeriod}
                onChange={(e) => setRetentionPeriod(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded text-[13px] bg-white focus:outline-none focus:border-[#D14509]"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months (Default)</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="84">7 Years (Financial / Regulatory compliance)</option>
              </select>
              <span className="text-[11px] text-muted mt-1 block">
                The platform runs daily automated retention sweeps and records all purges to the immutable audit log.
              </span>
            </div>

            {/* Legal Hold Toggle */}
            <div className="pt-3 border-t border-divider flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-ink flex items-center space-x-1.5">
                  <ShieldAlert size={15} className="text-amber-600" />
                  <span>Litigation & Regulatory Legal Hold</span>
                </div>
                <div className="text-[12px] text-muted">
                  Temporarily suspends all automated deletions organization-wide during active audits.
                </div>
              </div>
              <input
                type="checkbox"
                checked={legalHoldEnabled}
                onChange={(e) => setLegalHoldEnabled(e.target.checked)}
                className="w-4 h-4 text-[#D14509] rounded border-divider cursor-pointer"
              />
            </div>
          </div>

          {/* Candidate Right to Erasure / GDPR (A-08) */}
          <div className="border border-divider rounded-[6px] p-6 bg-white space-y-5">
            <div className="flex items-center space-x-2 text-[15px] font-semibold text-ink border-b border-divider pb-3">
              <Trash2 size={17} className="text-red-600" />
              <span>Right to Erasure / Candidate Purge (A-08)</span>
            </div>

            <form onSubmit={handleCandidatePurge} className="space-y-3">
              <div>
                <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                  Candidate Email to Purge
                </label>
                <input
                  type="email"
                  required
                  placeholder="candidate@domain.com"
                  value={purgeEmail}
                  onChange={(e) => setPurgeEmail(e.target.value)}
                  className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-red-500"
                />
              </div>

              <p className="text-[12px] text-muted leading-relaxed">
                Purges candidate records, code submissions, console outputs, and notes across all stores within 30 days. An immutable de-identified receipt will be appended to the audit ledger.
              </p>

              {purgeSuccessMessage && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-mono flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>{purgeSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPurging}
                className="h-9 px-4 rounded-[6px] bg-red-600 hover:bg-red-700 text-white font-semibold text-[13px] transition-colors"
              >
                {isPurging ? 'Purging records...' : 'Execute Candidate Purge (A-08)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

