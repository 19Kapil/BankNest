// account-type.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('AccountType')
export class AccountTypeEntity {
  @PrimaryGeneratedColumn()
  accountTypeId: number;

  @Column({ unique: true })
  accountTypeName: string; // e.g., Savings, Checking, etc.

  @Column('float')
  interestRate: number; // Interest rate for this account type
}

