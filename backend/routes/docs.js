const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// Get all docs
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM docs ORDER BY doc_date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("GET Docs Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// Fetch URL Metadata (thumbnail)
router.post('/meta', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ image: null });

        // Check if youtube
        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(ytRegExp);
        if (match && match[2].length === 11) {
            return res.json({ image: `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` });
        }

        // Fetch HTML for og:image
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        const html = await response.text();
        const ogImageMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["'](.*?)["']/i) || 
                             html.match(/<meta\s+content=["'](.*?)["']\s+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
        
        if (ogImageMatch && ogImageMatch[1]) {
            let imgUrl = ogImageMatch[1];
            if (imgUrl.startsWith('/')) {
                const urlObj = new URL(url);
                imgUrl = `${urlObj.protocol}//${urlObj.host}${imgUrl}`;
            }
            return res.json({ image: imgUrl });
        }
        res.json({ image: null });
    } catch (error) {
        res.json({ image: null });
    }
});

// Create doc
router.post('/', async (req, res) => {
    try {
        const { title, type, url: inputUrl, description, doc_date, start_date, end_date, is_lomba, winner, external_link, file } = req.body;
        let finalUrl = inputUrl || null;

        if (file && file.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(file, { folder: 'portfolio_docs' });
            finalUrl = uploadRes.secure_url;
            // Let frontend define type if it uploads file (could be 'image' or 'video')
        }

        let finalDocDate = doc_date || new Date().toISOString().split('T')[0];
        if (finalDocDate.includes('T')) finalDocDate = finalDocDate.split('T')[0];

        const finalStartDate = start_date ? (start_date.includes('T') ? start_date.split('T')[0] : start_date) : null;
        const finalEndDate = end_date ? (end_date.includes('T') ? end_date.split('T')[0] : end_date) : null;
        const finalIsLomba = is_lomba === true || is_lomba === 'true' || is_lomba === 1;

        const [result] = await db.query(
            'INSERT INTO docs (title, type, url, description, doc_date, start_date, end_date, is_lomba, winner, external_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, type, finalUrl, description, finalDocDate, finalStartDate, finalEndDate, finalIsLomba, winner || null, external_link || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Doc created successfully' });
    } catch (error) {
        console.error("POST Doc Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// Update doc
router.put('/:id', async (req, res) => {
    try {
        const { title, type, url: inputUrl, description, doc_date, start_date, end_date, is_lomba, winner, external_link, file } = req.body;
        const { id } = req.params;
        let finalDocDate = doc_date || new Date().toISOString().split('T')[0];
        if (finalDocDate.includes('T')) finalDocDate = finalDocDate.split('T')[0];

        const finalStartDate = start_date ? (start_date.includes('T') ? start_date.split('T')[0] : start_date) : null;
        const finalEndDate = end_date ? (end_date.includes('T') ? end_date.split('T')[0] : end_date) : null;
        const finalIsLomba = is_lomba === true || is_lomba === 'true' || is_lomba === 1;

        let fileUrl = null;
        if (file && file.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(file, { folder: 'portfolio_docs' });
            fileUrl = uploadRes.secure_url;
        }

        const query = 'UPDATE docs SET title=?, type=?, url=?, description=?, doc_date=?, start_date=?, end_date=?, is_lomba=?, winner=?, external_link=? WHERE id=?';
        const params = [title, type, fileUrl || inputUrl || null, description, finalDocDate, finalStartDate, finalEndDate, finalIsLomba, winner || null, external_link || null, id];

        await db.query(query, params);
        res.json({ message: 'Doc updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// Delete doc
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM docs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Doc deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

module.exports = router;
