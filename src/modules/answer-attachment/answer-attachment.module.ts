import { Module, forwardRef } from '@nestjs/common';
import { AnswerAttachmentService } from './answer-attachment.service';
import { AnswerAttachmentResolver } from './answer-attachment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { AnswerService } from '@modules/answer/answer.service';
import { Answer } from '@entities/answer.entity';
import { AnswerModule } from '@modules/answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerAttachment, Answer]),
    forwardRef(() => AnswerModule),
  ],
  providers: [AnswerAttachmentService, AnswerAttachmentResolver, AnswerService],
  exports: [AnswerAttachmentService],
})
export class AnswerAttachmentModule {}
