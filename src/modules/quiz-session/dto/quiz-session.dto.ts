import { Course } from '@entities/course.entity';
import { Question } from '@entities/question.entity';
import { Topic } from '@entities/topic.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StatusType, TestType } from '@utils/types/utils.types';

@InputType()
export class PartialCreateQuizSessionDetailDTO {
  @Field()
  questionId: string;

  @Field({ nullable: true })
  selectedAnswerId?: string;
}

@InputType()
export class CreateQuizSessionDTO {
  @Field(() => TestType)
  testType: TestType;

  @Field()
  courseId: string;

  @Field(() => [PartialCreateQuizSessionDetailDTO])
  questions: PartialCreateQuizSessionDetailDTO[];
}

@ObjectType()
export class QuestionPartialDTO {
  @Field()
  correctAnswer: string;

  @Field({ nullable: true })
  explanation: string;

  @Field()
  question: Question;

  @Field(() => StatusType)
  result: StatusType;
}

@ObjectType()
export class QuizSessionPerformanceDTO {
  @Field()
  sessionKey: string;

  @Field(() => Int)
  totalPointsObtained: number;

  @Field(() => TestType)
  testType: TestType;

  @Field(() => Course, { nullable: true })
  course?: Course;

  @Field(() => [QuestionPartialDTO])
  failedQuestions: QuestionPartialDTO[];
}

@ObjectType()
export class UserPerformanceReviewDTO {
  @Field(() => Topic)
  topic: Topic;

  @Field(() => [Question])
  questionsTaken: Question[];

  @Field(() => Int)
  pointsObtained: number;

  @Field(() => Int)
  totalQuestionsTaken: number;
}
