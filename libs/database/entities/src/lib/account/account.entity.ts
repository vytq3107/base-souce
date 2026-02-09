import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { Profile } from './profile.entity';
import { Role } from '../role/role.entity';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ name: 'profile_id', type: 'uuid' })
  profileId: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
