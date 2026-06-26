-- Database diatur oleh connection string
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    technologies JSON,
    github_url VARCHAR(255) NULL,
    live_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    period VARCHAR(50) NOT NULL,
    start_year INT NULL,
    end_year INT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS docs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'image', 
    url VARCHAR(255),
    description TEXT,
    doc_date DATE NULL,
    external_link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'approved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password is 'admin123' hashed with bcrypt)
-- You can change this later from the application or DB
INSERT IGNORE INTO users (username, password) 
VALUES ('admin', '$2b$10$F1pkLfr4oRwTQMJaG4uxkOUIgLphP.qGA87JEjrg9VEqhM/Pqy7OG');
