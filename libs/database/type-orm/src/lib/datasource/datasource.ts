import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { databaseConfig } from '@support-center/shared/config';
import { TYPEORM_ENTITIES, TYPEORM_MIGRATIONS, TYPEORM_SUBSCRIBERS } from '../constants';

// Load env for standalone usage (CLI, etc)
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Mimic what registerAs does, but for raw usage outside of Nest context
const dbConfig = databaseConfig();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: TYPEORM_ENTITIES,
  migrations: TYPEORM_MIGRATIONS,
  subscribers: TYPEORM_SUBSCRIBERS,
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
};

export const AppDataSource = new DataSource(dataSourceOptions);
