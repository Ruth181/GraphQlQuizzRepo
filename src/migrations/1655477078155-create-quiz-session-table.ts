import { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuizSessionTable1655477078155 implements MigrationInterface {
  name = 'createQuizSessionTable1655477078155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."QUIZ_SESSION_DETAIL_result_enum" AS ENUM('FAILED', 'CORRECT', 'SKIPPED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."TEST_TIME_DURATION_testtype_enum" AS ENUM('BALANCED_TEST', 'RANDOMIZED_TEST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "QUIZ_SESSION_DETAIL" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quizSessionId" uuid NOT NULL, "questionId" uuid NOT NULL, "result" "public"."QUIZ_SESSION_DETAIL_result_enum" NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fd6541bc69c5c062b311f2a5338" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "QUIZ_SESSION" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionKey" character varying(5) NOT NULL, "userId" uuid NOT NULL, "totalPointsObtained" double precision NOT NULL DEFAULT '0', "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32046e283106e5ca55ea80969bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TEST_TIME_DURATION" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "testType" "public"."TEST_TIME_DURATION_testtype_enum" NOT NULL, "noOfQuestions" integer NOT NULL DEFAULT '0', "durationInMinutes" integer, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f2ada64aa1388ccf206b72706d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION_DETAIL" ADD CONSTRAINT "FK_523a961c9f5df563d4248a049de" FOREIGN KEY ("quizSessionId") REFERENCES "QUIZ_SESSION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION_DETAIL" ADD CONSTRAINT "FK_aa78ef76e740f6a44bdc3d00612" FOREIGN KEY ("questionId") REFERENCES "QUESTION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" ADD CONSTRAINT "FK_9fb28598f2c4ff63cfadd8afe87" FOREIGN KEY ("userId") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION" DROP CONSTRAINT "FK_9fb28598f2c4ff63cfadd8afe87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION_DETAIL" DROP CONSTRAINT "FK_aa78ef76e740f6a44bdc3d00612"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUIZ_SESSION_DETAIL" DROP CONSTRAINT "FK_523a961c9f5df563d4248a049de"`,
    );
    await queryRunner.query(`DROP TABLE "TEST_TIME_DURATION"`);
    await queryRunner.query(`DROP TABLE "QUIZ_SESSION"`);
    await queryRunner.query(`DROP TABLE "QUIZ_SESSION_DETAIL"`);
    await queryRunner.query(
      `DROP TYPE "public"."QUIZ_SESSION_DETAIL_result_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."TEST_TIME_DURATION_testtype_enum"`,
    );
  }
}
