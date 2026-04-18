import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | {
        subtotal: number;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, dto: AddToCartDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | {
        subtotal: number;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | {
        subtotal: number;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | {
        subtotal: number;
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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            reservedUntil: Date | null;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
