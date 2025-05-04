import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'dB/data-source';
import { UsersModule } from './users/users.module';
import { UserKycModule } from './user-kyc/user-kyc.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, UserKycModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
