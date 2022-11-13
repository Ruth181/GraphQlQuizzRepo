import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  randomTestRandomTestQuizRecordLoader: DataLoader<string, T>;
  userForRandomTestQuizRecordLoader: DataLoader<string, T>;
  quizSessionForRandomTestQuizRecordLoader: DataLoader<string, T>;
}
