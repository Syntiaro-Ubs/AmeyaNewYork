const db = require('./db');
const fs = require('fs');
const path = require('path');

async function migrate() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const stmt of statements) {
      await db.query(stmt);
      console.log(`Executed: ${stmt.substring(0, 50)}...`);
    }
    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
