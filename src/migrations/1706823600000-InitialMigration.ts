import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1706823600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid generation function is available
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create Player entity table in football schema
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS football.player (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        position VARCHAR NOT NULL,
        "jerseyNumber" INT NOT NULL UNIQUE,
        appearances INT DEFAULT 0,
        goals INT DEFAULT 0,
        assists INT DEFAULT 0,
        cards INT DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Donation entity table in football schema
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS football.donation (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR DEFAULT 'KES',
        "donorName" VARCHAR NOT NULL,
        "donorEmail" VARCHAR,
        "mpesaTransactionId" VARCHAR UNIQUE,
        status VARCHAR DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Document entity table in football schema
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS football.document (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        description TEXT,
        "filePath" VARCHAR NOT NULL,
        "fileSize" INT,
        "mimeType" VARCHAR,
        "uploadedBy" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS football.document;');
    await queryRunner.query('DROP TABLE IF EXISTS football.donation;');
    await queryRunner.query('DROP TABLE IF EXISTS football.player;');
  }
}
