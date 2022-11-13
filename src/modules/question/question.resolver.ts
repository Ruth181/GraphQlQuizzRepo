import { Answer } from '@entities/answer.entity';
import { QuestionAttachment } from '@entities/question-attachment.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { Question } from '@entities/question.entity';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { RolesGuard } from '@schematics/guards/role.guard';
import { CurrentUser, Roles } from '@utils/decorators/utils.decorator';
import { AppRole, DecodedTokenKey } from '@utils/types/utils.types';
import { CreateQuestionDTO } from './dto/question.dto';
import { QuestionService } from './question.service';
import { MyContext } from './type/question.type';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionSrv: QuestionService) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args('payload') payload: CreateQuestionDTO,
  ): Promise<Question> {
    return await this.questionSrv.createQuestion(payload);
  }

  @Query(() => [Question])
  async findQuestions(): Promise<Question[]> {
    return await this.questionSrv.findAll();
  }

  @Query(() => [Question])
  async findQuestionsByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<Question[]> {
    return await this.questionSrv.findAllByCondition({ status });
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => [Question])
  async generateBalancedTest(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Question[]> {
    return await this.questionSrv.generateBalancedTest(courseId, userId);
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => [Question])
  async generateRandomTest(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Question[]> {
    return await this.questionSrv.generateRandomTest(userId, courseId);
  }

  @Query(() => Question)
  async findQuestionById(
    @Args('questionId', ParseUUIDPipe) questionId: string,
  ): Promise<Question> {
    return await this.questionSrv.findOne({ id: questionId });
  }

  @ResolveField('quizSessionDetailsForThisQuestion', () => [QuizSessionDetail])
  async resolveQuizSessionDetailsForThisQuestion(
    @Root() { id }: Question,
    @Context() ctx: MyContext<QuizSessionDetail[]>,
  ): Promise<QuizSessionDetail[]> {
    return await ctx.quizSessionForQuestionLoader.load(id);
  }

  @ResolveField('questionTopicRecordsForThisQuestion', () => [
    QuestionCourseTopic,
  ])
  async resolveQuestionTopicRecordsForThisQuestion(
    @Root() { id }: Question,
    @Context() ctx: MyContext<QuestionCourseTopic[]>,
  ): Promise<QuestionCourseTopic[]> {
    return await ctx.questionCourseTopicForQuestionLoader.load(id);
  }

  @ResolveField('answersForThisQuestion', () => [Answer])
  async resolveAnswersForThisQuestion(
    @Root() { id }: Question,
    @Context() ctx: MyContext<Answer[]>,
  ): Promise<Answer[]> {
    return await ctx.answerForQuestionLoader.load(id);
  }

  @ResolveField('attachmentsForThisQuestion', () => [QuestionAttachment])
  async resolveAttachmentsForThisQuestion(
    @Root() { id }: Question,
    @Context() ctx: MyContext<QuestionAttachment[]>,
  ): Promise<QuestionAttachment[]> {
    return await ctx.questionAttachmentForQuestionLoader.load(id);
  }
}
