const { DataSource } = require('typeorm');
const path = require('path');

// Load .env if available
require('dotenv').config();

async function runMigrations() {
  // First, create a datasource without schema to create the initial migrations table
  const initialDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/src/migrations/*.js'],
    migrationsTableName: '_typeorm_migrations',
    synchronize: false,
    logging: ['error', 'warn'],
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await initialDataSource.initialize();

    // Check if football schema exists
    const schemaExists = await initialDataSource.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata
        WHERE schema_name = 'football'
      );
    `);

    if (!schemaExists[0].exists) {
      console.log('Football schema does not exist. Running schema creation migration first...');

      // Run only the schema creation migration
      await initialDataSource.runMigrations();

      await initialDataSource.destroy();

      // Now create a new datasource with the football schema
      const footballDataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        schema: 'football',
        entities: ['dist/src/**/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        migrationsTableName: '_typeorm_migrations',
        synchronize: false,
        logging: ['error', 'warn'],
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      await footballDataSource.initialize();
      console.log('Running remaining migrations in football schema...');
      await footballDataSource.runMigrations();
      await footballDataSource.destroy();

    } else {
      console.log('Football schema already exists. Running migrations normally...');
      await initialDataSource.runMigrations();
      await initialDataSource.destroy();
    }

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();