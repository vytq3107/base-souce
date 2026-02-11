import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeeders } from '../seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    this.logger.log('Starting seed...');
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      
      await runSeeders(this.dataSource);
      
      this.logger.log('Seed completed successfully');
    } catch (error) {
      this.logger.error('Seed failed', error);
      throw error;
    }
  }
}
