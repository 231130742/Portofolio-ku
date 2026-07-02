const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        // Parse technologies JSON
        const projects = rows.map(p => ({
            ...p,
            technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies
        }));
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a project
router.post('/', async (req, res) => {
    try {
        const { title, description, technologies, github_url, live_url, image } = req.body;
        
        let imageUrl = null;
        if (image && image.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(image, { folder: 'portfolio_projects' });
            imageUrl = uploadRes.secure_url;
        }
        
        // technologies might be a JSON string from frontend
        let techArray = technologies;
        if (typeof technologies === 'string') {
            try {
                techArray = JSON.parse(technologies);
            } catch (e) {
                techArray = technologies.split(',').map(t => t.trim());
            }
        }
        const techJson = JSON.stringify(techArray || []);

        const [result] = await db.query(
            'INSERT INTO projects (title, description, image, technologies, github_url, live_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, imageUrl, techJson, github_url || null, live_url || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
    } catch (error) {
        console.error("POST Project Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// Update a project
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, technologies, github_url, live_url, image } = req.body;
        
        let techArray = technologies;
        if (typeof technologies === 'string') {
            try {
                techArray = JSON.parse(technologies);
            } catch (e) {
                techArray = technologies.split(',').map(t => t.trim());
            }
        }
        const techJson = JSON.stringify(techArray || []);

        let imageUrl = null;
        if (image && image.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(image, { folder: 'portfolio_projects' });
            imageUrl = uploadRes.secure_url;
        }

        if (imageUrl) {
            await db.query(
                'UPDATE projects SET title=?, description=?, image=?, technologies=?, github_url=?, live_url=? WHERE id=?',
                [title, description, imageUrl, techJson, github_url || null, live_url || null, id]
            );
        } else {
            await db.query(
                'UPDATE projects SET title=?, description=?, technologies=?, github_url=?, live_url=? WHERE id=?',
                [title, description, techJson, github_url || null, live_url || null, id]
            );
        }
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error("PUT Project Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
