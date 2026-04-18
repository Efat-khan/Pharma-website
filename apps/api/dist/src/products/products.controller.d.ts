import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<{
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
    getFeatured(limit?: number): Promise<({
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
    })[]>;
    getByCategory(slug: string, page?: number, limit?: number): Promise<{
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
    findOne(slug: string): Promise<{
        category: {
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
        };
        brand: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            logo: string | null;
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
}
