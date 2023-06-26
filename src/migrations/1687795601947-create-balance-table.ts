import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceTable1687795601947 implements MigrationInterface {
  name = 'CreateBalanceTable1687795601947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."balance_histories_status_enum" AS ENUM('DEPOSIT', 'BUY', 'REFUND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "description" text NOT NULL, "status" "public"."balance_histories_status_enum" NOT NULL DEFAULT 'BUY', "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "balanceId" uuid, CONSTRAINT "REL_923c01060bedafad4553cacc20" UNIQUE ("userId"), CONSTRAINT "PK_602ce2399f1a8fe7c42231b6d7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_923c01060bedafad4553cacc20" ON "balance_histories" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "balances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" uuid NOT NULL, CONSTRAINT "REL_414a454532d03cd17f4ef40eae" UNIQUE ("userId"), CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_histories" ADD CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f" FOREIGN KEY ("balanceId") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_histories" ADD CONSTRAINT "FK_923c01060bedafad4553cacc204" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balances" ADD CONSTRAINT "FK_414a454532d03cd17f4ef40eae2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "balances" DROP CONSTRAINT "FK_414a454532d03cd17f4ef40eae2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_histories" DROP CONSTRAINT "FK_923c01060bedafad4553cacc204"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_histories" DROP CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f"`,
    );
    await queryRunner.query(`DROP TABLE "balances"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_923c01060bedafad4553cacc20"`,
    );
    await queryRunner.query(`DROP TABLE "balance_histories"`);
    await queryRunner.query(
      `DROP TYPE "public"."balance_histories_status_enum"`,
    );
  }
}
