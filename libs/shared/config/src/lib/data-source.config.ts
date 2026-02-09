import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Account,
  Profile,
  AccountStatus,
  RefreshToken,
  Role,
  Department,
  Workspace,
  WorkspaceMember,
} from '@support-center/database/entities';

@Injectable()
export class DataSourceConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [
        Account,
        Profile,
        AccountStatus,
        RefreshToken,
        Role,
        Department,
        Workspace,
        WorkspaceMember,
      ],
      synchronize: this.configService.get<string>('DB_SYNC') === 'true',
      logging: this.configService.get<string>('DB_LOGGING') === 'true',
    };
  }
}
