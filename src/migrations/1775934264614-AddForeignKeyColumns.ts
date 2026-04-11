import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyColumns1775934264614 implements MigrationInterface {
  name = 'AddForeignKeyColumns1775934264614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add playerId foreign key column to document table if it doesn't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'football' 
          AND table_name = 'document' 
          AND column_name = 'playerId'
        ) THEN
          ALTER TABLE "football"."document" ADD COLUMN "playerId" uuid;
        END IF;
      END
      $$;
    `);

    // Add playerId foreign key column to donation table if it doesn't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'football' 
          AND table_name = 'donation' 
          AND column_name = 'playerId'
        ) THEN
          ALTER TABLE "football"."donation" ADD COLUMN "playerId" uuid;
        END IF;
      END
      $$;
    `);

    // Add foreign key constraints if they don't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_schema = 'football' 
          AND table_name = 'document' 
          AND constraint_name = 'FK_document_player'
        ) THEN
          ALTER TABLE "football"."document"
          ADD CONSTRAINT "FK_document_player"
          FOREIGN KEY ("playerId") REFERENCES "football"."player"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_schema = 'football' 
          AND table_name = 'donation' 
          AND constraint_name = 'FK_donation_player'
        ) THEN
          ALTER TABLE "football"."donation"
          ADD CONSTRAINT "FK_donation_player"
          FOREIGN KEY ("playerId") REFERENCES "football"."player"("id") ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints if they exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_schema = 'football' 
          AND table_name = 'document' 
          AND constraint_name = 'FK_document_player'
        ) THEN
          ALTER TABLE "football"."document" DROP CONSTRAINT "FK_document_player";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_schema = 'football' 
          AND table_name = 'donation' 
          AND constraint_name = 'FK_donation_player'
        ) THEN
          ALTER TABLE "football"."donation" DROP CONSTRAINT "FK_donation_player";
        END IF;
      END
      $$;
    `);

    // Remove columns if they exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'football' 
          AND table_name = 'document' 
          AND column_name = 'playerId'
        ) THEN
          ALTER TABLE "football"."document" DROP COLUMN "playerId";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'football' 
          AND table_name = 'donation' 
          AND column_name = 'playerId'
        ) THEN
          ALTER TABLE "football"."donation" DROP COLUMN "playerId";
        END IF;
      END
      $$;
    `);
  }
}