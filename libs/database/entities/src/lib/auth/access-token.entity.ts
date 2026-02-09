import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { Account } from '../account/account.entity';

@Entity('access_tokens')
@Index(['token'], { unique: true })
export class AccessToken extends BaseEntity {
  @Column({ length: 500 })
  token: string;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'revoked', type: 'boolean', default: false })
  revoked: boolean;
}
