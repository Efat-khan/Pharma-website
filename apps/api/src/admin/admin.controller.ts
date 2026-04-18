import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role, OrderStatus, PrescriptionStatus } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PHARMACIST)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('orders')
  getOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.adminService.getAllOrders(page, limit, status);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('note') note: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.updateOrderStatus(id, status, note, adminId);
  }

  @Post('products')
  @Roles(Role.ADMIN)
  createProduct(@Body() data: any) {
    return this.adminService.createProduct(data);
  }

  @Patch('products/:id')
  @Roles(Role.ADMIN)
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProduct(id, data);
  }

  @Delete('products/:id')
  @Roles(Role.ADMIN)
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  createCategory(@Body() data: any) {
    return this.adminService.createCategory(data);
  }

  @Post('brands')
  @Roles(Role.ADMIN)
  createBrand(@Body() data: any) {
    return this.adminService.createBrand(data);
  }

  @Get('prescriptions/pending')
  getPendingPrescriptions() {
    return this.adminService.getPendingPrescriptions();
  }

  @Patch('prescriptions/:id')
  reviewPrescription(
    @Param('id') id: string,
    @Body('status') status: PrescriptionStatus,
    @Body('note') note: string,
  ) {
    return this.adminService.reviewPrescription(id, status, note);
  }

  @Post('banners')
  @Roles(Role.ADMIN)
  createBanner(@Body() data: any) {
    return this.adminService.createBanner(data);
  }

  @Get('banners')
  getBanners() {
    return this.adminService.getBanners();
  }

  @Get('users')
  @Roles(Role.ADMIN)
  getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllUsers(page, limit);
  }
}
