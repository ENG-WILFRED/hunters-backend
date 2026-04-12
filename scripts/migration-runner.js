const { Client } = require('pg');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Creating hunters schema if it does not exist...');
    await client.query('CREATE SCHEMA IF NOT EXISTS hunters;');

    console.log('Schema created successfully. Running TypeORM migrations...');
    await client.end();

    // Run TypeORM migrations
    execSync('npx typeorm migration:run -d dist/ormconfig.js', {
      stdio: 'inherit',
      env: { ...process.env }
    });

    console.log('All migrations completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();