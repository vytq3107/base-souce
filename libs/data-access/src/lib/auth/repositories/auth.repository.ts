import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, RefreshToken } from '@support-center/database/entities';
import { BaseRepositoryAbstract } from '@support-center/core/abstracts';
import { PaginatedResponseDto, PaginationQueryDto } from '@support-center/core/dtos';

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

  //test phan trang, co the xoa
  async findAccountsWithPagination(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<Account>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationQuery;
    const offset = (page - 1) * limit;

    const sortableFields: Record<PaginationQueryDto['sortBy'], string> = {
      createdAt: 'account.createdAt',
      username: 'account.username',
      fullName: 'profile.fullName'
    };

    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.profile', 'profile')
      .leftJoinAndSelect('account.role', 'role');

    if (search?.trim()) {
      queryBuilder.andWhere('(account.username ILIKE :search OR profile.fullName ILIKE :search)', {
        search: `%${search.trim()}%`
      });
    }

    const [items, totalItems] = await queryBuilder
      .orderBy(sortableFields[sortBy], sortOrder)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }
}
