import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            image: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        image: string | null;
        parentId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            image: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        image: string | null;
        parentId: string | null;
    }>;
}
