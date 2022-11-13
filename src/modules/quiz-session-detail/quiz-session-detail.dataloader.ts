import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { Question } from '@entities/question.entity';
import { QuizSession } from '@entities/quiz-session.entity';

export const questionForQuizSessionDetailLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Question)
      .createQueryBuilder('question')
      .where('question.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const quizSessionForQuizSessionDetailLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(QuizSession)
      .createQueryBuilder('quizSession')
      .where('quizSession.id IN (:...keys)', { keys })
      .getMany();
  });
};
