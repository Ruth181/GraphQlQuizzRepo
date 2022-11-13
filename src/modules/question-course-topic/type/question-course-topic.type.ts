import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  questionForQCTLoader: DataLoader<string, T>;
  topicForQCTLoader: DataLoader<string, T>;
  courseForQCTLoader: DataLoader<string, T>;
}
