const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function backupDatabase() {
    try {
        console.log("☁️ Menghubungkan ke database Aiven (Online) untuk proses backup...");
        const aivenDb = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const tables = ['users', 'projects', 'experiences', 'docs', 'messages'];
        const backupData = {};
        let sqlDump = `-- Backup Database Portofolio\n-- Tanggal: ${new Date().toLocaleString()}\n\n`;

        for (let table of tables) {
            console.log(`📦 Mem-backup tabel [${table}]...`);
            const [rows] = await aivenDb.query(`SELECT * FROM ${table}`);
            
            // Simpan dalam format JSON
            backupData[table] = rows;

            // Buat query SQL INSERT
            if (rows.length > 0) {
                sqlDump += `-- Data untuk tabel ${table}\n`;
                for (let row of rows) {
                    const keys = Object.keys(row);
                    const values = Object.values(row).map(val => {
                        if (val === null) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                        return val;
                    });
                    
                    sqlDump += `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
                }
                sqlDump += `\n`;
            }
            console.log(`   ✅ Tersimpan ${rows.length} baris dari ${table}.`);
        }

        // Simpan ke file JSON
        const jsonPath = path.join(__dirname, 'backup.json');
        fs.writeFileSync(jsonPath, JSON.stringify(backupData, null, 2));
        console.log(`\n💾 Berhasil menyimpan backup data JSON di: ${jsonPath}`);

        // Simpan ke file SQL
        const sqlPath = path.join(__dirname, 'backup_data.sql');
        fs.writeFileSync(sqlPath, sqlDump);
        console.log(`💾 Berhasil menyimpan backup query SQL di: ${sqlPath}`);

        console.log("\n🎉 SELAMAT! Backup selesai. Datamu aman!");
        await aivenDb.end();
    } catch (error) {
        console.error("\n❌ Terjadi Kesalahan saat Backup:", error.message);
    }
}

backupDatabase();
