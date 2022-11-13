import { Course } from '@entities/course.entity';
import { DepartmentService } from '@modules/department/department.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extractExcelSheetData } from '@utils/functions/utils.function';
import { RequestStatus } from '@utils/types/utils.types';
import { GenericService } from 'src/generic.service';
import {
  BulkCourseResponseDTO,
  CreateCourseDTO,
  FailedUploadType,
  UpdateCourseDTO,
} from './dto/course.dto';

@Injectable()
export class CourseService extends GenericService(Course) {
  private relations = [
    'department',
    'questionTopicRecordsForThisCourse',
    'topicsUnderThisCourse',
    'randomTestsUnderThisCourse',
    'quizSessionsUnderThisCourse',
    'quizSessionsUnderThisCourse.user',
    'quizSessionsUnderThisCourse.detailsForThisQuizSession',
  ];

  constructor(private readonly departmentSrv: DepartmentService) {
    super();
  }

  async createCourse(payload: CreateCourseDTO): Promise<Course> {
    const { name, departmentId } = payload;
    if (!name || !departmentId) {
      throw new BadRequestException('Field name and departmentId are required');
    }
    try {
      const courseExists = await this.getRepo().findOne({
        where: { name: name.toUpperCase(), departmentId },
        select: ['id'],
      });
      if (courseExists?.id) {
        throw new BadRequestException('Course already exists');
      }
      return await this.create(payload);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateCourse(payload: UpdateCourseDTO): Promise<Course> {
    const { courseId, name, departmentId, status } = payload;
    if (!courseId) {
      throw new BadRequestException('Field courseId is required');
    }
    try {
      const courseExists = await this.findOne({ id: courseId });
      if (!courseExists?.id) {
        throw new NotFoundException();
      }
      if (name && name !== courseExists.name) {
        courseExists.name = name.toUpperCase();
      }
      if ('status' in payload) {
        courseExists.status = status;
      }
      if (departmentId && departmentId !== courseExists.departmentId) {
        courseExists.departmentId = departmentId;
      }
      const updatedCourse: Partial<Course> = {
        departmentId: courseExists.departmentId,
        status: courseExists.status,
        name: courseExists.name,
      };
      await this.getRepo().update({ id: courseExists.id }, updatedCourse);
      return await this.getRepo().findOne({
        where: { id: courseExists.id },
        relations: [...this.relations],
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findCourseById(courseId: string): Promise<Course> {
    if (!courseId) {
      throw new BadRequestException('Field courseId is required');
    }
    try {
      const courseExists = await this.getRepo().findOne({
        where: { id: courseId },
        relations: [...this.relations],
      });
      if (!courseExists?.id) {
        throw new NotFoundException();
      }
      return courseExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllCourses(): Promise<Course[]> {
    try {
      const courses = await this.getRepo().find({
        relations: [...this.relations],
      });
      if (courses?.length <= 0) {
        throw new NotFoundException();
      }
      return courses;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findCoursesByDepartmentId(departmentId: string): Promise<Course[]> {
    if (!departmentId) {
      throw new BadRequestException('Field courseId is required');
    }
    try {
      return await this.getRepo().find({
        where: { departmentId },
        relations: [...this.relations],
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findCoursesByStatus(status: boolean): Promise<Course[]> {
    if (typeof status === 'undefined') {
      throw new BadRequestException('Field status is required');
    }
    try {
      return await this.getRepo().find({
        where: { status },
        relations: [...this.relations],
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createCourseInBulk(
    excelFileLink: string,
  ): Promise<BulkCourseResponseDTO> {
    if (!excelFileLink) {
      throw new BadRequestException('Excel file must be uploaded');
    }
    try {
      type ExcelType = { Name: string; Department: string };
      const excelData = extractExcelSheetData<ExcelType>(excelFileLink, true);
      const createdCourses: Course[] = [];
      const failedUploads: FailedUploadType[] = [];
      for (const course of excelData) {
        const { Name: name, Department: departmentName } = course;
        let message = `Course '${name}' already exists`;
        const courseExists = await this.getRepo().findOne({
          where: { name: name.toUpperCase() },
          select: ['id'],
        });
        if (courseExists?.id) {
          failedUploads.push({
            course: name,
            message,
          });
          continue;
        }
        const departmentFound = await this.departmentSrv.getRepo().findOne({
          where: { name: departmentName.toUpperCase() },
          select: ['id'],
        });
        if (!departmentFound?.id) {
          message = `Department '${departmentName}' does not exist. Try creating it first`;
          failedUploads.push({
            course: name,
            message,
          });
        } else {
          const newCourse = await this.create({
            name,
            departmentId: departmentFound.id,
          });
          createdCourses.push(newCourse);
        }
      }
      return {
        data: createdCourses,
        coursesThatFailedUpload: failedUploads,
        status: RequestStatus.SUCCESSFUL,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
