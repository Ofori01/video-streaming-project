import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1772635609256 implements MigrationInterface {
  name = "Migrations1772635609256";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "description" TYPE character varying(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "description" TYPE character varying`,
    );
  }
}
