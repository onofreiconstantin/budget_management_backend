import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1788562370137 implements MigrationInterface {
    name = 'SecondMigration1788562370137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock" DROP COLUMN "testMod"`);
        await queryRunner.query(`ALTER TABLE "mock" ADD "test_mod" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock" ADD "test_mod2" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock" DROP COLUMN "test_mod2"`);
        await queryRunner.query(`ALTER TABLE "mock" DROP COLUMN "test_mod"`);
        await queryRunner.query(`ALTER TABLE "mock" ADD "testMod" character varying NOT NULL`);
    }

}
