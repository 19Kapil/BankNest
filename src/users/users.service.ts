import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import MailService from 'src/utility/mailService';
import { AuthJwtService } from 'src/utility/jwtService';

@Injectable()
export class UsersService {
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private mailService: MailService,
    private jwtService: AuthJwtService,
  ) {}

  async register(body: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const { email, password, name } = body;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await this.usersRepository.save(user);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(email, { otp, expiresAt });

    await this.mailService.sendMail(
      email,
      'Your OTP Code',
      `Your OTP is ${otp}`,
    );

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const stored = this.otpStore.get(email);
    if (!stored || stored.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (stored.expiresAt < Date.now()) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP expired.');
    }

    user.isVerified = true;
    await this.usersRepository.save(user);
    this.otpStore.delete(email);

    return { message: 'Email verified successfully.' };
  }

  async resendOtp(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min

    this.otpStore.set(email, { otp, expiresAt });

    await this.mailService.sendMail(
      email,
      'Your OTP Code',
      `Your OTP is ${otp}`,
    );

    return { message: 'OTP resent successfully.' };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'isVerified'],
    });
    if (!user) throw new BadRequestException('User not found');
    if (!user.isVerified) throw new BadRequestException('Verify email first');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new BadRequestException('Invalid password');

    const { accessToken, refreshToken } = await this.jwtService.generateTokens({
      id: user.id,
      email: user.email,
    });

    // Set cookies here
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      user: { email: user.email, name: user.name },
    };
  }

  async logout(res: Response): Promise<{ message: string }> {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Successfully logged out' };
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // 1. Fetch user (including password)
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    // 3. Ensure new password ≠ old password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    // 4. Hash and save the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully.' };
  }
}
