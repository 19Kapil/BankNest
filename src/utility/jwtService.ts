import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(payload: { id: number; email: string; role: string[] }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
