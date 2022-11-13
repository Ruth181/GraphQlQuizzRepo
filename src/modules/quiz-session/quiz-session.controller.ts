import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  QuizSessionPerformanceDTO,
  UserPerformanceReviewDTO,
} from './dto/quiz-session.dto';
import { QuizSessionService } from './quiz-session.service';

@Controller('quiz-session')
export class QuizSessionController {
  constructor(private readonly quizSessionSrv: QuizSessionService) {}

  @Get('/user-performance-review/by-topics-taken/:userId')
  async userPerformanceReviewByTopicsTaken(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    return await this.quizSessionSrv.userPerformanceReviewByTopicsTaken(userId);
  }

  @Get('/find-specific-user-performance-review/:userId/:sessionKey')
  async findSpecificUserPerformanceReview(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('sessionKey', ParseUUIDPipe) sessionKey: string,
  ): Promise<QuizSessionPerformanceDTO> {
    return await this.quizSessionSrv.findSpecificUserPerformanceReview(
      userId,
      sessionKey,
    );
  }

  @Get('/find-performance-for-topics/by-session-key/:sessionKey/:userId')
  async findPerformanceForTopicsUsingSessionKey(
    @Param('sessionKey', ParseUUIDPipe) sessionKey: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    return await this.quizSessionSrv.findPerformanceForTopicsUsingSessionKey(
      sessionKey,
      userId,
    );
  }
}
