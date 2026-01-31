const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return next(new ApiError(400, 'Avatar URL is required'));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    ).select('-password -__v');

    await createAuditLog(req.user.id, 'AVATAR_UPDATE', {
      details: { avatar },
      ip: getClientIp(req),
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'specialization', 'licenseNumber', 'phone', 'address', 'hospital'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -__v');

    await createAuditLog(req.user.id, 'PROFILE_UPDATE', {
      details: updates,
      ip: getClientIp(req),
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
