import { RandomTestTopic } from '@entities/random-test-topic.entity';
import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/generic.service';

@Injectable()
export class RandomTestTopicService extends GenericService(RandomTestTopic) {}
