import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RandomTestService } from '@modules/random-test/random-test.service';
import { GenericService } from 'src/generic.service';
import { CreateRandomTestQuizRecordDTO } from './dto/random-test-quiz-record.dto';

@Injectable()
export class RandomTestQuizRecordService extends GenericService(
  RandomTestQuizRecord,
) {
  constructor(private readonly randomTestSrv: RandomTestService) {
    super();
  }

  async createRandomTestQuizRecord({
    userId,
    quizSessionId,
    courseId,
  }: CreateRandomTestQuizRecordDTO): Promise<RandomTestQuizRecord> {
    const randomTest = await this.randomTestSrv.findOne({
      courseId,
      status: true,
    });
    if (!randomTest?.id) {
      throw new NotFoundException('No random test has been set');
    }
    return await this.create({
      userId,
      quizSessionId,
      randomTestId: randomTest.id,
    });
  }
}
