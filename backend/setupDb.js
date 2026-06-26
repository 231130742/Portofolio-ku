const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDb() {
    try {
        // Connect without database selected first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db',
            ssl: { rejectUnauthorized: false },
            multipleStatements: true
        });

        console.log('Connected to MySQL. Reading schema...');
        
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await connection.query(schema);

        console.log('Database setup completed successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

setupDb();
