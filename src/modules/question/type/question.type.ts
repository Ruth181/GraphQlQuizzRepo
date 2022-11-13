import { BaseMyContext } from '@utils/types/utils.types';
import * as DataLoader from 'dataloader';

export interface MyContext<T> extends BaseMyContext {
  answerForQuestionLoader: DataLoader<string, T>;
  questionAttachmentForQuestionLoader: DataLoader<string, T>;
  questionCourseTopicForQuestionLoader: DataLoader<string, T>;
  quizSessionForQuestionLoader: DataLoader<string, T>;
}
