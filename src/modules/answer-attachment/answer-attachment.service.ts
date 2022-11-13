import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileType } from '@utils/types/utils.types';
import { GenericService } from 'src/generic.service';
import { CreateAnswerAttachmentDTO } from './dto/answer-attachment.dto';

@Injectable()
export class AnswerAttachmentService extends GenericService(AnswerAttachment) {
  async createAnswerAttachment(
    payload: CreateAnswerAttachmentDTO,
    answerId: string,
  ): Promise<AnswerAttachment> {
    const { fileType, link } = payload;
    if (!answerId) {
      throw new BadRequestException('Field answerId is required');
    }
    if (!link || !fileType) {
      throw new BadRequestException('Fields link and fileType are required');
    }
    // TODO: refactor this into a function
    if (!Object.values(FileType).includes(fileType)) {
      throw new BadRequestException('Field fileType is invalid');
    }
    try {
      let answerAttachmentExists = await this.findOne({ link, fileType });
      if (!answerAttachmentExists?.id) {
        answerAttachmentExists = await this.create({ ...payload, answerId });
      }
      return answerAttachmentExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
