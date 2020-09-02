import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateConstraintsCategoryIdFromTransactionsTable1599002506023
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('category_id') !== -1,
    );

    await queryRunner.dropForeignKey('transactions', foreignKey ?? '');
  }
}
