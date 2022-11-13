import { Answer } from '@entities/answer.entity';
import { Question } from '@entities/question.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const answerAttachmentForAnswerLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const answer = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect(
        'answer.attachmentsForThisAnswer',
        'attachmentsForThisAnswer',
      )
      .where('answer.id IN (:...keys)', { keys })
      .getMany();
    return answer.map(
      ({ attachmentsForThisAnswer }) => attachmentsForThisAnswer,
    );
  });
};

// export const questionForAnswerLoader = () => {
//   return new Dataloader(async (keys: string[]) => {
//     console.log({ questions: keys });
//     const asyncData = keys.map((key) =>
//       getRepository(Answer)
//         .createQueryBuilder('answer')
//         .leftJoinAndSelect(Question, 'answer.question', 'question')
//         .where('answer.questionId =:key', { key })
//         .getOne(),
//     );
//     const answer = await Promise.all(asyncData);
//     return answer.map(({ question }) => question);
//   });
// };
// export const questionForAnswerLoader = () => {
//   return new Dataloader(async (keys: string[]) => {
//     const answer = await getRepository(Answer)
//       .createQueryBuilder('answer')
//       .leftJoinAndSelect('answer.question', 'question')
//       .where('answer.questionId IN (:...keys)', { keys })
//       .getMany();
//     return answer.map(({ question }) => question);
//   });
// };

export const questionForAnswerLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Question)
      .createQueryBuilder('question')
      .where('question.id IN (:...keys)', { keys })
      .getMany();
  });
};
