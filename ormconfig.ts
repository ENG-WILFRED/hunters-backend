import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

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
