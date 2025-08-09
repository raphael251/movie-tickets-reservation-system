import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754750850053 implements MigrationInterface {
    name = 'Migration1754750850053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screening" RENAME COLUMN "room" TO "theaterId"`);
        await queryRunner.query(`CREATE TYPE "public"."screeningSeat_status_enum" AS ENUM('AVAILABLE', 'PENDING', 'RESERVED')`);
        await queryRunner.query(`CREATE TABLE "screeningSeat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "screeningId" uuid NOT NULL, "rowLabel" character varying NOT NULL, "seatNumber" character varying NOT NULL, "status" "public"."screeningSeat_status_enum" NOT NULL DEFAULT 'AVAILABLE', CONSTRAINT "PK_054bd8b7861183d5ef6554ac366" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "theaterId"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "theaterId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_bda8523916fec884d0b4ddc6065" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screeningSeat" ADD CONSTRAINT "FK_89e26e93490f8dc8c862e5611c2" FOREIGN KEY ("screeningId") REFERENCES "screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screeningSeat" DROP CONSTRAINT "FK_89e26e93490f8dc8c862e5611c2"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_bda8523916fec884d0b4ddc6065"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "theaterId"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "theaterId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "screeningSeat"`);
        await queryRunner.query(`DROP TYPE "public"."screeningSeat_status_enum"`);
        await queryRunner.query(`ALTER TABLE "screening" RENAME COLUMN "theaterId" TO "room"`);
    }

}
