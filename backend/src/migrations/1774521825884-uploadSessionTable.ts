import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadSessionEntity1769000000000 implements MigrationInterface {
  name = "AddUploadSessionEntity1769000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = 'upload_session_entity_status_enum' AND n.nspname = 'public'
        ) THEN
          CREATE TYPE "public"."upload_session_entity_status_enum" AS ENUM('initiated', 'finalized', 'expired', 'failed');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "upload_session_entity" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "status" "public"."upload_session_entity_status_enum" NOT NULL DEFAULT 'initiated',
        "expiresAt" TIMESTAMP NOT NULL,
        "videoTempKey" character varying NOT NULL,
        "thumbnailTempKey" character varying NOT NULL,
        "videoFinalKey" character varying NOT NULL,
        "thumbnailFinalKey" character varying NOT NULL,
        "videoExpectedMimeType" character varying NOT NULL,
        "videoExpectedSize" bigint NOT NULL,
        "thumbnailExpectedMimeType" character varying NOT NULL,
        "thumbnailExpectedSize" bigint NOT NULL,
        "videoUploadedAt" TIMESTAMP,
        "thumbnailUploadedAt" TIMESTAMP,
        "finalizedAt" TIMESTAMP,
        "userId" integer,
        CONSTRAINT "PK_6f3bcf13a6ef2df5d8ed8f97a25" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_upload_session_status" ON "upload_session_entity" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_upload_session_expiresAt" ON "upload_session_entity" ("expiresAt")`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_upload_session_user') THEN
          ALTER TABLE "upload_session_entity"
          ADD CONSTRAINT "FK_upload_session_user"
          FOREIGN KEY ("userId") REFERENCES "user_entity"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload_session_entity" DROP CONSTRAINT IF EXISTS "FK_upload_session_user"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_upload_session_expiresAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_upload_session_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "upload_session_entity"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."upload_session_entity_status_enum"`);
  }
}
