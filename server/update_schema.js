const db = require('./db');

async function addMissingColumns() {
  try {
    const columns = [
      { name: 'care_instructions', sql: 'ALTER TABLE products ADD COLUMN care_instructions TEXT' },
      { name: 'shipping_returns', sql: 'ALTER TABLE products ADD COLUMN shipping_returns TEXT' },
      { name: 'size_guide', sql: 'ALTER TABLE products ADD COLUMN size_guide TEXT' },
      { name: 'stock_quantity', sql: 'ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0' }
    ];

    for (const col of columns) {
      try {
        await db.query(col.sql);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`Column already exists: ${col.name}`);
        } else {
          console.error(`Error adding ${col.name}:`, err.message);
        }
      }
    }
    
    console.log('Database update process finished.');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

addMissingColumns();
