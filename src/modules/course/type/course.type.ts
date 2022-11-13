import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  departmentForCourseLoader: DataLoader<string, T>;
  questionCourseTopicForCourseLoader: DataLoader<string, T>;
  topicsForCourseLoader: DataLoader<string, T>;
  randomTestsForCourseLoader: DataLoader<string, T>;
  quizSessionsForCourseLoader: DataLoader<string, T>;
}
