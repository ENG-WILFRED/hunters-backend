import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHuntersSchema1775981781721 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid generation function is available
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Create Player entity table in hunters schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS hunters.player (
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

        // Create Donation entity table in hunters schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS hunters.donation (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                amount DECIMAL(10, 2) NOT NULL,
                "donorName" VARCHAR,
                "mpesaReceipt" VARCHAR,
                "playerId" UUID,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create Document entity table in hunters schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS hunters.document (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                filename VARCHAR NOT NULL,
                base64 TEXT NOT NULL,
                mime VARCHAR,
                "playerId" UUID,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create Post entity table in hunters schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS hunters.post (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL,
                message TEXT NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS hunters.post;');
        await queryRunner.query('DROP TABLE IF EXISTS hunters.document;');
        await queryRunner.query('DROP TABLE IF EXISTS hunters.donation;');
        await queryRunner.query('DROP TABLE IF EXISTS hunters.player;');
    }

}
