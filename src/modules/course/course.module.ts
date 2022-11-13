import { Course } from '@entities/course.entity';
import { Department } from '@entities/department.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { Topic } from '@entities/topic.entity';
import { DepartmentModule } from '@modules/department/department.module';
import { DepartmentService } from '@modules/department/department.service';
import { QuestionCourseTopicModule } from '@modules/question-course-topic/question-course-topic.module';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { TopicModule } from '@modules/topic/topic.module';
import { TopicService } from '@modules/topic/topic.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Department, Topic, QuestionCourseTopic]),
    forwardRef(() => DepartmentModule),
    TopicModule,
    QuestionCourseTopicModule,
  ],
  providers: [
    CourseResolver,
    CourseService,
    DepartmentService,
    TopicService,
    QuestionCourseTopicService,
  ],
  exports: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
