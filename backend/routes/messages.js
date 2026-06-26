const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Publik: Mengirim pesan baru
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Semua field (name, email, message) harus diisi' });
        }
        
        const [result] = await db.query(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        res.status(201).json({ id: result.insertId, message: 'Pesan berhasil dikirim dan menunggu persetujuan.' });
    } catch (error) {
        console.error('Error post message:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengirim pesan' });
    }
});

// Publik: Mengambil pesan yang sudah disetujui (untuk ditampilkan sebagai komentar)
router.get('/approved', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, name, message, created_at FROM messages WHERE status = 'approved' ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error('Error get approved messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Mengambil semua pesan (termasuk pending)
router.get('/', async (req, res) => {
    try {
        // Here you might want to add middleware to check admin token, but we are keeping it simple based on existing routes
        const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error get all messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Menyetujui pesan
router.put('/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE messages SET status = 'approved' WHERE id = ?", [id]);
        res.json({ message: 'Pesan berhasil disetujui' });
    } catch (error) {
        console.error('Error approve message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Menangguhkan pesan (kembalikan ke pending)
router.put('/:id/suspend', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE messages SET status = 'pending' WHERE id = ?", [id]);
        res.json({ message: 'Pesan berhasil ditangguhkan' });
    } catch (error) {
        console.error('Error suspend message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Menghapus pesan
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM messages WHERE id = ?', [id]);
        res.json({ message: 'Pesan berhasil dihapus' });
    } catch (error) {
        console.error('Error delete message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
