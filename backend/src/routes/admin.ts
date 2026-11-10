import { Router } from 'express';
import { db } from '../services/db';
import { UserProfile, AuditLogEntry, ApiKey, WebhookEndpoint } from '../types';

const router = Router();

// ─── Staff Members ───────────────────────────────────────────────────────────
router.get('/staff', (_req, res) => {
  res.json(db.getStaff());
});

router.post('/staff/invite', (req, res) => {
  const { name, email, role, team } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  const newStaff: UserProfile = {
    id: 'user-' + Math.random().toString(36).substring(2, 8),
    name: name || email.split('@')[0],
    email,
    role,
    allowedRoles: [role],
    organization: 'Acme Corporation',
    team: team || 'General Engineering',
    mfaEnabled: false,
    status: 'invited',
    lastActive: 'Invitation pending',
  };

  db.createStaff(newStaff);

  // Append audit event (A-01)
  db.addAuditLog({
    id: 'aud-' + Math.random().toString(36).substring(2, 8),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.v@acme.corp',
    role: 'Admin',
    action: `Staff Invited (${role})`,
    category: 'Account',
    target: email,
    result: 'Success',
    ipAddress: '192.0.2.45',
    device: 'Web Client',
    requestId: 'req-' + Math.random().toString(36).substring(2, 8),
    details: `Sent invitation link to ${email} for role ${role}.`,
  });

  res.status(201).json(newStaff);
});

router.patch('/staff/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.updateStaff(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Staff member not found' });

  // Append audit event (A-02, A-03)
  if (req.body.role) {
    db.addAuditLog({
      id: 'aud-' + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      actor: 'Marcus Vance',
      actorEmail: 'marcus.v@acme.corp',
      role: 'Admin',
      action: `Role Changed to ${req.body.role}`,
      category: 'Account',
      target: updated.email,
      result: 'Success',
      ipAddress: '192.0.2.45',
      device: 'Web Client',
      requestId: 'req-' + Math.random().toString(36).substring(2, 8),
      details: `Permissions updated immediately for ${updated.name}.`,
    });
  }

  if (req.body.status === 'deactivated') {
    db.addAuditLog({
      id: 'aud-' + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      actor: 'Marcus Vance',
      actorEmail: 'marcus.v@acme.corp',
      role: 'Admin',
      action: 'Staff Member Deactivated (A-03)',
      category: 'Account',
      target: updated.email,
      result: 'Success',
      ipAddress: '192.0.2.45',
      device: 'Web Client',
      requestId: 'req-' + Math.random().toString(36).substring(2, 8),
      details: `Revoked all active sessions for ${updated.name}.`,
    });
  }

  res.json(updated);
});

// ─── Audit Log ───────────────────────────────────────────────────────────────
router.get('/audit', (_req, res) => {
  res.json(db.getAuditLogs());
});

// ─── Candidate Data Purge (A-08) ─────────────────────────────────────────────
router.post('/purge-candidate', (req, res) => {
  const { candidateEmail } = req.body;
  if (!candidateEmail) {
    return res.status(400).json({ error: 'candidateEmail is required' });
  }

  // Remove corresponding interviews
  const interviews = db.getInterviews().filter((i) => i.candidateEmail === candidateEmail);
  interviews.forEach((i) => db.deleteInterview(i.id));

  // Log completion
  const auditEntry: AuditLogEntry = {
    id: 'aud-' + Math.random().toString(36).substring(2, 8),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.v@acme.corp',
    role: 'Admin',
    action: 'Candidate Data Purge Executed (A-08)',
    category: 'Data',
    target: `De-identified Candidate (${candidateEmail})`,
    result: 'Success',
    ipAddress: '192.0.2.45',
    device: 'Web Client',
    requestId: 'req-' + Math.random().toString(36).substring(2, 8),
    details: 'Database records, code files, and recordings purged under GDPR/CCPA. Minimal audit preserved.',
  };
  db.addAuditLog(auditEntry);

  res.json({ success: true, message: `Candidate ${candidateEmail} data purged`, auditEntry });
});

// ─── API Keys ────────────────────────────────────────────────────────────────
router.get('/apikeys', (_req, res) => {
  res.json(db.getApiKeys());
});

router.post('/apikeys', (req, res) => {
  const { name, scopes } = req.body;
  const newKey: ApiKey = {
    id: 'key-' + Math.random().toString(36).substring(2, 8),
    name: name || 'API Key',
    prefix: 'cr_live_' + Math.random().toString(36).substring(2, 8) + '...',
    createdAt: new Date().toISOString().substring(0, 10),
    scopes: scopes || ['interviews:read'],
  };
  db.createApiKey(newKey);
  res.status(201).json(newKey);
});

router.delete('/apikeys/:id', (req, res) => {
  db.deleteApiKey(req.params.id);
  res.status(204).send();
});

// ─── Webhooks ────────────────────────────────────────────────────────────────
router.get('/webhooks', (_req, res) => {
  res.json(db.getWebhooks());
});

router.post('/webhooks', (req, res) => {
  const { url, events } = req.body;
  const newWh: WebhookEndpoint = {
    id: 'wh-' + Math.random().toString(36).substring(2, 8),
    url,
    events: events || ['interview.ended', 'scorecard.submitted'],
    status: 'Active',
    deliveriesCount: 0,
  };
  db.createWebhook(newWh);
  res.status(201).json(newWh);
});

router.delete('/webhooks/:id', (req, res) => {
  db.deleteWebhook(req.params.id);
  res.status(204).send();
});

export default router;

