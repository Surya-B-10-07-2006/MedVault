const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');

let gfs;
let gridFSBucket;

const initGridFS = () => {
  if (mongoose.connection.readyState === 1) {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });
    gfs = gridFSBucket;
  }
};

mongoose.connection.once('open', () => {
  initGridFS();
});

const getGridFS = () => {
  if (!gfs && mongoose.connection.readyState === 1) {
    initGridFS();
  }
  return gfs;
};

const getBucket = () => {
  if (!gridFSBucket && mongoose.connection.readyState === 1) {
    initGridFS();
  }
  return gridFSBucket;
};

const storage = new GridFsStorage({
  url: process.env.MONGO_URI || process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return resolve({ err });
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads',
          metadata: {
            patientId: req.user?.id,
            uploadedBy: req.user?.id,
            originalName: file.originalname,
            mimetype: file.mimetype,
          },
        };
        resolve(fileInfo);
      });
    });
  },
});

module.exports = {
  storage,
  getGridFS: getGridFS,
  getBucket: getBucket,
};
