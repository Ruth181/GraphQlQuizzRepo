import { Module, forwardRef } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '@entities/answer.entity';
import { AnswerAttachmentModule } from '@modules/answer-attachment/answer-attachment.module';
import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { AnswerAttachmentService } from '@modules/answer-attachment/answer-attachment.service';
import { Question } from '@entities/question.entity';
import { QuestionModule } from '@modules/question/question.module';
import { QuestionService } from '@modules/question/question.service';
import { QuestionAttachmentModule } from '@modules/question-attachment/question-attachment.module';
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
    TypeOrmModule.forFeature([Answer, AnswerAttachment, Question]),
    AnswerAttachmentModule,
    QuestionAttachmentModule,
    QuizSessionModule,
    forwardRef(() => QuestionCourseTopicModule),
    TopicModule,
    forwardRef(() => UserModule),
    forwardRef(() => CourseModule),
    forwardRef(() => DepartmentModule),
    TestTimeDurationModule,
    RandomTestModule,
    forwardRef(() => QuestionModule),
  ],
  providers: [
    AnswerService,
    AnswerResolver,
    AnswerAttachmentService,
    QuestionService,
  ],
  exports: [AnswerService],
})
export class AnswerModule {}
