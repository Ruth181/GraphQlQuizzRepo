import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDepartmentQuestionTables1653916972322
  implements MigrationInterface
{
  name = 'createDepartmentQuestionTables1653916972322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ANSWER_ATTACHMENT" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answerId" uuid NOT NULL, "link" text NOT NULL, "fileType" character varying NOT NULL DEFAULT 'IMAGE', "stringPosition" integer, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4eb59209c6d745fef5ed3e1f7ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ANSWER" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "questionId" uuid NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de56886a3f6a0d009da60c1ae12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "DEPARTMENT" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe139b89560aff805690de35978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "COURSE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "departmentId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dcd712a4d39dcfd9d46ca0ae11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TOPIC" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" boolean NOT NULL DEFAULT true, "courseId" uuid NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b52d5b55b8b1613dd19e043bdf5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "QUESTION_TOPIC" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "topicId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0cf13de44dd9c405bc5a3aa131" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "QUESTION" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "isSingleChoiceAnswer" boolean NOT NULL DEFAULT true, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d739fc7b277deccf0f8008757b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "QUESTION_ATTACHMENT" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link" text NOT NULL, "fileType" character varying NOT NULL DEFAULT 'IMAGE', "stringPosition" integer, "questionId" uuid NOT NULL, "status" boolean NOT NULL DEFAULT true, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_914d9bc5de77edf01333f4006cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ANSWER" ADD CONSTRAINT "FK_240fd56c4c1d7928546be2ddf80" FOREIGN KEY ("questionId") REFERENCES "QUESTION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "COURSE" ADD CONSTRAINT "FK_3e8e07b561d69a40b898c83f21f" FOREIGN KEY ("departmentId") REFERENCES "DEPARTMENT"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TOPIC" ADD CONSTRAINT "FK_c9373ae21ee9ded6f63adc29da0" FOREIGN KEY ("courseId") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_TOPIC" ADD CONSTRAINT "FK_f796ca0c740e4bbd01f6575ecf0" FOREIGN KEY ("questionId") REFERENCES "QUESTION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_TOPIC" ADD CONSTRAINT "FK_d4a8466ff2435b59dfd0f575b73" FOREIGN KEY ("topicId") REFERENCES "TOPIC"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_ATTACHMENT" ADD CONSTRAINT "FK_3d67c16b0371fc0a783018b226c" FOREIGN KEY ("questionId") REFERENCES "QUESTION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QUESTION_ATTACHMENT" DROP CONSTRAINT "FK_3d67c16b0371fc0a783018b226c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_TOPIC" DROP CONSTRAINT "FK_d4a8466ff2435b59dfd0f575b73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QUESTION_TOPIC" DROP CONSTRAINT "FK_f796ca0c740e4bbd01f6575ecf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TOPIC" DROP CONSTRAINT "FK_c9373ae21ee9ded6f63adc29da0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "COURSE" DROP CONSTRAINT "FK_3e8e07b561d69a40b898c83f21f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ANSWER" DROP CONSTRAINT "FK_240fd56c4c1d7928546be2ddf80"`,
    );
    await queryRunner.query(`DROP TABLE "QUESTION_ATTACHMENT"`);
    await queryRunner.query(`DROP TABLE "QUESTION"`);
    await queryRunner.query(`DROP TABLE "QUESTION_TOPIC"`);
    await queryRunner.query(`DROP TABLE "TOPIC"`);
    await queryRunner.query(`DROP TABLE "COURSE"`);
    await queryRunner.query(`DROP TABLE "DEPARTMENT"`);
    await queryRunner.query(`DROP TABLE "ANSWER"`);
    await queryRunner.query(`DROP TABLE "ANSWER_ATTACHMENT"`);
  }
}
