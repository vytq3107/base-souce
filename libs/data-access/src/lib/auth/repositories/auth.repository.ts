import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, RefreshToken } from '@support-center/database/entities';
import { BaseRepositoryAbstract } from '@support-center/core/abstracts';

@Injectable()
export class AuthRepository extends BaseRepositoryAbstract<Account> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {
    super(accountRepository);
  }

  async findAccountByUsername(username: string): Promise<Account | null> {
    return this.accountRepository
      .createQueryBuilder('account')
      .addSelect('account.password') // ⭐ bắt buộc
      .leftJoinAndSelect('account.profile', 'profile')
      .leftJoinAndSelect('account.role', 'role')
      .where('account.username = :username', { username })
      .andWhere('account.isActive = true')
      .andWhere('account.deletedAt IS NULL')
      .getOne();
  }

  async createRefreshToken(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = this.refreshTokenRepository.create(data);
    return this.refreshTokenRepository.save(token);
  }

  async revokeRefreshToken(accountId: string): Promise<void> {
    // Note: This specific method might not fit BaseRepository pattern perfectly if it updates a different entity
    // But it's fine to keep it here as custom method
    await this.refreshTokenRepository.update({ accountId, revokedAt: null }, { revokedAt: new Date() });
  }
}
