const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateUser() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ssa@100ssa',
      database: process.env.DB_NAME || 'social_spark'
    });

    console.log('Connected to database');

    // Update the existing user to have proper name and username
    const [result] = await connection.query(
      'UPDATE users SET full_name = ?, username = ? WHERE id = ?',
      ['Syed Shoaib Aslam', 'shoaib39011', 1]
    );
    
    console.log('User updated successfully');

    // Check the updated user
    const [users] = await connection.query('SELECT * FROM users WHERE id = 1');
    console.log('Updated user:');
    console.table(users);

  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateUser().catch(console.error);