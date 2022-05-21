import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactions1653145041117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sender_user_id',
            type: 'uuid',
          },
          {
            name: 'receiver_user_id',
            type: 'uuid',
          },
          {
            name: 'value',
            type: 'float8',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'senderUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['sender_user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'receiverUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['receiver_user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
