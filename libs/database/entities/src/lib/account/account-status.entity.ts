import { Entity, Column, PrimaryColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ProfileStatus, StatusSource } from '@support-center/shared/enum';
import { Account } from './account.entity';

@Entity('account_statuses')
export class AccountStatus {
  @PrimaryColumn({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'enum', enum: ProfileStatus, default: ProfileStatus.OFFLINE })
  status: ProfileStatus;

  @Column({ type: 'enum', enum: StatusSource, default: StatusSource.MANUAL })
  source: StatusSource;

  @Column({ name: 'last_active_at', type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
