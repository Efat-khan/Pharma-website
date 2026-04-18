import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(slug: string): Promise<{
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
