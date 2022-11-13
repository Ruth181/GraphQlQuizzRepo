import { Question } from '@entities/question.entity';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { AnswerService } from '@modules/answer/answer.service';
import { CourseService } from '@modules/course/course.service';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { QuizSessionDetailService } from '@modules/quiz-session-detail/quiz-session-detail.service';
import { RandomTestQuizRecordService } from '@modules/random-test-quiz-record/random-test-quiz-record.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  POINTS_PER_QUESTION,
  StatusType,
  TestType,
} from '@utils/types/utils.types';
import { GenericService } from 'src/generic.service';
import { In } from 'typeorm';
import {
  CreateQuizSessionDTO,
  QuestionPartialDTO,
  QuizSessionPerformanceDTO,
  UserPerformanceReviewDTO,
} from './dto/quiz-session.dto';

@Injectable()
export class QuizSessionService extends GenericService(QuizSession) {
  private relations = [
    'course',
    'user',
    'detailsForThisQuizSession',
    'detailsForThisQuizSession.quizSession',
    'detailsForThisQuizSession.question',
    'detailsForThisQuizSession.question.answersForThisQuestion',
    'randomTestsForThisQuizSession',
    'randomTestsForThisQuizSession.quizSession',
  ];

  constructor(
    private readonly quizSessionDetailSrv: QuizSessionDetailService,
    private readonly answerSrv: AnswerService,
    private readonly randomTestQuizRecordSrv: RandomTestQuizRecordService,
    private readonly courseSrv: CourseService,
    private readonly questionCourseTopicSrv: QuestionCourseTopicService,
  ) {
    super();
  }

