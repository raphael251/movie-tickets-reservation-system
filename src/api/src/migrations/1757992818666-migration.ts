import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1757992818666 implements MigrationInterface {
  name = 'Migration1757992818666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."outbox_event_enum" AS ENUM('USER_CREATED')`);
    await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('PENDING', 'SENT')`);
    await queryRunner.query(
      `CREATE TABLE "outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event" "public"."outbox_event_enum" NOT NULL, "payload" character varying NOT NULL, "status" "public"."outbox_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "outbox"`);
    await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."outbox_event_enum"`);
  }
}
