import { TestTimeDuration } from '@entities/test-time-duration.entity';
import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/generic.service';

@Injectable()
export class TestTimeDurationService extends GenericService(TestTimeDuration) {}
