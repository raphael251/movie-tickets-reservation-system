import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755387848102 implements MigrationInterface {
    name = 'Migration1755387848102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "createdAt"`);
    }

}
