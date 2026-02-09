#!/usr/bin/env node
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { runSeeders } from '@support-center/database/seed';
import { DataSourceConfig } from '@support-center/shared/config';
import { ConfigService } from '@nestjs/config';

config({ path: '.env' });

async function bootstrap() {
  const configService = new ConfigService(process.env);
  const dataSourceConfig = new DataSourceConfig(configService);
  const options = dataSourceConfig.createTypeOrmOptions();

  const dataSource = new DataSource(options as any);

  try {
    await dataSource.initialize();
    console.log('📦 Database connection established\n');

    await runSeeders(dataSource);

    await dataSource.destroy();
    console.log('\n📦 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

bootstrap();
