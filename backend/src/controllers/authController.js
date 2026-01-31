const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const JTIBlacklist = require('../models/JTIBlacklist');
const ApiError = require('../utils/ApiError');
const createAuditLog = require('../utils/createAuditLog');
const { registerSchema, loginSchema } = require('../utils/validation');

const generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id, jti: crypto.randomBytes(16).toString('hex') },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRE || '7d' }
  );
};

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
};

exports.register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;
    const userRole = role || 'patient';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ApiError(400, 'Email already registered'));
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await createAuditLog(user._id, 'REGISTER', {
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
      expiresIn: 900,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await createAuditLog(user._id, 'LOGIN', {
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
      expiresIn: 900,
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return next(new ApiError(401, 'Refresh token required'));
    }

    const stored = await RefreshToken.findOne({ token });
    if (!stored || new Date() > stored.expiresAt) {
      return next(new ApiError(401, 'Invalid or expired refresh token'));
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    
    // Validate JTI to prevent token reuse
    if (decoded.jti) {
      const blacklisted = await JTIBlacklist.findOne({ jti: decoded.jti });
      if (blacklisted) {
        await RefreshToken.deleteOne({ token });
        return next(new ApiError(401, 'Token already used'));
      }
      // Blacklist the JTI
      await JTIBlacklist.create({ jti: decoded.jti, expiresAt: new Date(decoded.exp * 1000) });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      await RefreshToken.deleteOne({ token });
      return next(new ApiError(401, 'User not found'));
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    await RefreshToken.deleteOne({ token });
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired refresh token'));
    }
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset link will be sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    // In production, send email via nodemailer using SMTP_* env vars
    console.log('Reset URL (dev):', resetUrl);

    await createAuditLog(user._id, 'PASSWORD_RESET', {
      details: { requested: true },
      ip: getClientIp(req),
    });

    res.json({ success: true, message: 'If email exists, reset link will be sent' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });
    if (!user) {
      return next(new ApiError(400, 'Invalid or expired reset token'));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v').lean();
    res.json({ success: true, user: user ? { id: user._id, ...user } : null });
  } catch (err) {
    next(err);
  }
};
