import {
  Field,
  InputType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { AppRole } from '@utils/types/utils.types';

@InputType()
export class CreateUserDTO {
  @Field()
  email: string;

  @Field({ nullable: true })
  profileImageUrl?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field(() => AppRole, { nullable: true })
  role: AppRole;

  @Field({ nullable: true })
  departmentId?: string;
}

@InputType()
export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['password'] as const),
) {
  @Field()
  userId: string;

  @Field({ nullable: true })
  status?: boolean;

  @Field({ nullable: true })
  profileImageUrl?: string;
}

@InputType()
export class LoginDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}

@InputType()
export class UpdatePasswordDTO {
  @Field()
  newPassword: string;

  @Field()
  uniqueVerificationCode: string;
}
