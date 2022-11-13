import { Module, forwardRef } from '@nestjs/common';
import { QuizSessionDetailService } from './quiz-session-detail.service';
import { QuizSessionDetailResolver } from './quiz-session-detail.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { Question } from '@entities/question.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module';
import { QuestionModule } from '@modules/question/question.module';
import { QuizSessionService } from '@modules/quiz-session/quiz-session.service';
import { QuestionService } from '@modules/question/question.service';
import { AnswerModule } from '@modules/answer/answer.module';
import { QuestionAttachmentModule } from '@modules/question-attachment/question-attachment.module';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { TopicModule } from '@modules/topic/topic.module';
import { CourseModule } from '@modules/course/course.module';
import { DepartmentModule } from '@modules/department/department.module';
import { TestTimeDurationModule } from '@modules/test-time-duration/test-time-duration.module';
import { UserModule } from '@modules/user/user.module';
import { RandomTestQuizRecordModule } from '@modules/random-test-quiz-record/random-test-quiz-record.module';
import { RandomTestModule } from '@modules/random-test/random-test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizSessionDetail, Question, QuizSession]),
    forwardRef(() => QuizSessionModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => QuestionAttachmentModule),
    forwardRef(() => QuestionCourseTopicModule),
    forwardRef(() => CourseModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => UserModule),
    TopicModule,
    RandomTestQuizRecordModule,
    TestTimeDurationModule,
    RandomTestModule,
  ],
  providers: [
    QuizSessionDetailService,
    QuizSessionDetailResolver,
    QuizSessionService,
    QuestionService,
  ],
  exports: [QuizSessionDetailService],
})
export class QuizSessionDetailModule {}
