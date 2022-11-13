import { RandomTestTopic } from '@entities/random-test-topic.entity';
import { RandomTest } from '@entities/random-test.entity';
import { Topic } from '@entities/topic.entity';
import { Resolver, Context, Root, ResolveField } from '@nestjs/graphql';
import { RandomTestTopicService } from './random-test-topic.service';
import { MyContext } from './type/random-test-topic.type';

@Resolver(() => RandomTestTopic)
export class RandomTestTopicResolver {
  constructor(private readonly randomTestTopicSrv: RandomTestTopicService) {}

  @ResolveField('topic', () => Topic)
  async resolveTopicField(
    @Root() { topicId }: RandomTestTopic,
    @Context() ctx: MyContext<Topic>,
  ): Promise<Topic> {
    return await ctx.topicForRandomTestTopicLoader.load(topicId);
  }

  @ResolveField('randomTest', () => RandomTest)
  async resolveRandomTestField(
    @Root() { randomTestId }: RandomTestTopic,
    @Context() ctx: MyContext<RandomTest>,
  ): Promise<RandomTest> {
    return await ctx.randomTestForRandomTestTopicLoader.load(randomTestId);
  }
}
