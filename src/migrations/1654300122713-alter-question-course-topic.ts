import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterQuestionCourseTopic1654300122713
  implements MigrationInterface
{
  name = 'alterQuestionCourseTopic1654300122713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "QUESTION_COURSE_TOPIC" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "topicId" uuid NOT NULL, "courseId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d2d5aa0088bf9d6fac3a7cf7fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" ADD CONSTRAINT "FK_f57da0d26e467f132c237002925" FOREIGN KEY ("questionId") REFERENCES "QUESTION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" ADD CONSTRAINT "FK_e0205ae024099ab853e022cdb3e" FOREIGN KEY ("topicId") REFERENCES "TOPIC"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" ADD CONSTRAINT "FK_16e21a7d0f0325a3e164e0c517f" FOREIGN KEY ("courseId") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" DROP CONSTRAINT "FK_16e21a7d0f0325a3e164e0c517f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" DROP CONSTRAINT "FK_e0205ae024099ab853e022cdb3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_COURSE_TOPIC" DROP CONSTRAINT "FK_f57da0d26e467f132c237002925"`,
    );
    await queryRunner.query(`DROP TABLE "QUESTION_COURSE_TOPIC"`);
  }
}
