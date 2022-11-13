import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  userForQuizSessionLoader: DataLoader<string, T>;
  quizSessionDetailForQuizSessionLoader: DataLoader<string, T>;
  randomTestQuizRecordForQuizSessionLoader: DataLoader<string, T>;
  courseForQuizSessionLoader: DataLoader<string, T>;
}
