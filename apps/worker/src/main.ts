import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🔨 Worker started successfully');
  console.log('📊 Listening for Kafka events...');
  
  // Keep the process running
  process.on('SIGINT', async () => {
    console.log('\n⏹️  Shutting down worker...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
