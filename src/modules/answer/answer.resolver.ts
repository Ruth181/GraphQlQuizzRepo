import { Resolver, ResolveField, Root, Context } from '@nestjs/graphql';
import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { Answer } from '@entities/answer.entity';
import { Question } from '@entities/question.entity';
import { MyContext } from '@modules/answer/type/answer.type';
import { AnswerService } from './answer.service';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerSrv: AnswerService) {}

  @ResolveField('question', () => Question)
  async resolveQuestionField(
    @Root() { questionId }: Answer,
    @Context() ctx: MyContext<Question>,
  ): Promise<Question> {
    return await ctx.questionForAnswerLoader.load(questionId);
  }

  @ResolveField('attachmentsForThisAnswer', () => [AnswerAttachment])
  async resolveAttachmentsForThisAnswer(
    @Root() { id }: Answer,
    @Context() ctx: MyContext<AnswerAttachment[]>,
  ): Promise<AnswerAttachment[]> {
    return await ctx.answerAttachmentsForAnswerLoader.load(id);
  }
}
