import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';

@Entity('departments')
@Unique(['code'])
export class Department extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
