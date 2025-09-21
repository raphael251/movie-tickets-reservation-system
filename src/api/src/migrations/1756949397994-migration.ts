import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756949397994 implements MigrationInterface {
    name = 'Migration1756949397994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "UQ_825611e3ea7b9d8c66de16ddac0"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_reserved_seat" ON "reservation" ("screeningSeatId") WHERE status = 'CONFIRMED'`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0" FOREIGN KEY ("screeningSeatId") REFERENCES "screeningSeat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0"`);
        await queryRunner.query(`DROP INDEX "public"."unique_reserved_seat"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "UQ_825611e3ea7b9d8c66de16ddac0" UNIQUE ("screeningSeatId")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_825611e3ea7b9d8c66de16ddac0" FOREIGN KEY ("screeningSeatId") REFERENCES "screeningSeat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
