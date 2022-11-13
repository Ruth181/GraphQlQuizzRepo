import { Field, ObjectType } from '@nestjs/graphql';
import { AppRole } from '@utils/types/utils.types';

@ObjectType()
export class AuthResponse {
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field(() => AppRole)
  role: AppRole;

  @Field({ nullable: true })
  jwtRefreshToken: string;

  @Field()
  dateCreated: Date;

  @Field()
  token: string;

  @Field()
  tokenInitializationDate: number;

  @Field()
  tokenExpiryDate: number;
}
