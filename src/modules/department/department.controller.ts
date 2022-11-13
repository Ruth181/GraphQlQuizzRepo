import { Department } from '@entities/department.entity';
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
import { DepartmentService } from './department.service';
import { BulkDepartmentResponseDTO } from './dto/departent.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentSrv: DepartmentService) {}

  @Post('/upload-departments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  async uploadDepartments(
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<BulkDepartmentResponseDTO> {
    const filePath = `uploads/${uploadedFile.filename}`;
    return await this.departmentSrv.createDepartmentInBulk(filePath);
  }

  @Get('/')
  async findAllDepartments(): Promise<Department[]> {
    return await this.departmentSrv.findAllDepartments();
  }

  @Get('/:departmentId')
  async findDepartmentById(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<Department> {
    return await this.departmentSrv.findDepartmentById(departmentId);
  }

  @Get('/find-departments/by-status/:status')
  async findDepartmentsByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<Department[]> {
    return await this.departmentSrv.findDepartmentsByStatus(status);
  }
}
