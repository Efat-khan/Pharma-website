import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    private cartService;
    constructor(prisma: PrismaService, cartService: CartService);
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
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
        items: {
            id: string;
            mrp: import("@prisma/client/runtime/library").Decimal;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            productSku: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        couponCode: string | null;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryCharge: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
        cancelReason: string | null;
    }>;
    getUserOrders(userId: string, page?: number, limit?: number): Promise<{
        data: ({
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
            items: ({
                product: {
                    images: {
                        id: string;
                        createdAt: Date;
                        sortOrder: number;
                        productId: string;
                        url: string;
                        publicId: string | null;
                        isPrimary: boolean;
                    }[];
                } & {
                    name: string;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    categoryId: string;
                    brandId: string | null;
                    isFeatured: boolean;
                    sku: string;
                    genericName: string | null;
                    slug: string;
                    shortDescription: string | null;
                    mrp: import("@prisma/client/runtime/library").Decimal;
                    sellingPrice: import("@prisma/client/runtime/library").Decimal;
                    stock: number;
                    reservedStock: number;
                    unit: string;
                    packSize: string | null;
                    requiresPrescription: boolean;
                };
            } & {
                id: string;
                mrp: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                total: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                quantity: number;
                productName: string;
                productSku: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            couponCode: string | null;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            deliveryCharge: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
            cancelReason: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrderById(userId: string, orderId: string): Promise<{
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
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    sortOrder: number;
                    productId: string;
                    url: string;
                    publicId: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                categoryId: string;
                brandId: string | null;
                isFeatured: boolean;
                sku: string;
                genericName: string | null;
                slug: string;
                shortDescription: string | null;
                mrp: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                stock: number;
                reservedStock: number;
                unit: string;
                packSize: string | null;
                requiresPrescription: boolean;
            };
        } & {
            id: string;
            mrp: import("@prisma/client/runtime/library").Decimal;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            productName: string;
            productSku: string;
            orderId: string;
        })[];
        prescriptions: {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            publicId: string | null;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            orderId: string | null;
            note: string | null;
            imageUrl: string;
        }[];
        statusLogs: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
            createdBy: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        couponCode: string | null;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryCharge: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        addressSnapshot: import("@prisma/client/runtime/library").JsonValue;
        cancelReason: string | null;
    }>;
    cancelOrder(userId: string, orderId: string, reason?: string): Promise<{
        message: string;
    }>;
    private generateOrderNumber;
}
