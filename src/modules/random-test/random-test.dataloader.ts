import * as Dataloader from 'dataloader';
import { Course } from '@entities/course.entity';
import { RandomTest } from '@entities/random-test.entity';
import { getRepository } from 'typeorm';

export const randomTestTopicForRandomTestLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const randomTest = await getRepository(RandomTest)
      .createQueryBuilder('randomTest')
      .leftJoinAndSelect(
        'randomTest.topicsUnderThisRandomTest',
        'topicsUnderThisRandomTest',
      )
      .where('randomTest.id IN (:...keys)', { keys })
      .getMany();
    return randomTest.map(
      ({ topicsUnderThisRandomTest }) => topicsUnderThisRandomTest,
    );
  });

export const randomTestQuizRecordForRandomTestLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const randomTest = await getRepository(RandomTest)
      .createQueryBuilder('randomTest')
      .leftJoinAndSelect(
        'randomTest.testRecordsForThisRandomTest',
        'testRecordsForThisRandomTest',
      )
      .where('randomTest.id IN (:...keys)', { keys })
      .getMany();
    return randomTest.map(
      ({ testRecordsForThisRandomTest }) => testRecordsForThisRandomTest,
    );
  });

export const courseForRandomTestLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Course)
      .createQueryBuilder('course')
      .where('course.id IN (:...keys)', { keys })
      .getMany();
  });
};
