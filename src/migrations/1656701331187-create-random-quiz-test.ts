import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRandomQuizTest1656701331187 implements MigrationInterface {
  name = 'createRandomQuizTest1656701331187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "RANDOM_TEST_TOPIC" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topicId" uuid NOT NULL, "randomTestId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94a5c40ab335b407e6addd56f26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RANDOM_TEST" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid NOT NULL, "noOfQuestions" integer NOT NULL DEFAULT '0', "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a20fdbecad852ea3bf8a98e6a5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RANDOM_TEST_QUIZ_RECORD" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "quizSessionId" uuid NOT NULL, "randomTestId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f37e20ef87117f62d11f54b42aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_TOPIC" ADD CONSTRAINT "FK_e6a2fac7b39b55def11c8e48c93" FOREIGN KEY ("topicId") REFERENCES "TOPIC"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_TOPIC" ADD CONSTRAINT "FK_d3b12e3f4ab8b013c6f0ed976ff" FOREIGN KEY ("randomTestId") REFERENCES "RANDOM_TEST"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST" ADD CONSTRAINT "FK_250dffcb8db482bb7a4243cae92" FOREIGN KEY ("courseId") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" ADD CONSTRAINT "FK_51ba379a9f90c9cf7c82036961c" FOREIGN KEY ("userId") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" ADD CONSTRAINT "FK_d800306d3ace058ee1e64bf52e1" FOREIGN KEY ("quizSessionId") REFERENCES "QUIZ_SESSION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" ADD CONSTRAINT "FK_f78e775de77ef0e0fa365b72237" FOREIGN KEY ("randomTestId") REFERENCES "RANDOM_TEST"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ANSWER_ATTACHMENT" ADD CONSTRAINT "FK_7cfea7792c16e8a9305e7724c04" FOREIGN KEY ("answerId") REFERENCES "ANSWER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ANSWER_ATTACHMENT" DROP CONSTRAINT "FK_7cfea7792c16e8a9305e7724c04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" DROP CONSTRAINT "FK_f78e775de77ef0e0fa365b72237"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" DROP CONSTRAINT "FK_d800306d3ace058ee1e64bf52e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_QUIZ_RECORD" DROP CONSTRAINT "FK_51ba379a9f90c9cf7c82036961c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST" DROP CONSTRAINT "FK_250dffcb8db482bb7a4243cae92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_TOPIC" DROP CONSTRAINT "FK_d3b12e3f4ab8b013c6f0ed976ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RANDOM_TEST_TOPIC" DROP CONSTRAINT "FK_e6a2fac7b39b55def11c8e48c93"`,
    );
    await queryRunner.query(`DROP TABLE "RANDOM_TEST_QUIZ_RECORD"`);
    await queryRunner.query(`DROP TABLE "RANDOM_TEST"`);
    await queryRunner.query(`DROP TABLE "RANDOM_TEST_TOPIC"`);
  }
}
