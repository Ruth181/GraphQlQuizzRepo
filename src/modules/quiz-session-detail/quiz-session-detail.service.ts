import { QuizSessionDetail } from '@entities/quiz-session-detail.entity';
import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/generic.service';

@Injectable()
export class QuizSessionDetailService extends GenericService(
  QuizSessionDetail,
) {}
