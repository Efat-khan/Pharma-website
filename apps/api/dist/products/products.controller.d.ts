import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<{
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
    getByCategory(slug: string, page?: number, limit?: number): Promise<{
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
    findOne(slug: string): Promise<{
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
}
