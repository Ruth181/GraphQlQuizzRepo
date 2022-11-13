import { Question } from '@entities/question.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const answerForQuestionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Question)
      .createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.answersForThisQuestion',
        'answersForThisQuestion',
      )
      .where('question.id IN (:...keys)', { keys })
      .getMany();
    const records = question.map(
      ({ answersForThisQuestion }) => answersForThisQuestion,
    );
    return [...records];
  });
};

export const questionAttachmentForQuestionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Question)
      .createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.attachmentsForThisQuestion',
        'attachmentsForThisQuestion',
      )
      .where('question.id IN (:...keys)', { keys })
      .getMany();
    const records = question.map(
      ({ attachmentsForThisQuestion }) => attachmentsForThisQuestion,
    );
    return [...records];
  });
};

export const questionCourseTopicForQuestionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Question)
      .createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.questionTopicRecordsForThisQuestion',
        'questionTopicRecordsForThisQuestion',
      )
      .where('question.id IN (:...keys)', { keys })
      .getMany();
    const records = question.map(
      ({ questionTopicRecordsForThisQuestion }) =>
        questionTopicRecordsForThisQuestion,
    );
    return [...records];
  });
};

export const quizSessionDetailsForQuestionLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const question = await getRepository(Question)
      .createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.quizSessionDetailsForThisQuestion',
        'quizSessionDetailsForThisQuestion',
      )
      .where('question.id IN (:...keys)', { keys })
      .getMany();
    const records = question.map(
      ({ quizSessionDetailsForThisQuestion }) =>
        quizSessionDetailsForThisQuestion,
    );
    return [...records];
  });
};
