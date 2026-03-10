import { MigrationInterface, QueryRunner } from "typeorm";
import { USER_ROLE } from "../lib/types/common/enums";
import {
  userRolesSeed,
  adminUserSeed,
  videoCategoriesSeed,
} from "../seed/data";

export class SeedDatabase1768480159350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert user roles
    for (const role of userRolesSeed) {
      await queryRunner.query(
        `
            INSERT INTO "user_roles_entity" ("name", "description","createdAt", "updatedAt")
            VALUES ($1, $2, NOW(), NOW())
            ON CONFLICT DO NOTHING
            `,
        [role.name, role.description],
      );
    }

    // Get the admin role id
    const adminRoleResult = await queryRunner.query(
      `
            SELECT id FROM "user_roles_entity" WHERE name = $1
        `,
      [USER_ROLE.ADMIN],
    );

    const adminRoleId = adminRoleResult[0]?.id;

    if (adminRoleId) {
      // Insert admin user
      await queryRunner.query(
        `
                INSERT INTO "user_entity" ("email", "username", "password", "roleId", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                ON CONFLICT (email) DO NOTHING
            `,
        [
          adminUserSeed.email,
          adminUserSeed.username,
          adminUserSeed.password,
          adminRoleId,
        ],
      );
    }

    // Insert video categories
    for (const category of videoCategoriesSeed) {
      await queryRunner.query(
        `
            INSERT INTO "category_entity" ("name", "description", "createdAt", "updatedAt")
            VALUES ($1, $2, NOW(), NOW())
            ON CONFLICT (name) DO NOTHING
        `,
        [category.name, category.description],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete video categories
    for (const category of videoCategoriesSeed) {
      await queryRunner.query(
        `
            DELETE FROM "category_entity" WHERE name = $1
        `,
        [category.name],
      );
    }
    // Delete admin user
    await queryRunner.query(
      `
            DELETE FROM "user_entity" WHERE email = $1
        `,
      [adminUserSeed.email],
    );

    // Delete user roles
    for (const role of userRolesSeed) {
      await queryRunner.query(
        `
                DELETE FROM "user_roles_entity" WHERE name = $1
            `,
        [role.name],
      );
    }
  }
}
