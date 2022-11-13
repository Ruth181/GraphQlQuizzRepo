import { Module, forwardRef } from '@nestjs/common';
import { QuestionCourseTopicService } from './question-course-topic.service';
import { QuestionCourseTopicResolver } from './question-course-topic.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { Topic } from '@entities/topic.entity';
import { Course } from '@entities/course.entity';
import { Question } from '@entities/question.entity';
import { CourseModule } from '@modules/course/course.module';
import { TopicModule } from '@modules/topic/topic.module';
import { QuestionModule } from '@modules/question/question.module';
import { CourseService } from '@modules/course/course.service';
import { TopicService } from '@modules/topic/topic.service';
import { QuestionService } from '@modules/question/question.service';
import { AnswerModule } from '@modules/answer/answer.module';
import { QuestionAttachmentModule } from '@modules/question-attachment/question-attachment.module';
import { DepartmentModule } from '@modules/department/department.module';
import { TestTimeDurationModule } from '@modules/test-time-duration/test-time-duration.module';
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module';
import { UserModule } from '@modules/user/user.module';
import { RandomTestModule } from '@modules/random-test/random-test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionCourseTopic, Topic, Course, Question]),
    forwardRef(() => CourseModule),
    TopicModule,
    QuestionModule,
    AnswerModule,
    QuestionAttachmentModule,
    TestTimeDurationModule,
    QuizSessionModule,
    RandomTestModule,
    forwardRef(() => UserModule),
    forwardRef(() => DepartmentModule),
  ],
  providers: [
    QuestionCourseTopicService,
    QuestionCourseTopicResolver,
    CourseService,
    TopicService,
    QuestionService,
  ],
  exports: [QuestionCourseTopicService],
})
export class QuestionCourseTopicModule {}
