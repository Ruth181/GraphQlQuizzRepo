import { Course } from '@entities/course.entity';
import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterValidators } from '@utils/validators/multer.validator';
import { diskStorage } from 'multer';
import { CourseService } from './course.service';
import { BulkCourseResponseDTO } from './dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseSrv: CourseService) {}

  @Post('/upload-courses')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  async uploadCourses(
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<BulkCourseResponseDTO> {
    const filePath = `uploads/${uploadedFile.filename}`;
    return await this.courseSrv.createCourseInBulk(filePath);
  }

  @Get()
  async findAllCourses(): Promise<Course[]> {
    return await this.courseSrv.findAllCourses();
  }

  @Get('/:courseId')
  async findCourseById(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Course> {
    return await this.courseSrv.findCourseById(courseId);
  }

  @Get('/find-courses/by-departmentId/:departmentId')
  async findCoursesByDepartmentId(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<Course[]> {
    return await this.courseSrv.findCoursesByDepartmentId(departmentId);
  }

  @Get('/find-courses-by-status/:status')
  async findCoursesByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<Course[]> {
    return await this.courseSrv.findCoursesByStatus(status);
  }
}
