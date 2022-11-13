import { Answer } from '@entities/answer.entity';
import { Course } from '@entities/course.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';
import { User } from '@entities/user.entity';
import { AnswerModule } from '@modules/answer/answer.module';
import { CourseModule } from '@modules/course/course.module';
import { CourseService } from '@modules/course/course.service';
import { DepartmentModule } from '@modules/department/department.module';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { QuizSessionDetailModule } from '@modules/quiz-session-detail/quiz-session-detail.module';
import { QuizSessionDetailService } from '@modules/quiz-session-detail/quiz-session-detail.service';
import { RandomTestQuizRecordModule } from '@modules/random-test-quiz-record/random-test-quiz-record.module';
import { RandomTestQuizRecordService } from '@modules/random-test-quiz-record/random-test-quiz-record.service';
import { RandomTestModule } from '@modules/random-test/random-test.module';
import { UserModule } from '@modules/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSessionResolver } from './quiz-session.resolver';
import { QuizSessionService } from './quiz-session.service';
import { QuizSessionController } from './quiz-session.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizSession,
      QuizSessionDetail,
      RandomTestQuizRecord,
      User,
      Answer,
      Course,
      QuestionCourseTopic,
    ]),
    QuizSessionDetailModule,
    RandomTestQuizRecordModule,
    RandomTestModule,
    forwardRef(() => QuestionCourseTopicModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => CourseModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    QuizSessionResolver,
    QuizSessionService,
    QuizSessionDetailService,
    RandomTestQuizRecordService,
    CourseService,
    QuestionCourseTopicService,
  ],
  exports: [QuizSessionService],
  controllers: [QuizSessionController],
})
export class QuizSessionModule {}
