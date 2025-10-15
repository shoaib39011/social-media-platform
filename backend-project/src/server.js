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
  const { email, password, fullName, username, city } = req.body;
  console.log('POST /api/register - data:', { email, fullName, username, city });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, full_name, username, city, joined_date) VALUES ($1, $2, $3, $4, $5, NOW())',
      [email, hashedPassword, fullName, username, city || null]
    );
    
    // Get the newly created user
    const newUserResult = await pool.query(
      'SELECT id, email, full_name, username, city FROM users WHERE email = $1',
      [email]
    );
    
    const newUser = newUserResult.rows[0];
    console.log('POST /api/register - New user created:', newUser);
    
    res.json({ 
      success: true, 
      message: 'User registered!', 
      userId: newUser.id,
      user: newUser 
    });
  } catch (err) {
    console.error('POST /api/register - Error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('POST /api/login - email:', email);
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.log('POST /api/login - Query result:', result);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('POST /api/login - Login successful for user:', user.id);
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        city: user.city
      }
    });
  } catch (err) {
    console.error('POST /api/login - Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/profile', async (req, res) => {
  const { userId, fullName, username, bio, city } = req.body;
  const actualUserId = userId || req.user?.id || 1; // Use userId from request body
  console.log('PATCH /api/profile - userId:', actualUserId, 'data:', { fullName, username, bio, city });
  
  try {
    await pool.query(
      'UPDATE users SET full_name = $1, username = $2, bio = $3, city = $4 WHERE id = $5',
      [fullName, username, bio, city, actualUserId]
    );
    const updatedUser = await pool.query(
      'SELECT id, full_name, username, bio, city, joined_date FROM users WHERE id = $1',
      [actualUserId]
    );
    console.log('PATCH /api/profile - Updated user:', updatedUser.rows[0]);
    res.json({ success: true, user: updatedUser.rows[0] });
  } catch (err) {
    console.error('PATCH /api/profile - Error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  const userId = req.query.userId || 1;
  console.log('GET /api/profile - userId:', userId);
  
  try {
    const result = await pool.query(
      'SELECT id, full_name, username, bio, city, joined_date, email FROM users WHERE id = $1',
      [userId]
    );
    console.log('GET /api/profile - Query result:', result);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('GET /api/profile - Returning user:', result.rows[0]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('GET /api/profile - Error:', err);
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
