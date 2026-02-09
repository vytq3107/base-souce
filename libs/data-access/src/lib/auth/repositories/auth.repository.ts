import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Account, RefreshToken } from '@support-center/database/entities';

@Injectable()
export class AuthRepository {
  private accountRepository: Repository<Account>;
  private refreshTokenRepository: Repository<RefreshToken>;

  constructor(private dataSource: DataSource) {
    this.accountRepository = this.dataSource.getRepository(Account);
    this.refreshTokenRepository = this.dataSource.getRepository(RefreshToken);
  }

  async findAccountByUsername(username: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { username, isActive: true },
      relations: ['profile', 'role'],
      select: ['id', 'username', 'password', 'isActive', 'profileId', 'roleId'],
    });
  }

  async createRefreshToken(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = this.refreshTokenRepository.create(data);
    return this.refreshTokenRepository.save(token);
  }

  async revokeRefreshToken(accountId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { accountId, revokedAt: null },
      { revokedAt: new Date() }
    );
  }
}
