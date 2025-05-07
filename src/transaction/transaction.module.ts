import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserAccountEntity } from 'src/user-account/entities/user-account.entity';
import { AccountTypeEntity } from 'src/user-account/entities/account-type.entity';
import { CustomJwtModule } from 'src/utility/jwtModule';

@Module({
  imports: [ TypeOrmModule.forFeature([TransactionEntity,UserEntity,UserAccountEntity,AccountTypeEntity]),CustomJwtModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
