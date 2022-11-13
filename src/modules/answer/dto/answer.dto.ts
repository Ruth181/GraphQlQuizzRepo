import { CreateAnswerAttachmentDTO } from '@modules/answer-attachment/dto/answer-attachment.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAnswerDTO {
  @Field()
  text: string;

  @Field()
  isCorrect: boolean;

  @Field(() => [CreateAnswerAttachmentDTO], {
    nullable: true,
    description:
      'Contains list of pictures or other media attached to an answer',
  })
  attachments?: CreateAnswerAttachmentDTO[];
}
