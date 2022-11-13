import { CreateUserDTO, LoginDTO } from '@modules/user/dto/user.dto';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.dto';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authSrv: AuthService) {}

  @Mutation(() => AuthResponse)
  async signUp(@Args('payload') payload: CreateUserDTO): Promise<AuthResponse> {
    return await this.authSrv.signUp(payload);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('payload') payload: LoginDTO): Promise<AuthResponse> {
    return await this.authSrv.login(payload);
  }

  @Mutation(() => AuthResponse)
  async refreshJWTToken(
    @Args('refreshToken') jwtRefreshToken: string,
  ): Promise<AuthResponse> {
    return await this.authSrv.refreshJWTToken(jwtRefreshToken);
  }
}
