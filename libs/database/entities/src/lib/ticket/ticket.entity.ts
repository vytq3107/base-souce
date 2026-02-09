import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { TicketStatus } from '@support-center/shared/enum';

@Entity('tickets')
@Index(['conversation_id'])
@Index(['assigned_to_id'])
@Index(['status'])
export class Ticket extends BaseEntity {
  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @Column({ name: 'assigned_to_id', type: 'uuid', nullable: true })
  assignedToId?: string;

  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById: string;

  @Column({ name: 'is_delayed', type: 'boolean', default: false })
  isDelayed: boolean;

  @Column({ name: 'is_paused', type: 'boolean', default: false })
  isPaused: boolean;

  @Column({ name: 'paused_at', type: 'timestamp', nullable: true })
  pausedAt?: Date;

  @Column({ name: 'resumed_at', type: 'timestamp', nullable: true })
  resumedAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ name: 'priority', type: 'int', default: 0 })
  priority: number;
}
