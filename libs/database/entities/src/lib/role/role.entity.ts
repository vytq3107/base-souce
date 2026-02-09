import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { RoleCode } from '@support-center/shared/enum';

@Entity('roles')
@Unique(['code'])
export class Role extends BaseEntity {
  @Column({ type: 'enum', enum: RoleCode })
  code: RoleCode;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;
}
