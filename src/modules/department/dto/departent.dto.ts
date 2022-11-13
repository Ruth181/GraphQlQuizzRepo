import { Department } from '@entities/department.entity';
import { Field, InputType } from '@nestjs/graphql';
import { FileResponseDTO } from 'src/app.service';

@InputType()
export class UpdateDepartmentDTO {
  @Field()
  departmentId: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  status: boolean;
}

export class FailedUploadType {
  department: string;
  message: string;
}

export class BulkDepartmentResponseDTO extends FileResponseDTO<Department[]> {
  departmentsThatFailedUpload: FailedUploadType[];
}
