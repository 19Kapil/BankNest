// mailer.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'networkintrusion6@gmail.com',
      pass: 'kdwc tflt whmv whej'
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: '',
      to,
      subject,
      text,
    });
  }
}
