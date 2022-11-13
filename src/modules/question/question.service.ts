import { AnswerService } from '@modules/answer/answer.service';
import { QuestionAttachmentService } from '@modules/question-attachment/question-attachment.service';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Question } from '@entities/question.entity';
import { GenericService } from 'src/generic.service';
import { CreateQuestionDTO, CreateSingleQuestionDTO } from './dto/question.dto';
import { TopicService } from '@modules/topic/topic.service';
import {
  arrayDifference,
  extractExcelSheetData,
  findMatchInStringArray,
  randomizeOrderOfArray,
} from '@utils/functions/utils.function';
import { RequestStatus, StatusType, TestType } from '@utils/types/utils.types';
import {
  BulkQuestionResponseDTO,
  FailedUploadType,
} from '@modules/question/dto/question.dto';
import { CourseService } from '@modules/course/course.service';
import { Topic } from '@entities/topic.entity';
import { DepartmentService } from '@modules/department/department.service';
import { TestTimeDurationService } from '@modules/test-time-duration/test-time-duration.service';
import { QuizSessionService } from '@modules/quiz-session/quiz-session.service';
import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { UserService } from '@modules/user/user.service';
import { In } from 'typeorm';
import { RandomTestService } from '@modules/random-test/random-test.service';

@Injectable()
export class QuestionService extends GenericService(Question) {
  private relations = [
    'attachmentsForThisQuestion',
    'answersForThisQuestion',
    'questionTopicRecordsForThisQuestion',
    'questionTopicRecordsForThisQuestion.topic',
    'questionTopicRecordsForThisQuestion.topic.course',
    'questionTopicRecordsForThisQuestion.course',
    'quizSessionDetailsForThisQuestion',
    'quizSessionDetailsForThisQuestion.quizSession',
    'quizSessionDetailsForThisQuestion.question',
  ];

  constructor(
    private readonly answerSrv: AnswerService,
    private readonly questionAttachmentSrv: QuestionAttachmentService,
    private readonly questionCourseTopicSrv: QuestionCourseTopicService,
    private readonly topicSrv: TopicService,
    private readonly courseSrv: CourseService,
    private readonly departmentSrv: DepartmentService,
    private readonly testTimeDurationSrv: TestTimeDurationService,
    private readonly quizSessionSrv: QuizSessionService,
    private readonly randomTestSrv: RandomTestService,
    private readonly userSrv: UserService,
  ) {
    super();
  }

  async createQuestion(payload: CreateQuestionDTO): Promise<Question> {
    const { answers, text, topicId, attachments, explanation } = payload;
    const isSingleChoiceAnswer =
      typeof payload.isSingleChoiceAnswer === 'undefined'
        ? true
        : payload.isSingleChoiceAnswer;

    if (!answers || answers?.length < 1 || !text) {
      throw new BadRequestException('Fields answers and text are required');
    }
    if (!answers.find((answer) => answer.isCorrect)) {
      throw new BadRequestException('At least one answer must be  correct');
    }
    const textToUppercase = text.toUpperCase();
    const questionExists = await this.getRepo().findOne({
      where: { text: textToUppercase },
      select: ['id'],
    });
    if (questionExists?.id) {
      throw new ConflictException('Question already exists');
    }
    const createdQuestion = await this.create({
      text,
      isSingleChoiceAnswer,
      explanation,
    });
    if (createdQuestion?.id && answers?.length > 0) {
      await Promise.all(
        answers.map((answer) =>
          this.answerSrv.createAnswer(answer, createdQuestion.id),
        ),
      );
      if (attachments?.length > 0) {
        await Promise.all(
          attachments.map((attachment) =>
            this.questionAttachmentSrv.createQuestionAttachment(
              attachment,
              createdQuestion.id,
            ),
          ),
        );
      }
      if (topicId) {
        const topic = await this.topicSrv.getRepo().findOne({
          where: { id: topicId },
          select: ['courseId'],
        });
        if (!topic?.courseId) {
          throw new NotFoundException(`Topic with id '${topicId}' not found`);
        }
        // Attach created question to a given topic
        await this.questionCourseTopicSrv.createQuestionTopic({
          questionId: createdQuestion.id,
          courseId: topic.courseId,
          topicId,
        });
      }
    }
    return createdQuestion;
  }

