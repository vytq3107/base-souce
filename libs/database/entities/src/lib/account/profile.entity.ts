import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;
}
