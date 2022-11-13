import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRandomTestQuizRecordDTO {
  @Field()
  userId: string;

  @Field()
  quizSessionId: string;

  @Field()
  courseId: string;
}
