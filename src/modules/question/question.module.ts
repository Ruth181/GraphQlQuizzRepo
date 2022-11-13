import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@entities/question.entity';
import { Answer } from '@entities/answer.entity';
import { AnswerModule } from '@modules/answer/answer.module';
import { AnswerService } from '@modules/answer/answer.service';
import { AnswerAttachmentModule } from '@modules/answer-attachment/answer-attachment.module';
import { QuestionAttachmentModule } from '@modules/question-attachment/question-attachment.module';
import { QuestionAttachment } from '@entities/question-attachment.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { Topic } from '@entities/topic.entity';
import { TopicModule } from '@modules/topic/topic.module';
import { TopicService } from '@modules/topic/topic.service';
import { QuestionController } from './question.controller';
import { Course } from '@entities/course.entity';
import { CourseModule } from '@modules/course/course.module';
import { CourseService } from '@modules/course/course.service';
import { Department } from '@entities/department.entity';
import { DepartmentModule } from '@modules/department/department.module';
import { DepartmentService } from '@modules/department/department.service';
import { TestTimeDuration } from '@entities/test-time-duration.entity';
import { TestTimeDurationModule } from '@modules/test-time-duration/test-time-duration.module';
import { TestTimeDurationService } from '@modules/test-time-duration/test-time-duration.service';
import { QuizSession } from '@entities/quiz-session.entity';
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module';
import { QuizSessionService } from '@modules/quiz-session/quiz-session.service';
import { User } from '@entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { QuizSessionDetailModule } from '@modules/quiz-session-detail/quiz-session-detail.module';
import { QuizSessionDetailService } from '@modules/quiz-session-detail/quiz-session-detail.service';
import { RandomTestQuizRecordModule } from '@modules/random-test-quiz-record/random-test-quiz-record.module';
import { RandomTestModule } from '@modules/random-test/random-test.module';
import { RandomTest } from '@entities/random-test.entity';
import { RandomTestService } from '@modules/random-test/random-test.service';
import { RandomTestTopicModule } from '@modules/random-test-topic/random-test-topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Answer,
      QuestionAttachment,
      QuestionCourseTopic,
      Topic,
      Course,
      Department,
      TestTimeDuration,
      QuizSession,
      User,
      QuizSessionDetail,
      RandomTest,
    ]),
    AnswerAttachmentModule,
    AnswerModule,
    RandomTestQuizRecordModule,
    QuestionAttachmentModule,
    forwardRef(() => QuestionCourseTopicModule),
    TopicModule,
    forwardRef(() => CourseModule),
    forwardRef(() => DepartmentModule),
    TestTimeDurationModule,
    QuizSessionModule,
    forwardRef(() => UserModule),
    QuizSessionDetailModule,
    RandomTestModule,
    RandomTestTopicModule,
  ],
  providers: [
    QuestionService,
    QuestionResolver,
    AnswerService,
    QuestionCourseTopicService,
    TopicService,
    CourseService,
    DepartmentService,
    TestTimeDurationService,
    QuizSessionService,
    UserService,
    QuizSessionDetailService,
    RandomTestService,
  ],
  exports: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
