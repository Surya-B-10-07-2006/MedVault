const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'UPLOAD_RECORD',
        'VIEW_RECORD',
        'SHARE_RECORD',
        'REQUEST_ACCESS',
        'GRANT_ACCESS',
        'PROFILE_UPDATE',
        'AVATAR_UPDATE',
        'REVOKE_ACCESS',
        'DELETE_RECORD',
        'PASSWORD_RESET',
      ],
    },
    resource: {
      type: String,
      default: null,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
