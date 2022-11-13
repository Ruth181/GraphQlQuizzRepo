import { Question } from '@entities/question.entity';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterValidators } from '@utils/validators/multer.validator';
import { diskStorage } from 'multer';
import { QuestionService } from './question.service';
import { FileResponseDTO } from '../../app.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionSrv: QuestionService) {}

  @Post('/upload-questions')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  async uploadQuestions(
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<FileResponseDTO<Question[]>> {
    const filePath = `uploads/${uploadedFile.filename}`;
    return await this.questionSrv.createQuestionInBulk(filePath);
  }

  @Get()
  async findAllQuestions(): Promise<Question[]> {
    return await this.questionSrv.findAllQuestions();
  }

  @Get('/:questionId')
  async findQuestionById(
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ): Promise<Question> {
    return await this.questionSrv.findQuestionById(questionId);
  }

  @Get('/generate-random-test/:userId/:courseId')
  async generateRandomTest(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Question[]> {
    return await this.questionSrv.generateRandomTest(userId, courseId);
  }

  @Get('/generate-balanced-test/:userId/:courseId')
  async generateBalancedTest(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Question[]> {
    return await this.questionSrv.generateBalancedTest(courseId, userId);
  }
}
