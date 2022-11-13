import { Topic } from '@entities/topic.entity';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { FileResponseDTO } from 'src/app.service';

@InputType()
export class CreateTopicDTO {
  @Field()
  name: string;

  @Field()
  courseId: string;
}

@InputType()
export class UpdateTopicDTO extends PartialType(CreateTopicDTO) {
  @Field()
  topicId: string;

  @Field({ nullable: true })
  status: boolean;
}

export class FailedUploadType {
  topic: string;
  message: string;
}

export class BulkTopicResponseDTO extends FileResponseDTO<Topic[]> {
  topicsThatFailedUpload: FailedUploadType[];
}
