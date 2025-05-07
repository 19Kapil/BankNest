import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('send-money')
  async sendMoney(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const { id: senderId } = req.user as UserEntity;
    return this.transactionService.sendMoney(senderId, createTransactionDto);
  }

  @Get('my-transactions')
  async getMyTransactions(@Req() req: Request) {
    const { id: userId } = req.user as UserEntity;
    return this.transactionService.getMyTransactions(userId);
  }
}
