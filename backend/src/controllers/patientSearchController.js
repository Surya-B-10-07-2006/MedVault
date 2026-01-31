const User = require('../models/User');

exports.searchPatients = async (req, res, next) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Patient name is required' });
    }

    const patients = await User.find({
      name: { $regex: name, $options: 'i' },
      role: 'patient'
    }).select('name email createdAt').limit(10);

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchPatients
};