import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { RandomTest } from '@entities/random-test.entity';
import { CourseService } from '@modules/course/course.service';
import { QuestionCourseTopicService } from '@modules/question-course-topic/question-course-topic.service';
import { RandomTestTopicService } from '@modules/random-test-topic/random-test-topic.service';
import { findMatchInStringArray } from '@utils/functions/utils.function';
import { GenericService } from 'src/generic.service';
import { CreateRandomTestDTO } from './dto/random-test.dto';

@Injectable()
export class RandomTestService extends GenericService(RandomTest) {
  private relations = [
    'course',
    'topicsUnderThisRandomTest',
    'topicsUnderThisRandomTest.randomTest',
    'topicsUnderThisRandomTest.topic',
    'testRecordsForThisRandomTest',
    'testRecordsForThisRandomTest.quizSession',
    'testRecordsForThisRandomTest.randomTest',
    'testRecordsForThisRandomTest.quizSession.user',
    'testRecordsForThisRandomTest.quizSession.detailsForThisQuizSession',
  ];

  constructor(
    private readonly randomTestTopicSrv: RandomTestTopicService,
    private readonly questionCourseTopicSrv: QuestionCourseTopicService,
    private readonly courseSrv: CourseService,
  ) {
    super();
  }

  async createRandomTest(payload: CreateRandomTestDTO): Promise<RandomTest> {
    const { courseId, noOfQuestions, topics } = payload;
    if (!courseId || !noOfQuestions || !topics) {
      throw new BadRequestException(
        'Fields courseId, topics, noOfQuestions are required',
      );
    }
    if (topics.length <= 0) {
      throw new BadRequestException('Please select at least one topic');
    }
    try {
      const courseExists = await this.courseSrv.getRepo().findOne({
        where: { id: courseId },
        relations: ['topicsUnderThisCourse'],
      });
      if (!courseExists?.id) {
        throw new NotFoundException('Course does not exist');
      }
      const topicsFromDB = courseExists.topicsUnderThisCourse.map(
        (topic) => topic.id,
      );
      const topicsNotMatched = findMatchInStringArray(
        topics,
        topicsFromDB,
        'NOT_IN',
      );
      if (topicsNotMatched.length > 0) {
        throw new NotFoundException(
          `Topics ${topicsNotMatched.join(',')} do not exist under course: '${
            courseExists.name
          }'`,
        );
      }
      const questionsFromDB = await this.questionCourseTopicSrv.getRepo().find({
        where: { topicId: In(topics) },
        relations: ['question'],
      });
      if (questionsFromDB.length < noOfQuestions) {
        throw new NotFoundException(
          `Number of questions '${noOfQuestions}' is > number of available questions: '${questionsFromDB.length}'`,
        );
      }
      // Deactivate previous random tests
      await this.getRepo().update({ courseId }, { status: false });
      const createdRandomTest = await this.create({ noOfQuestions, courseId });
      if (createdRandomTest?.id) {
        await this.randomTestTopicSrv.createMany([
          ...topics.map((topicId) => ({
            topicId,
            randomTestId: createdRandomTest.id,
          })),
        ]);
      }
      return createdRandomTest;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findRandomTestById(randomTestId: string): Promise<RandomTest> {
    if (!randomTestId) {
      throw new BadRequestException('Field randomTestId is required');
    }
    try {
      const randomTest = await this.getRepo().findOne({
        where: { id: randomTestId },
        relations: [...this.relations],
      });
      if (!randomTest?.id) {
        throw new NotFoundException('Random test not found');
      }
      return randomTest;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllRandomTests(): Promise<RandomTest[]> {
    try {
      const randomTests = await this.getRepo().find({
        relations: [...this.relations],
      });
      if (!randomTests?.length) {
        throw new NotFoundException();
      }
      return randomTests;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
