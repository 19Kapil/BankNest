// user-account.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccountEntity } from './entities/user-account.entity';
import { AccountTypeEntity } from './entities/account-type.entity';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private readonly userAccountRepository: Repository<UserAccountEntity>,

    @InjectRepository(AccountTypeEntity)
    private readonly accountTypeRepository: Repository<AccountTypeEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Function to generate account number with 'AC' prefix and 12 digits
  private generateAccountNumber(): string {
    const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000); // generates a 12-digit number
    return `AC${randomDigits}`;
  }

  // Method to create a new user account
  async create(userId: number, dto: CreateUserAccountDto): Promise<UserAccountEntity> {
    // Check if the user exists (userId should exist in the system)
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const userAccount = await this.userAccountRepository.findOne({ where: { userId } });
    if (userAccount) throw new NotFoundException('User already has an account');
  
   
    const accountType = await this.accountTypeRepository.findOne({
      where: { accountTypeName: dto.accountType }, 
    });
    if (!accountType) throw new NotFoundException('Account type not found');
  
    // Create the new user account
    const newAccount = this.userAccountRepository.create({
      userId,  
      accountName: dto.accountName,
      accountNumber: this.generateAccountNumber(),
      accountType,  
    });
  
    return await this.userAccountRepository.save(newAccount);
  }


  async getMyAccount(userId: number): Promise<any[]> {
    const accounts = await this.userAccountRepository.find({
      where: { userId },
      relations: ['accountType'],
    });
  
    return accounts.map(account => ({
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      accountBalance: account.accountBalance,
      isActive: account.isActive,
      accountType: {
        accountTypeName: account.accountType.accountTypeName,
        interestRate: account.accountType.interestRate,
      },
    }));
  }
  
}
