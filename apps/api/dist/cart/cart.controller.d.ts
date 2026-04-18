import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
            reservedUntil: Date | null;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
}
