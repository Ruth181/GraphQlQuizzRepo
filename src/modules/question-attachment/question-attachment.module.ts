import { Module, forwardRef } from '@nestjs/common';
import { QuestionAttachmentService } from './question-attachment.service';
import { QuestionAttachmentResolver } from './question-attachment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionAttachment } from '@entities/question-attachment.entity';
import { Question } from '@entities/question.entity';
import { QuestionModule } from '@modules/question/question.module';
import { QuestionService } from '@modules/question/question.service';
import { AnswerModule } from '@modules/answer/answer.module';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { TopicModule } from '@modules/topic/topic.module';
import { CourseModule } from '@modules/course/course.module';
import { DepartmentModule } from '@modules/department/department.module';
import { TestTimeDurationModule } from '@modules/test-time-duration/test-time-duration.module';
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module';
import { UserModule } from '@modules/user/user.module';
import { RandomTestModule } from '@modules/random-test/random-test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionAttachment, Question]),
    forwardRef(() => QuestionModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => QuestionCourseTopicModule),
    TopicModule,
    forwardRef(() => CourseModule),
    forwardRef(() => DepartmentModule),
    TestTimeDurationModule,
    QuizSessionModule,
    RandomTestModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    QuestionAttachmentService,
    QuestionAttachmentResolver,
    QuestionService,
  ],
  exports: [QuestionAttachmentService],
})
export class QuestionAttachmentModule {}
