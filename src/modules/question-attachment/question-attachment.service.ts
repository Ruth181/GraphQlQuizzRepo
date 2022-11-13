import { QuestionAttachment } from '@entities/question-attachment.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileType } from '@utils/types/utils.types';
import { GenericService } from 'src/generic.service';
import { CreateQuestionAttachmentDTO } from './dto/question-attachment.dto';

@Injectable()
export class QuestionAttachmentService extends GenericService(
  QuestionAttachment,
) {
  async createQuestionAttachment(
    payload: CreateQuestionAttachmentDTO,
    questionId: string,
  ): Promise<QuestionAttachment> {
    const { fileType, link } = payload;
    if (!questionId) {
      throw new BadRequestException('Field questionId is required');
    }
    if (!link || !fileType) {
      throw new BadRequestException('Fields link and fileType are required');
    }
    // TODO: refactor this into a function
    if (!Object.values(FileType).includes(fileType)) {
      throw new BadRequestException('Field fileType is invalid');
    }
    try {
      let questionAttachmentExists = await this.findOne({ link, fileType });
      if (!questionAttachmentExists?.id) {
        questionAttachmentExists = await this.create({
          ...payload,
          questionId,
        });
      }
      return questionAttachmentExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
