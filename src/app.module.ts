import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'dB/data-source';
import { UsersModule } from './users/users.module';
import { UserKycModule } from './user-kyc/user-kyc.module';
import { UserAccountModule } from './user-account/user-account.module';
import { AuthJwtService } from './utility/jwtService';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, UserKycModule, UserAccountModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
