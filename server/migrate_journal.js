const db = require('./db');

async function migrateJournal() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS journal_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        image_url VARCHAR(255),
        category VARCHAR(100),
        read_time VARCHAR(50),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    await db.query(createTableQuery);
    console.log("journal_articles table created successfully.");
  } catch (error) {
    console.error("Error creating journal_articles table:", error);
  } finally {
    process.exit(0);
  }
}

migrateJournal();
