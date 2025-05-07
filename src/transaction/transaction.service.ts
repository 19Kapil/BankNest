import { Injectable ,NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { UserAccountEntity } from 'src/user-account/entities/user-account.entity';
import { AccountTypeEntity } from 'src/user-account/entities/account-type.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {

  constructor(
      @InjectRepository(UserAccountEntity)
      private readonly userAccountRepository: Repository<UserAccountEntity>,
  
      @InjectRepository(AccountTypeEntity)
      private readonly accountTypeRepository: Repository<AccountTypeEntity>,
  
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,

      @InjectRepository(TransactionEntity)
      private readonly transactionRepository: Repository<TransactionEntity>,
    ) {}
    async sendMoney(senderId: number, dto: CreateTransactionDto): Promise<string> {
      const {
        senderAccount,
        receiverAccount,
        receiverBank,
        amount,
        transactionType,
        remarks,
      } = dto;
    
      if (!senderAccount || !receiverAccount || !receiverBank || !amount || !transactionType) {
        throw new BadRequestException('All fields are required');
      }

      if (senderAccount === receiverAccount) {
        throw new BadRequestException('Sender and receiver accounts cannot be the same');
      }
      // Find sender account
      const senderAcc = await this.userAccountRepository.findOne({
        where: {
          accountNumber: String(senderAccount),
          userId: Number(senderId),
        },
      });
      if (!senderAcc) throw new NotFoundException('Sender account not found ot This is not Your Account');
    
      // Find receiver account
      const receiverAcc = await this.userAccountRepository.findOne({
        where: { accountNumber: String(receiverAccount) },
      });
      if (!receiverAcc) throw new NotFoundException('Receiver account not found');
    
      // Check for sufficient balance
      if (senderAcc.accountBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
    
      // Update balances
      senderAcc.accountBalance -= amount;
      receiverAcc.accountBalance += amount;
      await this.userAccountRepository.save([senderAcc, receiverAcc]);
    
      // Save transaction
      const transaction = this.transactionRepository.create({
        senderId: Number(senderId),
        senderAccount: senderAcc.accountNumber.toString(),
        receiverAccount: receiverAcc.accountNumber.toString(),
        receiverBank,
        amount,
        transactionType,
        remarks,
      });
    
      await this.transactionRepository.save(transaction);
      return 'Transaction done successfully';
    }
    
    
    async getMyTransactions(userId: number): Promise<{
      message: string;
      transactions: Array<{
        senderAccount: string;
        receiverAccount: string;
        receiverBank: string;
        amount: number;
        transactionType: string;
        remarks?: string;
        transactionDate: Date;
        direction: 'WITHDRAW' | 'DEPOSIT';
      }>;
    }> {
      const accounts = await this.userAccountRepository.find({
        where: { userId },
      });
  
      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('No user accounts found');
      }
  
      const accountNumber = accounts[0].accountNumber;
  
      const rawTransactions = await this.transactionRepository.find({
        where: [
          { senderAccount: accountNumber },
          { receiverAccount: accountNumber },
        ],
        select: [
          'senderAccount',
          'receiverAccount',
          'receiverBank',
          'amount',
          'transactionType',
          'remarks',
          'transactionDate',
        ],
        order: { transactionDate: 'DESC' },
      });
  
      if (!rawTransactions || rawTransactions.length === 0) {
        throw new NotFoundException('No transactions found for this user');
      }
  
      const transactions = rawTransactions.map((txn) => ({
        ...txn,
        direction: txn.senderAccount === accountNumber ? 'WITHDRAW' as const : 'DEPOSIT' as const,
      }));
  
      return {
        message: 'Transactions retrieved successfully.',
        transactions,
      };
    }
  
}
