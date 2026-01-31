const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

// Generate 5-digit random code
const generateShareCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Generate share code for record
const generateCodeForRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    
    const record = await MedicalRecord.findOne({
      _id: recordId,
      patientId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    let shareCode;
    let isUnique = false;
    
    // Generate unique code
    while (!isUnique) {
      shareCode = generateShareCode();
      const existing = await MedicalRecord.findOne({ shareCode });
      if (!existing) isUnique = true;
    }

    record.shareCode = shareCode;
    await record.save();

    res.json({ shareCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Access record with name and code
const accessRecordByCode = async (req, res) => {
  try {
    const { patientName, shareCode } = req.body;

    // Find patient by name
    const patient = await User.findOne({
      name: { $regex: patientName, $options: 'i' },
      role: 'patient'
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find record with code
    const record = await MedicalRecord.findOne({
      patientId: patient._id,
      shareCode
    }).populate('patientId', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Invalid code or record not found' });
    }

    res.json({
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
  generateCodeForRecord,
  accessRecordByCode
};