import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFixtureTable1775981781722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS hunters.fixture (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "homeTeam" VARCHAR NOT NULL,
        "awayTeam" VARCHAR NOT NULL,
        "homeScore" INT,
        "awayScore" INT,
        "kickOff" TIMESTAMP NOT NULL,
        venue VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'Friendly'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS hunters.fixture;');
  }
}
