import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { NODE_ENVIRONMENT, NODE_ENV } from '@utils/types/utils.types';
dotenv.config();

const { DATABASE_URL, DATABASE_LOCAL_URL } = process.env;

let config: ConnectionOptions;

switch (NODE_ENV) {
  case NODE_ENVIRONMENT.DEVELOPMENT:
    config = {
      type: 'postgres',
      url: DATABASE_LOCAL_URL,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      // We are using migrations, synchronize should be set to false.
      synchronize: false,
      logging: ['error', 'query'],
      logger: 'file',
      cache: { duration: 1000 * 60 * 30 }, //cache for 30 minutes
      // Allow both start:prod and start:dev to use migrations
      // __dirname is either dist or src folder, meaning either
      // the compiled js in prod or the ts in dev.
      migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
      migrationsTableName: 'migrations',
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: true,
      cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: `${__dirname}/migrations`,
      },
      ssl: false,
    };
    break;
  default:
  case NODE_ENVIRONMENT.PRODUCTION:
    config = {
      type: 'postgres',
      url: DATABASE_URL,
      synchronize: false,
      dropSchema: false,
      logging: ['error', 'query'],
      logger: 'file',
      ssl: false,
      cache: { duration: 1000 * 60 * 30 },
      entities: ['dist/**/*.entity.js'],
      migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
      migrationsTableName: 'migrations',
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: true,
      cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: `${__dirname}/migrations`,
      },
    };
    break;
}

export default config;
