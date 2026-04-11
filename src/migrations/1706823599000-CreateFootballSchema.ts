import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFootballSchema1706823599000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the football schema
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS football;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the football schema if it exists
    await queryRunner.query('DROP SCHEMA IF EXISTS football CASCADE;');
  }
}