const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { verifyToken } = require('./auth');

// Get all certificates
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM certificates ORDER BY issue_date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create certificate
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, category, issuer, issue_date, credential_id, credential_url, file } = req.body;
        let imageUrl = null;

        if (file && file.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(file, { folder: 'portfolio_certs' });
            imageUrl = uploadRes.secure_url;
        }

        const query = `
            INSERT INTO certificates 
            (title, category, issuer, issue_date, credential_id, credential_url, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [title, category || 'Lainnya', issuer, issue_date || null, credential_id || null, credential_url || null, imageUrl];
        
        const [result] = await db.query(query, params);
        res.json({ id: result.insertId, message: 'Certificate created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update certificate
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, issuer, issue_date, credential_id, credential_url, file } = req.body;
        
        let imageUrl = req.body.image_url || null; // existing image url

        if (file && file.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(file, { folder: 'portfolio_certs' });
            imageUrl = uploadRes.secure_url;
        }

        const query = `
            UPDATE certificates 
            SET title=?, category=?, issuer=?, issue_date=?, credential_id=?, credential_url=?, image_url=? 
            WHERE id=?
        `;
        const params = [title, category || 'Lainnya', issuer, issue_date || null, credential_id || null, credential_url || null, imageUrl, id];

        await db.query(query, params);
        res.json({ message: 'Certificate updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete certificate
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM certificates WHERE id = ?', [id]);
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
