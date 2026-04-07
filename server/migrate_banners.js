const db = require('./db');

async function migrateBanners() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_slug VARCHAR(100) NOT NULL UNIQUE,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image', 'video') NOT NULL,
        focal_point VARCHAR(50) DEFAULT 'center 40%',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('banners table created.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateBanners();
