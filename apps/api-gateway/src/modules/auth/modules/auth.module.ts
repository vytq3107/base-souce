import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService, AuthRepository, JwtConfigService } from '@support-center/data-access';
import { AuthAbstractService } from '@support-center/core/abstracts';
import { JwtStrategy } from '@support-center/core/strategies';
import { AuthController } from '../controllers/auth.controller';
import { TypeormConfigModule } from '@support-center/database/type-orm';
import { Account, RefreshToken } from '@support-center/database/entities';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService
    }),
    TypeormConfigModule.forFeature([Account, RefreshToken]) // Or entities if using TypeOrmModule.forFeature
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    JwtConfigService,
    JwtStrategy,
    {
      provide: AuthAbstractService,
      useClass: AuthService
    },
    // Keep AuthService if needed for non-interface injection, though we prefer Abstract
    AuthService
  ],
  exports: [AuthAbstractService]
})
export class AuthModule {}
