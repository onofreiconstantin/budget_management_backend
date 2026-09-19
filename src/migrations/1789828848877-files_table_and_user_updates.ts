import { MigrationInterface, QueryRunner } from "typeorm";

export class FilesTableAndUserUpdates1789828848877 implements MigrationInterface {
    name = 'FilesTableAndUserUpdates1789828848877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8380406413c086702397176cdbe"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "archived_by" TO "archived_by_id"`);
        await queryRunner.query(`CREATE TABLE "document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "original_name" character varying NOT NULL, "object_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "size_bytes" bigint NOT NULL, "checksum" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "avatar_user_id" uuid, "user_id" uuid, "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "UQ_3435531963270217c720a137033" UNIQUE ("object_key"), CONSTRAINT "REL_9373a68d5322796ea9819e1755" UNIQUE ("avatar_user_id"), CONSTRAINT "CHK_a908d7f0861d2eecb0b94b7c8a" CHECK (num_nonnulls("avatar_user_id", "user_id") = 1), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_9373a68d5322796ea9819e17550" FOREIGN KEY ("avatar_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_a24176a40152f41c98c09d8057d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_56c1b9b09dbca71b08a8ecf4366" FOREIGN KEY ("archived_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b2c917f3e854e095221e89aa05d" FOREIGN KEY ("archived_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b2c917f3e854e095221e89aa05d"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_56c1b9b09dbca71b08a8ecf4366"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_a24176a40152f41c98c09d8057d"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_9373a68d5322796ea9819e17550"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "archived_by_id" TO "archived_by"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8380406413c086702397176cdbe" FOREIGN KEY ("archived_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
