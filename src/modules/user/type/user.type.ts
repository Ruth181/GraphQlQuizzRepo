import * as DataLoader from 'dataloader';
import { BaseMyContext } from '@utils/types/utils.types';

export interface MyContext<T> extends BaseMyContext {
  departmentForUserLoader: DataLoader<string, T>;
  quizSessionsForUserLoader: DataLoader<string, T>;
  randomTestQuizRecordForUserLoader: DataLoader<string, T>;
}
