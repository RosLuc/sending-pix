import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Keys } from '../../keys/entities/keys.entity';
import { Transactions } from '../../transactions/entities/transactions.entity';

@Entity()
export class Users {
  constructor() {
    this.id = uuid();
  }

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Keys, (key) => key.user)
  keys: Keys[];

  @OneToMany(() => Transactions, (transaction) => transaction.senderUser)
  sentTransactions: Transactions[];

  @OneToMany(() => Transactions, (transaction) => transaction.receiverUser)
  receivedTransactions: Transactions[];
}
