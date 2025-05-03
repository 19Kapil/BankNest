import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';
import { Res, Req ,BadRequestException} from '@nestjs/common';
import { Request } from 'express';
import { UserType } from './types/userTypes';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    return await this.usersService.register(body);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return await this.usersService.verifyOtp(body.email, body.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    return await this.usersService.resendOtp(body.email);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string },
  @Res({ passthrough: true }) res: Response,) {
    return await this.usersService.login(body.email, body.password,res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.usersService.logout(res);
  }

  @Put('update-password')
  async updatePassword(
    @Body() body: {oldPassword: string; newPassword: string },
    @Req() req: Request
  ) {
    const { id: userId } = req.user as UserType;
   // const userId = 14;

    return await this.usersService.updatePassword(userId, body.oldPassword, body.newPassword);
  }

}
