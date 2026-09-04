import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1788561694872 implements MigrationInterface {
    name = 'InitialMigration1788561694872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock" ADD "testMod" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock" DROP COLUMN "testMod"`);
    }

}
