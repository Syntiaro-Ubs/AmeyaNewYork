const db = require('./db');

async function migrateStock() {
  try {
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0
    `);
    console.log('stock_quantity column added to products table.');
    process.exit(0);
  } catch (error) {
    // If ALTER TABLE ... ADD COLUMN IF NOT EXISTS is not supported by the MySQL version
    if (error.code === 'ER_PFS_NO_SUCH_FILE') {
        console.log('Attempting alternative migration...');
    }
    
    try {
        await db.query('ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0');
        console.log('stock_quantity column added.');
        process.exit(0);
    } catch (innerError) {
        if (innerError.code === 'ER_DUP_COLUMN_NAME') {
            console.log('stock_quantity column already exists.');
            process.exit(0);
        }
        console.error('Migration failed:', innerError);
        process.exit(1);
    }
  }
}

migrateStock();
