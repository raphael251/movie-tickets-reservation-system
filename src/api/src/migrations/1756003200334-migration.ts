import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756003200334 implements MigrationInterface {
    name = 'Migration1756003200334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "createdAt"`);
    }

}
