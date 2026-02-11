import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeormConfigModule } from '@support-center/database/type-orm';
import { AuthModule } from './modules/auth/modules/auth.module';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { LoggerMiddleware } from '@support-center/core/middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        `apps/api-gateway/.env.${process.env.NODE_ENV || 'development'}`,
        '.env'
      ]
    }),
    TypeormConfigModule.defaultConfig(),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const i18nPath = configService.get<string>('I18N_PATH');
        return {
          fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE') || 'en',
          loaderOptions: {
            path: path.join(process.cwd(), i18nPath),
            watch: true
          }
        };
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      inject: [ConfigService]
    }),
    AuthModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
