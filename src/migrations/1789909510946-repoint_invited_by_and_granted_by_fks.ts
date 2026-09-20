import { MigrationInterface, QueryRunner } from 'typeorm';

export class RepointInvitedByAndGrantedByFks1789909510946 implements MigrationInterface {
  name = 'RepointInvitedByAndGrantedByFks1789909510946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" DROP CONSTRAINT "FK_f2adb477aa41340163bac901751"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 days'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ADD CONSTRAINT "FK_f2adb477aa41340163bac901751" FOREIGN KEY ("invited_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5" FOREIGN KEY ("granted_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" DROP CONSTRAINT "FK_f2adb477aa41340163bac901751"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT (now() + '7 days')`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_82ccbbe620226b06bad4b563ff5" FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ADD CONSTRAINT "FK_f2adb477aa41340163bac901751" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
