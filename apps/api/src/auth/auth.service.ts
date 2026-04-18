import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpPurpose } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;

    const recentOtp = await this.prisma.otpToken.findFirst({
      where: {
        phone,
        purpose: OtpPurpose.LOGIN,
        createdAt: { gte: new Date(Date.now() - 60_000) },
        verified: false,
      },
    });
    if (recentOtp) {
      throw new TooManyRequestsException('Please wait 1 minute before requesting another OTP');
    }

    await this.prisma.otpToken.updateMany({
      where: { phone, purpose: OtpPurpose.LOGIN, verified: false },
      data: { verified: true },
    });

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60_000);

    await this.prisma.otpToken.create({
      data: { phone, otp, purpose: OtpPurpose.LOGIN, expiresAt },
    });

    await this.notificationsService.notifyOtpSend({ phone, otp });

    const userExists = await this.prisma.user.findUnique({
      where: { phone },
      select: { id: true, name: true },
    });

    return {
      message: 'OTP sent successfully',
      isNewUser: !userExists,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp, name } = dto;

    const otpRecord = await this.prisma.otpToken.findFirst({
      where: {
        phone,
        purpose: OtpPurpose.LOGIN,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('OTP expired or not found. Please request a new one.');
    }

    if (otpRecord.attempts >= 3) {
      await this.prisma.otpToken.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
      throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
    }

    if (otpRecord.otp !== otp) {
      await this.prisma.otpToken.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = 3 - (otpRecord.attempts + 1);
      throw new BadRequestException(`Invalid OTP. ${remaining} attempts remaining.`);
    }

    await this.prisma.otpToken.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          name: name || null,
          isVerified: true,
          cart: { create: {} },
        },
      });
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, name: user.name || name || null },
      });
    }

    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

    if (stored.user.deletedAt || !stored.user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.generateTokens(stored.user.id, stored.user.phone, stored.user.role);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Logged out from all devices' };
  }

  private async generateTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private generateOtp(): string {
    if (process.env.NODE_ENV === 'development') return '123456';
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
