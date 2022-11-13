import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { User } from '@entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from '@modules/department/department.module';

@Module({
  imports: [
    UserModule,
    DepartmentModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, UserService],
  exports: [AuthService],
})
export class AuthModule {}
