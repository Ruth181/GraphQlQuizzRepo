import { Course } from '@entities/course.entity';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { FileResponseDTO } from 'src/app.service';

@InputType()
export class CreateCourseDTO {
  @Field()
  name: string;

  @Field()
  departmentId: string;
}

@InputType()
export class UpdateCourseDTO extends PartialType(CreateCourseDTO) {
  @Field()
  courseId: string;

  @Field({ nullable: true })
  status?: boolean;
}

export class FailedUploadType {
  course: string;
  message: string;
}

export class BulkCourseResponseDTO extends FileResponseDTO<Course[]> {
  coursesThatFailedUpload: FailedUploadType[];
}
