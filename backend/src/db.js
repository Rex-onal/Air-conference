const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('WARNING: DATABASE_URL environment variable is not defined. Neon PostgreSQL client will use local defaults.');
}

const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false
});

// Helper to convert SQLite '?' parameters to PostgreSQL '$1', '$2', etc.
function convertSql(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

// Promise wrappers for database queries
const run = async (sql, params = []) => {
  const pgSql = convertSql(sql);
  const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
  const finalSql = isInsert
    ? pgSql.replace(/;?\s*$/, ' RETURNING id')
    : pgSql;
  const res = await pool.query(finalSql, params);
  return {
    id: res.rows[0]?.id || null,
    changes: res.rowCount
  };
};

const all = async (sql, params = []) => {
  const pgSql = convertSql(sql);
  const res = await pool.query(pgSql, params);
  return res.rows;
};

const get = async (sql, params = []) => {
  const pgSql = convertSql(sql);
  const res = await pool.query(pgSql, params);
  return res.rows[0] || null;
};

// Initialize schema and run seeder migrations
const initDb = async () => {
  try {
    // 1. Create registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        company VARCHAR(255),
        role VARCHAR(255),
        ticketType VARCHAR(50) NOT NULL,
        registrationCode VARCHAR(50) NOT NULL UNIQUE,
        registeredAt VARCHAR(100) NOT NULL
      )
    `);

    // 2. Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submittedAt VARCHAR(100) NOT NULL
      )
    `);

    console.log('PostgreSQL schemas verified.');

    // 3. Migrate Registrations from registrations.json if table is empty
    const regCountRow = await get('SELECT COUNT(*) as count FROM registrations');
    if (parseInt(regCountRow.count || '0') === 0) {
      const jsonFile = path.join(__dirname, 'data', 'registrations.json');
      if (fs.existsSync(jsonFile)) {
        console.log('Found legacy registrations.json. Starting migration to PostgreSQL...');
        const fileContent = fs.readFileSync(jsonFile, 'utf8');
        const legacyData = JSON.parse(fileContent || '[]');
        
        for (const item of legacyData) {
          try {
            await pool.query(
              `INSERT INTO registrations 
               (name, email, company, role, ticketType, registrationCode, registeredAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               ON CONFLICT (email) DO NOTHING`,
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
        
        console.log(`Successfully migrated ${legacyData.length} records to PostgreSQL database.`);
        // Archive JSON file
        fs.renameSync(jsonFile, `${jsonFile}.bak`);
        console.log(`Archived ${jsonFile} to registrations.json.bak`);
      }
    }

    // 4. Migrate Contacts from contact.json if table is empty
    const contactCountRow = await get('SELECT COUNT(*) as count FROM contacts');
    if (parseInt(contactCountRow.count || '0') === 0) {
      const jsonFile = path.join(__dirname, 'data', 'contact.json');
      if (fs.existsSync(jsonFile)) {
        console.log('Found legacy contact.json. Starting migration to PostgreSQL...');
        const fileContent = fs.readFileSync(jsonFile, 'utf8');
        const legacyData = JSON.parse(fileContent || '[]');
        
        for (const item of legacyData) {
          await pool.query(
            `INSERT INTO contacts (name, email, message, submittedAt) VALUES ($1, $2, $3, $4)`,
            [item.name, item.email, item.message, item.submittedAt || new Date().toISOString()]
          );
        }
        console.log(`Successfully migrated ${legacyData.length} contacts to PostgreSQL database.`);
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
  pool,
  run,
  all,
  get,
  initDb
};
