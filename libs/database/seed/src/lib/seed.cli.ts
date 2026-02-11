#!/usr/bin/env node
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { TypeormConfigModule } from '@support-center/database/type-orm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeormConfigModule.defaultConfig(),
  ],
  providers: [SeedService],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.run();
    await app.close();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
