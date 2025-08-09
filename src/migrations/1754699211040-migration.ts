import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754699211040 implements MigrationInterface {
  name = 'Migration1754699211040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "screening" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "category" character varying NOT NULL, "room" character varying NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, CONSTRAINT "PK_5111bc526c9133721aeffb9a578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`ALTER TABLE "reservation" RENAME COLUMN "movieId" TO "screeningId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "screening"`);
    await queryRunner.query(`ALTER TABLE "reservation" RENAME COLUMN "screeningId" TO "movieId"`);
  }
}
