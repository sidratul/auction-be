import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBidTable1687773715801 implements MigrationInterface {
  name = 'CreateBidTable1687773715801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bids" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric NOT NULL, "itemId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7dfeb7e7415b48ae5e68d2d079" ON "bids" ("itemId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1531393fadbf123f3d51c91d81" ON "bids" ("userId") `,
    );
    await queryRunner.query(`ALTER TABLE "items" ADD "highestBidId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "UQ_6e530f1464fdecb776bcb45850e" UNIQUE ("highestBidId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_6e530f1464fdecb776bcb45850e" FOREIGN KEY ("highestBidId") REFERENCES "bids"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" ADD CONSTRAINT "FK_7dfeb7e7415b48ae5e68d2d0791" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" ADD CONSTRAINT "FK_1531393fadbf123f3d51c91d819" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT "FK_1531393fadbf123f3d51c91d819"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT "FK_7dfeb7e7415b48ae5e68d2d0791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_6e530f1464fdecb776bcb45850e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "UQ_6e530f1464fdecb776bcb45850e"`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "highestBidId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1531393fadbf123f3d51c91d81"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7dfeb7e7415b48ae5e68d2d079"`,
    );
    await queryRunner.query(`DROP TABLE "bids"`);
  }
}
