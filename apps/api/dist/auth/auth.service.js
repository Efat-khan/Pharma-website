"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
class TooManyRequestsException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
const prisma_service_1 = require("../prisma/prisma.service");
const sms_service_1 = require("../notifications/sms.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService, smsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.smsService = smsService;
    }
    async sendOtp(dto) {
        const { phone } = dto;
        const recentOtp = await this.prisma.otpToken.findFirst({
            where: {
                phone,
                purpose: client_1.OtpPurpose.LOGIN,
                createdAt: { gte: new Date(Date.now() - 60_000) },
                verified: false,
            },
        });
        if (recentOtp) {
            throw new TooManyRequestsException('Please wait 1 minute before requesting another OTP');
        }
        await this.prisma.otpToken.updateMany({
            where: { phone, purpose: client_1.OtpPurpose.LOGIN, verified: false },
            data: { verified: true },
        });
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60_000);
        await this.prisma.otpToken.create({
            data: { phone, otp, purpose: client_1.OtpPurpose.LOGIN, expiresAt },
        });
        await this.smsService.sendOtp(phone, otp);
        const userExists = await this.prisma.user.findUnique({
            where: { phone },
            select: { id: true, name: true },
        });
        return {
            message: 'OTP sent successfully',
            isNewUser: !userExists,
        };
    }
    async verifyOtp(dto) {
        const { phone, otp, name } = dto;
        const otpRecord = await this.prisma.otpToken.findFirst({
            where: {
                phone,
                purpose: client_1.OtpPurpose.LOGIN,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('OTP expired or not found. Please request a new one.');
        }
        if (otpRecord.attempts >= 3) {
            await this.prisma.otpToken.update({
                where: { id: otpRecord.id },
                data: { verified: true },
            });
            throw new common_1.BadRequestException('Too many failed attempts. Please request a new OTP.');
        }
        if (otpRecord.otp !== otp) {
            await this.prisma.otpToken.update({
                where: { id: otpRecord.id },
                data: { attempts: { increment: 1 } },
            });
            const remaining = 3 - (otpRecord.attempts + 1);
            throw new common_1.BadRequestException(`Invalid OTP. ${remaining} attempts remaining.`);
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
        }
        else if (!user.isVerified) {
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
    async refreshTokens(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token not found or expired');
        }
        if (stored.user.deletedAt || !stored.user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        return this.generateTokens(stored.user.id, stored.user.phone, stored.user.role);
    }
    async logout(refreshToken) {
        await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
        return { message: 'Logged out from all devices' };
    }
    async generateTokens(userId, phone, role) {
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
    generateOtp() {
        if (process.env.NODE_ENV === 'development')
            return '123456';
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map