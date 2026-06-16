const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Ensure parent data directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log(`SQLite database successfully opened at: ${dbPath}`);
  }
});

// Promise wrappers for database queries
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize schema and run seeder migrations
const initDb = async () => {
  try {
    // 1. Create registrations table
    await run(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        company TEXT,
        role TEXT,
        ticketType TEXT NOT NULL,
        registrationCode TEXT NOT NULL UNIQUE,
        registeredAt TEXT NOT NULL
      )
    `);

    // 2. Create contacts table
    await run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        submittedAt TEXT NOT NULL
      )
    `);

    console.log('SQLite schemas verified.');

    // 3. Migrate Registrations from registrations.json if table is empty
    const regCountRow = await get('SELECT COUNT(*) as count FROM registrations');
    if (regCountRow.count === 0) {
      const jsonFile = path.join(__dirname, 'data', 'registrations.json');
      if (fs.existsSync(jsonFile)) {
        console.log('Found legacy registrations.json. Starting migration to SQLite...');
        const fileContent = fs.readFileSync(jsonFile, 'utf8');
        const legacyData = JSON.parse(fileContent || '[]');
        
        for (const item of legacyData) {
          try {
            await run(
              `INSERT OR IGNORE INTO registrations 
               (name, email, company, role, ticketType, registrationCode, registeredAt) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                item.name, 
                item.email, 
                item.company || 'Independent', 
                item.role || 'Enthusiast', 
                item.ticketType, 
                item.registrationCode, 
                item.registeredAt || new Date().toISOString()
              ]
            );
          } catch (insertErr) {
            console.error(`Skipped inserting registrant ${item.email} during migration:`, insertErr.message);
          }
        }
        
        console.log(`Successfully migrated ${legacyData.length} records to SQLite database.`);
        // Archive JSON file
        fs.renameSync(jsonFile, `${jsonFile}.bak`);
        console.log(`Archived ${jsonFile} to registrations.json.bak`);
      }
    }

    // 4. Migrate Contacts from contact.json if table is empty
    const contactCountRow = await get('SELECT COUNT(*) as count FROM contacts');
    if (contactCountRow.count === 0) {
      const jsonFile = path.join(__dirname, 'data', 'contact.json');
      if (fs.existsSync(jsonFile)) {
        console.log('Found legacy contact.json. Starting migration to SQLite...');
        const fileContent = fs.readFileSync(jsonFile, 'utf8');
        const legacyData = JSON.parse(fileContent || '[]');
        
        for (const item of legacyData) {
          await run(
            `INSERT INTO contacts (name, email, message, submittedAt) VALUES (?, ?, ?, ?)`,
            [item.name, item.email, item.message, item.submittedAt || new Date().toISOString()]
          );
        }
        console.log(`Successfully migrated ${legacyData.length} contacts to SQLite database.`);
        // Archive JSON file
        fs.renameSync(jsonFile, `${jsonFile}.bak`);
        console.log(`Archived ${jsonFile} to contact.json.bak`);
      }
    }

  } catch (error) {
    console.error('Database schema initialization or migration failed:', error);
  }
};

module.exports = {
  db,
  run,
  all,
  get,
  initDb
};
