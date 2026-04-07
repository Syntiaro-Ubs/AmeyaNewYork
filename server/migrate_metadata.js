const db = require('./db');

const categories = [
  { name: 'Rings', slug: 'rings' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bracelets & Bangles', slug: 'bracelets' },
  { name: 'Pendants & Necklaces', slug: 'necklaces' },
  { name: 'Sets', slug: 'sets' }
];

const collections = [
  { name: 'Eclat Initial', slug: 'eclat-initial' },
  { name: 'Eleve', slug: 'eleve' },
  { name: 'Love and Engagement', slug: 'love-engagement' },
  { name: 'Apex Spark', slug: 'apex-spark' }
];

async function migrate() {
  try {
    console.log('Starting metadata migration...');

    // 1. Create categories table
    console.log('Creating categories table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create collections table
    console.log('Creating collections table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Prepopulate categories
    console.log('Prepopulating categories...');
    for (const cat of categories) {
      await db.query(
        'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)',
        [cat.name, cat.slug]
      );
    }

    // 4. Prepopulate collections
    console.log('Prepopulating collections...');
    for (const col of collections) {
      await db.query(
        'INSERT IGNORE INTO collections (name, slug) VALUES (?, ?)',
        [col.name, col.slug]
      );
    }

    console.log('Metadata migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('MIGRATION ERROR:', error);
    process.exit(1);
  }
}

migrate();
