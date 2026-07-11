-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS dashboard_db;
USE dashboard_db;

-- Crea la tabella preferiti
CREATE TABLE IF NOT EXISTS preferiti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_id VARCHAR(255) NOT NULL,
    titolo VARCHAR(255) NOT NULL,
    paese VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);