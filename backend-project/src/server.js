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
    const [result] = await pool.execute('SELECT NOW() as now');
    res.json({ success: true, timestamp: result[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, fullName, username, city } = req.body;
  console.log('POST /api/register - data:', { email, fullName, username, city });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.execute(
      'INSERT INTO users (email, password, full_name, username, city, joined_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [email, hashedPassword, fullName, username, city || null]
    );
    
    // Get the newly created user
    const [newUserResult] = await pool.execute(
      'SELECT id, email, full_name, username, city FROM users WHERE email = ?',
      [email]
    );
    
    const newUser = newUserResult[0];
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
    const [result] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    console.log('POST /api/login - Query result:', result);
    
    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result[0];
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
    await pool.execute(
      'UPDATE users SET full_name = ?, username = ?, bio = ?, city = ? WHERE id = ?',
      [fullName, username, bio, city, actualUserId]
    );
    const [updatedUser] = await pool.execute(
      'SELECT id, full_name, username, bio, city, created_at FROM users WHERE id = ?',
      [actualUserId]
    );
    // Map created_at to joined_date for frontend compatibility
    const user = { ...updatedUser[0], joined_date: updatedUser[0].created_at };
    delete user.created_at;
    console.log('PATCH /api/profile - Updated user:', user);
    res.json({ success: true, user: user });
  } catch (err) {
    console.error('PATCH /api/profile - Error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  const userId = req.query.userId;
  const email = req.query.email;
  
  console.log('GET /api/profile - userId:', userId, 'email:', email);
  
  try {
    let result;
    if (email) {
      // Fetch by email (for logged-in user)
      [result] = await pool.execute(
        'SELECT id, full_name, username, bio, city, created_at, email FROM users WHERE email = ?',
        [email]
      );
    } else {
      // Fetch by userId (for viewing other profiles)
      const actualUserId = userId || 1;
      [result] = await pool.execute(
        'SELECT id, full_name, username, bio, city, created_at, email FROM users WHERE id = ?',
        [actualUserId]
      );
    }
    
    console.log('GET /api/profile - Query result:', result);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Map created_at to joined_date for frontend compatibility
    const user = { ...result[0], joined_date: result[0].created_at };
    delete user.created_at;
    console.log('GET /api/profile - Returning user:', user);
    res.json({ success: true, user: user });
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
