const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all experiences
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM experiences ORDER BY start_year DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create experience
router.post('/', async (req, res) => {
    try {
        const { role, organization, start_year, end_year, description } = req.body;
        const periodStr = start_year && end_year ? `${start_year} - ${end_year}` : req.body.period;
        const [result] = await db.query(
            'INSERT INTO experiences (role, organization, period, description, start_year, end_year) VALUES (?, ?, ?, ?, ?, ?)',
            [role, organization, periodStr, description, start_year, end_year]
        );
        res.status(201).json({ id: result.insertId, message: 'Experience created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update experience
router.put('/:id', async (req, res) => {
    try {
        const { role, organization, start_year, end_year, description } = req.body;
        const periodStr = start_year && end_year ? `${start_year} - ${end_year}` : req.body.period;
        await db.query(
            'UPDATE experiences SET role=?, organization=?, period=?, description=?, start_year=?, end_year=? WHERE id=?',
            [role, organization, periodStr, description, start_year, end_year, req.params.id]
        );
        res.json({ message: 'Experience updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete experience
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM experiences WHERE id = ?', [req.params.id]);
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
