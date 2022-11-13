import { Module, forwardRef } from '@nestjs/common';
import { RandomTestService } from './random-test.service';
import { RandomTestResolver } from './random-test.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomTest } from '@entities/random-test.entity';
import { RandomTestTopicModule } from '@modules/random-test-topic/random-test-topic.module';
import { RandomTestTopicService } from '@modules/random-test-topic/random-test-topic.service';
import { RandomTestTopic } from '@entities/random-test-topic.entity';
import { CourseModule } from '@modules/course/course.module';
import { CourseService } from '@modules/course/course.service';
import { Course } from '@entities/course.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { DepartmentModule } from '@modules/department/department.module';
import { RandomTestController } from './random-test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RandomTest,
      RandomTestTopic,
      QuestionCourseTopic,
      Course,
    ]),
    RandomTestTopicModule,
    forwardRef(() => DepartmentModule),
    forwardRef(() => CourseModule),
    forwardRef(() => QuestionCourseTopicModule),
  ],
  providers: [
    RandomTestService,
    RandomTestResolver,
    RandomTestTopicService,
    CourseService,
    QuestionCourseTopicService,
  ],
  exports: [RandomTestService],
  controllers: [RandomTestController],
})
export class RandomTestModule {}
