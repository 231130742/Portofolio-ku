const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPassword() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db'
        });

        await connection.query(
            "UPDATE users SET password = ? WHERE username = 'admin'",
            ['$2b$10$F1pkLfr4oRwTQMJaG4uxkOUIgLphP.qGA87JEjrg9VEqhM/Pqy7OG']
        );

        console.log('Password fixed successfully');
        await connection.end();
    } catch (error) {
        console.error('Error fixing password:', error);
    }
}

fixPassword();
