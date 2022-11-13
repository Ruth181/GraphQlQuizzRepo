import {
  Args,
  Resolver,
  Mutation,
  Query,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { Topic } from '@entities/topic.entity';
import { TopicService } from './topic.service';
import { CreateTopicDTO, UpdateTopicDTO } from './dto/topic.dto';
import { Course } from '@entities/course.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { MyContext } from './type/topic.type';
import { RandomTestTopic } from '@entities/random-test-topic.entity';

@Resolver(() => Topic)
export class TopicResolver {
  constructor(private readonly topicSrv: TopicService) {}

  @Mutation(() => Topic)
  async createTopic(@Args('payload') payload: CreateTopicDTO): Promise<Topic> {
    return await this.topicSrv.createTopic(payload);
  }

  @Mutation(() => Topic)
  async updateTopic(@Args('payload') payload: UpdateTopicDTO): Promise<Topic> {
    return await this.topicSrv.updateTopic(payload);
  }

  @Query(() => [Topic])
  async findTopics(): Promise<Topic[]> {
    return await this.topicSrv.findAll();
  }

  @Query(() => [Topic])
  async findTopicsByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<Topic[]> {
    return await this.topicSrv.findAllByCondition({ status });
  }

  @Query(() => Topic)
  async findTopicById(
    @Args('topicId', ParseUUIDPipe) topicId: string,
  ): Promise<Topic> {
    return await this.topicSrv.findOne({ id: topicId });
  }

  @Query(() => [Topic], {
    description: 'Returns only topics with questions attached to them',
  })
  async findTopicsWithQuestionsByCourseId(
    @Args('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Topic[]> {
    return await this.topicSrv.findTopicsWithQuestionsByCourseId(
      courseId,
      false,
    );
  }

  @ResolveField('course', () => Course)
  async resolveCourseField(
    @Root() { courseId }: Topic,
    @Context() ctx: MyContext<Course>,
  ): Promise<Course> {
    return await ctx.courseForTopicLoader.load(courseId);
  }

  @ResolveField('questionTopicRecordsForThisTopic', () => [QuestionCourseTopic])
  async resolveQuestionTopicRecordsForThisTopic(
    @Root() { id }: Topic,
    @Context() ctx: MyContext<QuestionCourseTopic[]>,
  ): Promise<QuestionCourseTopic[]> {
    return await ctx.questionTopicRecordForTopicLoader.load(id);
  }

  @ResolveField('randomTestTopicsForThisTopic', () => [RandomTestTopic])
  async resolveRandomTestRecordsForThisTopic(
    @Root() { id }: Topic,
    @Context() ctx: MyContext<RandomTestTopic[]>,
  ): Promise<RandomTestTopic[]> {
    return await ctx.randomTestTopicsRecordForTopicLoader.load(id);
  }
}
