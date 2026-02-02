import { DataSource } from 'typeorm';

// Load .env if available (guarded so environments without dotenv won't fail build)
declare const require: any;
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available in this environment; rely on process.env
}

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: '_typeorm_migrations',
  synchronize: false,
  logging: ['error', 'warn'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