  async createQuizSession(
    quizSession: CreateQuizSessionDTO,
    userId: string,
  ): Promise<QuizSession> {
    type ArrayPartialType = {
      pointsObtained: number;
      result: StatusType;
      questionId: string;
    };
    if (!userId || !quizSession.testType || !quizSession.courseId) {
      throw new BadRequestException(
        'Fields testType, courseId and userId are required',
      );
    }
    if (!Object.values(TestType).includes(quizSession.testType)) {
      throw new BadRequestException(
        `Fields testType must be one of ${Object.values(TestType).join(',')}`,
      );
    }
    if (quizSession.questions.length < 1) {
      throw new BadRequestException('Fields questions are required');
    }
    try {
      const skippedQuestions = quizSession.questions.filter(
        ({ selectedAnswerId }) => !selectedAnswerId,
      );
      const nonSkippedQuestions = quizSession.questions.filter(
        ({ selectedAnswerId }) => selectedAnswerId,
      );
      const mappedNonSkippedAnswers: ArrayPartialType[] = [];
      for (const { selectedAnswerId } of nonSkippedQuestions) {
        const ans = await this.answerSrv.findOne({ id: selectedAnswerId });
        let pointsObtained = 0;
        let result = StatusType.FAILED;
        if (ans.isCorrect) {
          pointsObtained = POINTS_PER_QUESTION;
          result = StatusType.CORRECT;
        }
        mappedNonSkippedAnswers.push({
          pointsObtained,
          questionId: ans.questionId,
          result,
        });
      }
      const mappedSkippedQuestions: ArrayPartialType[] = skippedQuestions.map(
        ({ questionId }) => ({
          pointsObtained: 0,
          result: StatusType.SKIPPED,
          questionId,
        }),
      );
      const mergedQuestions = mappedSkippedQuestions.concat(
        mappedNonSkippedAnswers,
      );
      const totalPointsObtained = mergedQuestions.reduce(
        (currentCount, value) => currentCount + value.pointsObtained,
        0,
      );
      const createdQuizSession = await this.create({
        userId,
        courseId: quizSession.courseId,
        testType: quizSession.testType,
        totalPointsObtained,
      });

      if (createdQuizSession?.id) {
        await this.quizSessionDetailSrv.createMany(
          mergedQuestions.map((quizDetail) => ({
            quizSessionId: createdQuizSession.id,
            questionId: quizDetail.questionId,
            result: quizDetail.result,
          })),
        );
        // Save records for random test
        if (quizSession.testType === TestType.RANDOMIZED_TEST) {
          await this.randomTestQuizRecordSrv.createRandomTestQuizRecord({
            userId,
            quizSessionId: createdQuizSession.id,
            courseId: quizSession.courseId,
          });
        }
      }
      return createdQuizSession;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async userPerformanceReview(
    userId: string,
  ): Promise<QuizSessionPerformanceDTO[]> {
    const result: QuizSessionPerformanceDTO[] = [];
    if (!userId) {
      throw new BadRequestException('Field userId is required');
    }
    try {
      const quizSessions = await this.getRepo().find({
        where: { userId },
        relations: [...this.relations],
      });
      if (quizSessions.length > 0) {
        for (const session of quizSessions) {
          const item: QuizSessionPerformanceDTO = {
            sessionKey: session.sessionKey,
            testType: session.testType,
            totalPointsObtained: session.totalPointsObtained,
            failedQuestions: [],
          };
          const course = await this.courseSrv
            .getRepo()
            .findOne({ where: { id: session.courseId } });
          if (course?.id) {
            item.course = course;
          }
          // Find questions that were either skipped / failed
          const failedQuestions: QuestionPartialDTO[] =
            session.detailsForThisQuizSession
              .filter(({ result }) => result !== StatusType.CORRECT)
              .map(({ question, result }) => {
                const correctAnswer = question.answersForThisQuestion.find(
                  ({ isCorrect }) => isCorrect,
                );
                return {
                  result,
                  question,
                  correctAnswer: correctAnswer.text,
                  explanation: question.explanation,
                };
              });
          item.failedQuestions.push(...failedQuestions);
          result.push(item);
        }
      }
      return result;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findSpecificUserPerformanceReview(
    userId: string,
    sessionKey: string,
  ): Promise<QuizSessionPerformanceDTO> {
    if (!userId || !sessionKey) {
      throw new BadRequestException(
        'Fields userId and sessionKey are required',
      );
    }
    try {
      const userReviews = await this.userPerformanceReview(userId);
      if (!userReviews || userReviews.length < 1) {
        throw new NotFoundException('No records found');
      }
      const review = userReviews.find(
        (review) => review.sessionKey === sessionKey,
      );
      if (!review) {
        throw new NotFoundException('No records found');
      }
      return review;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findSpecificUserPerformanceReviewByTopicsTaken(
    userId: string,
    topicId: string,
  ): Promise<UserPerformanceReviewDTO> {
    if (!userId || !topicId) {
      throw new BadRequestException('Fields userId and topicId are required');
    }
    try {
      const userReviews = await this.userPerformanceReviewByTopicsTaken(userId);
      if (!userReviews || userReviews.length < 1) {
        throw new NotFoundException('No records found');
      }
      const review = userReviews.find(({ topic }) => topic.id === topicId);
      if (!review) {
        throw new NotFoundException('No records found');
      }
      return review;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async userPerformanceReviewByTopicsTaken(
    userId: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    if (!userId) {
      throw new BadRequestException('Field userId is required');
    }
    try {
      let response: UserPerformanceReviewDTO[] = [];
      const quizSessions = await this.getRepo().find({
        where: { userId },
        relations: [...this.relations],
      });
      const questionsAnsweredByUser = await quizSessions
        .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
        .flat()
        .map(({ question }) => question);

      // Pull topics associated with questions
      const questionTopicRecords = await this.questionCourseTopicSrv
        .getRepo()
        .find({
          where: {
            questionId: In(questionsAnsweredByUser.map(({ id }) => id)),
          },
          relations: ['topic', 'question'],
        });

      const topicsTakenByUser = questionTopicRecords.map(({ topic }) => topic);
      for (const topic of topicsTakenByUser) {
        const associatedQuestions = questionTopicRecords
          .filter((item) => item.topicId === topic.id)
          .map(({ question }) => question);
        const totalPointsObtained = this.calculateTotal(
          associatedQuestions,
          quizSessions
            .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
            .flat(),
        );
        response.push({
          pointsObtained: totalPointsObtained,
          topic,
          totalQuestionsTaken: associatedQuestions.length,
          questionsTaken: [...associatedQuestions],
        });
      }
      response = this.selectDistinctByTopic(response);
      return (
        response.sort((a, b) =>
          a.pointsObtained > b.pointsObtained ? -1 : 1,
        ) ?? []
      );
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findPerformanceForTopicsUsingSessionKey(
    sessionKey: string,
    userId: string,
  ): Promise<UserPerformanceReviewDTO[]> {
    let response: UserPerformanceReviewDTO[] = [];
    // Find quiz Session and get the topics associated with them
    if (!sessionKey) {
      throw new BadRequestException('Field sessionKey is required');
    }
    try {
      const quizSession = await this.getRepo().findOne({
        where: { sessionKey, userId },
        relations: [...this.relations],
      });
      if (!quizSession?.id) {
        throw new NotFoundException(
          `No records found or Records found not matched to this user with id: '${userId}'`,
        );
      }
      const questionsAnsweredByUser =
        await quizSession.detailsForThisQuizSession.map(
          ({ question }) => question,
        );
      // Pull topics associated with questions
      const questionTopicRecords = await this.questionCourseTopicSrv
        .getRepo()
        .find({
          where: {
            questionId: In(questionsAnsweredByUser.map(({ id }) => id)),
          },
          relations: ['topic', 'question'],
        });

      const topicsTakenByUser = questionTopicRecords.map(({ topic }) => topic);
      for (const topic of topicsTakenByUser) {
        const associatedQuestions = questionTopicRecords
          .filter((item) => item.topicId === topic.id)
          .map(({ question }) => question);
        const totalPointsObtained = this.calculateTotal(
          associatedQuestions,
          quizSession.detailsForThisQuizSession,
        );
        response.push({
          pointsObtained: totalPointsObtained,
          topic,
          totalQuestionsTaken: associatedQuestions.length,
          questionsTaken: [...associatedQuestions],
        });
      }
      response = this.selectDistinctByTopic(response);
      return (
        response.sort((a, b) =>
          a.pointsObtained > b.pointsObtained ? -1 : 1,
        ) ?? []
      );
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private selectDistinctByTopic(
    payload: UserPerformanceReviewDTO[],
  ): UserPerformanceReviewDTO[] {
    const topicIds = payload.map((o) => o.topic.id);
    return payload.filter(
      ({ topic: { id } }, index) => !topicIds.includes(id, index + 1),
    );
  }

  private calculateTotal(
    associatedQuestions: Question[],
    quizDetails: QuizSessionDetail[],
  ): number {
    let totalPoints = 0;
    for (const question of associatedQuestions) {
      const quizDetail = quizDetails.find(
        (item) => item.questionId === question.id,
      );
      if (quizDetail?.result === StatusType.CORRECT) {
        totalPoints += POINTS_PER_QUESTION;
      }
    }
    return totalPoints;
  }
}
