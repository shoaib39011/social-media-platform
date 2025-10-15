const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ssa@100ssa',
      database: process.env.DB_NAME || 'social_spark'
    });

    console.log('Connected to database');

    // Check all users
    const [users] = await connection.query('SELECT * FROM users');
    console.log('Current users in database:');
    console.table(users);

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUsers().catch(console.error);