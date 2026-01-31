const AuditLog = require('../models/AuditLog');

const createAuditLog = async (userId, action, options = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resource: options.resource || null,
      resourceId: options.resourceId || null,
      details: options.details || null,
      ip: options.ip || null,
      userAgent: options.userAgent || null,
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = createAuditLog;
