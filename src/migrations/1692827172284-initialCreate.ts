import { MigrationInterface, QueryRunner } from "typeorm";

export class initialCreate1692827172284 implements MigrationInterface {
    name = 'initialCreate1692827172284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userFiles" ADD "isUnsafe" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userFiles" DROP CONSTRAINT "FK_389108e51b44d8355830ef8f497"`);
        await queryRunner.query(`ALTER TABLE "userFiles" ALTER COLUMN "folderId" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "file_name_index" ON "userFiles" ("name") `);
        await queryRunner.query(`ALTER TABLE "userFiles" ADD CONSTRAINT "FK_389108e51b44d8355830ef8f497" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userFiles" DROP CONSTRAINT "FK_389108e51b44d8355830ef8f497"`);
        await queryRunner.query(`DROP INDEX "public"."file_name_index"`);
        await queryRunner.query(`ALTER TABLE "userFiles" ALTER COLUMN "folderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userFiles" ADD CONSTRAINT "FK_389108e51b44d8355830ef8f497" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userFiles" DROP COLUMN "isUnsafe"`);
    }

}
