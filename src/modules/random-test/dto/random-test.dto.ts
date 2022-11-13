import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateRandomTestDTO {
  @Field()
  courseId: string;

  @Field(() => [String], { description: 'TopicIds for random test' })
  topics: string[];

  @Field(() => Int)
  noOfQuestions: number;
}
