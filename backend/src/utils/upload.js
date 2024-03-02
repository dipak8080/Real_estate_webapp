// src/utils/upload.js
const multer = require('multer');
const path = require('path');

// Set up storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Changed to a fixed 'uploads/' directory relative to the server's current working directory
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Generate a unique file name and use path.extname to get the file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Changed to use path.extname for the extension
  }
});

// Filter files by type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not an image or PDF!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB file size limit
  }
});

module.exports = upload;
