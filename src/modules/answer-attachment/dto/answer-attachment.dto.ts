import { Field, InputType, Int } from '@nestjs/graphql';
import { FileType } from '@utils/types/utils.types';

@InputType()
export class CreateAnswerAttachmentDTO {
  @Field()
  link: string;

  @Field(() => FileType)
  fileType: FileType;

  @Field(() => Int, {
    nullable: true,
    description: `Location of the file in the string 'text'`,
  })
  stringPosition?: number;
}
