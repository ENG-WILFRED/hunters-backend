import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFootballSchema1706823599000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // The schema is already created by the pre-migration script
    // This migration just ensures the migrations table is in the right place
    // No action needed as the schema creation is handled externally
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Schema dropping is handled externally if needed
  }
}