import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountTypeEntity } from './account-type.entity';  // Adjust the path accordingly

@Entity('UserAccount')
export class UserAccountEntity {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ unique: true })
  userId: number;

  @Column()
  accountName: string;

  @Column({ unique: true })
  accountNumber: string;

  // Relation to AccountType
  @ManyToOne(() => AccountTypeEntity, { eager: true }) 
  @JoinColumn({ name: 'accountTypeId' }) 
  accountType: AccountTypeEntity;

  @Column('float', { default: 0.00 })
  accountBalance: number;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
