const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// =======================================================================
// TIPS: CARA MENGGANTI USERNAME & PASSWORD ADMIN
// =======================================================================
// 1. Ubah nilai di dalam tanda kutip pada variabel di bawah ini.
// 2. Simpan file ini (Ctrl + S).
// 3. Buka terminal di dalam folder backend, lalu ketik: node fixPassword.js
// 4. Selesai! Anda bisa langsung login dengan kredensial baru tersebut.
// =======================================================================

const NEW_USERNAME = 'admin';       // <--- Ganti username baru di sini
const NEW_PASSWORD = 'password123'; // <--- Ganti password baru di sini

async function fixPassword() {
    try {
        console.log('Menghubungkan ke database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db',
            port: process.env.DB_PORT || 3306,
            ssl: { rejectUnauthorized: false } // Penting untuk Aiven
        });

        console.log('Membuat enkripsi (hash) untuk password baru...');
        // bcrypt secara otomatis akan mengenkripsi teks rahasia Anda agar aman
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

        console.log('Memperbarui data di database...');
        
        // Pertama, cek apakah tabel users ada isinya
        const [users] = await connection.query("SELECT * FROM users");
        
        if (users.length === 0) {
            // Jika belum ada user sama sekali, kita buat baru (INSERT)
            await connection.query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [NEW_USERNAME, hashedPassword]
            );
            console.log(`✅ Sukses! Akun baru dibuat dengan Username: ${NEW_USERNAME}`);
        } else {
            // Jika sudah ada user, kita perbarui (UPDATE) user yang pertama
            const oldUsername = users[0].username;
            await connection.query(
                "UPDATE users SET username = ?, password = ? WHERE username = ?",
                [NEW_USERNAME, hashedPassword, oldUsername]
            );
            console.log(`✅ Sukses! Akun diperbarui menjadi Username: ${NEW_USERNAME}`);
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Gagal memperbarui password:', error.message);
    }
}

fixPassword();

