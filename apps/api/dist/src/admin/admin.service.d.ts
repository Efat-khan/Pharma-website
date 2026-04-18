import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrderStatus, PrescriptionStatus } from '@prisma/client';
export declare class AdminService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getDashboardStats(): Promise<{
        totalOrders: number;
        todayOrders: number;
        pendingOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalProducts: number;
        totalUsers: number;
        pendingPrescriptions: number;
    }>;
    getAllOrders(page?: number, limit?: number, status?: OrderStatus): Promise<{
        data: ({
            user: {
                id: string;
                phone: string;
                name: string;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus(orderId: string, status: OrderStatus, note?: string, adminId?: string): Promise<{
        user: {
            phone: string;
            name: string;
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
    getProducts(query: {
        search?: string;
        categoryId?: string;
        brandId?: string;
        isActive?: string;
        requiresPrescription?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            brand: {
                id: string;
                name: string;
                slug: string;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
        };
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
    }>;
    createProduct(data: any): Promise<{
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
    }>;
    updateProduct(id: string, data: any): Promise<{
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
    }>;
    deleteProduct(id: string): Promise<{
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
    }>;
    getAllCategories(): Promise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    getAllBrands(): Promise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    createCategory(data: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        description: string | null;
        sortOrder: number;
        parentId: string | null;
    }>;
    createBrand(data: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    getPendingPrescriptions(): Promise<({
        user: {
            id: string;
            phone: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    })[]>;
    reviewPrescription(id: string, status: PrescriptionStatus, note?: string): Promise<{
        user: {
            phone: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        publicId: string | null;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        orderId: string | null;
        note: string | null;
        imageUrl: string;
    }>;
    createBanner(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string;
        linkUrl: string | null;
    }>;
    getBanners(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string;
        linkUrl: string | null;
    }[]>;
    getAllUsers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            phone: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            isActive: boolean;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
