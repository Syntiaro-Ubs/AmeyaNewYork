const db = require('./db');
const bcrypt = require('bcryptjs');

async function migrateAuth() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@ameya.com']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@ameya.com', hashedPassword, 'admin']
      );
      console.log('Default admin created: admin@ameya.com / admin123');
    }

    console.log('Auth migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('Auth migration failed:', error);
    process.exit(1);
  }
}

migrateAuth();
