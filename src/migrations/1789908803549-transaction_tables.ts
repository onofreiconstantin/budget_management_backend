import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTables1789908803549 implements MigrationInterface {
  name = 'TransactionTables1789908803549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "CHK_abce29ad817fbef514f3517a12"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."estimations_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TABLE "estimations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "created_by_id" uuid NOT NULL, "transaction_entity_id" uuid NOT NULL, "amount" numeric(19,4) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."estimations_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "PK_c7ec983ab9a4dccf21b74198cd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "created_by_id" uuid NOT NULL, "transaction_entity_id" uuid NOT NULL, "estimation_id" uuid, "amount" numeric(19,4) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_entities_type_enum" AS ENUM('employer', 'client', 'retailer', 'food_service', 'housing', 'utility', 'transport', 'accommodation', 'healthcare', 'education', 'entertainment', 'professional_service', 'financial_institution', 'government', 'person', 'charity', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_entities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "created_by_id" uuid NOT NULL, "name" character varying NOT NULL, "type" "public"."transaction_entities_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "PK_ff2eafc226d7d2f4ee79f2533dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "transaction_entity_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_9790dbcec8bfa1c7d8155e567cf" UNIQUE ("transaction_entity_id")`,
    );
    await queryRunner.query(`ALTER TABLE "documents" ADD "estimation_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "transaction_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 days'`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "CHK_31ba93f727ff959ee49ed2eb69" CHECK (num_nonnulls("avatar_user_id", "user_id", "organization_user_id", "admin_id", "transaction_entity_id", "estimation_id", "transaction_id") = 1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" ADD CONSTRAINT "FK_06bf5e40a988918dc839bec965b" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" ADD CONSTRAINT "FK_5c6ad8fb89d214b175e41df4f54" FOREIGN KEY ("created_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" ADD CONSTRAINT "FK_816664cb42c17616aa7c9be4491" FOREIGN KEY ("transaction_entity_id") REFERENCES "transaction_entities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" ADD CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_245f73843f5949d161ea0c3ca13" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_361b4545aafa33ae00d8630295c" FOREIGN KEY ("created_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_8c6b04888aab788c2091e25e578" FOREIGN KEY ("transaction_entity_id") REFERENCES "transaction_entities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_9f7341fbf27e72d4fdb209139cd" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" ADD CONSTRAINT "FK_b7a8951d3514b092a6a6b2a3d15" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" ADD CONSTRAINT "FK_378fe0f17b366758ab574899598" FOREIGN KEY ("created_by_id") REFERENCES "organization_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" ADD CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_9790dbcec8bfa1c7d8155e567cf" FOREIGN KEY ("transaction_entity_id") REFERENCES "transaction_entities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_115d39eab8179c12ac141d5951b" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_db9157d0ba4b49bc5c1746f0592" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_db9157d0ba4b49bc5c1746f0592"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_115d39eab8179c12ac141d5951b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_9790dbcec8bfa1c7d8155e567cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" DROP CONSTRAINT "FK_fd6454aa56042eed6e4804d10c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" DROP CONSTRAINT "FK_378fe0f17b366758ab574899598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_entities" DROP CONSTRAINT "FK_b7a8951d3514b092a6a6b2a3d15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_d48a07d3bdad7bdd839bc05b816"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_9f7341fbf27e72d4fdb209139cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_8c6b04888aab788c2091e25e578"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_361b4545aafa33ae00d8630295c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_245f73843f5949d161ea0c3ca13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" DROP CONSTRAINT "FK_502e0c5d1cef9c9503201fbeed3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" DROP CONSTRAINT "FK_816664cb42c17616aa7c9be4491"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" DROP CONSTRAINT "FK_5c6ad8fb89d214b175e41df4f54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimations" DROP CONSTRAINT "FK_06bf5e40a988918dc839bec965b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "CHK_31ba93f727ff959ee49ed2eb69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_invitations" ALTER COLUMN "expires_at" SET DEFAULT (now() + '7 days')`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "estimation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_9790dbcec8bfa1c7d8155e567cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "transaction_entity_id"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_entities"`);
    await queryRunner.query(
      `DROP TYPE "public"."transaction_entities_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "estimations"`);
    await queryRunner.query(`DROP TYPE "public"."estimations_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "CHK_abce29ad817fbef514f3517a12" CHECK ((num_nonnulls(avatar_user_id, user_id, organization_user_id, admin_id) = 1))`,
    );
  }
}
