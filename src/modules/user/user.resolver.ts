import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { User } from '@entities/user.entity';
import { DefaultResponseTypeGQL } from '@utils/types/utils.types';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from './dto/user.dto';
import { UserService } from './user.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { Department } from '@entities/department.entity';
import { QuizSession } from '@entities/quiz-session.entity';
import { MyContext } from './type/user.type';
import { RandomTestQuizRecord } from '@entities/random-test-quiz-record.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userSrv: UserService) {}

  @Mutation(() => User, { description: 'Sign-up' })
  async createUser(@Args('payload') payload: CreateUserDTO): Promise<User> {
    return await this.userSrv.createUser(payload);
  }

  @Mutation(() => DefaultResponseTypeGQL)
  async deleteUserByEmail(
    @Args('email') email: string,
  ): Promise<DefaultResponseTypeGQL> {
    return await this.userSrv.deleteUserByEmail(email);
  }

  @Mutation(() => DefaultResponseTypeGQL)
  async verifyAccount(
    @Args('uniqueVerificationCode') uniqueVerificationCode: string,
  ): Promise<DefaultResponseTypeGQL> {
    return await this.userSrv.verifyAccount(uniqueVerificationCode);
  }

  @Mutation(() => DefaultResponseTypeGQL, {
    description: 'kick-off forgot password',
  })
  async initiateForgotPasswordFlow(
    @Args('email') email: string,
  ): Promise<DefaultResponseTypeGQL> {
    return await this.userSrv.initiateForgotPasswordFlow(email);
  }

  @Query(() => DefaultResponseTypeGQL)
  async finalizeForgotPasswordFlow(
    @Args('uniqueVerificationCode') uniqueVerificationCode: string,
  ): Promise<DefaultResponseTypeGQL> {
    return await this.userSrv.finalizeForgotPasswordFlow(
      uniqueVerificationCode,
    );
  }

  @Mutation(() => DefaultResponseTypeGQL)
  async changePassword(
    @Args('payload') payload: UpdatePasswordDTO,
  ): Promise<DefaultResponseTypeGQL> {
    return await this.userSrv.changePassword(payload);
  }

  @Mutation(() => User, {
    description: 'Used for updating user profile',
  })
  async updateUser(@Args('payload') payload: UpdateUserDTO): Promise<User> {
    return await this.userSrv.updateUser(payload);
  }

  @Query(() => User)
  async findUserById(
    @Args('userId', ParseUUIDPipe) userId: string,
  ): Promise<User> {
    return await this.userSrv.findUserById(userId);
  }

  @Query(() => [User])
  async findUsersByStatus(
    @Args('status', { type: () => Boolean }) status: boolean,
  ): Promise<User[]> {
    return await this.userSrv.findUsersByStatus(status);
  }

  @Query(() => [User])
  async findUsersByDepartmentId(
    @Args('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<User[]> {
    return await this.userSrv.findAllByCondition({ departmentId });
  }

  @Query(() => [User])
  async findUsers(): Promise<User[]> {
    return await this.userSrv.findAll();
  }

  @ResolveField('quizSessionsForThisUser', () => [QuizSession])
  async resolveQuizSessionsForThisUser(
    @Root() { id }: User,
    @Context() ctx: MyContext<QuizSession[]>,
  ): Promise<QuizSession[]> {
    return await ctx.quizSessionsForUserLoader.load(id);
  }

  @ResolveField('randomTestsTakenByThisUser', () => [RandomTestQuizRecord])
  async resolveRandomTestsTakenByThisUser(
    @Root() { id }: User,
    @Context() ctx: MyContext<RandomTestQuizRecord[]>,
  ): Promise<RandomTestQuizRecord[]> {
    return await ctx.randomTestQuizRecordForUserLoader.load(id);
  }

  @ResolveField('department', () => Department, { nullable: true })
  async resolveDepartmentField(
    @Root() { departmentId }: User,
    @Context() ctx: MyContext<Department>,
  ): Promise<Department> {
    if (departmentId) {
      return await ctx.departmentForUserLoader.load(departmentId);
    }
  }
}
