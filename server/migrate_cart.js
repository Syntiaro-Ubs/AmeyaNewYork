require('dotenv').config();
const db = require('./db');

async function migrateCart() {
  try {
    console.log('Creating cart_items table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        size VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_cart_item (user_email, product_id, size)
      )
    `);
    console.log('Successfully created cart_items table.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating cart_items table:', error);
    process.exit(1);
  }
}

migrateCart();
