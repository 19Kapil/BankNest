import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'dB/data-source';
import { UsersModule } from './users/users.module';
import { UserKycModule } from './user-kyc/user-kyc.module';
import { UserAccountModule } from './user-account/user-account.module';
import { AuthJwtService } from './utility/jwtService';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, UserKycModule, UserAccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
