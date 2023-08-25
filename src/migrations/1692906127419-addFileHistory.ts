import { MigrationInterface, QueryRunner } from "typeorm";

export class addFileHistory1692906127419 implements MigrationInterface {
    name = 'addFileHistory1692906127419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_history_actiontype_enum" AS ENUM('upload', 'rename', 'copy', 'move', 'delete', 'marked_unsafe')`);
        await queryRunner.query(`CREATE TABLE "file_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fileId" character varying NOT NULL, "actionType" "public"."file_history_actiontype_enum" NOT NULL, "remark" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_0deb31e450cde5a323d8af4aa3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "userFiles" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "file_history" ADD CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d"`);
        await queryRunner.query(`ALTER TABLE "userFiles" DROP COLUMN "deleted"`);
        await queryRunner.query(`DROP TABLE "file_history"`);
        await queryRunner.query(`DROP TYPE "public"."file_history_actiontype_enum"`);
    }

}
