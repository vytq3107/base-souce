/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import type { DataSource, DataSourceOptions, EntitySubscriberInterface, MigrationInterface } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { databaseConfig, TDatabaseConfig } from '@support-center/shared/config';
import { TYPEORM_ENTITIES, TYPEORM_MIGRATIONS, TYPEORM_SUBSCRIBERS } from '../constants';

type MigrationCtor = new (...args: unknown[]) => MigrationInterface;
type SubscriberCtor = new (...args: unknown[]) => EntitySubscriberInterface<unknown>;

export interface TypeOrmExtraOptions {
  extraEntities?: EntityClassOrSchema[];
  extraMigrations?: Array<MigrationCtor | string>;
  extraSubscribers?: Array<SubscriberCtor | string>;
  overrides?: Partial<PostgresConnectionOptions> & {
    entities?: EntityClassOrSchema[];
    migrations?: Array<MigrationCtor | string>;
    subscribers?: Array<SubscriberCtor | string>;
  };
}

// Helpers
function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function takeOverrideOrMerge<T>(base: T[], extra: T[] | undefined, override: T[] | undefined): T[] {
  if (override && override.length) {
    return override;
  }
  return dedupe([...(base ?? []), ...(extra ?? [])]);
}

@Module({})
export class TypeormConfigModule {
  static forRoot(options?: TypeOrmModuleOptions & Partial<DataSourceOptions>): DynamicModule {
    return TypeOrmModule.forRoot(options);
  }

  static forFeature(
    entities: EntityClassOrSchema[],
    dataSource?: DataSource | DataSourceOptions | string
  ): DynamicModule {
    return TypeOrmModule.forFeature(entities, dataSource);
  }

  /**
   * Config mặc định + merge thêm (entities/migrations/subscribers/overrides) tại chỗ.
   * - Nếu overrides.entities/migrations/subscribers có giá trị -> dùng nguyên (không merge).
   * - Ngược lại -> TYPEORM_* + extra* (merge + dedupe).
   */
  static defaultConfig(
    extraOptions?: TypeOrmExtraOptions,
    asyncOpts?: Partial<TypeOrmModuleAsyncOptions>
  ): DynamicModule {
    const defaultAsyncOpts: TypeOrmModuleAsyncOptions = {
      imports: [ConfigModule.forFeature(databaseConfig), ...(asyncOpts?.imports ?? [])],
      inject: [databaseConfig.KEY, ...(asyncOpts?.inject ?? [])],
      useFactory: async (db: TDatabaseConfig, ..._rest: any[]): Promise<TypeOrmModuleOptions> => {
        const { extraEntities = [], extraMigrations = [], extraSubscribers = [], overrides = {} } = extraOptions ?? {};

        // Base defaults
        const base: PostgresConnectionOptions = {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.database,
          synchronize: db.synchronize,
          logging: db.logging,
          dropSchema: db.dropSchema,
          migrationsRun: db.migrationsRun,
          useUTC: db.useUTC,
          entities: TYPEORM_ENTITIES,
          migrations: TYPEORM_MIGRATIONS,
          subscribers: TYPEORM_SUBSCRIBERS,
          extra: {
            max: 20,
            min: 5,
            acquireTimeoutMillis: 60000,
            idleTimeoutMillis: 300000,
            connectionTimeoutMillis: 10000
          }
        };

        const merged: PostgresConnectionOptions = {
          ...base,
          ...overrides,
          entities: takeOverrideOrMerge<EntityClassOrSchema>(
            base.entities as EntityClassOrSchema[],
            extraEntities,
            overrides.entities
          ),
          migrations: takeOverrideOrMerge<MigrationCtor | string>(
            base.migrations as Array<MigrationCtor | string>,
            extraMigrations,
            overrides.migrations
          ),
          subscribers: takeOverrideOrMerge<SubscriberCtor | string>(
            base.subscribers as Array<SubscriberCtor | string>,
            extraSubscribers,
            overrides.subscribers
          ),
          extra: { ...base.extra, ...(overrides.extra ?? {}) }
        };

        return merged;
      },
      ...asyncOpts
    };

    return TypeOrmModule.forRootAsync(defaultAsyncOpts);
  }
}
