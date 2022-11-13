import { Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appSrv: AppService) {}

  @Query(() => String)
  getHello(): string {
    return this.appSrv.getHello();
  }
}
