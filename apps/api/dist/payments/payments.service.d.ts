import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    handleBkashWebhook(payload: any): Promise<{
        received: boolean;
    }>;
    handleSslWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
