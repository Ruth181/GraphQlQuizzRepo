import { QuizSession } from '@entities/quiz-session.entity';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';
import { RandomTest } from '@entities/random-test.entity';
import { User } from '@entities/user.entity';
import { Resolver, ResolveField, Root, Context } from '@nestjs/graphql';
import { MyContext } from './type/random-test-quiz-record.type';

@Resolver(() => RandomTestQuizRecord)
export class RandomTestQuizRecordResolver {
  @ResolveField('user', () => User)
  async resolveUserField(
    @Root() { userId }: RandomTestQuizRecord,
    @Context() ctx: MyContext<User>,
  ): Promise<User> {
    return await ctx.userForRandomTestQuizRecordLoader.load(userId);
  }

  @ResolveField('quizSession', () => QuizSession)
  async resolveQuizSessionField(
    @Root() { quizSessionId }: RandomTestQuizRecord,
    @Context() ctx: MyContext<QuizSession>,
  ): Promise<QuizSession> {
    return await ctx.quizSessionForRandomTestQuizRecordLoader.load(
      quizSessionId,
    );
  }

  @ResolveField('randomTest', () => RandomTest)
  async resolveRandomTestField(
    @Root() { randomTestId }: RandomTestQuizRecord,
    @Context() ctx: MyContext<RandomTest>,
  ): Promise<RandomTest> {
    return await ctx.randomTestRandomTestQuizRecordLoader.load(randomTestId);
  }
}
