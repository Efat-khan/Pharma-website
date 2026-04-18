import { ConfigService } from '@nestjs/config';
export declare class SslcommerzService {
    private config;
    private readonly logger;
    private readonly storeId;
    private readonly storePass;
    private readonly isLive;
    constructor(config: ConfigService);
    private get baseUrl();
    initSession(params: {
        orderId: string;
        amount: number;
        customerName: string;
        customerPhone: string;
        customerEmail: string;
        successUrl: string;
        failUrl: string;
        cancelUrl: string;
    }): Promise<{
        redirectURL: string;
        sessionKey: string;
    }>;
    validateIpn(payload: Record<string, any>): boolean;
}
