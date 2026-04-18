import { AdminService } from './admin.service';
import { OrderStatus, PrescriptionStatus } from '@prisma/client';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalOrders: number;
        todayOrders: number;
        pendingOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalProducts: number;
        totalUsers: number;
        pendingPrescriptions: number;
    }>;
    getOrders(page?: number, limit?: number, status?: OrderStatus): Promise<{
        data: ({
            user: {
                name: string;
                phone: string;
                id: string;
            };
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
                productId: string;
                quantity: number;
                mrp: import("@prisma/client/runtime/library").Decimal;
                sellingPrice: import("@prisma/client/runtime/library").Decimal;
                total: import("@prisma/client/runtime/library").Decimal;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus(id: string, status: OrderStatus, note: string, adminId: string): Promise<{
        user: {
            name: string;
            phone: string;
        };
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
    createProduct(data: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sku: string;
        genericName: string | null;
        shortDescription: string | null;
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
    }>;
    updateProduct(id: string, data: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sku: string;
        genericName: string | null;
        shortDescription: string | null;
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
    }>;
    deleteProduct(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sku: string;
        genericName: string | null;
        shortDescription: string | null;
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
    }>;
    createCategory(data: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        image: string | null;
        parentId: string | null;
    }>;
    createBrand(data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    getPendingPrescriptions(): Promise<({
        user: {
            name: string;
            phone: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    })[]>;
    reviewPrescription(id: string, status: PrescriptionStatus, note: string): Promise<{
        user: {
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    }>;
    createBanner(data: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        imageUrl: string;
        linkUrl: string | null;
    }>;
    getBanners(): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        imageUrl: string;
        linkUrl: string | null;
    }[]>;
    getUsers(page?: number, limit?: number): Promise<{
        data: {
            name: string;
            phone: string;
            id: string;
            createdAt: Date;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            isActive: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
