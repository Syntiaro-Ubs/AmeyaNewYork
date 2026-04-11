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
        image VARCHAR(255),
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
        description TEXT,
        image VARCHAR(255),
        hover_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2b. Add missing metadata columns for existing databases
    const columns = [
      { name: 'categories.image', sql: 'ALTER TABLE categories ADD COLUMN image VARCHAR(255)' },
      { name: 'collections.description', sql: 'ALTER TABLE collections ADD COLUMN description TEXT' },
      { name: 'collections.image', sql: 'ALTER TABLE collections ADD COLUMN image VARCHAR(255)' },
      { name: 'collections.hover_image', sql: 'ALTER TABLE collections ADD COLUMN hover_image VARCHAR(255)' }
    ];

    for (const column of columns) {
      try {
        await db.query(column.sql);
        console.log(`Added column: ${column.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`Column already exists: ${column.name}`);
        } else {
          throw error;
        }
      }
    }

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
