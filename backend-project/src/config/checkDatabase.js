const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAndUpdateDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ssa@100ssa',
      database: process.env.DB_NAME || 'social_spark'
    });

    console.log('Connected to database');

    // Check users table structure
    const [userColumns] = await connection.query('DESCRIBE users');
    console.log('Current users table structure:');
    console.table(userColumns);

    // Check if password column exists
    const passwordColumn = userColumns.find(col => col.Field === 'password');
    if (!passwordColumn) {
      console.log('Adding password column to users table...');
      await connection.query('ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL AFTER email');
    }

    // Check if bio column exists
    const bioColumn = userColumns.find(col => col.Field === 'bio');
    if (!bioColumn) {
      console.log('Adding bio column to users table...');
      await connection.query('ALTER TABLE users ADD COLUMN bio TEXT AFTER password');
    }

    // Check if city column exists
    const cityColumn = userColumns.find(col => col.Field === 'city');
    if (!cityColumn) {
      console.log('Adding city column to users table...');
      await connection.query('ALTER TABLE users ADD COLUMN city VARCHAR(100) AFTER bio');
    }

    // Check if posts table exists
    try {
      const [postColumns] = await connection.query('DESCRIBE posts');
      console.log('Current posts table structure:');
      console.table(postColumns);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('Posts table does not exist. Creating it...');
        await connection.execute(`
          CREATE TABLE posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
        console.log('Posts table created successfully');
      }
    }

    console.log('Database structure check completed');
    
  } catch (error) {
    console.error('Error checking database structure:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  checkAndUpdateDatabase().catch(console.error);
}

module.exports = checkAndUpdateDatabase;