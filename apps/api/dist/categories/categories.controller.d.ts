import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(slug: string): Promise<{
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
