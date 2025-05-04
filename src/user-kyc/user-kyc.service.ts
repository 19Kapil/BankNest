import { Injectable } from '@nestjs/common';
import { CreateUserKycDto } from './dto/create-user-kyc.dto';
//import { UpdateUserKycDto } from './dto/update-user-kyc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserKYCEntity } from './entities/user-kyc.entity';
import { CloudinaryService } from 'src/utility/common/cloudinary.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserKycService {
  constructor(
    @InjectRepository(UserKYCEntity)
    private userKycRepository: Repository<UserKYCEntity>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createKyc(dto: CreateUserKycDto, profilePath: Buffer, citizenPath: Buffer, userId: number): Promise<string> {
    const userID: string = userId.toString();
    const profileUploadUrl = await this.cloudinaryService.uploadPhoto(profilePath, userID);
    const citizenshipUploadUrl = await this.cloudinaryService.uploadPhoto(citizenPath, userID);

    const newKyc = this.userKycRepository.create({
      userId,
      ...dto,
      profilePhoto: profileUploadUrl,
      citizenshipPhoto: citizenshipUploadUrl,
    });

    await this.userKycRepository.save(newKyc);
    return 'User KYC submitted successfully';
  }


  async getAllKyc(): Promise<UserKYCEntity[]> {
    return await this.userKycRepository.find(); 
  }
}

