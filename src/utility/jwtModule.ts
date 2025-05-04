import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from 'src/utility/jwtService';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthJwtService],
  exports: [AuthJwtService, JwtModule],
})
export class CustomJwtModule {}
