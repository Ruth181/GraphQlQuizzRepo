import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppRole, DecodedTokenKey } from '@utils/types/utils.types';

export const CurrentUser = createParamDecorator(
  (data: DecodedTokenKey, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const responseData: any = ctx.getContext().req.userData;
    return data ? responseData[data] : responseData;
  },
);

export const Roles = (...roles: AppRole[]) => SetMetadata('roles', roles);

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}
