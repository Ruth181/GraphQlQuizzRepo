import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRandomTestTopicDTO {
  @Field()
  topicId: string;

  @Field()
  randomTestId: string;
}
