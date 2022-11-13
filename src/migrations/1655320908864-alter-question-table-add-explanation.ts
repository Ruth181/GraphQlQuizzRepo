import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterQuestionTableAddExplanation1655320908864
  implements MigrationInterface
{
  name = 'alterQuestionTableAddExplanation1655320908864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "QUESTION" ADD "explanation" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "QUESTION" DROP COLUMN "explanation"`);
  }
}
