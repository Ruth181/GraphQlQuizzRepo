import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  usersForDepartmentLoader: DataLoader<string, T>;
  coursesForDepartmentLoaders: DataLoader<string, T>;
}
