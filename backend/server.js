const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (Folder uploads lokal dihapus karena sudah pakai Cloudinary)

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const experienceRoutes = require('./routes/experiences');
const docRoutes = require('./routes/docs');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

// Export app untuk Vercel Serverless
module.exports = app;

// Tetap jalankan server lokal jika tidak berjalan di Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
