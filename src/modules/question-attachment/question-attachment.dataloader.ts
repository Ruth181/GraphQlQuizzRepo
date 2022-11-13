import { Question } from '@entities/question.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const questionForQuestionAttachmentLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Question)
      .createQueryBuilder('question')
      .where('question.id IN (:...keys)', { keys })
      .getMany();
  });
};
