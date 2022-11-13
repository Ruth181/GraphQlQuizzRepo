import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Topic } from '@entities/topic.entity';
import { GenericService } from 'src/generic.service';
import {
  BulkTopicResponseDTO,
  CreateTopicDTO,
  FailedUploadType,
  UpdateTopicDTO,
} from './dto/topic.dto';
import { extractExcelSheetData } from '@utils/functions/utils.function';
import { RequestStatus } from '@utils/types/utils.types';
import { CourseService } from '@modules/course/course.service';

@Injectable()
export class TopicService extends GenericService(Topic) {
  private relations = [
    'course',
    'questionTopicRecordsForThisTopic',
    'questionTopicRecordsForThisTopic.question',
    'questionTopicRecordsForThisTopic.question.answersForThisQuestion',
    'questionTopicRecordsForThisTopic.course',
    'questionTopicRecordsForThisTopic.topic',
    'randomTestTopicsForThisTopic',
    'randomTestTopicsForThisTopic.topic',
    'randomTestTopicsForThisTopic.randomTest',
  ];

  constructor(private readonly courseSrv: CourseService) {
    super();
  }

  async createTopic(payload: CreateTopicDTO): Promise<Topic> {
    const { courseId, name } = payload;
    if (!name || !courseId) {
      throw new BadRequestException('Fields name and courseId are required');
    }
    try {
      const nameToUppercase = name.toUpperCase();
      let topicExists = await this.findOne({ name: nameToUppercase });
      if (!topicExists?.id) {
        topicExists = await this.create(payload);
      }
      return topicExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateTopic(payload: UpdateTopicDTO): Promise<Topic> {
    const { status, topicId, courseId, name } = payload;
    if (!topicId) {
      throw new BadRequestException('Field topicId is required');
    }
    try {
      const topicExists = await this.findOne({ id: topicId });
      if (!topicExists?.id) {
        throw new NotFoundException();
      }
      if (name && name !== topicExists.name) {
        topicExists.name = name.toUpperCase();
      }
      if ('status' in payload) {
        topicExists.status = status;
      }
      if (courseId && courseId !== topicExists.courseId) {
        topicExists.courseId = courseId;
      }
      const updatedTopic: Partial<Topic> = {
        courseId: topicExists.courseId,
        status: topicExists.status,
        name: topicExists.name,
      };
      await this.getRepo().update({ id: topicExists.id }, updatedTopic);
      return await this.findOne({ id: topicExists.id });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createTopicInBulk(
    excelFileLink: string,
  ): Promise<BulkTopicResponseDTO> {
    if (!excelFileLink) {
      throw new BadRequestException('Excel file must be uploaded');
    }
    try {
      type ExcelType = { Name: string; Course: string };
      const excelData = extractExcelSheetData<ExcelType>(excelFileLink, true);
      const createdTopics: Topic[] = [];
      const failedUploads: FailedUploadType[] = [];
      for (const topic of excelData) {
        const { Name: name, Course: courseName } = topic;
        let message = `Topic '${name}' already exists`;
        const topicExists = await this.getRepo().findOne({
          where: { name: name.toUpperCase() },
          select: ['id'],
        });
        if (topicExists?.id) {
          failedUploads.push({
            topic: name,
            message,
          });
          continue;
        }
        const courseFound = await this.courseSrv.getRepo().findOne({
          where: { name: courseName.toUpperCase() },
          select: ['id'],
        });
        if (!courseFound?.id) {
          message = `Course '${courseName}' does not exist. Try creating it first`;
          failedUploads.push({
            topic: name,
            message,
          });
        } else {
          const newTopic = await this.create({
            name,
            courseId: courseFound.id,
          });
          createdTopics.push(newTopic);
        }
      }
      return {
        data: createdTopics,
        topicsThatFailedUpload: failedUploads,
        status: RequestStatus.SUCCESSFUL,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findTopicsWithQuestionsByCourseId(
    courseId: string,
    addRelations = true,
  ): Promise<Topic[]> {
    if (!courseId) {
      throw new BadRequestException('Field courseId is required');
    }
    try {
      let filters: any = { where: { courseId } };
      if (addRelations) {
        filters = { ...filters, relations: [...this.relations] };
      }
      const topics = await this.getRepo().find(filters);
      return topics.filter(
        ({ questionTopicRecordsForThisTopic }) =>
          questionTopicRecordsForThisTopic.length > 0,
      );
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findTopicById(topicId: string): Promise<Topic> {
    if (!topicId) {
      throw new BadRequestException('Field topicId is required');
    }
    try {
      const topic = await this.getRepo().findOne({
        where: { id: topicId },
        relations: [...this.relations],
      });
      return topic;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllTopics(): Promise<Topic[]> {
    try {
      const topics = await this.getRepo().find({
        relations: [...this.relations],
      });
      if (topics?.length <= 0) {
        throw new NotFoundException();
      }
      return topics;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
