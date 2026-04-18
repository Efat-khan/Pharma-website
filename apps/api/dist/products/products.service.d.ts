import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        search?: string;
        categoryId?: string;
        brandId?: string;
        minPrice?: number;
        maxPrice?: number;
        isFeatured?: boolean;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
            brand: {
                name: string;
                id: string;
                slug: string;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        category: {
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
        };
        brand: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            logo: string | null;
        };
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
    }>;
    findById(id: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        brand: {
            name: string;
            id: string;
            slug: string;
        };
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
    }>;
    getFeatured(limit?: number): Promise<({
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
    })[]>;
    getByCategory(categorySlug: string, page?: number, limit?: number): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
            brand: {
                name: string;
                id: string;
                slug: string;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
