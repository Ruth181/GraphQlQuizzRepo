import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { Course } from '@entities/course.entity';
import { Topic } from '@entities/topic.entity';

export const courseForTopicLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Course)
      .createQueryBuilder('course')
      .where('course.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const questionCourseTopicRecordForTopicLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Topic)
      .createQueryBuilder('topic')
      .leftJoinAndSelect(
        'topic.questionTopicRecordsForThisTopic',
        'questionTopicRecordsForThisTopic',
      )
      .where('topic.id IN (:...keys)', { keys })
      .getMany();
    return question.map(
      ({ questionTopicRecordsForThisTopic }) =>
        questionTopicRecordsForThisTopic,
    );
  });

export const randomTestTopicsRecordForTopicLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Topic)
      .createQueryBuilder('topic')
      .leftJoinAndSelect(
        'topic.randomTestTopicsForThisTopic',
        'randomTestTopicsForThisTopic',
      )
      .where('topic.id IN (:...keys)', { keys })
      .getMany();
    return question.map(
      ({ randomTestTopicsForThisTopic }) => randomTestTopicsForThisTopic,
    );
  });
