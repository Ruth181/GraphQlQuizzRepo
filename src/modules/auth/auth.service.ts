import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDTO, LoginDTO } from '@modules/user/dto/user.dto';
import { decode, sign } from 'jsonwebtoken';
import 'dotenv/config';
import { UserService } from '../user/user.service';
import { AuthResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly userSrv: UserService) {}

  private async signPayload(payload: any): Promise<string> {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
  }

  async signUp(payload: CreateUserDTO): Promise<AuthResponse> {
    try {
      const user = await this.userSrv.createUser(payload);
      if (user?.id) {
        const user = await this.userSrv.findUserByUsernameAndPassword({
          email: payload.email,
          password: payload.password,
        });
        if (user?.id) {
          const { dateCreated, email, role, id, jwtRefreshToken } = user;
          const token = await this.signPayload({
            dateCreated,
            email,
            role,
            id,
          });
          const decodedToken: any = decode(token);
          const { exp, iat } = decodedToken;
          return {
            userId: id,
            role,
            jwtRefreshToken,
            email,
            dateCreated,
            token,
            tokenInitializationDate: iat,
            tokenExpiryDate: exp,
          };
        }
        throw new BadRequestException('Incorrect login details');
      }
      throw new BadRequestException('User creation failed');
    } catch (ex) {
      this.logger.log(ex);
      throw ex;
    }
  }

  async login(payload: LoginDTO): Promise<AuthResponse> {
    try {
      const user = await this.userSrv.findUserByUsernameAndPassword(
        payload,
        true,
      );
      if (user?.id) {
        const { dateCreated, email, role, id, jwtRefreshToken } = user;
        const token = await this.signPayload({
          dateCreated,
          email,
          role,
          id,
        });
        const decodedToken: any = decode(token);
        const { exp, iat } = decodedToken;
        return {
          userId: id,
          role,
          jwtRefreshToken,
          email,
          dateCreated,
          token,
          tokenInitializationDate: iat,
          tokenExpiryDate: exp,
        };
      }
      throw new BadRequestException('Incorrect login details');
    } catch (ex) {
      this.logger.log(ex);
      throw ex;
    }
  }

  async refreshJWTToken(jwtRefreshToken: string): Promise<AuthResponse> {
    try {
      const user = await this.userSrv.findOne({ jwtRefreshToken });
      if (user?.id) {
        const { dateCreated, email, role, id, jwtRefreshToken } = user;
        const token = await this.signPayload({
          dateCreated,
          email,
          role,
          id,
        });
        const decodedToken: any = decode(token);
        const { exp, iat } = decodedToken;
        return {
          userId: id,
          role,
          email,
          dateCreated,
          token,
          jwtRefreshToken,
          tokenInitializationDate: iat,
          tokenExpiryDate: exp,
        };
      }
      throw new BadRequestException('Invalid jwt refresh token');
    } catch (ex) {
      this.logger.log(ex);
      throw ex;
    }
  }
}
