import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  answerAttachmentsForAnswerLoader: DataLoader<string, T>;
  questionForAnswerLoader: DataLoader<string, T>;
}
