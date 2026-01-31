const AccessRequest = require('../models/AccessRequest');
const MedicalRecord = require('../models/MedicalRecord');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

exports.getForPatient = async (req, res, next) => {
  try {
    const requests = await AccessRequest.find({ patientId: req.user.id })
      .populate('doctorId', 'name email specialization')
      .populate('recordId', 'originalName fileType createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

exports.clearPending = async (req, res, next) => {
  try {
    await AccessRequest.updateMany(
      { patientId: req.user.id, status: 'pending' },
      { status: 'rejected', respondedAt: new Date(), respondedBy: req.user.id }
    );
    res.json({ success: true, message: 'All pending requests cleared' });
  } catch (err) {
    next(err);
  }
};

exports.respond = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, selectedRecords } = req.body;

    const accessRequest = await AccessRequest.findById(id).populate('recordId');
    if (!accessRequest || accessRequest.patientId.toString() !== req.user.id.toString()) {
      return next(new ApiError(404, 'Request not found'));
    }
    if (accessRequest.status !== 'pending') {
      return next(new ApiError(400, 'Request already responded'));
    }

    accessRequest.status = action === 'approve' ? 'approved' : 'rejected';
    accessRequest.respondedAt = new Date();
    accessRequest.respondedBy = req.user.id;
    await accessRequest.save();

    if (action === 'approve') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      if (accessRequest.recordId) {
        // Specific record request
        const record = await MedicalRecord.findById(accessRequest.recordId);
        if (record) {
          const exists = record.sharedWith.some(
            (s) => s.sharedWith.toString() === accessRequest.doctorId.toString()
          );
          if (!exists) {
            record.sharedWith.push({
              sharedWith: accessRequest.doctorId,
              expiresAt,
              accessGranted: true,
            });
            await record.save();
          }
        }
      } else if (selectedRecords && selectedRecords.length > 0) {
        // General request - patient selects records
        for (const recordId of selectedRecords) {
          const record = await MedicalRecord.findOne({ 
            _id: recordId, 
            patientId: req.user.id 
          });
          if (record) {
            const exists = record.sharedWith.some(
              (s) => s.sharedWith.toString() === accessRequest.doctorId.toString()
            );
            if (!exists) {
              record.sharedWith.push({
                sharedWith: accessRequest.doctorId,
                expiresAt,
                accessGranted: true,
              });
              await record.save();
            }
          }
        }
      }
    }

    await createAuditLog(req.user.id, 'GRANT_ACCESS', {
      resource: 'AccessRequest',
      resourceId: accessRequest._id,
      details: { action: accessRequest.status, selectedRecords },
      ip: getClientIp(req),
    });

    res.json({ success: true, request: accessRequest });
  } catch (err) {
    next(err);
  }
};
