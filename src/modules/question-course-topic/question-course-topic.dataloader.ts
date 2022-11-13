import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { Topic } from '@entities/topic.entity';
import { Question } from '@entities/question.entity';
import { Course } from '@entities/course.entity';

export const topicForQCTLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Topic)
      .createQueryBuilder('topic')
      .where('topic.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const CourseForQCTLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Course)
      .createQueryBuilder('course')
      .where('course.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const questionForQCTLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Question)
      .createQueryBuilder('question')
      .where('question.id IN (:...keys)', { keys })
      .getMany();
  });
};
