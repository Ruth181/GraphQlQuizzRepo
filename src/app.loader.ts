import { answerForAnswerAttachmentLoader } from '@modules/answer-attachment/answer-attachment.dataloader';
import {
  answerAttachmentForAnswerLoader,
  questionForAnswerLoader,
} from '@modules/answer/answer.dataloader';
import {
  departmentForCourseLoader,
  topicForCourseLoader,
  questionTopicForCourseLoader,
  randomTestsForCourseLoader,
  quizSessionsForCourseLoader,
} from '@modules/course/course.dataloader';
import {
  usersForDepartmentLoader,
  coursesForDepartmentLoader,
} from '@modules/department/department.dataloader';
import { questionForQuestionAttachmentLoader } from '@modules/question-attachment/question-attachment.dataloader';
import {
  questionForQCTLoader,
  topicForQCTLoader,
  CourseForQCTLoader,
} from '@modules/question-course-topic/question-course-topic.dataloader';
import {
  answerForQuestionLoader,
  questionAttachmentForQuestionLoader,
  questionCourseTopicForQuestionLoader,
  quizSessionDetailsForQuestionLoader,
} from '@modules/question/question.dataloader';
import {
  questionForQuizSessionDetailLoader,
  quizSessionForQuizSessionDetailLoader,
} from '@modules/quiz-session-detail/quiz-session-detail.dataloader';
import {
  userForQuizSessionLoader,
  quizSessionDetailForQuizSessionLoader,
  courseForQuizSessionLoader,
  randomTestQuizRecordForQuizSessionLoader,
} from '@modules/quiz-session/quiz-session.dataloader';
import {
  randomTestRandomTestQuizRecordLoader,
  userForRandomTestQuizRecordLoader,
  quizSessionForRandomTestQuizRecordLoader,
} from '@modules/random-test-quiz-record/random-test-quiz-record.dataloader';
import {
  randomTestForRandomTestTopicLoader,
  topicForRandomTestTopicLoader,
} from '@modules/random-test-topic/random-test-topic.dataloder';
import {
  randomTestTopicForRandomTestLoader,
  randomTestQuizRecordForRandomTestLoader,
  courseForRandomTestLoader,
} from '@modules/random-test/random-test.dataloader';
import {
  courseForTopicLoader,
  questionCourseTopicRecordForTopicLoader,
  randomTestTopicsRecordForTopicLoader,
} from '@modules/topic/topic.dataloader';
import {
  departmentForUserLoader,
  quizSessionsForUserLoader,
  randomTestQuizRecordForUserLoader,
} from '@modules/user/user.dataloader';

export const AppDataLoaders = {
  // [Question]
  answerForQuestionLoader: answerForQuestionLoader(),
  questionAttachmentForQuestionLoader: questionAttachmentForQuestionLoader(),
  questionCourseTopicForQuestionLoader: questionCourseTopicForQuestionLoader(),
  quizSessionForQuestionLoader: quizSessionDetailsForQuestionLoader(),
  // [Answer]
  answerAttachmentsForAnswerLoader: answerAttachmentForAnswerLoader(),
  questionForAnswerLoader: questionForAnswerLoader(),
  // [Course]
  departmentForCourseLoader: departmentForCourseLoader(),
  topicsForCourseLoader: topicForCourseLoader(),
  questionCourseTopicForCourseLoader: questionTopicForCourseLoader(),
  quizSessionsForCourseLoader: quizSessionsForCourseLoader(),
  randomTestsForCourseLoader: randomTestsForCourseLoader(),
  // [AnswerAttachment]
  answerForAnswerAttachmentLoader: answerForAnswerAttachmentLoader(),
  // [Department]
  usersForDepartmentLoader: usersForDepartmentLoader(),
  coursesForDepartmentLoaders: coursesForDepartmentLoader(),
  // [QuestionAttachment]
  questionForQuestionAttachmentLoader: questionForQuestionAttachmentLoader(),
  // [QuestionCourseTopic]
  questionForQCTLoader: questionForQCTLoader(),
  topicForQCTLoader: topicForQCTLoader(),
  courseForQCTLoader: CourseForQCTLoader(),
  // [QuizSession]
  userForQuizSessionLoader: userForQuizSessionLoader(),
  quizSessionDetailForQuizSessionLoader:
    quizSessionDetailForQuizSessionLoader(),
  courseForQuizSessionLoader: courseForQuizSessionLoader(),
  randomTestQuizRecordForQuizSessionLoader:
    randomTestQuizRecordForQuizSessionLoader(),
  // [QuizSessionDetail]
  questionForQuizSessionDetailLoader: questionForQuizSessionDetailLoader(),
  quizSessionForQuizSessionDetailLoader:
    quizSessionForQuizSessionDetailLoader(),
  // [Topic]
  randomTestTopicsRecordForTopicLoader: randomTestTopicsRecordForTopicLoader(),
  courseForTopicLoader: courseForTopicLoader(),
  questionTopicRecordForTopicLoader: questionCourseTopicRecordForTopicLoader(),
  // [User]
  departmentForUserLoader: departmentForUserLoader(),
  quizSessionsForUserLoader: quizSessionsForUserLoader(),
  randomTestQuizRecordForUserLoader: randomTestQuizRecordForUserLoader(),
  // [RandomTest]
  courseForRandomTestLoader: courseForRandomTestLoader(),
  randomTestTopicForRandomTestLoader: randomTestTopicForRandomTestLoader(),
  randomTestQuizRecordForRandomTestLoader:
    randomTestQuizRecordForRandomTestLoader(),
  // [RandomTestQuizRecord]
  randomTestRandomTestQuizRecordLoader: randomTestRandomTestQuizRecordLoader(),
  userForRandomTestQuizRecordLoader: userForRandomTestQuizRecordLoader(),
  quizSessionForRandomTestQuizRecordLoader:
    quizSessionForRandomTestQuizRecordLoader(),
  //[RandomTestTopic]
  topicForRandomTestTopicLoader: topicForRandomTestTopicLoader(),
  randomTestForRandomTestTopicLoader: randomTestForRandomTestTopicLoader(),
};
