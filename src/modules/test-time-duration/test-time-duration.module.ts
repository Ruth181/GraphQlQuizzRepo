import { Module } from '@nestjs/common';
import { TestTimeDurationService } from './test-time-duration.service';
import { TestTimeDurationResolver } from './test-time-duration.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTimeDuration } from '@entities/test-time-duration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestTimeDuration])],
  providers: [TestTimeDurationService, TestTimeDurationResolver],
  exports: [TestTimeDurationService],
})
export class TestTimeDurationModule {}
