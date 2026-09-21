import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionTable1790002892312 implements MigrationInterface {
  name = 'CreateSessionTable1790002892312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "session" (
        "sid" varchar NOT NULL,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_session_expire" ON "session" ("expire")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_expire"`);
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
