import { QuestionCourseTopic } from '@entities/question-course-topic.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GenericService } from 'src/generic.service';
import { CreateQuestionTopicDTO } from './dto/question-course-topic.dto';

@Injectable()
export class QuestionCourseTopicService extends GenericService(
  QuestionCourseTopic,
) {
  async createQuestionTopic(
    payload: CreateQuestionTopicDTO,
  ): Promise<QuestionCourseTopic> {
    if (!payload.questionId || !payload.topicId || !payload.courseId) {
      throw new BadRequestException(
        'Fields questionId, courseId and topicId are required',
      );
    }
    try {
      let questionTopicExists = await this.findOne({
        topicId: payload.topicId,
        questionId: payload.questionId,
      });
      if (!questionTopicExists?.id) {
        questionTopicExists = await this.create(payload);
      }
      return questionTopicExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
