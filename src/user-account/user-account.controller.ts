import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('user-account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() createUserAccountDto: CreateUserAccountDto,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as UserEntity;
    console.log(userId);
    return this.userAccountService.create(userId, createUserAccountDto);
  }

 @UseGuards(JwtAuthGuard)
  @Get('getmyaccount')
  async getAll(@Req() req: Request) {
    const { id: userId } = req.user as UserEntity;
    return this.userAccountService.getMyAccount(userId);
  } 



}
