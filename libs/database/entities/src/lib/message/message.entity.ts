import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@support-center/core/classes';
import { MessageType } from '@support-center/shared/enum';

@Entity('messages')
@Index(['conversation_id'])
@Index(['sender_id'])
@Index(['created_at'])
export class Message extends BaseEntity {
  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_from_customer', type: 'boolean', default: false })
  isFromCustomer: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt?: Date;
}
