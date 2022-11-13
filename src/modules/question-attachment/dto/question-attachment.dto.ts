import { CreateAnswerAttachmentDTO } from '@modules/answer-attachment/dto/answer-attachment.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionAttachmentDTO extends CreateAnswerAttachmentDTO {}
