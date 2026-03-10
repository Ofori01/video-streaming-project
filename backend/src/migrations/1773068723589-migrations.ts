import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1773068723589 implements MigrationInterface {
  name = "Migrations1773068723589";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "videoId" integer NOT NULL, "createdById" integer NOT NULL, "parentId" integer, CONSTRAINT "PK_5a439a16c76d63e046765cdb84f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_7f04e30e6b47e3d95a48883f08c" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_140d931d8b1d92fe1950f46b759" FOREIGN KEY ("createdById") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_94d540d1210eb47d8c42048365e" FOREIGN KEY ("parentId") REFERENCES "comment_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_94d540d1210eb47d8c42048365e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_140d931d8b1d92fe1950f46b759"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_7f04e30e6b47e3d95a48883f08c"`,
    );
    await queryRunner.query(`DROP TABLE "comment_entity"`);
  }
}
