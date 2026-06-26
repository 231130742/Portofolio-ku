const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    try {
        console.log("🔗 Menghubungkan ke database XAMPP (Lokal)...");
        const localDb = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'portfolio_db'
        });

        console.log("☁️ Menghubungkan ke database Aiven (Online)...");
        const aivenDb = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const tables = ['users', 'projects', 'experiences', 'docs', 'messages'];

        for (let table of tables) {
            console.log(`\n📦 Memproses tabel [${table}]...`);
            
            // 1. Ambil data dari lokal
            const [rows] = await localDb.query(`SELECT * FROM ${table}`);
            console.log(`   Ditemukan ${rows.length} baris data di XAMPP.`);

            if (rows.length === 0) continue;

            // 2. Hapus isi tabel di Aiven untuk menampung data dari XAMPP
            await aivenDb.query(`TRUNCATE TABLE ${table}`);
            
            // 3. Masukkan data ke Aiven
            let successCount = 0;
            for (let row of rows) {
                const keys = Object.keys(row);
                const values = Object.values(row);
                
                const placeholders = keys.map(() => '?').join(', ');
                const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
                
                // Pastikan format tipe data (terutama JSON) diproses dengan benar
                const processedValues = values.map(val => 
                    (typeof val === 'object' && val !== null && !(val instanceof Date)) 
                    ? JSON.stringify(val) 
                    : val
                );
                
                try {
                    await aivenDb.execute(query, processedValues);
                    successCount++;
                } catch (e) {
                    console.error(`   Gagal memindah baris id=${row.id}:`, e.message);
                }
            }
            console.log(`   ✅ Berhasil memindahkan ${successCount} baris ke Aiven!`);
        }

        console.log("\n🎉 SELAMAT! Migrasi Data Selesai Sepenuhnya!");
        await localDb.end();
        await aivenDb.end();
    } catch (error) {
        console.error("\n❌ Terjadi Kesalahan Migrasi:", error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.log("TIPS: Pastikan XAMPP MySQL dalam keadaan START.");
        }
    }
}

migrate();
