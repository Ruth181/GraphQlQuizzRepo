import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import {
  generateUniqueKey,
  saveLogToFile,
} from '@utils/functions/utils.function';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      if (context.getType<GqlContextType>() === 'graphql') {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const res: Response = gqlContext.getContext().res;
        const req: Request = gqlContext.getContext().req;
        const parentType = info.parentType.name;
        const fieldName = info.fieldName;
        const body = info.fieldNodes[0]?.loc?.source?.body;
        const message = `GraphQL: [${parentType}] - (${fieldName})`;

        // Add request ID,so it can be tracked with response
        const requestId = generateUniqueKey(10);

        // Put to header, so can attach it to response as well
        res.header('requestId', requestId);

        const httpInfo = {
          requestId,
          body,
          host: req['hostname'],
          userAgent: req.headers['user-agent'],
          context: message,
          ipAddress:
            req.headers['x-forwarded-for'] ??
            req['connection']['remoteAddress'],
        };

        const now = Date.now();
        return next.handle().pipe(
          tap((response) => {
            httpInfo['requestStatus'] = 'success';
            httpInfo['duration'] = `${Date.now() - now}ms`;
            httpInfo['response'] = response;
            this.logger.debug(httpInfo);
            saveLogToFile(httpInfo);
          }),
          catchError((error: any) => {
            httpInfo['requestStatus'] = 'error';
            httpInfo['duration'] = `${Date.now() - now}ms`;
            httpInfo['error'] = error;
            this.logger.error(httpInfo);
            saveLogToFile(httpInfo);
            return throwError(() => error);
          }),
        );
      }
      return next.handle();
    } catch (ex) {
      this.logger.debug(ex);
      throw ex;
    }
  }
}
