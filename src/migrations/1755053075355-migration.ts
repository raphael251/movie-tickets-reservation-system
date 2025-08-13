import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755053075355 implements MigrationInterface {
    name = 'Migration1755053075355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "deletedAt"`);
    }

}
