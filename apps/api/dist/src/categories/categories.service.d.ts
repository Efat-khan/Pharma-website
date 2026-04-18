import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: {
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
        }[];
        _count: {
            products: number;
        };
    } & {
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
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
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
        }[];
    } & {
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
}
