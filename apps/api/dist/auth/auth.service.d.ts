import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../notifications/sms.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private smsService;
    constructor(prisma: PrismaService, jwtService: JwtService, smsService: SmsService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
        isNewUser: boolean;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
        user: {
            id: string;
            phone: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private generateOtp;
}
