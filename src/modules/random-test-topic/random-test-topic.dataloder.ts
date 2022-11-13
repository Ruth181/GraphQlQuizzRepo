import { RandomTest } from '@entities/random-test.entity';
import { Topic } from '@entities/topic.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const topicForRandomTestTopicLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Topic)
      .createQueryBuilder('topic')
      .where('topic.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const randomTestForRandomTestTopicLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(RandomTest)
      .createQueryBuilder('randomTest')
      .where('randomTest.id IN (:...keys)', { keys })
      .getMany();
  });
};
