import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { APIError } from '../utils/response.js';

// Setup uploads path in the root folder
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf|docx|doc/;
  const mimetypeTest = allowedExtensions.test(file.mimetype);
  const extensionTest = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (mimetypeTest && extensionTest) {
    return cb(null, true);
  }
  
  cb(new APIError('Uploaded file extension is not allowed. Only images and documents (PDF, Word) are supported.', 400), false);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
