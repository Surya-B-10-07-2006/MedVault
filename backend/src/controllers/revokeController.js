const MedicalRecord = require('../models/MedicalRecord');

const revokeAccess = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    
    const record = await MedicalRecord.findOne({
      _id: recordId,
      patientId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    record.shareCode = null;
    await record.save();

    res.json({ success: true, message: 'Access revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  revokeAccess
};