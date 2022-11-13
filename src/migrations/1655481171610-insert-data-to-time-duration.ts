import { TestType } from '@utils/types/utils.types';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class insertDataToTimeDuration1655481171610
  implements MigrationInterface
{
  private timeDurations = [
    {
      testType: TestType.BALANCED_TEST,
      durationInMinutes: 30,
      noOfQuestions: 10,
    },
    {
      testType: TestType.RANDOMIZED_TEST,
      durationInMinutes: 30,
      noOfQuestions: 15,
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction().then(async () => {
      // Seeding database
      // Then try to start another one
      await queryRunner.startTransaction().then(async () => {
        await getRepository('TEST_TIME_DURATION').save(this.timeDurations);
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM TEST_TIME_DURATION;`);
  }
}
