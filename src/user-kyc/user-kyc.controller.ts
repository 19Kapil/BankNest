import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserKycService } from './user-kyc.service';
import { CreateUserKycDto } from './dto/create-user-kyc.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {RolesGuard} from 'src/guards/role-auth.guard';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserKYCEntity } from './entities/user-kyc.entity';
import { Roles } from 'src/guards/roles.decorator';

@Controller('user-kyc')
export class UserKycController {
  constructor(private readonly userKycService: UserKycService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'citizenshipPhoto', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
      },
    ),
  )
  async create(
    @Body() body: CreateUserKycDto,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      profilePhoto?: Express.Multer.File[];
      citizenshipPhoto?: Express.Multer.File[];
    },
  ): Promise<string> {
    if (!files.profilePhoto?.[0] || !files.citizenshipPhoto?.[0]) {
      throw new Error('Please upload both profile and citizenship photos.');
    }
    const profilePath = files.profilePhoto[0].buffer;
    const citizenPath = files.citizenshipPhoto[0].buffer;

    const { id: userId } = req.user as UserEntity;
    return this.userKycService.createKyc(
      body,
      profilePath,
      citizenPath,
      userId,
    );
  }

  @Get('getAllKYC')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') 
  async getAllKYC(@Req() req: Request): Promise<UserKYCEntity[]> {
    const { id: userId, role } = req.user as UserEntity;
    console.log(role);
    return this.userKycService.getAllKyc(); // Call service to get all KYC records
  }



}
