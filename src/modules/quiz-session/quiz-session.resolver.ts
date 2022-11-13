import { Course } from '@entities/course.entity';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';
import { User } from '@entities/user.entity';
import { UseGuards } from '@nestjs/common';
import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Root,
  Context,
  Query,
} from '@nestjs/graphql';
import { RolesGuard } from '@schematics/guards/role.guard';
import { CurrentUser, Roles } from '@utils/decorators/utils.decorator';
import { AppRole, DecodedTokenKey } from '@utils/types/utils.types';
import {
  CreateQuizSessionDTO,
  QuizSessionPerformanceDTO,
  UserPerformanceReviewDTO,
} from './dto/quiz-session.dto';
import { QuizSessionService } from './quiz-session.service';
import { MyContext } from './type/quiz-session.type';

@Resolver(() => QuizSession)
export class QuizSessionResolver {
  constructor(private readonly quizSessionSrv: QuizSessionService) {}

  @Query(() => [QuizSession])
  async findQuizSessions(): Promise<QuizSession[]> {
    return await this.quizSessionSrv.findAll();
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Mutation(() => QuizSession, {
    description: 'Called after a test is submitted or times out',
  })
  async createQuizSession(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('payload') payload: CreateQuizSessionDTO,
  ): Promise<QuizSession> {
    return await this.quizSessionSrv.createQuizSession(payload, userId);
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => [QuizSessionPerformanceDTO])
  async userPerformanceReview(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
  ): Promise<QuizSessionPerformanceDTO[]> {
    return await this.quizSessionSrv.userPerformanceReview(userId);
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => QuizSessionPerformanceDTO)
  async findSpecificUserPerformanceReview(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('sessionKey') sessionKey: string,
  ): Promise<QuizSessionPerformanceDTO> {
    return await this.quizSessionSrv.findSpecificUserPerformanceReview(
      userId,
      sessionKey,
    );
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => UserPerformanceReviewDTO)
  async findSpecificUserPerformanceReviewByTopicsTaken(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('topicId') topicId: string,
  ): Promise<UserPerformanceReviewDTO> {
    return await this.quizSessionSrv.findSpecificUserPerformanceReviewByTopicsTaken(
      userId,
      topicId,
    );
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => [UserPerformanceReviewDTO])
  async userPerformanceReviewByTopicsTaken(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    return await this.quizSessionSrv.userPerformanceReviewByTopicsTaken(userId);
  }

  @Roles(AppRole.USER)
  @UseGuards(RolesGuard)
  @Query(() => [UserPerformanceReviewDTO])
  async findPerformanceForTopicsUsingSessionKey(
    @CurrentUser(DecodedTokenKey.ID) userId: string,
    @Args('sessionKey') sessionKey: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    return await this.quizSessionSrv.findPerformanceForTopicsUsingSessionKey(
      sessionKey,
      userId,
    );
  }

  @ResolveField('user', () => User)
  async resolveQuestionField(
    @Root() { userId }: QuizSession,
    @Context() ctx: MyContext<User>,
  ): Promise<User> {
    return await ctx.userForQuizSessionLoader.load(userId);
  }

  @ResolveField('course', () => Course)
  async resolveCourseField(
    @Root() { courseId }: QuizSession,
    @Context() ctx: MyContext<Course>,
  ): Promise<Course> {
    return await ctx.courseForQuizSessionLoader.load(courseId);
  }

  @ResolveField('detailsForThisQuizSession', () => [QuizSessionDetail])
  async resolveDetailsForThisQuizSession(
    @Root() { id }: QuizSession,
    @Context() ctx: MyContext<QuizSessionDetail[]>,
  ): Promise<QuizSessionDetail[]> {
    return await ctx.quizSessionDetailForQuizSessionLoader.load(id);
  }

  @ResolveField('randomTestsForThisQuizSession', () => [RandomTestQuizRecord])
  async resolveRandomTestsForThisQuizSession(
    @Root() { id }: QuizSession,
    @Context() ctx: MyContext<RandomTestQuizRecord[]>,
  ): Promise<RandomTestQuizRecord[]> {
    return await ctx.randomTestQuizRecordForQuizSessionLoader.load(id);
  }
}
