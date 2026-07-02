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
    format: 'webp', // Otomatis ubah semua gambar jadi WebP
    transformation: [{ width: 1200, crop: 'limit' }, { quality: 'auto:good' }] // Kompresi otomatis
  },
});

// Setup storage untuk Docs
const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Jika file adalah PDF, biarkan sebagai PDF. Jika gambar, ubah jadi WebP.
    const isPdf = file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype === 'application/pdf';
    return {
      folder: 'portfolio_docs',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic', 'pdf'],
      format: isPdf ? 'pdf' : 'webp',
      transformation: isPdf ? [] : [{ width: 1200, crop: 'limit' }, { quality: 'auto:good' }]
    };
  },
});

const uploadProject = multer({ storage: projectStorage });
const uploadDoc = multer({ storage: docStorage });

module.exports = {
  cloudinary,
  uploadProject,
  uploadDoc
};
