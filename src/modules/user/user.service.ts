import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  generateUniqueKey,
  hashPassword,
  sendEmail,
  verifyPasswordHash,
} from '@utils/functions/utils.function';
import { User } from '@entities/user.entity';
import {
  AppRole,
  DefaultResponseTypeGQL,
  RequestStatus,
} from '@utils/types/utils.types';
import {
  CreateUserDTO,
  LoginDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from './dto/user.dto';
import { GenericService } from '../../generic.service';
import { DepartmentService } from '@modules/department/department.service';

@Injectable()
export class UserService extends GenericService(User) {
  constructor(private readonly departmentSrv: DepartmentService) {
    super();
  }

  async createUser(payload: CreateUserDTO): Promise<User> {
    const { email, firstName, lastName, password, role, departmentId } =
      payload;
    if (!email || !firstName || !lastName || !password) {
      throw new BadRequestException(
        'Fields email,firstName,lastName,password are required',
      );
    }
    if (role) {
      if (!Object.values(AppRole).includes(role)) {
        throw new BadRequestException('Invalid role');
      }
    }
    if (role !== AppRole.ADMIN && !departmentId) {
      throw new BadRequestException(
        `Field departmentId is required for all users except admins`,
      );
    }
    try {
      const userExists = await this.getRepo().findOne({
        where: { email },
        select: ['id'],
      });
      if (userExists?.id) {
        throw new ConflictException('User already exists');
      }
      if (typeof role === 'undefined' || role === AppRole.USER) {
        const uniqueVerificationCode = generateUniqueKey();
        const html = `<h3>Hi, Pls use this verification key: '${uniqueVerificationCode}' to validate your account</h3>`;
        const emailResponse = await sendEmail(html, 'Verify Account', [email]);
        if (emailResponse.success) {
          return await this.create({
            ...payload,
            uniqueVerificationCode,
          });
        }
        throw new BadGatewayException(
          emailResponse.message ?? 'Email not sent',
        );
      }
      return await this.create({ ...payload, status: true });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async verifyAccount(
    uniqueVerificationCode: string,
  ): Promise<DefaultResponseTypeGQL> {
    if (!uniqueVerificationCode) {
      throw new BadRequestException('Field uniqueVerificationCode is required');
    }
    try {
      const userExists = await this.findOne({
        uniqueVerificationCode,
      });
      if (!userExists?.id) {
        throw new NotFoundException('Verification code not found');
      }
      await this.getRepo().update(
        { id: userExists.id },
        { status: true, uniqueVerificationCode: null },
      );
      return {
        message: 'Account verified',
        status: RequestStatus.SUCCESSFUL,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findUserById(userId: string): Promise<User> {
    if (!userId) {
      throw new BadRequestException('Field userId is required');
    }
    try {
      const response = await this.findOne({ id: userId });
      if (!response?.id) {
        throw new NotFoundException();
      }
      return response;
    } catch (ex) {
      throw ex;
    }
  }

  async findUsersByStatus(status: boolean): Promise<User[]> {
    try {
      return await this.findAllByCondition({ status });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUserByUsernameAndPassword(
    { email, password }: LoginDTO,
    checkStatus = false,
  ): Promise<User> {
    try {
      const user: User = await this.findOne({ email });
      if (user?.id) {
        if (!user.status && checkStatus) {
          throw new ForbiddenException();
        }
        if (await verifyPasswordHash(password, user.password)) {
          return user;
        }
      }
      throw new NotFoundException();
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async initiateForgotPasswordFlow(
    email: string,
  ): Promise<DefaultResponseTypeGQL> {
    if (!email) {
      throw new BadRequestException('Field email is required');
    }
    try {
      const userExists = await this.findOne({
        email,
      });
      if (!userExists?.id) {
        throw new NotFoundException('User not found');
      }
      const uniqueCode = generateUniqueKey();
      await this.getRepo().update(
        { id: userExists.id },
        { uniqueVerificationCode: uniqueCode },
      );
      // Send email
      const htmlEmailTemplate = `
      <h2>Please copy the code below to verify your account ownership</h2>
      <h3>${uniqueCode}</h3>
    `;
      const emailResponse = await sendEmail(
        htmlEmailTemplate,
        'Verify Account Ownership',
        [userExists.email],
      );
      if (emailResponse.success) {
        return {
          status: RequestStatus.SUCCESSFUL,
          message: 'Email sent',
        };
      }
      throw new InternalServerErrorException(emailResponse.message);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  // TODO: Uncomment later
  //   async initiateForgotPasswordFlow(
  //     email: string,
  //   ): Promise<DefaultResponseTypeGQL> {
  //     if (!email) {
  //       throw new BadRequestException('Field email is required');
  //     }
  //     try {
  //       const userExists = await this.findOne({
  //         email,
  //       });
  //       if (!userExists?.id) {
  //         throw new NotFoundException('User not found');
  //       }
  //       const uniqueCode = generateUniqueKey();
  //       await this.getRepo().update(
  //         { id: userExists.id },
  //         { uniqueVerificationCode: uniqueCode },
  //       );
  //       return {
  //         status: RequestStatus.SUCCESSFUL,
  //         message: `Email sent: ${uniqueCode}`,
  //       };
  //     } catch (ex) {
  //       this.logger.error(ex);
  //       throw ex;
  //     }
  //   }

  async finalizeForgotPasswordFlow(
    uniqueVerificationCode: string,
  ): Promise<DefaultResponseTypeGQL> {
    try {
      const userExists = await this.findOne({
        uniqueVerificationCode,
      });
      if (userExists?.id) {
        return {
          status: RequestStatus.SUCCESSFUL,
          message: 'Unique token validated',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async changePassword({
    uniqueVerificationCode,
    newPassword,
  }: UpdatePasswordDTO): Promise<DefaultResponseTypeGQL> {
    try {
      const userExists = await this.findOne({
        uniqueVerificationCode,
      });
      if (userExists?.id) {
        const doesOldAndNewPasswordMatch = await verifyPasswordHash(
          newPassword,
          userExists.password,
        );
        if (doesOldAndNewPasswordMatch) {
          const message = 'Both old and new password match';
          throw new ConflictException(message);
        }
        const hashedPassword = await hashPassword(newPassword);
        await this.getRepo().update(
          { id: userExists.id },
          {
            uniqueVerificationCode: null,
            password: hashedPassword,
          },
        );
        return {
          status: RequestStatus.SUCCESSFUL,
          message: 'Password changed successfully',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async updateUser(payload: UpdateUserDTO): Promise<User> {
    const {
      departmentId,
      email,
      firstName,
      lastName,
      status,
      role,
      profileImageUrl,
      userId,
    } = payload;
    if (!userId) {
      throw new BadRequestException('Field userId is required');
    }
    try {
      const userExists = await this.findOne({ id: userId });
      if (!userExists?.id) {
        throw new NotFoundException('User not found');
      }
      if (departmentId && userExists.departmentId !== departmentId) {
        const departmentFound = await this.departmentSrv.getRepo().findOne({
          where: { id: departmentId },
          select: ['id'],
        });
        if (!departmentFound?.id) {
          throw new NotFoundException(
            `Department with id: ${departmentId} not found`,
          );
        }
        userExists.departmentId = departmentId;
      }
      if (email && userExists.email !== email) {
        userExists.email = email;
      }
      if (firstName && userExists.firstName !== firstName) {
        userExists.firstName = firstName;
      }
      if (lastName && userExists.lastName !== lastName) {
        userExists.lastName = lastName;
      }
      if (profileImageUrl && userExists.profileImageUrl !== profileImageUrl) {
        userExists.profileImageUrl = profileImageUrl;
      }
      if (
        role &&
        Object.values(AppRole).includes(role) &&
        userExists.role !== role
      ) {
        userExists.role = role;
      }
      if ('status' in payload) {
        userExists.status = status;
      }
      const updatedUser: Partial<User> = {
        status: userExists.status,
        departmentId: userExists.departmentId,
        role: userExists.role,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        profileImageUrl: userExists.profileImageUrl,
      };
      await this.getRepo().update({ id: userExists.id }, updatedUser);
      return await this.findOne({ id: userExists.id });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async deleteUserByEmail(email: string): Promise<DefaultResponseTypeGQL> {
    if (!email) {
      throw new BadRequestException('Field email is required');
    }
    try {
      await this.delete({ email });
      return {
        message: 'Deleted',
        status: RequestStatus.SUCCESSFUL,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
