const multer = require('multer');

// Store file in memory temporarily
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, JPEG, PNG, GIF, WEBP'), false);
    }
  },
});

const singleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = { singleUpload };
