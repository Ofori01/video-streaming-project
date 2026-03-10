import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeDatabase1768480119266 implements MigrationInterface {
    name = 'InitializeDatabase1768480119266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_entity_type_enum" AS ENUM('thumbnail', 'video', 'profilePicture')`);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying NOT NULL, "type" "public"."file_entity_type_enum" NOT NULL, CONSTRAINT "PK_d8375e0b2592310864d2b4974b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "description" character varying(100) NOT NULL, CONSTRAINT "UQ_ecbe8ebc20a3c7cd594d8e445e1" UNIQUE ("name"), CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_entity_name_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user_roles_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."user_roles_entity_name_enum" NOT NULL DEFAULT 'user', "description" character varying(150) NOT NULL, CONSTRAINT "PK_ea622cfb33ae2afc4505f972936" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(10) NOT NULL, "email" character varying, "password" character varying NOT NULL, "roleId" integer, "profilePictureUrlId" integer, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "REL_8345e56131c1da3612c45ee0c9" UNIQUE ("profilePictureUrlId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "duration" double precision, "processingError" character varying, "status" character varying NOT NULL DEFAULT 'archived', "processingStatus" character varying NOT NULL DEFAULT 'pending', "thumbnailId" integer, "videoId" integer, "categoryId" integer, "uploadedById" integer, CONSTRAINT "PK_a86a8f20977e8900f5f6dc4add6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "otp" integer NOT NULL, "userEmail" character varying NOT NULL, "expiresIn" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a4c814055f51a286ef1e7f1b78d" UNIQUE ("otp"), CONSTRAINT "PK_af69f5d9d41ea2100820431b72e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a4c814055f51a286ef1e7f1b78" ON "otp_entity" ("otp") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f71bfdad13c5737f063addee4" ON "otp_entity" ("userEmail") `);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2" FOREIGN KEY ("roleId") REFERENCES "user_roles_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_8345e56131c1da3612c45ee0c9a" FOREIGN KEY ("profilePictureUrlId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD CONSTRAINT "FK_4ac6640a515c17d0cc161527ecd" FOREIGN KEY ("thumbnailId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD CONSTRAINT "FK_2d697a6f0447819c58fadcd7ca9" FOREIGN KEY ("videoId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD CONSTRAINT "FK_24a3c03165fbc1ab2c7211b9238" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD CONSTRAINT "FK_3497af17ec8141f5a3b30a10a00" FOREIGN KEY ("uploadedById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_entity" DROP CONSTRAINT "FK_3497af17ec8141f5a3b30a10a00"`);
        await queryRunner.query(`ALTER TABLE "video_entity" DROP CONSTRAINT "FK_24a3c03165fbc1ab2c7211b9238"`);
        await queryRunner.query(`ALTER TABLE "video_entity" DROP CONSTRAINT "FK_2d697a6f0447819c58fadcd7ca9"`);
        await queryRunner.query(`ALTER TABLE "video_entity" DROP CONSTRAINT "FK_4ac6640a515c17d0cc161527ecd"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_8345e56131c1da3612c45ee0c9a"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f71bfdad13c5737f063addee4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4c814055f51a286ef1e7f1b78"`);
        await queryRunner.query(`DROP TABLE "otp_entity"`);
        await queryRunner.query(`DROP TABLE "video_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "user_roles_entity"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_entity_name_enum"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`DROP TYPE "public"."file_entity_type_enum"`);
    }

}
