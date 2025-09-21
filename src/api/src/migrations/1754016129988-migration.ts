import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754016129988 implements MigrationInterface {
    name = 'Migration1754016129988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "movieId" character varying NOT NULL, "seatCode" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reservation"`);
    }

}
