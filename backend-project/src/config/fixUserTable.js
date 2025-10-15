const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixUserTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'ssa@100ssa',
      database: process.env.DB_NAME || 'social_spark'
    });

    console.log('Connected to database');

    // Make username nullable and email not required to be unique temporarily
    console.log('Updating users table constraints...');
    
    // First, alter username to allow NULL
    try {
      await connection.query('ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NULL');
      console.log('Username column updated to allow NULL');
    } catch (error) {
      console.log('Username column already allows NULL or error:', error.message);
    }
    
    // Make email nullable temporarily
    try {
      await connection.query('ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NULL');
      console.log('Email column updated to allow NULL');
    } catch (error) {
      console.log('Email column already allows NULL or error:', error.message);
    }

    console.log('Users table constraints updated successfully');
    
  } catch (error) {
    console.error('Error updating table constraints:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixUserTable().catch(console.error);