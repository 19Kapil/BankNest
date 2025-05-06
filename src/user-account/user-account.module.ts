import { Module } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountEntity } from './entities/user-account.entity';
import { AccountTypeEntity } from './entities/account-type.entity';
import { CustomJwtModule } from 'src/utility/jwtModule';
import { AuthJwtService } from 'src/utility/jwtService';
import { UserEntity } from 'src/users/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity,AccountTypeEntity,UserEntity]),CustomJwtModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
})
export class UserAccountModule {}
