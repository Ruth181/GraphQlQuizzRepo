import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  courseForTopicLoader: DataLoader<string, T>;
  randomTestTopicsRecordForTopicLoader: DataLoader<string, T>;
  questionTopicRecordForTopicLoader: DataLoader<string, T>;
}
