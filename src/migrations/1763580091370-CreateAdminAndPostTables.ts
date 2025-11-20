import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminAndPostTables1763580091370 implements MigrationInterface {
    name = 'CreateAdminAndPostTables1763580091370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admins_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR')`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "profilePicture" character varying, "role" "public"."admins_role_enum" NOT NULL DEFAULT 'ADMIN', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_795ea37789f68b3176d024d8f1" ON "admins" ("role") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "body" text NOT NULL, "description" character varying(500), "imageUrl" character varying, "slug" character varying(255) NOT NULL, "status" "public"."posts_status_enum" NOT NULL DEFAULT 'DRAFT', "isPublic" boolean NOT NULL DEFAULT false, "readTime" integer, "authorId" uuid NOT NULL, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_54ddf9075260407dcfdd724857" ON "posts" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_46bc204f43827b6f25e0133dbf" ON "posts" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_5b16a708acb357dd119d40cc45" ON "posts" ("publishedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_21dc9c0e307ba9397098ec138c" ON "posts" ("isPublic") `);
        await queryRunner.query(`CREATE INDEX "IDX_a69d9e2ae78ef7d100f8317ae0" ON "posts" ("status") `);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a69d9e2ae78ef7d100f8317ae0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21dc9c0e307ba9397098ec138c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b16a708acb357dd119d40cc45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46bc204f43827b6f25e0133dbf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54ddf9075260407dcfdd724857"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5a322ad12a7bf95460c958e80"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_795ea37789f68b3176d024d8f1"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TYPE "public"."admins_role_enum"`);
    }

}
