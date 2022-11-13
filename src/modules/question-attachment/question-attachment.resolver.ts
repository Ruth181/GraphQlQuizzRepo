import { QuestionAttachment } from '@entities/question-attachment.entity';
import { Question } from '@entities/question.entity';
import { Root, ResolveField, Resolver, Context } from '@nestjs/graphql';
import { MyContext } from './type/question-attachment.type';

@Resolver(() => QuestionAttachment)
export class QuestionAttachmentResolver {
  @ResolveField('question', () => Question)
  async resolveAttachmentsForThisAnswer(
    @Root() { questionId }: QuestionAttachment,
    @Context() ctx: MyContext<Question>,
  ): Promise<Question> {
    return await ctx.questionForQuestionAttachmentLoader.load(questionId);
  }
}
