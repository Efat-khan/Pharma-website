"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, categoryId, brandId, minPrice, maxPrice, isFeatured, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const where = { isActive: true };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { genericName: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (brandId)
            where.brandId = brandId;
        if (isFeatured !== undefined)
            where.isFeatured = isFeatured;
        if (minPrice || maxPrice) {
            where.sellingPrice = {};
            if (minPrice)
                where.sellingPrice.gte = minPrice;
            if (maxPrice)
                where.sellingPrice.lte = maxPrice;
        }
        const [total, items] = await this.prisma.$transaction([
            this.prisma.product.count({ where }),
            this.prisma.product.findMany({
                where,
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    category: { select: { id: true, name: true, slug: true } },
                    brand: { select: { id: true, name: true, slug: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            data: items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug, isActive: true },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
                category: true,
                brand: true,
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id, isActive: true },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
                category: { select: { id: true, name: true, slug: true } },
                brand: { select: { id: true, name: true, slug: true } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async getFeatured(limit = 10) {
        return this.prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            include: { images: { where: { isPrimary: true }, take: 1 } },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getByCategory(categorySlug, page = 1, limit = 20) {
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.findAll({ categoryId: category.id, page, limit });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map