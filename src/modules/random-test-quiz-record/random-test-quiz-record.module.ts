import { Module, forwardRef } from '@nestjs/common';
import { RandomTestQuizRecordService } from './random-test-quiz-record.service';
import { RandomTestQuizRecordResolver } from './random-test-quiz-record.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';
import { RandomTest } from '@entities/random-test.entity';
import { RandomTestModule } from '@modules/random-test/random-test.module';
import { RandomTestService } from '@modules/random-test/random-test.service';
import { RandomTestTopicModule } from '@modules/random-test-topic/random-test-topic.module';
import { CourseModule } from '@modules/course/course.module';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RandomTestQuizRecord, RandomTest]),
    RandomTestModule,
    RandomTestTopicModule,
    forwardRef(() => QuestionCourseTopicModule),
    forwardRef(() => CourseModule),
  ],
  providers: [
    RandomTestQuizRecordService,
    RandomTestQuizRecordResolver,
    RandomTestService,
  ],
  exports: [RandomTestQuizRecordService],
})
export class RandomTestQuizRecordModule {}
