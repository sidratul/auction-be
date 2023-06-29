import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustBalanceHistory1687973719387 implements MigrationInterface {
    name = 'AdjustBalanceHistory1687973719387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "FK_923c01060bedafad4553cacc204"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_923c01060bedafad4553cacc20"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "REL_923c01060bedafad4553cacc20"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "balanceId" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4c7615ff0e17359103ab1a6c73" ON "balance_histories" ("balanceId") `);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f" FOREIGN KEY ("balanceId") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c7615ff0e17359103ab1a6c73"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "balanceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "FK_4c7615ff0e17359103ab1a6c73f" FOREIGN KEY ("balanceId") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "REL_923c01060bedafad4553cacc20" UNIQUE ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_923c01060bedafad4553cacc20" ON "balance_histories" ("userId") `);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "FK_923c01060bedafad4553cacc204" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
