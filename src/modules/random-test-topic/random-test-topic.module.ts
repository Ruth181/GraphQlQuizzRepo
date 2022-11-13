import { Module } from '@nestjs/common';
import { RandomTestTopicService } from './random-test-topic.service';
import { RandomTestTopicResolver } from './random-test-topic.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomTestTopic } from '@entities/random-test-topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RandomTestTopic])],
  providers: [RandomTestTopicService, RandomTestTopicResolver],
  exports: [RandomTestTopicService],
})
export class RandomTestTopicModule {}
