const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

// Simple method: Doctor requests access by patient name
exports.requestAccessByName = async (req, res, next) => {
  try {
    const { patientName } = req.body;

    // Find patient by name
    const patient = await User.findOne({
      name: { $regex: `^${patientName.trim()}$`, $options: 'i' },
      role: 'patient'
    });
    
    if (!patient) {
      return next(new ApiError(404, 'Patient not found'));
    }

    // Get all patient records
    const records = await MedicalRecord.find({ patientId: patient._id });
    
    if (records.length === 0) {
      return next(new ApiError(404, 'No records found for this patient'));
    }

    // Grant access to all records immediately (30 days expiry)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    for (const record of records) {
      const hasAccess = record.sharedWith.some(
        share => share.sharedWith.toString() === req.user.id.toString()
      );
      
      if (!hasAccess) {
        record.sharedWith.push({
          sharedWith: req.user.id,
          expiresAt,
          accessGranted: true
        });
        await record.save();
      }
    }

    await createAuditLog(req.user.id, 'REQUEST_ACCESS', {
      details: { patientName, recordsCount: records.length },
      ip: getClientIp(req),
    });

    res.json({ 
      success: true, 
      message: `Access granted to ${records.length} records from ${patient.name}`,
      recordsCount: records.length
    });
  } catch (err) {
    next(err);
  }
};

// Get records doctor has access to
exports.getAccessibleRecords = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({
      'sharedWith.sharedWith': req.user.id,
      'sharedWith.accessGranted': true,
      'sharedWith.expiresAt': { $gt: new Date() }
    })
    .populate('patientId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};