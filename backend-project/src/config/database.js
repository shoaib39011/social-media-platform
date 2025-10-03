const { Pool } = require('pg');

const pool = new Pool({
  user: 'socialuser',
  host: 'localhost',
  database: 'social_media_db',
  password: 'socialpass',
  port: 5432,
});


module.exports = pool;