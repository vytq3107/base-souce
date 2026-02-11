import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1770777250705 implements MigrationInterface {
  name = 'Init1770777250705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying(255), "avatar" text, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."roles_code_enum" AS ENUM('ADMIN', 'KTV')`);
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" "public"."roles_code_enum" NOT NULL, "name" character varying(255), CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "profile_id" uuid NOT NULL, "role_id" uuid NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."account_statuses_status_enum" AS ENUM('ONLINE', 'BUSY', 'OFFLINE')`);
    await queryRunner.query(`CREATE TYPE "public"."account_statuses_source_enum" AS ENUM('MANUAL', 'AUTO', 'SYSTEM')`);
    await queryRunner.query(
      `CREATE TABLE "account_statuses" ("account_id" uuid NOT NULL, "status" "public"."account_statuses_status_enum" NOT NULL DEFAULT 'OFFLINE', "source" "public"."account_statuses_source_enum" NOT NULL DEFAULT 'MANUAL', "last_active_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f0f173407ed0d4e677a250a17e9" PRIMARY KEY ("account_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "value" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "revoked_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_91fddbe23e927e1e525c152baa3" UNIQUE ("code"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "department_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "workspace_members" ("account_id" uuid NOT NULL, "workspace_id" uuid NOT NULL, CONSTRAINT "PK_766b6c7f852eae1239ae54bb286" PRIMARY KEY ("account_id", "workspace_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_d702676a1cf025265c9ccb39387" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "account_statuses" ADD CONSTRAINT "FK_f0f173407ed0d4e677a250a17e9" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_e7d078bbcae8ab94aa0d5f9015c" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "workspaces" ADD CONSTRAINT "FK_b6bc46368c2533feb979b69dcd5" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_b125fd7f5ee39220d2d49e6f9a7" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "workspace_members" ADD CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_4a7c584ddfe855379598b5e20fd"`);
    await queryRunner.query(`ALTER TABLE "workspace_members" DROP CONSTRAINT "FK_b125fd7f5ee39220d2d49e6f9a7"`);
    await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_b6bc46368c2533feb979b69dcd5"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_e7d078bbcae8ab94aa0d5f9015c"`);
    await queryRunner.query(`ALTER TABLE "account_statuses" DROP CONSTRAINT "FK_f0f173407ed0d4e677a250a17e9"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_d702676a1cf025265c9ccb39387"`);
    await queryRunner.query(`DROP TABLE "workspace_members"`);
    await queryRunner.query(`DROP TABLE "workspaces"`);
    await queryRunner.query(`DROP TABLE "departments"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "account_statuses"`);
    await queryRunner.query(`DROP TYPE "public"."account_statuses_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_statuses_status_enum"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_code_enum"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
  }
}
