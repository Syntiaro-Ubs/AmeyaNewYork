const db = require('./server/db');
require('dotenv').config();

async function check() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('--- TABLES ---');
    console.log(rows);
    
    const [productsSchema] = await db.query('DESCRIBE products');
    console.log('\n--- PRODUCTS SCHEMA ---');
    console.log(productsSchema);

    const [collections] = await db.query('SELECT DISTINCT collection FROM products');
    console.log('\n--- UNIQUE COLLECTIONS ---');
    console.log(collections);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

check();
