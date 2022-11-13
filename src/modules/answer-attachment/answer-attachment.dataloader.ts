import { AnswerAttachment } from '@entities/answer-attachment.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

// export const answerForAnswerAttachmentLoader = () => {
//   return new Dataloader(async (keys: string[]) => {
//     const asyncData = keys.map((key) =>
//       getRepository(AnswerAttachment)
//         .createQueryBuilder('answerAttachment')
//         .leftJoinAndSelect('answerAttachment.answer', 'answer')
//         .where('answerAttachment.answerId =:key', { key })
//         .getOne(),
//     );
//     const answerAttachment = await Promise.all(asyncData);
//     return answerAttachment.map(({ answer }) => answer);
//   });
// };
export const answerForAnswerAttachmentLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const answerAttachment = await getRepository(AnswerAttachment)
      .createQueryBuilder('answerAttachment')
      .leftJoinAndSelect('answerAttachment.answer', 'answer')
      .where('answerAttachment.answerId IN (:...keys)', { keys })
      .getMany();
    return answerAttachment.map(({ answer }) => answer);
  });
};
