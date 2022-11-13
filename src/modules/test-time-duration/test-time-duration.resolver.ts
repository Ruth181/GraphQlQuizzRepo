import { TestTimeDuration } from '@entities/test-time-duration.entity';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => TestTimeDuration)
export class TestTimeDurationResolver {}
