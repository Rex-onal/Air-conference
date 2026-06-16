const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const db = require('./db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Helper to get absolute path to data files (used only for read-only speakers/schedule files)
const getDataFilePath = (fileName) => path.join(__dirname, 'data', fileName);

// Utility function to read legacy JSON files safely
const readJsonFile = (fileName, defaultValue = []) => {
  try {
    const filePath = getDataFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultValue;
  }
};

// API Endpoints

// 1. Get Speakers (Read-only static JSON)
app.get('/api/speakers', (req, res) => {
  const speakers = readJsonFile('speakers.json');
  res.json({ success: true, data: speakers });
});

// 2. Get Schedule (Read-only static JSON)
app.get('/api/schedule', (req, res) => {
  const schedule = readJsonFile('schedule.json');
  res.json({ success: true, data: schedule });
});

// 3. Register for ticket (SQLite Write)
app.post('/api/register', async (req, res, next) => {
  const { name, email, company, role, ticketType } = req.body;

  // Simple validation
  if (!name || !email || !ticketType) {
    return res.status(400).json({ success: false, message: 'Name, email, and ticket type are required.' });
  }

  try {
    // Check if already registered
    const exists = await db.get('SELECT 1 FROM registrations WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (exists) {
      return res.status(400).json({ success: false, message: 'This email is already registered for the conference.' });
    }

    // Generate unique registration code
    const code = 'AIR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const registeredAt = new Date().toISOString();

    const insertResult = await db.run(
      `INSERT INTO registrations (name, email, company, role, ticketType, registrationCode, registeredAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, company || 'Independent', role || 'Enthusiast', ticketType, code, registeredAt]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        name,
        ticketType,
        registrationCode: code
      }
    });
  } catch (error) {
    console.error('Registration SQLite error:', error);
    res.status(500).json({ success: false, message: 'Failed to record registration in database. Please try again.' });
  }
});

// 4. Contact Form Submission (SQLite Write)
app.post('/api/contact', async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  try {
    const submittedAt = new Date().toISOString();
    await db.run(
      `INSERT INTO contacts (name, email, message, submittedAt) VALUES (?, ?, ?, ?)`,
      [name, email, message, submittedAt]
    );

    res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you shortly!' });
  } catch (error) {
    console.error('Contact SQLite error:', error);
    res.status(500).json({ success: false, message: 'Failed to save message to database. Please try again.' });
  }
});

// 5. Admin Endpoints: Get Registrations (SQLite Aggregate & Read)
app.get('/api/admin/registrations', async (req, res, next) => {
  try {
    const registrations = await db.all('SELECT * FROM registrations ORDER BY registeredAt DESC');
    
    // Calculate stats using SQL counts
    const totalRow = await db.get('SELECT COUNT(*) as count FROM registrations');
    const standardRow = await db.get('SELECT COUNT(*) as count FROM registrations WHERE ticketType = ?', ['standard']);
    const vipRow = await db.get('SELECT COUNT(*) as count FROM registrations WHERE ticketType = ?', ['vip']);
    const studentRow = await db.get('SELECT COUNT(*) as count FROM registrations WHERE ticketType = ?', ['student']);

    const stats = {
      total: totalRow ? totalRow.count : 0,
      standard: standardRow ? standardRow.count : 0,
      vip: vipRow ? vipRow.count : 0,
      student: studentRow ? studentRow.count : 0
    };

    res.json({ success: true, data: registrations, stats });
  } catch (error) {
    console.error('Admin fetch SQLite error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve registrations from database.' });
  }
});

// 6. Admin Endpoints: Delete Registration (SQLite Write)
app.delete('/api/admin/registrations/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Try to delete by registrationCode or id
    const result = await db.run(
      'DELETE FROM registrations WHERE id = ? OR registrationCode = ?', 
      [parseInt(id) || -1, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error) {
    console.error('Admin delete SQLite error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete registration from database.' });
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

app.listen(PORT, async () => {
  // Initialize Database schemas & run JSON migrators
  await db.initDb();
  console.log(`AIR Conference backend listening at http://localhost:${PORT}`);
});
