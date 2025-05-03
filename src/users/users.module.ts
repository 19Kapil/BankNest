import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailModule } from 'src/utility/mailModule';
import { CustomJwtModule } from '../utility/jwtModule';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),MailModule,CustomJwtModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
