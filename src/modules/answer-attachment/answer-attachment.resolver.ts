import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { Answer } from '@entities/answer.entity';
import { AnswerService } from '@modules/answer/answer.service';
import { Resolver, Root, ResolveField, Context } from '@nestjs/graphql';
import { MyContext } from './type/answer-attachment.type';

@Resolver(() => AnswerAttachment)
export class AnswerAttachmentResolver {
  constructor(private readonly answerSrv: AnswerService) {}

  @ResolveField('answer', () => Answer)
  async resolveQuestionField(
    @Root() { answerId }: AnswerAttachment,
    @Context() ctx: MyContext<Answer>,
  ): Promise<Answer> {
    return await ctx.answerForAnswerAttachmentLoader.load(answerId);
  }
}
