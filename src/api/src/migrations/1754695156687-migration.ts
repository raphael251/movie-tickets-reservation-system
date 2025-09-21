import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754695156687 implements MigrationInterface {
    name = 'Migration1754695156687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "theater" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c70874202894cfb1575a5b2b743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "theaterId" uuid NOT NULL, "rowLabel" character varying NOT NULL, "seatNumber" character varying NOT NULL, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_99f82a33ce29735dc5e35ba3f80" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_99f82a33ce29735dc5e35ba3f80"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TABLE "theater"`);
    }

}
