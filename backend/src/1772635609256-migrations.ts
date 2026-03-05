import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1772635609256 implements MigrationInterface {
    name = 'Migrations1772635609256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_entity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD "description" character varying(1000) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_entity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD "description" character varying NOT NULL`);
    }

}
