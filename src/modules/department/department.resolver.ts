import { Course } from '@entities/course.entity';
import { Department } from '@entities/department.entity';
import { User } from '@entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { UpdateDepartmentDTO } from './dto/departent.dto';
import { MyContext } from './type/department.type';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentSrv: DepartmentService) {}

  @Mutation(() => Department)
  async createDepartment(@Args('name') name: string): Promise<Department> {
    return await this.departmentSrv.createDepartment(name);
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('payload') payload: UpdateDepartmentDTO,
  ): Promise<Department> {
    return await this.departmentSrv.updateDepartment(payload);
  }

  @Query(() => Department)
  async findDepartmentById(
    @Args('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<Department> {
    return await this.departmentSrv.findOne({ id: departmentId });
  }

  @Query(() => [Department])
  async findDepartments(): Promise<Department[]> {
    return await this.departmentSrv.findAll();
  }

  @Query(() => [Department])
  async findDepartmentsByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<Department[]> {
    return await this.departmentSrv.findAllByCondition({ status });
  }

  @ResolveField('coursesUnderThisDepartment', () => [Course])
  async resolveCoursesUnderThisDepartmentField(
    @Root() { id }: Department,
    @Context() ctx: MyContext<Course[]>,
  ) {
    return await ctx.coursesForDepartmentLoaders.load(id);
  }

  @ResolveField('usersUnderThisDepartment', () => [User])
  async resolveUsersUnderThisDepartmentField(
    @Root() { id }: User,
    @Context() ctx: MyContext<User[]>,
  ): Promise<User[]> {
    return await ctx.usersForDepartmentLoader.load(id);
  }
}
