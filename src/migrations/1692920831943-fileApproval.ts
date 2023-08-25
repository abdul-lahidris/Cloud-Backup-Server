import { MigrationInterface, QueryRunner } from "typeorm";

export class fileApproval1692920831943 implements MigrationInterface {
    name = 'fileApproval1692920831943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_approval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fileId" character varying NOT NULL, "userId" uuid NOT NULL, "approvalNumber" integer NOT NULL, CONSTRAINT "PK_2d0f1905156fbea9eef90e9f270" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "userFiles" ADD "deleteApprovalCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "file_approval" ADD CONSTRAINT "FK_02465205fc7d1c54151bacb33d3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_approval" DROP CONSTRAINT "FK_02465205fc7d1c54151bacb33d3"`);
        await queryRunner.query(`ALTER TABLE "userFiles" DROP COLUMN "deleteApprovalCount"`);
        await queryRunner.query(`DROP TABLE "file_approval"`);
    }

}
