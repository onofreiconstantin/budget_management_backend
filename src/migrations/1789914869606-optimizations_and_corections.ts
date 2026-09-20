import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizationsAndCorections1789914869606 implements MigrationInterface {
    name = 'OptimizationsAndCorections1789914869606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currencies" DROP CONSTRAINT "FK_7e5b767fe9638cb2f49e87657da"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816"`);
        await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" DROP CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_8b99424453764f0cdab5f767b2a"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_9e85809714a8012af200a80d653"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_702019e91e7a04539e1d6231028"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" RENAME COLUMN "type" TO "types"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_entities_type_enum" RENAME TO "transaction_entities_types_enum"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "archived_at"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "archived_by_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "archived_at"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "archived_by_id"`);
        await queryRunner.query(`ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 days'`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" DROP COLUMN "types"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_entities_types_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_entities_types_enum" AS ENUM('employer', 'client', 'retailer', 'food_service', 'housing', 'utility', 'transport', 'accommodation', 'healthcare', 'education', 'entertainment', 'professional_service', 'financial_institution', 'government', 'person', 'charity', 'other')`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" ADD "types" "public"."transaction_entities_types_enum" array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5ffbe395603641c29e8ce9b4c97" UNIQUE ("stripe_customer_id")`);
        await queryRunner.query(`CREATE INDEX "idx_organization_invitations_organization_id" ON "organization_invitations"  ("organization_id") `);
        await queryRunner.query(`CREATE INDEX "idx_transactions_organization_id" ON "transactions"  ("organization_id") `);
        await queryRunner.query(`CREATE INDEX "idx_estimations_organization_id" ON "estimations"  ("organization_id") `);
        await queryRunner.query(`CREATE INDEX "idx_transaction_entities_organization_id" ON "transaction_entities"  ("organization_id") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816" FOREIGN KEY ("archived_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3" FOREIGN KEY ("archived_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" ADD CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4" FOREIGN KEY ("archived_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_8b99424453764f0cdab5f767b2a" FOREIGN KEY ("archived_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_9e85809714a8012af200a80d653" FOREIGN KEY ("archived_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_9e85809714a8012af200a80d653"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_8b99424453764f0cdab5f767b2a"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" DROP CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4"`);
        await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_entities_organization_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_estimations_organization_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transactions_organization_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_organization_invitations_organization_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5ffbe395603641c29e8ce9b4c97"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" DROP COLUMN "types"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" ADD "types" "public"."transaction_entities_types_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT (now() + '7 days')`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "archived_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "archived_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "archived_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "archived_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_entities_types_enum" RENAME TO "transaction_entities_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" RENAME COLUMN "types" TO "type"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_702019e91e7a04539e1d6231028" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_9e85809714a8012af200a80d653" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_8b99424453764f0cdab5f767b2a" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entities" ADD CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD CONSTRAINT "FK_7e5b767fe9638cb2f49e87657da" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
