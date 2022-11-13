import { Department } from '@entities/department.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extractExcelSheetData } from '@utils/functions/utils.function';
import { RequestStatus } from '@utils/types/utils.types';
import { GenericService } from 'src/generic.service';
import {
  BulkDepartmentResponseDTO,
  FailedUploadType,
  UpdateDepartmentDTO,
} from './dto/departent.dto';

@Injectable()
export class DepartmentService extends GenericService(Department) {
  private relations = [
    'coursesUnderThisDepartment',
    'coursesUnderThisDepartment.department',
    'coursesUnderThisDepartment.topicsUnderThisCourse',
    'coursesUnderThisDepartment.questionTopicRecordsForThisCourse',
    'usersUnderThisDepartment',
  ];

  async createDepartment(name: string): Promise<Department> {
    if (!name) {
      throw new BadRequestException('Department name is required');
    }
    try {
      const departmentExists = await this.getRepo().findOne({
        where: { name: name.toUpperCase() },
        select: ['id'],
      });
      if (departmentExists?.id) {
        throw new ConflictException('Department already exists');
      }
      return await this.create({ name });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateDepartment(payload: UpdateDepartmentDTO): Promise<Department> {
    const { departmentId, name, status } = payload;
    if (!departmentId) {
      throw new BadRequestException('Field departmentId is required');
    }
    try {
      const departmentExists = await this.findOne({ id: departmentId });
      if (!departmentExists?.id) {
        throw new NotFoundException();
      }
      if (name && name !== departmentExists.name) {
        departmentExists.name = name.toUpperCase();
      }
      if ('status' in payload) {
        departmentExists.status = status;
      }
      const updatedDepartment: Partial<Department> = {
        status: departmentExists.status,
        name: departmentExists.name,
      };
      await this.getRepo().update(
        { id: departmentExists.id },
        updatedDepartment,
      );
      return await this.getRepo().findOne({
        where: { id: departmentExists.id },
        relations: [...this.relations],
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findDepartmentById(departmentId: string): Promise<Department> {
    if (!departmentId) {
      throw new BadRequestException('Field departmentId is required');
    }
    try {
      const departmentExists = await this.getRepo().findOne({
        where: { id: departmentId },
        relations: [...this.relations],
      });
      if (!departmentExists?.id) {
        throw new NotFoundException();
      }
      return departmentExists;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findDepartmentsByStatus(status: boolean): Promise<Department[]> {
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

  async findAllDepartments(): Promise<Department[]> {
    try {
      const departments = await this.getRepo().find({
        relations: [...this.relations],
      });
      if (departments?.length <= 0) {
        throw new NotFoundException();
      }
      return departments;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createDepartmentInBulk(
    excelFileLink: string,
  ): Promise<BulkDepartmentResponseDTO> {
    if (!excelFileLink) {
      throw new BadRequestException('Excel file must be uploaded');
    }
    try {
      const excelData = extractExcelSheetData<{ Name: string }>(
        excelFileLink,
        true,
      );
      const createdDepartments: Department[] = [];
      const failedUploads: FailedUploadType[] = [];
      for (const department of excelData) {
        const { Name: name } = department;
        const departmentExists = await this.getRepo().findOne({
          where: { name: name.toUpperCase() },
          select: ['id'],
        });
        if (departmentExists?.id) {
          failedUploads.push({
            message: `Department '${name}' already exists`,
            department: name,
          });
        } else {
          const newDepartment = await this.create({ name });
          createdDepartments.push(newDepartment);
        }
      }
      return {
        data: createdDepartments,
        departmentsThatFailedUpload: failedUploads,
        status: RequestStatus.SUCCESSFUL,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
