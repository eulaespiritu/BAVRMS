const AuditLog = require('../models/AuditLog');

async function logAction({ userId, action, targetCollection, targetId, details, ip }) {
  await AuditLog.create({ userId, action, targetCollection, targetId, details, ip });
}

module.exports = { logAction };