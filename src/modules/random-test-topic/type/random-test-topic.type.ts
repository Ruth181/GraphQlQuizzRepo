import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  topicForRandomTestTopicLoader: DataLoader<string, T>;
  randomTestForRandomTestTopicLoader: DataLoader<string, T>;
}
