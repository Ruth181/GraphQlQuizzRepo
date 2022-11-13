import { Module } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '@entities/department.entity';
import { DepartmentModule } from '@modules/department/department.module';
import { DepartmentService } from '@modules/department/department.service';
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module';
import { QuizSessionService } from '@modules/quiz-session/quiz-session.service';
import { QuizSession } from '@entities/quiz-session.entity';
import { QuizSessionDetailModule } from '@modules/quiz-session-detail/quiz-session-detail.module';
import { AnswerModule } from '@modules/answer/answer.module';
import { RandomTestQuizRecordModule } from '@modules/random-test-quiz-record/random-test-quiz-record.module';
import { CourseModule } from '@modules/course/course.module';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Department, QuizSession]),
    DepartmentModule,
    QuizSessionModule,
    QuizSessionDetailModule,
    AnswerModule,
    RandomTestQuizRecordModule,
    CourseModule,
    QuestionCourseTopicModule,
  ],
  providers: [UserService, UserResolver, DepartmentService, QuizSessionService],
  exports: [UserService],
})
export class UserModule {}
