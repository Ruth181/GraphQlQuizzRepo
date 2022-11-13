import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterQuizSessionTable1655481171710 implements MigrationInterface {
  name = 'alterQuizSessionTable1655481171710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."QUIZ_SESSION_testtype_enum" AS ENUM('BALANCED_TEST', 'RANDOMIZED_TEST')`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" ADD "testType" "public"."QUIZ_SESSION_testtype_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" DROP COLUMN "testType"`,
    );
    await queryRunner.query(`DROP TYPE "public"."QUIZ_SESSION_testtype_enum"`);
  }
}
