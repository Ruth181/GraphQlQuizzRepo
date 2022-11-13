import { Module, forwardRef } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicResolver } from './topic.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '@entities/topic.entity';
import { Course } from '@entities/course.entity';
import { CourseModule } from '@modules/course/course.module';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { CourseService } from '@modules/course/course.service';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { DepartmentModule } from '@modules/department/department.module';
import { TopicController } from './topic.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, Course, QuestionCourseTopic]),
    forwardRef(() => DepartmentModule),
    forwardRef(() => CourseModule),
    forwardRef(() => QuestionCourseTopicModule),
  ],
  providers: [
    TopicService,
    TopicResolver,
    CourseService,
    QuestionCourseTopicService,
  ],
  exports: [TopicService],
  controllers: [TopicController],
})
export class TopicModule {}
