import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminTable1789905046890 implements MigrationInterface {
  name = 'AdminTable1789905046890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "CHK_17a0738badf99870eeb7191ceb"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admins_permissions_enum" AS ENUM('users_view', 'users_manage', 'admins_view', 'admins_manage', 'subscriptions_view', 'subscriptions_manage', 'analytics_view')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "granted_by_id" uuid, "is_owner" boolean NOT NULL DEFAULT false, "permissions" "public"."admins_permissions_enum" array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "UQ_2b901dd818a2a6486994d915a68" UNIQUE ("user_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "documents" ADD "admin_id" uuid`);
    await queryRunner.query(
      `ALTER TYPE "public"."organization_users_permissions_enum" ADD VALUE 'organization_view'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_invitations_permissions_enum" ADD VALUE 'organization_view'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 days'`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "CHK_abce29ad817fbef514f3517a12" CHECK (num_nonnulls("avatar_user_id", "user_id", "organization_user_id", "admin_id") = 1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5" FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_9e85809714a8012af200a80d653" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_22f87798811a67dc97959129178" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_22f87798811a67dc97959129178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_9e85809714a8012af200a80d653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_2b901dd818a2a6486994d915a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "CHK_abce29ad817fbef514f3517a12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT (now() + '7 days')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_invitations_permissions_enum_old" AS ENUM('members_view', 'members_manage', 'transaction_entities_view', 'transaction_entities_manage_own', 'transaction_entities_manage_all', 'transactions_view_own', 'transactions_view_all', 'transactions_manage_own', 'transactions_manage_all', 'estimations_view_own', 'estimations_view_all', 'estimations_manage_own', 'estimations_manage_all', 'organization_manage', 'analytics_view_own', 'analytics_view_all')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "permissions" TYPE "public"."organization_invitations_permissions_enum_old"[] USING "permissions"::"text"::"public"."organization_invitations_permissions_enum_old"[]`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_invitations_permissions_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_invitations_permissions_enum_old" RENAME TO "organization_invitations_permissions_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_users_permissions_enum_old" AS ENUM('members_view', 'members_manage', 'transaction_entities_view', 'transaction_entities_manage_own', 'transaction_entities_manage_all', 'transactions_view_own', 'transactions_view_all', 'transactions_manage_own', 'transactions_manage_all', 'estimations_view_own', 'estimations_view_all', 'estimations_manage_own', 'estimations_manage_all', 'organization_manage', 'analytics_view_own', 'analytics_view_all')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ALTER COLUMN "permissions" TYPE "public"."organization_users_permissions_enum_old"[] USING "permissions"::"text"::"public"."organization_users_permissions_enum_old"[]`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_users_permissions_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_users_permissions_enum_old" RENAME TO "organization_users_permissions_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "admin_id"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_permissions_enum"`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "CHK_17a0738badf99870eeb7191ceb" CHECK ((num_nonnulls(avatar_user_id, user_id, organization_user_id) = 1))`,
    );
  }
}
