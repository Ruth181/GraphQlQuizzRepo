import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  courseForRandomTestLoader: DataLoader<string, T>;
  randomTestTopicForRandomTestLoader: DataLoader<string, T>;
  randomTestQuizRecordForRandomTestLoader: DataLoader<string, T>;
}
