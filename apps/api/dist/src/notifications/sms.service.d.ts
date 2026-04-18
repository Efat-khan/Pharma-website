export declare class SmsService {
    private readonly logger;
    sendOtp(phone: string, otp: string): Promise<boolean>;
    send(phone: string, message: string): Promise<boolean>;
}
