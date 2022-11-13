import { Module, forwardRef } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '@entities/department.entity';
import { Course } from '@entities/course.entity';
import { CourseModule } from '@modules/course/course.module';
import { CourseService } from '@modules/course/course.service';
import { User } from '@entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { DepartmentController } from './department.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Course, User]),
    forwardRef(() => UserModule),
    forwardRef(() => CourseModule),
  ],
  providers: [
    DepartmentService,
    DepartmentResolver,
    CourseService,
    UserService,
  ],
  exports: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
