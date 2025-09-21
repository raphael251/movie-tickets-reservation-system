import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754960407965 implements MigrationInterface {
    name = 'Migration1754960407965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "movieId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_a84042bef1152d9dbdb1446c811" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_a84042bef1152d9dbdb1446c811"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}
