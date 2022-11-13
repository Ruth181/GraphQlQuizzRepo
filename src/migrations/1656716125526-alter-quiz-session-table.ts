import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterQuizSessionTable1656716125526 implements MigrationInterface {
  name = 'alterQuizSessionTable1656716125526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "QUIZ_SESSION" ADD "courseId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" ADD CONSTRAINT "FK_da55d8309497bb4f7a3d4c816cc" FOREIGN KEY ("courseId") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" DROP CONSTRAINT "FK_da55d8309497bb4f7a3d4c816cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" DROP COLUMN "courseId"`,
    );
  }
}
