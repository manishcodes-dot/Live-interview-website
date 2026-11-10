import React from 'react';
import { Button } from '../common/Button';
import { CreditCard, Download, Users, TrendingUp, CheckCircle2, Shield } from 'lucide-react';

export const UsageBillingView: React.FC = () => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Team,Interviewer,SessionsThisMonth,CodeRuns,AllocatedSeats\n' +
      'Distributed Systems,Ines Becker,8,124,1\n' +
      'Infrastructure,Marcus Vance,4,48,1\n' +
      'Core Platform,Dr. Aris Thorne,6,82,1\n' +
      'Talent Acquisition,Chloe Dubois,14,0,1\n';
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `coderoom_usage_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Administration · Section 8.4
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Usage Metering & Plan Billing</h1>
            <p className="text-body text-muted mt-1">
              Track organization-wide interview quotas, microVM execution hours, and team cost allocation.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={handleExportCSV} className="space-x-2">
            <Download size={15} />
            <span>Export Usage CSV (A-10)</span>
          </Button>
        </div>

        {/* Current Plan Card */}
        <div className="rounded-[8px] border border-divider p-6 bg-[#FAFAFA] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[18px] font-semibold text-ink">Team Tier Plan</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Subscription
              </span>
            </div>
            <p className="text-[13px] text-muted">
              $59 / seat / month (billed annually). Next billing cycle renewal on <strong>December 1, 2026</strong>.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Manage Invoices
            </Button>
            <Button variant="primary" size="sm">
              Upgrade to Enterprise
            </Button>
          </div>
        </div>

        {/* Quota Progress Strips */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-5 rounded-[6px] border border-divider bg-white space-y-3">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Interviewer Seats</div>
            <div className="text-[26px] font-semibold text-ink font-mono">6 / 25</div>
            <div className="w-full bg-[#FAFAFA] h-2 rounded-full overflow-hidden border border-divider">
              <div className="bg-[#D14509] h-full rounded-full" style={{ width: '24%' }}></div>
            </div>
            <span className="text-[12px] text-muted">19 seats available to invite</span>
          </div>

          <div className="p-5 rounded-[6px] border border-divider bg-white space-y-3">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Monthly Interview Sessions</div>
            <div className="text-[26px] font-semibold text-ink font-mono">18 / 50</div>
            <div className="w-full bg-[#FAFAFA] h-2 rounded-full overflow-hidden border border-divider">
              <div className="bg-[#D14509] h-full rounded-full" style={{ width: '36%' }}></div>
            </div>
            <span className="text-[12px] text-muted">32 sessions remaining in cycle</span>
          </div>

          <div className="p-5 rounded-[6px] border border-divider bg-white space-y-3">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Sandbox Code Runs</div>
            <div className="text-[26px] font-semibold text-ink font-mono">412 / ∞</div>
            <div className="w-full bg-[#FAFAFA] h-2 rounded-full overflow-hidden border border-divider">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <span className="text-[12px] text-muted">Unlimited microVM runs included</span>
          </div>
        </div>

        {/* Team Breakdown Table */}
        <div className="space-y-4">
          <h2 className="text-[16px] font-semibold text-ink">Team Unit Cost & Usage Allocation</h2>
          <div className="border border-divider rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-5 font-medium">Team Department</th>
                  <th className="py-3 px-5 font-medium">Assigned Seats</th>
                  <th className="py-3 px-5 font-medium">Interviews Conducted</th>
                  <th className="py-3 px-5 font-medium">Code Runs</th>
                  <th className="py-3 px-5 font-medium text-right">Quota Share</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { team: 'Distributed Systems', seats: 2, ivs: 8, runs: 184, share: '44%' },
                  { team: 'Core Platform Engineering', seats: 2, ivs: 6, runs: 142, share: '33%' },
                  { team: 'Infrastructure & Security', seats: 1, ivs: 4, runs: 86, share: '22%' },
                  { team: 'Frontend Platform', seats: 1, ivs: 0, runs: 0, share: '0%' },
                ].map((row) => (
                  <tr key={row.team} className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-ink text-[14px]">{row.team}</td>
                    <td className="py-3.5 px-5 font-mono text-[13px] text-muted">{row.seats} staff</td>
                    <td className="py-3.5 px-5 font-mono text-[13px] text-ink">{row.ivs} sessions</td>
                    <td className="py-3.5 px-5 font-mono text-[13px] text-muted">{row.runs} runs</td>
                    <td className="py-3.5 px-5 text-right font-mono font-semibold text-[#D14509]">{row.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

