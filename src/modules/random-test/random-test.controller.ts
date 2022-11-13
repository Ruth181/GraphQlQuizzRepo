import { RandomTest } from '@entities/random-test.entity';
import { Controller, Param, Get, ParseUUIDPipe } from '@nestjs/common';
import { RandomTestService } from './random-test.service';

@Controller('random-test')
export class RandomTestController {
  constructor(private readonly randomTestSrv: RandomTestService) {}

  @Get('/')
  async findAllRandomTests(): Promise<RandomTest[]> {
    return await this.randomTestSrv.findAllRandomTests();
  }

  @Get('/:randomTestId')
  async findRandomTestById(
    @Param('randomTestId', ParseUUIDPipe) randomTestId: string,
  ): Promise<RandomTest> {
    return await this.randomTestSrv.findRandomTestById(randomTestId);
  }
}
