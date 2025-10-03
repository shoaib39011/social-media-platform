const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, city } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, city, joined_date) VALUES ($1, $2, $3, NOW())',
      [email, hashedPassword, city || null]
    );
    res.json({ success: true, message: 'User registered!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ success: true, message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/profile', async (req, res) => {
  const { fullName, username, bio, city } = req.body;
  const userId = req.user?.id || 1; // Replace with actual user ID logic
  try {
    await pool.query(
      'UPDATE users SET full_name = $1, username = $2, bio = $3, city = $4 WHERE id = $5',
      [fullName, username, bio, city, userId]
    );
    const updatedUser = await pool.query(
      'SELECT id, full_name, username, bio, city, joined_date FROM users WHERE id = $1',
      [userId]
    );
    res.json({ success: true, user: updatedUser.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  const userId = req.query.userId || 1;
  try {
    const result = await pool.query(
      'SELECT id, full_name, username, bio, city, joined_date, email FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const fetchUserProfile = async () => {
  const res = await fetch('http://localhost:3001/api/profile?userId=1');
  const data = await res.json();
  if (res.ok && data.user) {
    setEditData({
      fullName: data.user.full_name,
      username: data.user.username,
      bio: data.user.bio || "",
    });
    // Update other state as needed
  }
};

// Call fetchUserProfile after successful PATCH and in useEffect on page load
