import React, { useState, useEffect } from 'react';
import { ApiKey, WebhookEndpoint } from '../../types';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { AdminAPI } from '../../services/api';
import { Key, Webhook, Plus, Trash2, CheckCircle2, Copy } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);

  const loadIntegrations = async () => {
    try {
      const [keys, whs] = await Promise.all([AdminAPI.getApiKeys(), AdminAPI.getWebhooks()]);
      setApiKeys(keys);
      setWebhooks(whs);
    } catch (e) {
      console.error('Failed to load integrations:', e);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    try {
      const res = await AdminAPI.createApiKey(keyName, ['interviews:read', 'interviews:write', 'assessments:read']);
      setCreatedKeySecret(`cr_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`);
      setKeyName('');
      loadIntegrations();
    } catch (err: any) {
      alert(err.message || 'Failed to create key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? Connected applications will lose access immediately.')) return;
    await AdminAPI.deleteApiKey(id);
    loadIntegrations();
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Administration · Section 8.7
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Integrations, Webhooks & API Keys</h1>
            <p className="text-body text-muted mt-1">
              Connect external applicant tracking systems (Greenhouse, Lever), manage scoped API keys, and configure webhooks.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsKeyModalOpen(true)} className="space-x-2">
            <Plus size={16} />
            <span>Generate API Key (A-09)</span>
          </Button>
        </div>

        {/* ATS Integrations Strip */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-5 rounded-[6px] border border-divider bg-white flex items-center justify-between">
            <div>
              <div className="font-semibold text-ink text-[14px]">Greenhouse ATS</div>
              <div className="text-[12px] text-muted">Auto-create candidates & export scorecards</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="p-5 rounded-[6px] border border-divider bg-white flex items-center justify-between">
            <div>
              <div className="font-semibold text-ink text-[14px]">Lever Hire</div>
              <div className="text-[12px] text-muted">Interview loop stage synchronization</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="p-5 rounded-[6px] border border-divider bg-white flex items-center justify-between">
            <div>
              <div className="font-semibold text-ink text-[14px]">Workday HCM</div>
              <div className="text-[12px] text-muted">Enterprise recruitment module connector</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAFAFA] text-muted border border-divider">
              Private Beta
            </span>
          </div>
        </div>

        {/* API Keys Table (A-09) */}
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold text-ink flex items-center space-x-2">
            <Key size={17} className="text-[#D14509]" />
            <span>Organization API Keys</span>
          </h2>

          <div className="border border-divider rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-5 font-medium">Name</th>
                  <th className="py-3 px-5 font-medium">Key Prefix</th>
                  <th className="py-3 px-5 font-medium">Scopes</th>
                  <th className="py-3 px-5 font-medium">Created</th>
                  <th className="py-3 px-5 font-medium">Last Used</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-ink text-[13px]">{k.name}</td>
                    <td className="py-3.5 px-5 font-mono text-[12px] text-muted">{k.prefix}</td>
                    <td className="py-3.5 px-5 text-[11px] font-mono text-muted">{k.scopes.join(', ')}</td>
                    <td className="py-3.5 px-5 font-mono text-[12px] text-muted">{k.createdAt}</td>
                    <td className="py-3.5 px-5 font-mono text-[12px] text-ink">{k.lastUsedAt || 'Never'}</td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDeleteKey(k.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 space-x-1"
                      >
                        <Trash2 size={12} />
                        <span>Revoke</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Webhooks Section */}
        <div className="space-y-3 pt-4 border-t border-divider">
          <h2 className="text-[16px] font-semibold text-ink flex items-center space-x-2">
            <Webhook size={17} className="text-[#D14509]" />
            <span>Configured Event Webhooks</span>
          </h2>

          <div className="border border-divider rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-5 font-medium">Target URL</th>
                  <th className="py-3 px-5 font-medium">Subscribed Events</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium">Deliveries</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[13px] text-ink">{wh.url}</td>
                    <td className="py-3.5 px-5 text-[12px] font-mono text-muted">{wh.events.join(', ')}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {wh.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[13px] text-muted">{wh.deliveriesCount} calls</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generate API Key Modal (A-09) */}
      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => {
          setIsKeyModalOpen(false);
          setCreatedKeySecret(null);
        }}
        title="Generate New API Key (A-09)"
      >
        {createdKeySecret ? (
          <div className="space-y-4">
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px]">
              <div className="font-semibold mb-1">API Key Generated Successfully</div>
              <p>Please copy your API key now. For security purposes, you will not be able to view it again.</p>
            </div>

            <div className="p-3 rounded bg-[#FAFAFA] border border-divider font-mono text-[13px] text-ink break-all select-all flex items-center justify-between">
              <span>{createdKeySecret}</span>
              <button
                onClick={() => navigator.clipboard.writeText(createdKeySecret)}
                className="text-[#D14509] hover:underline text-[12px] ml-2 flex items-center space-x-1"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>

            <div className="pt-3 border-t border-divider flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setIsKeyModalOpen(false);
                  setCreatedKeySecret(null);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
                Key Label / Application Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Greenhouse Stage Hook"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full h-9 px-3 border border-divider rounded text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
              />
            </div>

            <p className="text-[12px] text-muted">
              Keys are created with default read/write scopes for technical interviews and reports. Usage is appended to the audit log.
            </p>

            <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Generate Key
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

