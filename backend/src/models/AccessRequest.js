const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
      required: false,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

accessRequestSchema.index({ doctorId: 1, patientId: 1, recordId: 1 });
accessRequestSchema.index({ doctorId: 1, patientId: 1, status: 1 });

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
