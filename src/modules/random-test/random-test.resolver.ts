import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Root,
  ResolveField,
  Context,
  Mutation,
  Args,
  Query,
} from '@nestjs/graphql';
import { RolesGuard } from '@schematics/guards/role.guard';
import { Roles } from '@utils/decorators/utils.decorator';
import { AppRole } from '@utils/types/utils.types';
import { RandomTest } from '@entities/random-test.entity';
import { CreateRandomTestDTO } from './dto/random-test.dto';
import { RandomTestService } from './random-test.service';
import { Course } from '@entities/course.entity';
import { MyContext } from './type/random-test.type';
import { RandomTestTopic } from '@entities/random-test-topic.entity';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';

@Roles(AppRole.ADMIN)
@UseGuards(RolesGuard)
@Resolver(() => RandomTest)
export class RandomTestResolver {
  constructor(private readonly randomTestSrv: RandomTestService) {}

  @Mutation(() => RandomTest, {
    description: 'Used by examiner to set area of focus for random test',
  })
  async createRandomTest(
    @Args('payload') payload: CreateRandomTestDTO,
  ): Promise<RandomTest> {
    return await this.randomTestSrv.createRandomTest(payload);
  }

  @Query(() => RandomTest, { name: 'findRandomTestSessionById' })
  async findRandomTestById(
    @Args('randomTestId', ParseUUIDPipe) randomTestId: string,
  ): Promise<RandomTest> {
    return await this.randomTestSrv.findRandomTestById(randomTestId);
  }

  @Query(() => [RandomTest], { name: 'findRandomTestSessions' })
  async findRandomTests(): Promise<RandomTest[]> {
    return await this.randomTestSrv.findAll();
  }

  @Query(() => [RandomTest], { name: 'findRandomTestSessionsByStatus' })
  async findRandomTestsByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<RandomTest[]> {
    return await this.randomTestSrv.findAllByCondition({ status });
  }

  @Query(() => [RandomTest], { name: 'findRandomTestSessionsByCourseId' })
  async findRandomTestsByCourseId(
    @Args('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<RandomTest[]> {
    return await this.randomTestSrv.findAllByCondition({ courseId });
  }

  @ResolveField('course', () => Course)
  async resolveCourseField(
    @Root() { courseId }: RandomTest,
    @Context() ctx: MyContext<Course>,
  ): Promise<Course> {
    return await ctx.courseForRandomTestLoader.load(courseId);
  }

  @ResolveField('topicsUnderThisRandomTest', () => [RandomTestTopic])
  async resolveTopicsUnderThisRandomTest(
    @Root() { id }: RandomTest,
    @Context() ctx: MyContext<RandomTestTopic[]>,
  ): Promise<RandomTestTopic[]> {
    return await ctx.randomTestTopicForRandomTestLoader.load(id);
  }

  @ResolveField('testRecordsForThisRandomTest', () => [RandomTestQuizRecord])
  async resolveTestRecordsForThisRandomTest(
    @Root() { id }: RandomTest,
    @Context() ctx: MyContext<RandomTestQuizRecord[]>,
  ): Promise<RandomTestQuizRecord[]> {
    return await ctx.randomTestQuizRecordForRandomTestLoader.load(id);
  }
}
