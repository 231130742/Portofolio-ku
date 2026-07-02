const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// Endpoint Ping untuk mencegah Aiven dari Sleep (dipanggil oleh cron-job.org)
const db = require('./config/db');
app.get('/api/ping', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ status: 'ok', message: 'Database is awake! 🚀' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Export app untuk Vercel Serverless
module.exports = app;

// Tetap jalankan server lokal jika tidak berjalan di Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
