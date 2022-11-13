import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserTableAddDepartmentId1655302963829
  implements MigrationInterface
{
  name = 'alterUserTableAddDepartmentId1655302963829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USER" ADD "departmentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "USER" ADD CONSTRAINT "FK_4665ad0c2c2f8bc90433ffd9d8c" FOREIGN KEY ("departmentId") REFERENCES "DEPARTMENT"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USER" DROP CONSTRAINT "FK_4665ad0c2c2f8bc90433ffd9d8c"`,
    );
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "departmentId"`);
  }
}
