import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SslcommerzService } from './sslcommerz.service';
export declare class PaymentsService {
    private prisma;
    private config;
    private ssl;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, ssl: SslcommerzService);
    getPaymentByOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        amount: import("@prisma/client/runtime/library").Decimal;
        gatewayTxnId: string | null;
        gatewayResponse: import("@prisma/client/runtime/library").JsonValue | null;
        paidAt: Date | null;
    }>;
    initiateSSL(userId: string, orderId: string): Promise<{
        redirectURL: string;
        orderId: string;
    }>;
    handleSslCallback(body: Record<string, any>, queryStatus: string): Promise<{
        redirectUrl: string;
    }>;
    handleSslWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
