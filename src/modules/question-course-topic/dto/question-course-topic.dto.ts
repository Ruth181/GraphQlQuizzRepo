import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionTopicDTO {
  @Field()
  questionId: string;

  @Field()
  topicId: string;

  @Field()
  courseId: string;
}
