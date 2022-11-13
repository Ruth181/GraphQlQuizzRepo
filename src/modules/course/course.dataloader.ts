import { Course } from '@entities/course.entity';
import { Department } from '@entities/department.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const departmentForCourseLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Department)
      .createQueryBuilder('department')
      .where('department.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const topicForCourseLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const course = await getRepository(Course)
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.topicsUnderThisCourse',
        'topicsUnderThisCourse',
      )
      .where('course.id IN (:...keys)', { keys })
      .getMany();
    return course.map((course) => course.topicsUnderThisCourse);
  });
};

export const questionTopicForCourseLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const course = await getRepository(Course)
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.questionTopicRecordsForThisCourse',
        'questionTopicRecordsForThisCourse',
      )
      .where('course.id IN (:...keys)', { keys })
      .getMany();
    return course.map((course) => course.questionTopicRecordsForThisCourse);
  });
};

export const quizSessionsForCourseLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const course = await getRepository(Course)
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.quizSessionsUnderThisCourse',
        'quizSessionsUnderThisCourse',
      )
      .where('course.id IN (:...keys)', { keys })
      .getMany();
    return course.map(
      ({ quizSessionsUnderThisCourse }) => quizSessionsUnderThisCourse,
    );
  });
};

export const randomTestsForCourseLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const course = await getRepository(Course)
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.randomTestsUnderThisCourse',
        'randomTestsUnderThisCourse',
      )
      .where('course.id IN (:...keys)', { keys })
      .getMany();
    return course.map(
      ({ randomTestsUnderThisCourse }) => randomTestsUnderThisCourse,
    );
  });
};
