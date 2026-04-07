CREATE DATABASE IF NOT EXISTS ameya_db;
USE ameya_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  collection VARCHAR(100),
  description TEXT,
  material VARCHAR(100),
  gemstone VARCHAR(100),
  image VARCHAR(255),
  gallery JSON,
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
