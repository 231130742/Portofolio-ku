const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'doc-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all docs
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM docs ORDER BY doc_date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create doc
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, type, url: inputUrl, description, doc_date, external_link } = req.body;
        let finalUrl = inputUrl || null;

        if (req.file) {
            finalUrl = `/uploads/${req.file.filename}`;
            // Let frontend define type if it uploads file (could be 'image' or 'video')
        }

        const finalDate = doc_date || new Date().toISOString().split('T')[0];

        const [result] = await db.query(
            'INSERT INTO docs (title, type, url, description, doc_date, external_link) VALUES (?, ?, ?, ?, ?, ?)',
            [title, type, finalUrl, description, finalDate, external_link || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Doc created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update doc
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const { title, type, url: inputUrl, description, doc_date, external_link } = req.body;
        const { id } = req.params;
        const finalDate = doc_date || new Date().toISOString().split('T')[0];

        if (req.file) {
            const finalUrl = `/uploads/${req.file.filename}`;
            await db.query(
                'UPDATE docs SET title=?, type=?, url=?, description=?, doc_date=?, external_link=? WHERE id=?',
                [title, type, finalUrl, description, finalDate, external_link || null, id]
            );
        } else {
            await db.query(
                'UPDATE docs SET title=?, type=?, url=?, description=?, doc_date=?, external_link=? WHERE id=?',
                [title, type, inputUrl || null, description, finalDate, external_link || null, id]
            );
        }
        res.json({ message: 'Doc updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete doc
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM docs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Doc deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
