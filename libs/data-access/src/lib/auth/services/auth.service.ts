import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/auth.repository';
import { LoginDto, SelectWorkspaceDto } from '@support-center/core/dtos';
import { WorkspaceMember, Account, Workspace } from '@support-center/database/entities';
import { DataSource } from 'typeorm';
import { AuthAbstractService } from '@support-center/core/abstracts';

@Injectable()
export class AuthService extends AuthAbstractService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSource
  ) {
    super(authRepository);
  }

  async login(loginDto: LoginDto) {
    const account = await this.authRepository.findAccountByUsername(loginDto.username);

    if (!account || !(await bcrypt.compare(loginDto.password, account.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: account.id,
      username: account.username,
      role: account.role.code,
      profileId: account.profileId
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshTokenValue = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d')
    });

    await this.authRepository.createRefreshToken({
      accountId: account.id,
      value: refreshTokenValue, // Should hash in real app
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: account.id,
        username: account.username,
        fullName: account.profile.fullName,
        role: account.role.code
      }
    };
  }

  async selectWorkspace(accountId: string, selectWorkspaceDto: SelectWorkspaceDto) {
    const member = await this.dataSource.getRepository(WorkspaceMember).findOne({
      where: { accountId, workspaceId: selectWorkspaceDto.workspaceId },
      relations: ['workspace']
    });

    if (!member) {
      throw new BadRequestException('Account is not a member of this workspace');
    }

    // Usually we issue a new token with workspace context
    const accountEntity = await this.dataSource.getRepository(Account).findOneBy({ id: accountId });
    if (!accountEntity) {
      throw new BadRequestException('Account not found');
    }

    const account = await this.authRepository.findAccountByUsername(accountEntity.username);

    const payload = {
      sub: accountId,
      username: account.username,
      role: account.role.code,
      workspaceId: selectWorkspaceDto.workspaceId,
      departmentId: member.workspace.departmentId
    };

    return {
      accessToken: this.jwtService.sign(payload),
      workspace: member.workspace
    };
  }

  async logout(accountId: string) {
    await this.authRepository.revokeRefreshToken(accountId);
    return { success: true };
  }
}
