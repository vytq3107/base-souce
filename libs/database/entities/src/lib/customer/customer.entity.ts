import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { ServiceType } from '@support-center/shared/enum';

@Entity('customers')
@Index(['email'], { unique: true })
export class Customer extends BaseEntity {
  @Column({ length: 255 })
  email: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ name: 'phone_number', length: 50, nullable: true })
  phoneNumber?: string;

  @Column({ name: 'telegram_id', length: 255, nullable: true })
  telegramId?: string;

  @Column({ name: 'parent_customer_id', type: 'uuid', nullable: true })
  parentCustomerId?: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'parent_customer_id' })
  parentCustomer?: Customer;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

@Entity('groups')
@Index(['customer_id', 'service_type'], { unique: true })
export class Group extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'service_type', type: 'enum', enum: ServiceType })
  serviceType: ServiceType;

  @Column({ name: 'parent_group_id', type: 'uuid', nullable: true })
  parentGroupId?: string;

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn({ name: 'parent_group_id' })
  parentGroup?: Group;

  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string;

  @Column({ name: 'telegram_group_id', length: 255, nullable: true })
  telegramGroupId?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
