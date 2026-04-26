const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

app.use(cors());
app.use(express.json());

// Initialize Database
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT,
        role TEXT,
        specialty TEXT,
        experience_years INTEGER,
        lawyer_card_id TEXT,
        phone_number TEXT,
        office_location TEXT,
        consultation_price INTEGER
      );

      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        client_id TEXT REFERENCES users(id),
        lawyer_id TEXT REFERENCES users(id),
        description TEXT,
        status TEXT DEFAULT 'pending',
        consultation_date TEXT,
        appointment_date TEXT,
        evidence_url TEXT,
        category TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        message TEXT,
        read INTEGER DEFAULT 0,
        created_at TEXT
      );
    `);

    // Mock Data Injection if empty
    const userRes = await pool.query('SELECT count(*) FROM users');
    if (parseInt(userRes.rows[0].count) === 0) {
      console.log('Injecting mock data...');
      
      const lawyers = [
        ['lawyer-1', 'sarah@example.com', 'password123', 'Maître Sarah Jenkins', 'Family Law', 12, '0555-123456', 'Alger, Didouche Mourad', 1200],
        ['lawyer-2', 'robert@example.com', 'password123', 'Maître Robert Miller', 'Real Estate Law', 8, '0555-987654', 'Oran, Front de Mer', 1500],
        ['lawyer-3', 'jessica@example.com', 'password123', 'Maître Jessica Pearson', 'Corporate Law', 15, '0555-443322', 'Alger, Hydra', 1500],
        ['lawyer-4', 'harvey@example.com', 'password123', 'Maître Harvey Specter', 'Criminal Law', 14, '0555-112233', 'Alger, Sidi Yahia', 1500],
        ['lawyer-saul', 'saul@example.com', 'password123', 'Maître Saul Goodman', 'Criminal Defense', 10, '0555-001122', 'Tizi Ouzou, Centre', 1000]
      ];

      for (const [id, email, pw, name, spec, exp, tel, loc, price] of lawyers) {
        await pool.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', [id, email, pw]);
        await pool.query('INSERT INTO profiles (id, full_name, role, specialty, experience_years, phone_number, office_location, consultation_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, name, 'lawyer', spec, exp, tel, loc, price]);
      }

      await pool.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', ['client-1', 'demo@example.com', 'password123']);
      await pool.query('INSERT INTO profiles (id, full_name, role) VALUES ($1, $2, $3)', ['client-1', 'John Doe', 'client']);
    }
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDb();

// Routes
app.post('/api/auth/signup', async (req, res) => {
  const { id, email, password, full_name, role } = req.body;
  try {
    await pool.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', [id, email, password]);
    await pool.query('INSERT INTO profiles (id, full_name, role) VALUES ($1, $2, $3)', [id, full_name, role]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    const user = userRes.rows[0];
    if (user) {
      const profileRes = await pool.query('SELECT * FROM profiles WHERE id = $1', [user.id]);
      const profile = profileRes.rows[0];
      res.json({ user, profile });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profiles', async (req, res) => {
  try {
    const profilesRes = await pool.query('SELECT * FROM profiles');
    res.json(profilesRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = Object.values(req.body);
    await pool.query(`UPDATE profiles SET ${fields} WHERE id = $${values.length + 1}`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/requests', async (req, res) => {
  const { userId, role } = req.query;
  try {
    let query = 'SELECT * FROM requests';
    let values = [];
    if (userId && role === 'client') {
      query += ' WHERE client_id = $1';
      values = [userId];
    } else if (userId && role === 'lawyer') {
      query += ' WHERE lawyer_id = $1';
      values = [userId];
    }
    
    const requestsRes = await pool.query(query, values);
    const requests = requestsRes.rows;
    
    // Attach profile info (keeping the same logic as before)
    const enriched = await Promise.all(requests.map(async r => {
      const clientRes = await pool.query('SELECT full_name FROM profiles WHERE id = $1', [r.client_id]);
      const lawyerRes = await pool.query('SELECT full_name FROM profiles WHERE id = $1', [r.lawyer_id]);
      const client = clientRes.rows[0];
      const lawyer = lawyerRes.rows[0];
      return { 
        ...r, 
        profiles: { full_name: client?.full_name }, 
        lawyers: { name: lawyer?.full_name } 
      };
    }));
    
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  const { id, client_id, lawyer_id, description, evidence_url, category, created_at } = req.body;
  try {
    await pool.query('INSERT INTO requests (id, client_id, lawyer_id, description, evidence_url, category, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
      [id, client_id, lawyer_id, description, evidence_url, category, created_at]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = Object.values(req.body);
    await pool.query(`UPDATE requests SET ${fields} WHERE id = $${values.length + 1}`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifsRes = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json(notifsRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { id, user_id, message, created_at } = req.body;
  try {
    await pool.query('INSERT INTO notifications (id, user_id, message, created_at) VALUES ($1, $2, $3, $4)', [id, user_id, message, created_at]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/read/:userId', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET read = 1 WHERE user_id = $1', [req.params.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
