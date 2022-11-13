import { Topic } from '@entities/topic.entity';
import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterValidators } from '@utils/validators/multer.validator';
import { diskStorage } from 'multer';
import { BulkTopicResponseDTO } from './dto/topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicSrv: TopicService) {}

  @Post('/upload-topics')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  async uploadTopics(
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<BulkTopicResponseDTO> {
    const filePath = `uploads/${uploadedFile.filename}`;
    return await this.topicSrv.createTopicInBulk(filePath);
  }

  @Get('/')
  async findAllTopics(): Promise<Topic[]> {
    return await this.topicSrv.findAllTopics();
  }

  @Get('/:topicId')
  async findTopicById(
    @Param('topicId', ParseUUIDPipe) topicId: string,
  ): Promise<Topic> {
    return await this.findTopicById(topicId);
  }

  @Get('/find-topics-with-questions/by-courseId/:courseId')
  async findTopicsWithQuestionsByCourseId(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Topic[]> {
    return await this.topicSrv.findTopicsWithQuestionsByCourseId(courseId);
  }
}
