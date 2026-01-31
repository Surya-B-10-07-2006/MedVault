const mongoose = require('mongoose');
const MedicalRecord = require('../models/MedicalRecord');
const AccessRequest = require('../models/AccessRequest');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

const path = require('path');
const crypto = require('crypto');

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'No file provided'));
    }

    const patientId = req.body.patientId || req.user.id;
    if (req.user.role === 'patient' && patientId !== req.user.id.toString()) {
      return next(new ApiError(403, 'You can only upload records for yourself'));
    }

    // Initialize GridFS Bucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Generate unique filename
    const filename = crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

    // Create upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        patientId,
        uploadedBy: req.user.id,
        originalName: req.file.originalname
      }
    });

    // Pipe buffer to GridFS
    const uploadPromise = new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
      uploadStream.end(req.file.buffer);
    });

    await uploadPromise;

    const record = await MedicalRecord.create({
      patientId,
      fileId: uploadStream.id,
      fileName: filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      description: (req.body.description || '').trim().slice(0, 500),
      uploadedBy: req.user.id,
    });

    await createAuditLog(req.user.id, 'UPLOAD_RECORD', {
      resource: 'MedicalRecord',
      resourceId: record._id,
      details: { fileName: record.originalName },
      ip: getClientIp(req),
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

exports.getByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // If no patientId provided, use current user's ID for patients
    const targetPatientId = patientId || req.user.id;
    
    if (req.user.role === 'patient' && targetPatientId !== req.user.id.toString()) {
      return next(new ApiError(403, 'Access denied'));
    }

    const records = await MedicalRecord.find({ patientId: targetPatientId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email')
      .lean();

    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

exports.viewOne = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await MedicalRecord.findById(recordId).populate('patientId', 'name email');
    if (!record) {
      return next(new ApiError(404, 'Record not found'));
    }

    const isOwner = record.patientId._id.toString() === req.user.id.toString();
    if (!isOwner && req.user.role !== 'doctor') {
      return next(new ApiError(403, 'Access denied to this record'));
    }

    await createAuditLog(req.user.id, 'VIEW_RECORD', {
      resource: 'MedicalRecord',
      resourceId: record._id,
      ip: getClientIp(req),
    });

    res.json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

exports.download = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await MedicalRecord.findById(recordId);
    if (!record) {
      return next(new ApiError(404, 'Record not found'));
    }

    const isOwner = record.patientId.toString() === req.user.id.toString();
    if (!isOwner && req.user.role !== 'doctor') {
      return next(new ApiError(403, 'Access denied'));
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const _id = new mongoose.Types.ObjectId(record.fileId);
    const file = await mongoose.connection.db.collection('uploads.files').findOne({ _id });
    if (!file) {
      return next(new ApiError(404, 'File not found in storage'));
    }

    res.setHeader('Content-Type', record.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(record.originalName)}"`);
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (err) {
    next(err);
  }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await MedicalRecord.findById(recordId);
    if (!record) {
      return next(new ApiError(404, 'Record not found'));
    }

    // Only owner can delete
    if (record.patientId.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, 'Only record owner can delete'));
    }

    // Delete file from GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const _id = new mongoose.Types.ObjectId(record.fileId);
    await bucket.delete(_id);

    // Delete record from database
    await MedicalRecord.findByIdAndDelete(recordId);

    await createAuditLog(req.user.id, 'DELETE_RECORD', {
      resource: 'MedicalRecord',
      resourceId: record._id,
      details: { fileName: record.originalName },
      ip: getClientIp(req),
    });

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getAccessSummary = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({ 
      patientId: req.user.id,
      shareCode: { $exists: true, $ne: null }
    }).lean();

    const accessSummary = records.map(record => ({
      recordId: record._id,
      recordName: record.originalName,
      shareCode: record.shareCode,
      createdAt: record.createdAt
    }));

    res.json({ success: true, accessSummary });
  } catch (err) {
    next(err);
  }
};
