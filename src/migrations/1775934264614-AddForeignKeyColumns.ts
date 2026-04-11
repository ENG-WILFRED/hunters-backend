import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyColumns1775934264614 implements MigrationInterface {
  name = 'AddForeignKeyColumns1775934264614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add playerId foreign key column to document table
    await queryRunner.query(`
      ALTER TABLE "football"."document"
      ADD COLUMN "playerId" uuid
    `);

    // Add playerId foreign key column to donation table
    await queryRunner.query(`
      ALTER TABLE "football"."donation"
      ADD COLUMN "playerId" uuid
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "football"."document"
      ADD CONSTRAINT "FK_document_player"
      FOREIGN KEY ("playerId") REFERENCES "football"."player"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "football"."donation"
      ADD CONSTRAINT "FK_donation_player"
      FOREIGN KEY ("playerId") REFERENCES "football"."player"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "football"."document"
      DROP CONSTRAINT "FK_document_player"
    `);

    await queryRunner.query(`
      ALTER TABLE "football"."donation"
      DROP CONSTRAINT "FK_donation_player"
    `);

    // Remove columns
    await queryRunner.query(`
      ALTER TABLE "football"."document"
      DROP COLUMN "playerId"
    `);

    await queryRunner.query(`
      ALTER TABLE "football"."donation"
      DROP COLUMN "playerId"
    `);
  }
}