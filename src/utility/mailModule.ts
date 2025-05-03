// mail.module.ts
import { Module } from '@nestjs/common';
import  MailService  from 'src/utility/mailService';
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
