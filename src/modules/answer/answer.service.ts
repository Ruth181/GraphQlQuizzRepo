import { Answer } from '@entities/answer.entity';
import { AnswerAttachmentService } from '@modules/answer-attachment/answer-attachment.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GenericService } from 'src/generic.service';
import { CreateAnswerDTO } from './dto/answer.dto';

@Injectable()
export class AnswerService extends GenericService(Answer) {
  constructor(private readonly answerAttachmentSrv: AnswerAttachmentService) {
    super();
  }

  async createAnswer(
    payload: CreateAnswerDTO,
    questionId: string,
  ): Promise<Answer> {
    const { isCorrect, text, attachments } = payload;
    if (!questionId) {
      throw new BadRequestException('Field questionId is required');
    }
    if (!text || typeof isCorrect === 'undefined') {
      throw new BadRequestException('Fields text and isCorrect is required');
    }
    try {
      const textToUppercase = text.toUpperCase();
      let answerExists = await this.findOne({
        questionId,
        text: textToUppercase,
      });
      if (!answerExists?.id) {
        answerExists = await this.create({ text, isCorrect, questionId });
        if (answerExists?.id && attachments?.length > 0) {
          await Promise.all(
            attachments.map((attachment) =>
              this.answerAttachmentSrv.createAnswerAttachment(
                attachment,
                answerExists.id,
              ),
            ),
          );
        }
      }
      return answerExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAnswersByIds(answerIds: readonly string[]): Promise<Answer[]> {
    try {
      return await this.getRepo().findByIds([...answerIds]);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
