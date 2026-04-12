import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1706823600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing tables if they exist with wrong structure
    await queryRunner.query('DROP TABLE IF EXISTS football.player;');
    await queryRunner.query('DROP TABLE IF EXISTS football.donation;');
    await queryRunner.query('DROP TABLE IF EXISTS football.document;');
    await queryRunner.query('DROP TABLE IF EXISTS football.post;');

    // Create Player entity table in football schema
    await queryRunner.query(`
      CREATE TABLE football.player (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        email VARCHAR,
        phone VARCHAR,
        password VARCHAR,
        "isAdmin" BOOLEAN DEFAULT FALSE,
        position VARCHAR DEFAULT 'MID',
        "matchesPlayed" INT DEFAULT 0,
        goals INT DEFAULT 0,
        assists INT DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Donation entity table in football schema
    await queryRunner.query(`
      CREATE TABLE football.donation (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        amount DECIMAL(10, 2) NOT NULL,
        "donorName" VARCHAR,
        "mpesaReceipt" VARCHAR,
        "playerId" UUID,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Document entity table in football schema
    await queryRunner.query(`
      CREATE TABLE football.document (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR NOT NULL,
        base64 TEXT NOT NULL,
        mime VARCHAR,
        "playerId" UUID,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Post entity table in football schema
    await queryRunner.query(`
      CREATE TABLE football.post (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        message TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS football.post;');
    await queryRunner.query('DROP TABLE IF EXISTS football.document;');
    await queryRunner.query('DROP TABLE IF EXISTS football.donation;');
    await queryRunner.query('DROP TABLE IF EXISTS football.player;');
  }
}
