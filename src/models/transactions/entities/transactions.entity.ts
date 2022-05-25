import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class Transactions {
  constructor() {
    this.id = uuid();
  }

  @PrimaryColumn()
  id: string;

  @Column()
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @JoinColumn({ name: 'sender_user_id' })
  @ManyToOne(() => Users, (user) => user.sentTransactions)
  senderUser: Users;

  @JoinColumn({ name: 'receiver_user_id' })
  @ManyToOne(() => Users, (user) => user.receivedTransactions)
  receiverUser: Users;
}
