import { Response } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    getPayment(orderId: string): Promise<{
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
    initiateSSL(user: any, orderId: string): Promise<{
        redirectURL: string;
        orderId: string;
    }>;
    sslCallback(body: Record<string, any>, queryStatus: string, res: Response): Promise<void>;
    sslWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
