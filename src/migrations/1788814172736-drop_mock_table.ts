import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropMockTable1788814172736 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mock"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mock" character varying NOT NULL, "test" character varying NOT NULL, "test_mod" character varying NOT NULL, "test_mod2" character varying NOT NULL, "test_mod3" character varying NOT NULL, CONSTRAINT "PK_374c21457ae3e56ec7d18d9e44e" PRIMARY KEY ("id"))`,
    );
  }
}
