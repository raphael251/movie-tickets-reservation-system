import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754846882094 implements MigrationInterface {
    name = 'Migration1754846882094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "screeningId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "seatCode"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "screeningSeatId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0" FOREIGN KEY ("screeningSeatId") REFERENCES "screeningSeat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "screeningSeatId"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "expiresAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "seatCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "screeningId" character varying NOT NULL`);
    }

}
