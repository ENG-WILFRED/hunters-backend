import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialMigration1706823600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid generation function is available
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create Player entity table
    await queryRunner.createTable(
      new Table({
        name: 'player',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'position',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'jerseyNumber',
            type: 'int',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'appearances',
            type: 'int',
            default: 0,
          },
          {
            name: 'goals',
            type: 'int',
            default: 0,
          },
          {
            name: 'assists',
            type: 'int',
            default: 0,
          },
          {
            name: 'cards',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create Donation entity table
    await queryRunner.createTable(
      new Table({
        name: 'donation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            default: "'KES'",
          },
          {
            name: 'donorName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'donorEmail',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mpesaTransactionId',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create Document entity table
    await queryRunner.createTable(
      new Table({
        name: 'document',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'filePath',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fileSize',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'mimeType',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'uploadedBy',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('document');
    await queryRunner.dropTable('donation');
    await queryRunner.dropTable('player');
  }
}
