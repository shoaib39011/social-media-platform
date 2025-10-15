const mysql = require('mysql2/promise');

const checkTableStructure = async () => {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'ssa@100ssa', // Update this if you have a password
      database: 'social_spark',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Checking users table structure...');
    
    // Check if the table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'users'");
    console.log('Tables found:', tables);
    
    if (tables.length > 0) {
      // Get table structure
      const [columns] = await pool.execute("DESCRIBE users");
      console.log('Users table structure:');
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Get sample data
      const [sampleData] = await pool.execute("SELECT * FROM users LIMIT 3");
      console.log('\nSample data:', sampleData);
    } else {
      console.log('Users table does not exist');
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkTableStructure();