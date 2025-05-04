import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKYCEntity } from './entities/user-kyc.entity';
import { UserKycService } from './user-kyc.service';
import { UserKycController } from './user-kyc.controller';
import { CloudinaryService } from 'src/utility/common/cloudinary.service';
import { CustomJwtModule } from 'src/utility/jwtModule';


@Module({
  imports: [TypeOrmModule.forFeature([UserKYCEntity]),CustomJwtModule],
  controllers: [UserKycController],
  providers: [UserKycService,CloudinaryService],
})
export class UserKycModule {}
