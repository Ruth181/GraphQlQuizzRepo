import {
  Controller,
  UploadedFile,
  Post,
  Get,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterValidators } from '@validators/multer.validator';
import { diskStorage } from 'multer';
import { AppService, FileResponseDTO } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appSrv: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hello world' };
  }

  @Get('/health-check')
  healthCheck(@Res() res: any): void {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
    try {
      res.send(healthcheck);
    } catch (ex) {
      healthcheck.message = ex;
      res.status(503).send();
    }
  }

  @Post('/upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.editFileName,
      }),
      fileFilter: MulterValidators.imageFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<FileResponseDTO<string>> {
    const filePath = `uploads/${uploadedFile.filename}`;
    return await this.appSrv.uploadSingleFile(filePath);
  }

  @UseInterceptors(
    FilesInterceptor('files[]', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.preserveOriginalFileName,
      }),
      fileFilter: MulterValidators.imageFileFilter,
      // limits: {
      //   fileSize: 10000
      // }
    }),
  )
  @Post('/upload-multiple-files')
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<FileResponseDTO<string[]>> {
    const filePaths: string[] = files.map((data) => `uploads/${data.filename}`);
    return await this.appSrv.uploadMultipleFiles(filePaths);
  }
}
