import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Shield, Server, Cpu, Lock, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [cpuLimit, setCpuLimit] = useState('1 vCPU (cgroup quota)');
  const [memoryLimit, setMemoryLimit] = useState('512 MB (tmpfs included)');
  const [wallTime, setWallTime] = useState('10 seconds');
  const [networkPolicy, setNetworkPolicy] = useState('Disabled by default (No NIC)');
  const [aiPolicy, setAiPolicy] = useState('Allowed with transparency & disclosure');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-10">
        <div className="pb-8 border-b border-divider flex items-center justify-between">
          <div>
            <h1 className="text-heading text-ink font-semibold">Platform & Sandbox Settings</h1>
            <p className="text-body text-muted mt-1">
              Configure isolated execution limits, guest security profiles, and AI assistance policy.
            </p>
          </div>
          <Button variant="primary" onClick={handleSave}>
            {saved ? 'Saved Successfully' : 'Save Changes'}
          </Button>
        </div>

        {/* Execution Plane Sandbox Controls (Document 03 Architecture) */}
        <div className="border border-divider rounded-[6px] p-6 bg-white space-y-6">
          <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
            <Server size={18} className="text-[#D14509]" />
            <span>Execution Plane Resource Ceilings (Section 9)</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Per-Run CPU Ceiling
              </label>
              <input
                type="text"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[13px] font-mono focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] text-muted font-mono mt-1 block">
                Hard cgroup quota. Hyperthread siblings are never shared across tenants.
              </span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Guest Memory Ceiling
              </label>
              <input
                type="text"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[13px] font-mono focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] text-muted font-mono mt-1 block">
                Includes ephemeral tmpfs. OOM trigger cleanly terminates process group.
              </span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Wall-Clock Timeout
              </label>
              <input
                type="text"
                value={wallTime}
                onChange={(e) => setWallTime(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[13px] font-mono focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] text-muted font-mono mt-1 block">
                10s default for live runs; 15s for async assessment runs.
              </span>
            </div>

            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Sandbox Network Model
              </label>
              <input
                type="text"
                value={networkPolicy}
                onChange={(e) => setNetworkPolicy(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[13px] font-mono focus:outline-none focus:border-[#D14509]"
              />
              <span className="text-[11px] text-muted font-mono mt-1 block">
                No virtual NIC. vsock is the sole host-to-guest channel (PRD IS-1, IS-4).
              </span>
            </div>
          </div>
        </div>

        {/* AI & Integrity Policy (PRD IN-6) */}
        <div className="border border-divider rounded-[6px] p-6 bg-white space-y-4">
          <div className="flex items-center space-x-2 text-[16px] font-semibold text-ink border-b border-divider pb-3">
            <Shield size={18} className="text-muted" />
            <span>AI Assistance & Integrity Policy (PRD IN-6)</span>
          </div>

          <div className="space-y-3">
            {[
              'Disallowed (strict monitoring of paste and external window focus)',
              'Allowed with transparency & disclosure (candidate notes external AI prompts)',
              'In-platform AI assistant provided with full audit trail',
            ].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 p-3 rounded-[4px] border border-divider hover:bg-[#FFF7F1] cursor-pointer"
              >
                <input
                  type="radio"
                  name="aiPolicy"
                  checked={aiPolicy === option}
                  onChange={() => setAiPolicy(option)}
                  className="accent-[#D14509]"
                />
                <span className="text-[13px] text-ink font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