  async saveSingleQuestion(
    payload: CreateSingleQuestionDTO,
  ): Promise<Question> {
    const { answers, text, topicId, courseId, departmentId, explanation } =
      payload;
    try {
      const selectedTopic = await this.createDependentDataForBulkQuestionUpload(
        courseId,
        topicId,
        departmentId,
      );
      const questionText = `${
        text.endsWith('?') ? text : `${text}?`
      }`.toUpperCase();
      if (selectedTopic?.id) {
        const questionExists = await this.findOne({ text: questionText });
        if (!questionExists?.id) {
          const createdQuestion = await this.create({
            text,
            isSingleChoiceAnswer: true,
            explanation,
          });
          // Connect question to topic
          if (topicId) {
            await this.questionCourseTopicSrv.create({
              questionId: createdQuestion.id,
              courseId: selectedTopic.courseId,
              topicId: selectedTopic.id,
            });
          }
          // Save answers
          createdQuestion.answersForThisQuestion = await Promise.all(
            answers.map((answer) =>
              this.answerSrv.createAnswer(answer, createdQuestion.id),
            ),
          );
          return createdQuestion;
        }
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  // Query 'RandomTest' by 'courseId' and confirm that there a random test session set by the admin
  // - Pull relation: 'topicsUnderThisRandomTest'
  // - Use: 'topicsUnderThisRandomTest' to get list of topics under this test.
  // - Query QuestionCourseTopic to pick questions under each of these topics.
  // - Query QuizSession by 'userId', pull relation: 'detailsForThisQuizSession' and 'detailsForThisQuizSession.question'
  // - Compare which questions are already taken by the user that passed
  // - Remove those 'passed' questions from the list of questions to be returned
  // - if (randomTest.numberOfQuestions > questions.length) {
  // -- Query questions from the database
  // -- Remove duplicates from the array
  // -- Slice down by randomTest.numberOfQuestions
  async generateRandomTest(
    userId: string,
    courseId: string,
  ): Promise<Question[]> {
    if (!courseId || !userId) {
      throw new BadRequestException('Fields courseId and userId are required');
    }
    try {
      const returnedQuestions: Question[] = [];
      const randomTest = await this.randomTestSrv.getRepo().findOne({
        where: { courseId, status: true },
        relations: ['topicsUnderThisRandomTest'],
      });
      if (!randomTest?.id) {
        throw new NotFoundException(
          `Random test not found for courseId '${courseId}'`,
        );
      }
      const listOfTopics = randomTest.topicsUnderThisRandomTest.map(
        (topic) => topic.topicId,
      );
      if (!listOfTopics) {
        throw new NotFoundException(
          `No topics found for courseId '${courseId}'`,
        );
      }
      const questionCourseTopics = await this.questionCourseTopicSrv
        .getRepo()
        .find({
          where: { topicId: In(listOfTopics) },
          relations: ['question'],
        });
      const questionUnderRandomTestTopics = questionCourseTopics.map(
        ({ question }) => question,
      );
      const questionsUserHasAlreadyTaken =
        await this.findQuestionsAlreadyTakenByUser(userId, true);

      const difference = arrayDifference(
        questionUnderRandomTestTopics,
        questionsUserHasAlreadyTaken,
        'id',
      );
      if (difference.length < 1) {
        throw new BadRequestException(
          'No questions found for this random test',
        );
      }
      returnedQuestions.push(...difference.slice(0, randomTest.noOfQuestions));
      // return returnedQuestions;
      return await this.getRepo().findByIds(
        returnedQuestions.map(({ id }) => id),
        {
          relations: [...this.relations],
        },
      );
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findQuestionById(questionId: string): Promise<Question> {
    if (!questionId) {
      throw new BadRequestException('Field questionId is required');
    }
    try {
      const question = await this.getRepo().findOne({
        where: { id: questionId },
        relations: [...this.relations],
      });
      if (!question?.id) {
        throw new NotFoundException();
      }
      return question;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllQuestions(): Promise<Question[]> {
    try {
      return await this.getRepo().find({
        relations: [...this.relations],
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async findQuestionsAlreadyTakenByUser(
    userId: string,
    onlyIsFailed = false,
  ): Promise<Question[]> {
    try {
      const returnedQuestions: Question[] = [];
      const usersQuizSessions = await this.quizSessionSrv.getRepo().find({
        where: { userId },
        relations: [
          'detailsForThisQuizSession',
          'detailsForThisQuizSession.question',
        ],
      });
      if (usersQuizSessions?.length > 0) {
        let questionDetails = usersQuizSessions
          .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
          .flat();
        if (onlyIsFailed) {
          questionDetails = questionDetails.filter(
            ({ result }) => result !== StatusType.CORRECT,
          );
        }
        const questions = questionDetails.map(({ question }) => question);
        if (questions?.length > 0) {
          returnedQuestions.push(...questions);
        }
      }
      return returnedQuestions;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  // async generateRandomTest(userId: string): Promise<Question[]> {
  //   if (!userId) {
  //     throw new BadRequestException('Field userId is required');
  //   }
  //   try {
  //     const user = await this.userSrv.getRepo().findOne({
  //       where: { id: userId },
  //       relations: ['department'],
  //     });
  //     if (!user?.department?.id) {
  //       throw new NotFoundException(
  //         `User with id '${userId}' not attached to a department`,
  //       );
  //     }
  //     // Questions can be selected from multiple topics
  //     let questionPool: Question[];
  //     let noOfQuestions = 0;
  //     // Get number of questions for balanced tests
  //     const testDetails = await this.testTimeDurationSrv.getRepo().findOne({
  //       where: { status: true, testType: TestType.RANDOMIZED_TEST },
  //       select: ['id', 'noOfQuestions'],
  //     });
  //     if (!testDetails?.noOfQuestions) {
  //       throw new BadRequestException(
  //         'No of questions has not been set for balanced test',
  //       );
  //     }
  //     noOfQuestions = testDetails.noOfQuestions;
  //     questionPool = await this.findAllByCondition({ status: true });

  //     const courses = await this.courseSrv.findAllByCondition({
  //       departmentId: user.department.id,
  //     });
  //     if (!courses?.length) {
  //       return await this.generateGenericRandomTest(userId);
  //     } else {
  //       const courseIds = courses.map((course) => course.id);
  //       const questionTopicRecords = await this.questionCourseTopicSrv
  //         .getRepo()
  //         .find({
  //           where: { courseId: In(courseIds), status: true },
  //           relations: ['question'],
  //         });
  //       const questionsUnderThisCourse: Question[] = [];
  //       if (questionTopicRecords?.length) {
  //         questionsUnderThisCourse.push(
  //           ...questionTopicRecords.map(({ question }) => question),
  //         );
  //       }
  //       const questionsAlreadyTakenByUser: QuizSessionDetail[] = [];
  //       const gameSessionsPlayedByUser = await this.quizSessionSrv
  //         .getRepo()
  //         .find({
  //           where: { userId },
  //           relations: [
  //             'detailsForThisQuizSession',
  //             'detailsForThisQuizSession.question',
  //           ],
  //         });
  //       if (questionsAlreadyTakenByUser?.length > 0) {
  //         const extractedQuestions = gameSessionsPlayedByUser
  //           .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
  //           .flat(2);
  //         questionsAlreadyTakenByUser.push(...extractedQuestions);
  //       }
  //       const mappedQuestionPool = await this.selectQuestionPoolForBalancedTest(
  //         questionsUnderThisCourse,
  //         questionsAlreadyTakenByUser,
  //       );

  //       if (mappedQuestionPool?.length < noOfQuestions) {
  //         const difference = arrayDifference(
  //           questionPool,
  //           mappedQuestionPool,
  //           'id',
  //         );
  //         questionPool = [...mappedQuestionPool, ...difference];
  //       }
  //       questionPool = randomizeOrderOfArray(questionPool);
  //       return questionPool.slice(0, noOfQuestions);
  //     }
  //   } catch (ex) {
  //     this.logger.error(ex);
  //     throw ex;
  //   }
  // }

  /**
   * Use this for pulling random pool of questions from all courses,
   * irrespective of the user's department
   * @param userId
   * @returns
   */
  async generateGenericRandomTest(userId: string): Promise<Question[]> {
    if (!userId) {
      throw new BadRequestException('Field userId is required');
    }
    try {
      let questionPool: Question[];
      let noOfQuestions = 0;
      // Get number of questions for balanced tests
      const testDetails = await this.testTimeDurationSrv.getRepo().findOne({
        where: { status: true, testType: TestType.RANDOMIZED_TEST },
        select: ['id', 'noOfQuestions'],
      });
      if (!testDetails?.noOfQuestions) {
        throw new BadRequestException(
          'No of questions has not been set for balanced test',
        );
      }
      noOfQuestions = testDetails.noOfQuestions;
      questionPool = await this.findAllByCondition({ status: true });

      // Get all game sessions for this user
      const gameSessionsPlayedByUser = await this.quizSessionSrv
        .getRepo()
        .find({
          where: { userId },
          relations: [
            'detailsForThisQuizSession',
            'detailsForThisQuizSession.question',
          ],
        });
      const extractedQuestions = gameSessionsPlayedByUser
        .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
        .flat(2);
      const mappedQuestionPool = await this.selectQuestionPoolForBalancedTest(
        questionPool,
        extractedQuestions,
      );
      if (mappedQuestionPool?.length < noOfQuestions) {
        const difference = arrayDifference(
          questionPool,
          mappedQuestionPool,
          'id',
        );
        questionPool = [...mappedQuestionPool, ...difference];
      }
      questionPool = randomizeOrderOfArray(questionPool);
      return questionPool.slice(0, noOfQuestions);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async generateBalancedTest(
    courseId: string,
    userId: string,
  ): Promise<Question[]> {
    if (!courseId || !userId) {
      throw new BadRequestException('Fields courseId and userId are required');
    }
    try {
      const topics = await this.topicSrv
        .getRepo()
        .find({ where: { courseId }, select: ['id'] });
      if (topics?.length > 0) {
        let noOfQuestions = 0;
        // Get number of questions for balanced tests
        const testDetails = await this.testTimeDurationSrv.getRepo().findOne({
          where: { status: true, testType: TestType.BALANCED_TEST },
          select: ['id', 'noOfQuestions'],
        });
        if (!testDetails?.noOfQuestions) {
          throw new BadRequestException(
            'No of questions has not been set for balanced test',
          );
        }
        noOfQuestions = testDetails.noOfQuestions;

        const questionsUnderThisCourse: Question[] = [];
        // Find all questions under this course
        const courseQuestionRecords = await this.questionCourseTopicSrv
          .getRepo()
          .find({
            where: { courseId },
            relations: ['question'],
          });
        if (courseQuestionRecords?.length > 0) {
          questionsUnderThisCourse.push(
            ...courseQuestionRecords.map((record) => record.question),
          );
        }

        const questionsAlreadyTakenByUser: QuizSessionDetail[] = [];
        const gameSessionsPlayedByUser = await this.quizSessionSrv
          .getRepo()
          .find({
            where: { userId },
            relations: [
              'detailsForThisQuizSession',
              'detailsForThisQuizSession.question',
            ],
          });
        if (questionsAlreadyTakenByUser?.length > 0) {
          const extractedQuestions = gameSessionsPlayedByUser
            .map(({ detailsForThisQuizSession }) => detailsForThisQuizSession)
            .flat(2);
          questionsAlreadyTakenByUser.push(...extractedQuestions);
        }
        let questionPool = await this.selectQuestionPoolForBalancedTest(
          questionsUnderThisCourse,
          questionsAlreadyTakenByUser,
        );

        // If not enough questions are available, then add questions from other topics
        if (questionPool?.length < noOfQuestions) {
          questionPool = [...questionsUnderThisCourse];
        }
        questionPool = randomizeOrderOfArray(questionPool);
        questionPool = await this.getRepo().findByIds(
          questionPool.map(({ id }) => id),
          {
            relations: [...this.relations],
          },
        );
        return questionPool.slice(0, noOfQuestions);
      }
      throw new NotFoundException('No topics found under this course');
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async selectQuestionPoolForBalancedTest(
    courseQuestions: Question[],
    gamePlayDetails: QuizSessionDetail[],
  ): Promise<Question[]> {
    const questionPool: Question[] = [];
    try {
      const courseQuestionsMappedDownToIds = courseQuestions.map(
        ({ id }) => id,
      );
      const gamePlayDetailsMappedDownToIds = gamePlayDetails.map(
        ({ question: { id } }) => id,
      );
      const questionsUserHasNotTaken = findMatchInStringArray(
        courseQuestionsMappedDownToIds,
        gamePlayDetailsMappedDownToIds,
        'NOT_IN',
      );
      const questionsRecords = await this.getRepo().findByIds(
        questionsUserHasNotTaken,
      );
      questionPool.push(...questionsRecords);

      // Find questions the were failed or skipped
      const failedQuestions = await gamePlayDetails.filter(
        ({ result }) =>
          result === StatusType.FAILED || result === StatusType.SKIPPED,
      );
      questionPool.push(...failedQuestions.map((item) => item.question));
      return questionPool;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createQuestionInBulk(
    excelFileLink: string,
  ): Promise<BulkQuestionResponseDTO> {
    if (!excelFileLink) {
      throw new BadRequestException('Excel file must be uploaded');
    }
    try {
      const excelData = extractExcelSheetData(excelFileLink, true);
      const createdQuestions: Question[] = [];
      const failedUploads: FailedUploadType[] = [];
      for (const question of excelData) {
        const answersArray = Object.keys(question)
          .filter((optionLabel) =>
            optionLabel?.toUpperCase().startsWith('OPTION'),
          )
          .map((optionLabel) => ({
            text: question[optionLabel],
            isCorrect: optionLabel
              .toUpperCase()
              .endsWith(question['Answer'].toUpperCase()),
          }));
        const data: CreateSingleQuestionDTO = {
          text: question['Question'],
          topicId: question['TopicID'],
          explanation: question['Explanation'],
          courseId: question['CategoryID'],
          departmentId: question['DepartmentID'],
          answers: answersArray,
        };
        const createdQuestion = await this.saveSingleQuestion(data);
        if (createdQuestion?.id) {
          createdQuestions.push(createdQuestion);
        } else {
          const message = `Question: '${question['Question']}' already probably exists`;
          failedUploads.push({
            serialNumber: question['S/N'],
            question: question['Question'],
            message,
          });
        }
      }
      return {
        status: RequestStatus.SUCCESSFUL,
        data: createdQuestions,
        questionsThatFailedUpload: failedUploads,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async createDependentDataForBulkQuestionUpload(
    course: string,
    topic: string,
    department: string,
  ): Promise<Topic> {
    try {
      let departmentExists = await this.departmentSrv.findOne({
        name: department.toUpperCase(),
      });
      if (!departmentExists?.id) {
        departmentExists = await this.departmentSrv.create({
          name: department,
        });
      }
      let courseExists = await this.courseSrv.findOne({
        name: course.toUpperCase(),
      });
      if (!courseExists?.id) {
        courseExists = await this.courseSrv.create({
          departmentId: departmentExists.id,
          name: course,
        });
      }

      let topicExists = await this.topicSrv.findOne({
        name: topic.toUpperCase(),
      });
      if (!topicExists?.id) {
        topicExists = await this.topicSrv.create({
          courseId: courseExists.id,
          name: topic,
        });
      }
      return topicExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
