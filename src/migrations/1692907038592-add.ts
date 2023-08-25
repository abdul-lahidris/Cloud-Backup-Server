import { MigrationInterface, QueryRunner } from "typeorm";

export class add1692907038592 implements MigrationInterface {
    name = 'add1692907038592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d"`);
        await queryRunner.query(`ALTER TABLE "file_history" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file_history" ADD CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d"`);
        await queryRunner.query(`ALTER TABLE "file_history" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file_history" ADD CONSTRAINT "FK_91e2cfd61ce4217c4f267f6314d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
