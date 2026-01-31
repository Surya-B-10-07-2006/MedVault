const MedicalRecord = require('../models/MedicalRecord');
const AccessRequest = require('../models/AccessRequest');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

exports.getShared = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({
      'sharedWith.sharedWith': req.user.id,
      'sharedWith.accessGranted': true,
      'sharedWith.expiresAt': { $gt: new Date() },
    })
      .populate('patientId', 'name email')
      .populate('uploadedBy', 'name')
      .sort({ 'sharedWith.0.sharedAt': -1 })
      .lean();

    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

exports.requestAccess = async (req, res, next) => {
  try {
    const { recordId, patientId, message } = req.body;

    if (!patientId) {
      return next(new ApiError(400, 'Patient ID is required'));
    }

    // If no specific record ID, create a general access request
    if (!recordId) {
      const existing = await AccessRequest.findOne({
        doctorId: req.user.id,
        patientId,
        recordId: null,
        status: 'pending',
      });
      if (existing) {
        return next(new ApiError(400, 'General access request already sent'));
      }

      const request = await AccessRequest.create({
        doctorId: req.user.id,
        patientId,
        recordId: null,
        message: (message || 'Requesting access to your medical records').slice(0, 300),
      });

      await createAuditLog(req.user.id, 'REQUEST_ACCESS', {
        resource: 'AccessRequest',
        resourceId: request._id,
        details: { patientId },
        ip: getClientIp(req),
      });

      return res.status(201).json({ success: true, request });
    }

    const record = await MedicalRecord.findOne({
      _id: recordId,
      patientId,
    });
    if (!record) {
      return next(new ApiError(404, 'Record not found'));
    }

    const existing = await AccessRequest.findOne({
      doctorId: req.user.id,
      patientId,
      recordId,
      status: 'pending',
    });
    if (existing) {
      return next(new ApiError(400, 'Access request already sent'));
    }

    const request = await AccessRequest.create({
      doctorId: req.user.id,
      patientId,
      recordId,
      message: (message || '').slice(0, 300),
    });

    await createAuditLog(req.user.id, 'REQUEST_ACCESS', {
      resource: 'AccessRequest',
      resourceId: request._id,
      details: { recordId, patientId },
      ip: getClientIp(req),
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await AccessRequest.find({ doctorId: req.user.id })
      .populate('patientId', 'name email')
      .populate('recordId', 'originalName fileType createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const sharedRecordPatientIds = await MedicalRecord.distinct('patientId', {
      'sharedWith.sharedWith': req.user.id,
    });
    const patients = await User.find({ _id: { $in: sharedRecordPatientIds }, role: 'patient' })
      .select('name email')
      .lean();
    res.json({ success: true, patients });
  } catch (err) {
    next(err);
  }
};

exports.searchPatients = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name || name.trim().length < 2) {
      return next(new ApiError(400, 'Search term must be at least 2 characters'));
    }

    const patients = await User.find({
      role: 'patient',
      name: { $regex: name.trim(), $options: 'i' }
    })
      .select('name email')
      .limit(20)
      .lean();

    res.json({ success: true, patients });
  } catch (err) {
    next(err);
  }
};

exports.searchDoctors = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name || name.trim().length < 2) {
      return next(new ApiError(400, 'Search term must be at least 2 characters'));
    }

    const doctors = await User.find({
      role: 'doctor',
      name: { $regex: name.trim(), $options: 'i' }
    })
      .select('name email specialization')
      .limit(20)
      .lean();

    res.json({ success: true, doctors });
  } catch (err) {
    next(err);
  }
};
