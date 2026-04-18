import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
        items: {
            id: string;
            mrp: import("@prisma/client/runtime/library").Decimal;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            productSku: string;
            orderId: string;
        }[];
        payment: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryCharge: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        couponCode: string | null;
        cancelReason: string | null;
    }>;
    getOrders(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            items: ({
                product: {
                    images: {
                        id: string;
                        createdAt: Date;
                        sortOrder: number;
                        url: string;
                        publicId: string | null;
                        isPrimary: boolean;
                        productId: string;
                    }[];
                } & {
                    id: string;
                    name: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    description: string | null;
                    genericName: string | null;
                    shortDescription: string | null;
                    sku: string;
                    mrp: import("@prisma/client/runtime/library").Decimal;
                    sellingPrice: import("@prisma/client/runtime/library").Decimal;
                    stock: number;
                    reservedStock: number;
                    unit: string;
                    packSize: string | null;
                    requiresPrescription: boolean;
                    isFeatured: boolean;
                    categoryId: string;
                    brandId: string | null;
                };
            } & {
                id: string;
                mrp: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                quantity: number;
                total: import("@prisma/client/runtime/library").Decimal;
                productName: string;
                productSku: string;
                orderId: string;
            })[];
            payment: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            deliveryCharge: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            couponCode: string | null;
            cancelReason: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrder(userId: string, id: string): Promise<{
        prescriptions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            publicId: string | null;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            orderId: string | null;
            note: string | null;
            imageUrl: string;
        }[];
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    sortOrder: number;
                    url: string;
                    publicId: string | null;
                    isPrimary: boolean;
                    productId: string;
                }[];
            } & {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                genericName: string | null;
                shortDescription: string | null;
                sku: string;
                mrp: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                stock: number;
                reservedStock: number;
                unit: string;
                packSize: string | null;
                requiresPrescription: boolean;
                isFeatured: boolean;
                categoryId: string;
                brandId: string | null;
            };
        } & {
            id: string;
            mrp: import("@prisma/client/runtime/library").Decimal;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            total: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            productSku: string;
            orderId: string;
        })[];
        statusLogs: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
            createdBy: string | null;
        }[];
        payment: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryCharge: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        couponCode: string | null;
        cancelReason: string | null;
    }>;
    cancelOrder(userId: string, id: string, reason?: string): Promise<{
        message: string;
    }>;
}
