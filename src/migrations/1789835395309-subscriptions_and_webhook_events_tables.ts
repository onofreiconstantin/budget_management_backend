import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionsAndWebhookEventsTables1789835395309 implements MigrationInterface {
    name = 'SubscriptionsAndWebhookEventsTables1789835395309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "original_name" character varying NOT NULL, "object_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "size_bytes" bigint NOT NULL, "checksum" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "avatar_user_id" uuid, "user_id" uuid, "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "UQ_c54f674fe39feb75b72eebf5b33" UNIQUE ("object_key"), CONSTRAINT "UQ_94a33fd01ab155b0a20ee883295" UNIQUE ("avatar_user_id"), CONSTRAINT "REL_94a33fd01ab155b0a20ee88329" UNIQUE ("avatar_user_id"), CONSTRAINT "CHK_358ca9b7660d26a561696b67bd" CHECK (num_nonnulls("avatar_user_id", "user_id") = 1), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_tier_enum" AS ENUM('starter', 'pro')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "stripe_subscription_id" character varying NOT NULL, "stripe_product_id" character varying NOT NULL, "tier" "public"."subscriptions_tier_enum" NOT NULL, "status" character varying NOT NULL, "current_period_start" TIMESTAMP WITH TIME ZONE NOT NULL, "current_period_end" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d0a95ef8a28188364c546eb65c1" UNIQUE ("user_id"), CONSTRAINT "UQ_3a2d09d943f39912a01831a9272" UNIQUE ("stripe_subscription_id"), CONSTRAINT "REL_d0a95ef8a28188364c546eb65c" UNIQUE ("user_id"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "stripe_customer_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived_at" TIMESTAMP WITH TIME ZONE, "archived_by_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stripe_webhook_events_status_enum" AS ENUM('processing', 'succeeded', 'failed')`);
        await queryRunner.query(`CREATE TABLE "stripe_webhook_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stripe_event_id" character varying NOT NULL, "stripe_customer_id" character varying, "stripe_subscription_id" character varying, "event_type" character varying NOT NULL, "status" "public"."stripe_webhook_events_status_enum" NOT NULL DEFAULT 'processing', "attempts" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_480b8ef491e26854f98ef613caa" UNIQUE ("stripe_event_id"), CONSTRAINT "PK_0cf13fd3f2ff5604e092bc1ff48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_stripe_webhook_events_customer" ON "stripe_webhook_events"  ("stripe_customer_id") `);
        await queryRunner.query(`CREATE INDEX "idx_stripe_webhook_events_subscription" ON "stripe_webhook_events"  ("stripe_subscription_id") `);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_94a33fd01ab155b0a20ee883295" FOREIGN KEY ("avatar_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_702019e91e7a04539e1d6231028" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_089e4fe433b35e4ad0a87b9c7a6" FOREIGN KEY ("archived_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_089e4fe433b35e4ad0a87b9c7a6"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_702019e91e7a04539e1d6231028"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_94a33fd01ab155b0a20ee883295"`);
        await queryRunner.query(`DROP INDEX "public"."idx_stripe_webhook_events_subscription"`);
        await queryRunner.query(`DROP INDEX "public"."idx_stripe_webhook_events_customer"`);
        await queryRunner.query(`DROP TABLE "stripe_webhook_events"`);
        await queryRunner.query(`DROP TYPE "public"."stripe_webhook_events_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_tier_enum"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
