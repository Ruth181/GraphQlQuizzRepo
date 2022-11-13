import { Field, InputType, PickType } from '@nestjs/graphql';
import { CreateAnswerDTO } from '@modules/answer/dto/answer.dto';
import { CreateQuestionAttachmentDTO } from '@modules/question-attachment/dto/question-attachment.dto';
import { Question } from '@entities/question.entity';
import { FileResponseDTO } from 'src/app.service';

@InputType()
export class CreateQuestionDTO {
  @Field()
  text: string;

  @Field({ nullable: true })
  isSingleChoiceAnswer: boolean;

  @Field(() => [CreateAnswerDTO])
  answers: CreateAnswerDTO[];

  @Field({ nullable: true })
  explanation?: string;

  @Field({
    nullable: true,
    description: 'Add topic to attach question to a topic',
  })
  topicId?: string;

  @Field(() => [CreateQuestionAttachmentDTO], {
    nullable: true,
    description:
      'Contains list of pictures or other media attached to a question',
  })
  attachments?: CreateQuestionAttachmentDTO[];
}

@InputType()
export class CreateSingleQuestionDTO extends PickType(CreateQuestionDTO, [
  'text',
  'topicId',
  'answers',
  'explanation',
] as const) {
  @Field()
  courseId: string;

  @Field()
  departmentId: string;
}

export class FailedUploadType {
  serialNumber: number;
  question: string;
  message: string;
}

export class BulkQuestionResponseDTO extends FileResponseDTO<Question[]> {
  questionsThatFailedUpload: FailedUploadType[];
}
