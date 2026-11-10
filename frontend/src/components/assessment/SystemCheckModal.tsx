import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircle2, Wifi, Video, Mic, Globe, Shield } from 'lucide-react';

interface SystemCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const SystemCheckModal: React.FC<SystemCheckModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const [checking, setChecking] = useState(false);
  const [complete, setComplete] = useState(false);

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setComplete(true);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pre-Session System & Sandbox Readiness Check">
      <div className="space-y-5">
        <p className="text-[14px] text-muted leading-relaxed">
          Before entering the isolated execution environment, we verify your browser compatibility, WebSocket connectivity, and sandbox runner latency.
        </p>

        <div className="space-y-3 font-mono text-[13px]">
          <div className="p-3 rounded-[4px] border border-divider bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Globe size={16} className="text-muted" />
              <span className="text-ink">Browser Environment (Chrome/Edge/Firefox)</span>
            </div>
            <span className="text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 size={14} />
              <span>Supported</span>
            </span>
          </div>

          <div className="p-3 rounded-[4px] border border-divider bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Wifi size={16} className="text-muted" />
              <span className="text-ink">WebSocket & vsock Gateway Ping</span>
            </div>
            <span className="text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 size={14} />
              <span>28ms (Optimal)</span>
            </span>
          </div>

          <div className="p-3 rounded-[4px] border border-divider bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Video size={16} className="text-muted" />
              <span className="text-ink">Video Feed Permission</span>
            </div>
            <span className="text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 size={14} />
              <span>Ready</span>
            </span>
          </div>

          <div className="p-3 rounded-[4px] border border-divider bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Mic size={16} className="text-muted" />
              <span className="text-ink">Microphone Audio Level</span>
            </div>
            <span className="text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 size={14} />
              <span>Clear</span>
            </span>
          </div>
        </div>

        {/* Candidate Privacy & Integrity Disclosure Banner (PRD IN-5) */}
        <div className="p-3.5 rounded-[4px] border border-divider bg-[#FAFAFA] text-[12px] text-muted space-y-1">
          <div className="flex items-center space-x-1.5 text-ink font-semibold">
            <Shield size={14} className="text-muted" />
            <span>Candidate Transparency & Data Notice</span>
          </div>
          <p className="leading-relaxed">
            During timed assessments, code edits, paste events, and window focus state are logged for evaluation review. No biometric surveillance or automated disqualification algorithms are utilized.
          </p>
        </div>

        <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onProceed();
              onClose();
            }}
          >
            Start Assessment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

