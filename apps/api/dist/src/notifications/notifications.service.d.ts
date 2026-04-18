import { Queue } from 'bullmq';
import { OrderStatus } from '@prisma/client';
export interface OrderPlacedPayload {
    customerPhone: string;
    customerEmail?: string | null;
    customerName?: string | null;
    orderNumber: string;
    items: {
        productName: string;
        quantity: number;
        total: number;
    }[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: string;
}
export interface OrderStatusChangedPayload {
    customerPhone: string;
    customerName?: string | null;
    orderNumber: string;
    status: OrderStatus;
}
export interface OtpSendPayload {
    phone: string;
    otp: string;
}
export interface PrescriptionStatusPayload {
    customerPhone: string;
    customerName?: string | null;
    status: 'APPROVED' | 'REJECTED';
    note?: string | null;
}
export interface LowStockAlertPayload {
    adminEmail: string;
    productName: string;
    sku: string;
    stock: number;
}
export declare class NotificationsService {
    private readonly queue;
    constructor(queue: Queue);
    notifyOrderPlaced(payload: OrderPlacedPayload): Promise<void>;
    notifyOrderStatusChanged(payload: OrderStatusChangedPayload): Promise<void>;
    notifyOtpSend(payload: OtpSendPayload): Promise<void>;
    notifyPrescriptionStatus(payload: PrescriptionStatusPayload): Promise<void>;
    notifyLowStock(payload: LowStockAlertPayload): Promise<void>;
}
