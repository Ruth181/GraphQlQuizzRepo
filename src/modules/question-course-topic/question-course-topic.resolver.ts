import { Context, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { Course } from '@entities/course.entity';
import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { Question } from '@entities/question.entity';
import { Topic } from '@entities/topic.entity';
import { MyContext } from './type/question-course-topic.type';
import { QuestionCourseTopicService } from './question-course-topic.service';

@Resolver(() => QuestionCourseTopic)
export class QuestionCourseTopicResolver {
  constructor(
    private readonly questionCourseTopicSrv: QuestionCourseTopicService,
  ) {}

  @ResolveField('course', () => Course)
  async resolveCourseField(
    @Root() { courseId }: QuestionCourseTopic,
    @Context() ctx: MyContext<Course>,
  ): Promise<Course> {
    return await ctx.courseForQCTLoader.load(courseId);
  }

  @ResolveField('question', () => Question)
  async resolveQuestionField(
    @Root() { questionId }: QuestionCourseTopic,
    @Context() ctx: MyContext<Question>,
  ): Promise<Question> {
    return await ctx.questionForQCTLoader.load(questionId);
  }

  @ResolveField('topic', () => Topic)
  async resolveTopicField(
    @Root() { topicId }: QuestionCourseTopic,
    @Context() ctx: MyContext<Topic>,
  ): Promise<Topic> {
    return await ctx.topicForQCTLoader.load(topicId);
  }
}
