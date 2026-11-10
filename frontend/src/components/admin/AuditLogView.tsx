import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { Button } from '../common/Button';
import {
  FileCheck2,
  Download,
  Search,
  Filter,
  Shield,
  Clock,
  Laptop,
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = logs
    .filter((l) => !categoryFilter || l.category === categoryFilter)
    .filter(
      (l) =>
        !searchTerm ||
        l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.requestId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Role', 'Category', 'Action', 'Target', 'Result', 'IP', 'RequestID'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.role}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.result}"`,
      `"${l.ipAddress}"`,
      `"${l.requestId}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coderoom_audit_log_${new Date().toISOString().substring(0, 10)}.csv`);
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
              Compliance & Accountability · Section 5 & 8.5
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Immutable Security Audit Ledger</h1>
            <p className="text-body text-muted mt-1">
              Append-only audit trail recording every administrative event, access token issue, and data deletion.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={handleExportCSV} className="space-x-2">
            <Download size={15} />
            <span>Export Audit CSV (A-07)</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-muted" />
              <input
                type="text"
                placeholder="Search actor, action, target, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-3 border border-divider rounded-[4px] text-[13px] text-ink w-80 focus:outline-none focus:border-[#D14509]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 border border-divider rounded-[4px] text-[13px] bg-white text-ink focus:outline-none focus:border-[#D14509]"
            >
              <option value="">All Categories</option>
              <option value="Account">Account</option>
              <option value="Interviews">Interviews</option>
              <option value="Code">Code Execution</option>
              <option value="Evaluation">Evaluation</option>
              <option value="Questions">Questions</option>
              <option value="Data">Data & Erasure</option>
              <option value="Settings">Settings & Security</option>
            </select>
          </div>

          <div className="text-[12px] font-mono text-muted">
            Showing {filteredLogs.length} verified immutable records
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-5 font-medium">Timestamp</th>
                <th className="py-3 px-5 font-medium">Actor</th>
                <th className="py-3 px-5 font-medium">Action & Category</th>
                <th className="py-3 px-5 font-medium">Target Item</th>
                <th className="py-3 px-5 font-medium">Result</th>
                <th className="py-3 px-5 font-medium">Source IP & Device</th>
                <th className="py-3 px-5 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="py-3.5 px-5 font-mono text-[12px] text-muted whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-ink text-[13px]">{log.actor}</div>
                    <div className="text-[11px] font-mono text-muted">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-ink text-[13px]">{log.action}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-divider text-muted">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[13px] text-ink font-mono">{log.target}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[12px] font-mono text-muted">
                    <div>{log.ipAddress}</div>
                    <div className="text-[11px] text-muted truncate max-w-[140px]">{log.device}</div>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-[11px] text-[#D14509] hover:underline">
                    {log.requestId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[8px] border border-divider p-6 max-w-lg w-full space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="text-[15px] font-semibold text-ink">Audit Entry {selectedLog.id}</div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-muted hover:text-ink text-[14px]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Timestamp:</span>
                  <span className="font-mono text-ink">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Actor:</span>
                  <span className="text-ink font-semibold">
                    {selectedLog.actor} ({selectedLog.actorEmail})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Role:</span>
                  <span className="font-mono text-ink">{selectedLog.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Action:</span>
                  <span className="text-ink font-medium">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Target:</span>
                  <span className="font-mono text-ink">{selectedLog.target}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Request ID:</span>
                  <span className="font-mono text-ink">{selectedLog.requestId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Source IP:</span>
                  <span className="font-mono text-ink">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-divider/60">
                  <span className="text-muted">Device:</span>
                  <span className="font-mono text-ink">{selectedLog.device}</span>
                </div>
                <div className="pt-2">
                  <span className="text-muted block mb-1">Details:</span>
                  <div className="p-2.5 rounded bg-[#FAFAFA] border border-divider text-[12px] font-mono leading-relaxed text-ink">
                    {selectedLog.details || 'No additional parameters.'}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-divider flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

