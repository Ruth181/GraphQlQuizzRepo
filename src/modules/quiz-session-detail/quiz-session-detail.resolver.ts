import { ResolveField, Root, Resolver, Context } from '@nestjs/graphql';
import { Question } from '@entities/question.entity';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { MyContext } from '@modules/quiz-session-detail/type/quiz-session-detail.type';

@Resolver(() => QuizSessionDetail)
export class QuizSessionDetailResolver {
  @ResolveField('question', () => Question)
  async resolveQuestionField(
    @Root() { questionId }: QuizSessionDetail,
    @Context() ctx: MyContext<Question>,
  ): Promise<Question> {
    return await ctx.questionForQuizSessionDetailLoader.load(questionId);
  }

  @ResolveField('quizSession', () => QuizSession)
  async resolveQuizSessionField(
    @Root() { quizSessionId }: QuizSessionDetail,
    @Context() ctx: MyContext<QuizSession>,
  ): Promise<QuizSession> {
    return await ctx.quizSessionForQuizSessionDetailLoader.load(quizSessionId);
  }
}
