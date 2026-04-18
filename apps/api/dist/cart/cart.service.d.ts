import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    } | {
        subtotal: number;
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    sortOrder: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
    addItem(userId: string, dto: AddToCartDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    } | {
        subtotal: number;
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    sortOrder: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
    updateItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    } | {
        subtotal: number;
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    sortOrder: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    } | {
        subtotal: number;
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    sortOrder: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
    clearCart(userId: string): Promise<void>;
    private ensureCart;
    private releaseExpiredReservations;
}
