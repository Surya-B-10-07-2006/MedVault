const MedicalRecord = require('../models/MedicalRecord');

const quickAccess = async (req, res, next) => {
  try {
    const { shareCode } = req.body;

    if (!shareCode) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    const record = await MedicalRecord.findOne({
      shareCode
    }).populate('patientId', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Invalid access code' });
    }

    res.json({
      success: true,
      record: {
        _id: record._id,
        fileName: record.fileName,
        originalName: record.originalName,
        description: record.description,
        fileSize: record.fileSize,
        createdAt: record.createdAt,
        patient: record.patientId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  quickAccess
};