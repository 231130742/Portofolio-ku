const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi Cloudinary menggunakan environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup storage untuk Projects
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects', // Folder di Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic'],
  },
});

// Setup storage untuk Docs
const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_docs', // Folder di Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic', 'pdf'],
  },
});

const uploadProject = multer({ storage: projectStorage });
const uploadDoc = multer({ storage: docStorage });

module.exports = {
  cloudinary,
  uploadProject,
  uploadDoc
};
