const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'socialuser',
  host: 'localhost',
  database: 'social_media_db',
  password: 'socialpass',
  port: 5432,
});

async function updatePassword() {
  try {
    // Update jeshwanth's password to a known value
    const hashedPassword = await bcrypt.hash('password123', 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'jeshwanth@gmail.com']
    );
    
    console.log('Password updated for jeshwanth@gmail.com');
    console.log('New password: password123');
    
    // Also update shoaib's password
    const hashedPassword2 = await bcrypt.hash('shoaib123', 10);
    const result2 = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword2, 'ssaslam261005@gmail.com']
    );
    
    console.log('Password updated for ssaslam261005@gmail.com');
    console.log('New password: shoaib123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating passwords:', err);
    process.exit(1);
  }
}

updatePassword();