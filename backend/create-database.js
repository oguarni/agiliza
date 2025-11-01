/**
 * Database Creation Script
 * Run this to create the PostgreSQL database
 * Usage: node create-database.js
 */

require('dotenv').config();
const { Client } = require('pg');

const createDatabase = async () => {
  // Connect to PostgreSQL server (not to a specific database)
  const client = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    console.log('Connecting to PostgreSQL server...');
    console.log(`Host: ${process.env.DB_HOST || '127.0.0.1'}`);
    console.log(`Port: ${process.env.DB_PORT || 5432}`);
    console.log(`User: ${process.env.DB_USER || 'postgres'}`);

    await client.connect();
    console.log('✅ Connected to PostgreSQL server');

    const dbName = process.env.DB_NAME || 'task_management_dev';

    // Check if database already exists
    const checkQuery = `SELECT 1 FROM pg_database WHERE datname='${dbName}'`;
    const result = await client.query(checkQuery);

    if (result.rowCount > 0) {
      console.log(`⚠️  Database '${dbName}' already exists`);
      console.log('✅ You can proceed with migrations: npm run db:migrate');
    } else {
      // Create database
      console.log(`Creating database '${dbName}'...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully!`);
      console.log('\nNext steps:');
      console.log('1. Run migrations: npm run db:migrate');
      console.log('2. Start the server: npm run dev');
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed!');
      console.error('The password in your .env file is incorrect.');
      console.error('\nTo fix this:');
      console.error('1. Check your PostgreSQL password');
      console.error('2. Update DB_PASS in backend/.env');
      console.error('3. Or reset PostgreSQL password:');
      console.error('   sudo -u postgres psql -c "ALTER USER postgres PASSWORD \'postgres\';"');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Connection refused!');
      console.error('PostgreSQL is not running or not accepting connections.');
      console.error('\nTo fix this:');
      console.error('  sudo service postgresql start');
    } else {
      console.error('\nSee DATABASE_SETUP.md for troubleshooting help');
    }

    process.exit(1);
  }
};

createDatabase();
