import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { Course } from '@entities/course.entity';
import { CourseService } from './course.service';
import { CreateCourseDTO, UpdateCourseDTO } from './dto/course.dto';
import { Department } from '@entities/department.entity';
import { Topic } from '@entities/topic.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { MyContext } from './type/course.type';
import { QuizSession } from '@entities/quiz-session.entity';
import { RandomTest } from '@entities/random-test.entity';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseSrv: CourseService) {}

  @Mutation(() => Course)
  async createCourse(
    @Args('payload') payload: CreateCourseDTO,
  ): Promise<Course> {
    return await this.courseSrv.createCourse(payload);
  }

  @Mutation(() => Course)
  async updateCourse(
    @Args('payload') payload: UpdateCourseDTO,
  ): Promise<Course> {
    return await this.courseSrv.updateCourse(payload);
  }

  @Query(() => Course)
  async findCourseById(
    @Args('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Course> {
    return await this.courseSrv.findOne({ id: courseId });
  }

  @Query(() => [Course])
  async findCoursesByDepartmentId(
    @Args('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<Course[]> {
    return await this.courseSrv.findAllByCondition({ departmentId });
  }

  @Query(() => [Course])
  async findCourses(): Promise<Course[]> {
    return await this.courseSrv.findAll();
  }

  @Query(() => [Course])
  async findCoursesByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<Course[]> {
    return await this.courseSrv.findAllByCondition({ status });
  }

  @ResolveField('department', () => Department)
  async resolveCartField(
    @Root() { departmentId }: Course,
    @Context() ctx: MyContext<Department>,
  ): Promise<Department> {
    return await ctx.departmentForCourseLoader.load(departmentId);
  }

  @ResolveField('topicsUnderThisCourse', () => [Topic])
  async resolveTopicsUnderThisCourse(
    @Root() { id }: Course,
    @Context() ctx: MyContext<Topic[]>,
  ): Promise<Topic[]> {
    return await ctx.topicsForCourseLoader.load(id);
  }

  @ResolveField('questionTopicRecordsForThisCourse', () => [
    QuestionCourseTopic,
  ])
  async resolveQuestionTopicRecordsForThisCourse(
    @Root() { id }: Course,
    @Context() ctx: MyContext<QuestionCourseTopic[]>,
  ): Promise<QuestionCourseTopic[]> {
    return await ctx.questionCourseTopicForCourseLoader.load(id);
  }

  @ResolveField('quizSessionsUnderThisCourse', () => [QuizSession])
  async resolveQuizSessionsUnderThisCourse(
    @Root() { id }: Course,
    @Context() ctx: MyContext<QuizSession[]>,
  ): Promise<QuizSession[]> {
    return await ctx.quizSessionsForCourseLoader.load(id);
  }

  @ResolveField('randomTestsUnderThisCourse', () => [QuizSession])
  async resolveRandomTestsUnderThisCourse(
    @Root() { id }: Course,
    @Context() ctx: MyContext<RandomTest[]>,
  ): Promise<RandomTest[]> {
    return await ctx.randomTestsForCourseLoader.load(id);
  }
}
