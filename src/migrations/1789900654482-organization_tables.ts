import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationTables1789900654482 implements MigrationInterface {
    name = 'OrganizationTables1789900654482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "CHK_358ca9b7660d26a561696b67bd"`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "currency_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."organization_users_permissions_enum" AS ENUM('members_view', 'members_manage', 'transaction_entities_view', 'transaction_entities_manage_own', 'transaction_entities_manage_all', 'transactions_view_own', 'transactions_view_all', 'transactions_manage_own', 'transactions_manage_all', 'estimations_view_own', 'estimations_view_all', 'estimations_manage_own', 'estimations_manage_all', 'organization_manage', 'analytics_view_own', 'analytics_view_all')`);
        await queryRunner.query(`CREATE TABLE "organization_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "organization_id" uuid NOT NULL, "is_owner" boolean NOT NULL DEFAULT false, "permissions" "public"."organization_users_permissions_enum" array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "PK_af79a22d50256af35812ba60a87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."organization_invitations_status_enum" AS ENUM('pending', 'accepted', 'revoked')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_invitations_permissions_enum" AS ENUM('members_view', 'members_manage', 'transaction_entities_view', 'transaction_entities_manage_own', 'transaction_entities_manage_all', 'transactions_view_own', 'transactions_view_all', 'transactions_manage_own', 'transactions_manage_all', 'estimations_view_own', 'estimations_view_all', 'estimations_manage_own', 'estimations_manage_all', 'organization_manage', 'analytics_view_own', 'analytics_view_all')`);
        await queryRunner.query(`CREATE TABLE "organization_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "email" character varying NOT NULL, "token_hash" character varying NOT NULL, "status" "public"."organization_invitations_status_enum" NOT NULL DEFAULT 'pending', "permissions" "public"."organization_invitations_permissions_enum" array NOT NULL, "accepted_at" TIMESTAMP WITH TIME ZONE, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "invited_by_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_da2dfab0d3cb7f1bfdc886c4289" UNIQUE ("token_hash"), CONSTRAINT "PK_f172f12b8a9ee6584b661f57e24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "organization_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "CHK_17a0738badf99870eeb7191ceb" CHECK (num_nonnulls("avatar_user_id", "user_id", "organization_user_id") = 1)`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD CONSTRAINT "FK_7e5b767fe9638cb2f49e87657da" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_078696d55c09cc03375ae20d582" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_f4ea95cd7b3714cc51a102da69b" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_8b99424453764f0cdab5f767b2a" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_4b0ca0e677ff697894ead3ef37c" FOREIGN KEY ("organization_user_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_invitations" ADD CONSTRAINT "FK_7f88954e8d667a76ae3ced6f446" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_invitations" ADD CONSTRAINT "FK_f2adb477aa41340163bac901751" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_invitations" DROP CONSTRAINT "FK_f2adb477aa41340163bac901751"`);
        await queryRunner.query(`ALTER TABLE "organization_invitations" DROP CONSTRAINT "FK_7f88954e8d667a76ae3ced6f446"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_4b0ca0e677ff697894ead3ef37c"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_8b99424453764f0cdab5f767b2a"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_f4ea95cd7b3714cc51a102da69b"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_078696d55c09cc03375ae20d582"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP CONSTRAINT "FK_7e5b767fe9638cb2f49e87657da"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "CHK_17a0738badf99870eeb7191ceb"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "organization_user_id"`);
        await queryRunner.query(`DROP TABLE "organization_invitations"`);
        await queryRunner.query(`DROP TYPE "public"."organization_invitations_permissions_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_invitations_status_enum"`);
        await queryRunner.query(`DROP TABLE "organization_users"`);
        await queryRunner.query(`DROP TYPE "public"."organization_users_permissions_enum"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "CHK_358ca9b7660d26a561696b67bd" CHECK ((num_nonnulls(avatar_user_id, user_id) = 1))`);
    }

}
