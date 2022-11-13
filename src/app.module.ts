import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingInterceptor } from '@schematics/interceptors/logging.interceptor';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './orm.config';
import { AppResolver } from './app.resolver';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { CourseModule } from './modules/course/course.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { AnswerAttachmentModule } from './modules/answer-attachment/answer-attachment.module';
import { QuestionAttachmentModule } from './modules/question-attachment/question-attachment.module';
import { QuestionCourseTopicModule } from './modules/question-course-topic/question-course-topic.module';
import { TopicModule } from './modules/topic/topic.module';
import { TestTimeDurationModule } from './modules/test-time-duration/test-time-duration.module';
import { QuizSessionModule } from './modules/quiz-session/quiz-session.module';
import { QuizSessionDetailModule } from './modules/quiz-session-detail/quiz-session-detail.module';
import { AppDataLoaders as loaders } from './app.loader';
import { RandomTestModule } from './modules/random-test/random-test.module';
import { RandomTestTopicModule } from './modules/random-test-topic/random-test-topic.module';
import { RandomTestQuizRecordModule } from './modules/random-test-quiz-record/random-test-quiz-record.module';

export function DatabaseOrmModule(): DynamicModule {
  return TypeOrmModule.forRoot(ormConfig);
}

@Module({
  imports: [
    DatabaseOrmModule(),
    MulterModule.register({
      dest: './uploads',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 15,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: async ({ req, res }) => ({
        req,
        res,
        ...loaders,
      }),
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: true,
      introspection: true,
    }),
    UserModule,
    AuthModule,
    DepartmentModule,
    CourseModule,
    QuestionModule,
    AnswerModule,
    AnswerAttachmentModule,
    QuestionAttachmentModule,
    QuestionCourseTopicModule,
    TopicModule,
    TestTimeDurationModule,
    QuizSessionModule,
    QuizSessionDetailModule,
    RandomTestModule,
    RandomTestTopicModule,
    RandomTestQuizRecordModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
