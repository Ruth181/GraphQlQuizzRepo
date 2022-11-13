import { QuizSession } from '@entities/quiz-session.entity';
import { RandomTest } from '@entities/random-test.entity';
import { User } from '@entities/user.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const randomTestRandomTestQuizRecordLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(RandomTest)
      .createQueryBuilder('randomTest')
      .where('randomTest.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const userForRandomTestQuizRecordLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const quizSessionForRandomTestQuizRecordLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(QuizSession)
      .createQueryBuilder('quizSession')
      .where('quizSession.id IN (:...keys)', { keys })
      .getMany();
  });
};
