import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { Course } from '@entities/course.entity';
import { QuizSession } from '@entities/quiz-session.entity';

export const userForQuizSessionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const courseForQuizSessionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Course)
      .createQueryBuilder('course')
      .where('course.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const quizSessionDetailForQuizSessionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const quizSession = await getRepository(QuizSession)
      .createQueryBuilder('quizSession')
      .leftJoinAndSelect(
        'quizSession.detailsForThisQuizSession',
        'detailsForThisQuizSession',
      )
      .where('quizSession.id IN (:...keys)', { keys })
      .getMany();
    return quizSession.map(
      ({ detailsForThisQuizSession }) => detailsForThisQuizSession,
    );
  });
};

export const randomTestQuizRecordForQuizSessionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const quizSession = await getRepository(QuizSession)
      .createQueryBuilder('quizSession')
      .leftJoinAndSelect(
        'quizSession.randomTestsForThisQuizSession',
        'randomTestsForThisQuizSession',
      )
      .where('quizSession.id IN (:...keys)', { keys })
      .getMany();
    return quizSession.map(
      ({ randomTestsForThisQuizSession }) => randomTestsForThisQuizSession,
    );
  });
};
