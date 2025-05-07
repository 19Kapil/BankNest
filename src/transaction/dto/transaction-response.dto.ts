
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionResponseDto {
  message: string;
  transactions: TransactionEntity[];
}
