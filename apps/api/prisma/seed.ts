import { PrismaClient, Role, PaymentMethod, OrderStatus, PaymentStatus, CouponType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean slate (order matters — children before parents) ───────────────────
  await prisma.orderStatusLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.otpToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Cleaned existing data');

  // ─── Users ───────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      phone: '01700000001',
      name: 'Admin User',
      email: 'admin@pharmaci.com.bd',
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const pharmacist = await prisma.user.create({
    data: {
      phone: '01700000002',
      name: 'Pharmacist Karim',
      email: 'karim@pharmaci.com.bd',
      role: Role.PHARMACIST,
      isVerified: true,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      phone: '01711111111',
      name: 'Rahim Uddin',
      email: 'rahim@example.com',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      phone: '01722222222',
      name: 'Fatema Begum',
      email: 'fatema@example.com',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });
  console.log('  ✓ Users created (admin, pharmacist, 2 customers)');

  // ─── Addresses ───────────────────────────────────────────────────────────────
  const addr1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: 'Home',
      recipientName: 'Rahim Uddin',
      phone: '01711111111',
      line1: 'House 12, Road 5, Dhanmondi',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      postCode: '1209',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer2.id,
      label: 'Home',
      recipientName: 'Fatema Begum',
      phone: '01722222222',
      line1: 'Flat 3B, Mirpur 10',
      district: 'Dhaka',
      thana: 'Mirpur',
      postCode: '1216',
      isDefault: true,
    },
  });
  console.log('  ✓ Addresses created');

  // ─── Categories ──────────────────────────────────────────────────────────────
  const catMedicine = await prisma.category.create({
    data: { name: 'Medicine', slug: 'medicine', isActive: true, sortOrder: 1 },
  });
  const catAntibiotics = await prisma.category.create({
    data: { name: 'Antibiotics', slug: 'antibiotics', parentId: catMedicine.id, isActive: true, sortOrder: 2 },
  });
  const catVitamins = await prisma.category.create({
    data: { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', isActive: true, sortOrder: 3 },
  });
  const catPainRelief = await prisma.category.create({
    data: { name: 'Pain Relief', slug: 'pain-relief', isActive: true, sortOrder: 4 },
  });
  const catDiabetes = await prisma.category.create({
    data: { name: 'Diabetes Care', slug: 'diabetes-care', isActive: true, sortOrder: 5 },
  });
  const catSkinCare = await prisma.category.create({
    data: { name: 'Skin Care', slug: 'skin-care', isActive: true, sortOrder: 6 },
  });
  console.log('  ✓ Categories created');

  // ─── Brands ──────────────────────────────────────────────────────────────────
  const beximco = await prisma.brand.create({ data: { name: 'Beximco Pharma', slug: 'beximco-pharma', isActive: true } });
  const square = await prisma.brand.create({ data: { name: 'Square Pharmaceuticals', slug: 'square-pharmaceuticals', isActive: true } });
  const renata = await prisma.brand.create({ data: { name: 'Renata', slug: 'renata', isActive: true } });
  const acme = await prisma.brand.create({ data: { name: 'ACME Laboratories', slug: 'acme-laboratories', isActive: true } });
  console.log('  ✓ Brands created');

  // ─── Products ────────────────────────────────────────────────────────────────
  const products = await Promise.all([
    // Pain Relief
    prisma.product.create({
      data: {
        name: 'Napa 500mg Tablet',
        slug: 'napa-500mg-tablet',
        genericName: 'Paracetamol',
        description: 'Napa 500mg tablet is used for the relief of mild to moderate pain and fever.',
        shortDescription: 'Paracetamol 500mg for pain & fever relief',
        sku: 'SKU-NAPA-500',
        mrp: 2.00,
        sellingPrice: 1.50,
        stock: 500,
        unit: 'tablet',
        packSize: '10 tablets/strip',
        requiresPrescription: false,
        isActive: true,
        isFeatured: true,
        categoryId: catPainRelief.id,
        brandId: beximco.id,
        images: { create: { url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Napa+500mg', isPrimary: true } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ace 500mg Tablet',
        slug: 'ace-500mg-tablet',
        genericName: 'Paracetamol',
        description: 'Ace 500mg is used for pain relief and fever reduction.',
        shortDescription: 'Paracetamol 500mg — pain & fever',
        sku: 'SKU-ACE-500',
        mrp: 2.00,
        sellingPrice: 1.50,
        stock: 400,
        unit: 'tablet',
        packSize: '10 tablets/strip',
        requiresPrescription: false,
        isActive: true,
        isFeatured: false,
        categoryId: catPainRelief.id,
        brandId: square.id,
        images: { create: { url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Ace+500mg', isPrimary: true } },
      },
    }),

    // Antibiotics (prescription required)
    prisma.product.create({
      data: {
        name: 'Azithromycin 500mg Tablet',
        slug: 'azithromycin-500mg-tablet',
        genericName: 'Azithromycin',
        description: 'Azithromycin is an antibiotic used to treat various bacterial infections.',
        shortDescription: 'Antibiotic for bacterial infections',
        sku: 'SKU-AZI-500',
        mrp: 70.00,
        sellingPrice: 60.00,
        stock: 200,
        unit: 'tablet',
        packSize: '3 tablets/pack',
        requiresPrescription: true,
        isActive: true,
        isFeatured: false,
        categoryId: catAntibiotics.id,
        brandId: beximco.id,
        images: { create: { url: 'https://placehold.co/400x400/fce4ec/880e4f?text=Azithromycin', isPrimary: true } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Amoxicillin 500mg Capsule',
        slug: 'amoxicillin-500mg-capsule',
        genericName: 'Amoxicillin',
        description: 'Amoxicillin is a broad-spectrum antibiotic for bacterial infections.',
        shortDescription: 'Broad-spectrum antibiotic capsule',
        sku: 'SKU-AMX-500',
        mrp: 12.00,
        sellingPrice: 10.00,
        stock: 300,
        unit: 'capsule',
        packSize: '10 capsules/strip',
        requiresPrescription: true,
        isActive: true,
        isFeatured: false,
        categoryId: catAntibiotics.id,
        brandId: acme.id,
        images: { create: { url: 'https://placehold.co/400x400/f3e5f5/4a148c?text=Amoxicillin', isPrimary: true } },
      },
    }),

    // Vitamins
    prisma.product.create({
      data: {
        name: 'Vitamin C 500mg Tablet',
        slug: 'vitamin-c-500mg-tablet',
        genericName: 'Ascorbic Acid',
        description: 'Vitamin C supplement for immune support and antioxidant protection.',
        shortDescription: 'Immunity booster — Vitamin C 500mg',
        sku: 'SKU-VITC-500',
        mrp: 150.00,
        sellingPrice: 120.00,
        stock: 150,
        unit: 'tablet',
        packSize: '30 tablets/bottle',
        requiresPrescription: false,
        isActive: true,
        isFeatured: true,
        categoryId: catVitamins.id,
        brandId: square.id,
        images: { create: { url: 'https://placehold.co/400x400/fff9c4/f57f17?text=Vitamin+C', isPrimary: true } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Calcium + Vitamin D3 Tablet',
        slug: 'calcium-vitamin-d3-tablet',
        genericName: 'Calcium Carbonate + Cholecalciferol',
        description: 'Calcium and Vitamin D3 supplement for strong bones and teeth.',
        shortDescription: 'Bone health — Calcium + D3',
        sku: 'SKU-CALD3',
        mrp: 250.00,
        sellingPrice: 210.00,
        stock: 100,
        unit: 'tablet',
        packSize: '30 tablets/bottle',
        requiresPrescription: false,
        isActive: true,
        isFeatured: false,
        categoryId: catVitamins.id,
        brandId: renata.id,
        images: { create: { url: 'https://placehold.co/400x400/e8eaf6/283593?text=Calcium+D3', isPrimary: true } },
      },
    }),

    // Diabetes
    prisma.product.create({
      data: {
        name: 'Metformin 500mg Tablet',
        slug: 'metformin-500mg-tablet',
        genericName: 'Metformin Hydrochloride',
        description: 'Metformin is used to treat type 2 diabetes mellitus.',
        shortDescription: 'Type 2 diabetes management',
        sku: 'SKU-MET-500',
        mrp: 6.00,
        sellingPrice: 5.00,
        stock: 600,
        unit: 'tablet',
        packSize: '10 tablets/strip',
        requiresPrescription: true,
        isActive: true,
        isFeatured: false,
        categoryId: catDiabetes.id,
        brandId: square.id,
        images: { create: { url: 'https://placehold.co/400x400/e0f7fa/006064?text=Metformin', isPrimary: true } },
      },
    }),

    // Skin Care
    prisma.product.create({
      data: {
        name: 'Cetaphil Moisturizing Cream 250g',
        slug: 'cetaphil-moisturizing-cream-250g',
        genericName: 'Moisturizing Cream',
        description: 'Cetaphil Moisturizing Cream provides long-lasting moisture for dry, sensitive skin.',
        shortDescription: 'Gentle moisturizer for dry/sensitive skin',
        sku: 'SKU-CETA-250',
        mrp: 850.00,
        sellingPrice: 750.00,
        stock: 80,
        unit: 'pcs',
        packSize: '250g',
        requiresPrescription: false,
        isActive: true,
        isFeatured: true,
        categoryId: catSkinCare.id,
        brandId: null,
        images: { create: { url: 'https://placehold.co/400x400/fafafa/424242?text=Cetaphil', isPrimary: true } },
      },
    }),

    // Inactive product (for admin testing)
    prisma.product.create({
      data: {
        name: 'Discontinued Drug X',
        slug: 'discontinued-drug-x',
        genericName: 'Test',
        sku: 'SKU-DISC-001',
        mrp: 100.00,
        sellingPrice: 80.00,
        stock: 0,
        requiresPrescription: false,
        isActive: false,
        isFeatured: false,
        categoryId: catMedicine.id,
      },
    }),
  ]);
  console.log(`  ✓ ${products.length} products created`);

  // ─── Coupons ─────────────────────────────────────────────────────────────────
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME50',
        type: CouponType.FLAT,
        value: 50,
        minOrderValue: 200,
        maxUses: 100,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'SAVE10',
        type: CouponType.PERCENT,
        value: 10,
        minOrderValue: 500,
        maxUses: 50,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'FLAT100',
        type: CouponType.FLAT,
        value: 100,
        minOrderValue: 1000,
        isActive: true,
        expiresAt: new Date('2027-06-30'),
      },
      {
        code: 'EXPIRED20',
        type: CouponType.PERCENT,
        value: 20,
        minOrderValue: 300,
        isActive: true,
        expiresAt: new Date('2024-01-01'), // already expired — tests the guard
      },
    ],
  });
  console.log('  ✓ Coupons created (WELCOME50, SAVE10, FLAT100, EXPIRED20)');

  // ─── Banners ─────────────────────────────────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      {
        title: 'Up to 20% off on Vitamins',
        imageUrl: 'https://placehold.co/1200x400/e8f5e9/2e7d32?text=20%25+off+Vitamins',
        linkUrl: '/products?category=vitamins-supplements',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Free Delivery on orders over ৳500',
        imageUrl: 'https://placehold.co/1200x400/e3f2fd/1565c0?text=Free+Delivery+over+500tk',
        linkUrl: '/products',
        isActive: true,
        sortOrder: 2,
      },
      {
        title: 'New: Diabetes Care Range',
        imageUrl: 'https://placehold.co/1200x400/e0f7fa/006064?text=Diabetes+Care+Range',
        linkUrl: '/products?category=diabetes-care',
        isActive: true,
        sortOrder: 3,
      },
    ],
  });
  console.log('  ✓ Banners created');

  // ─── Cart for customer1 ───────────────────────────────────────────────────────
  const napaProduct = products[0]; // Napa 500mg
  const vitaminC = products[4];    // Vitamin C

  await prisma.cart.create({
    data: {
      userId: customer1.id,
      items: {
        create: [
          { productId: napaProduct.id, quantity: 3 },
          { productId: vitaminC.id, quantity: 1 },
        ],
      },
    },
  });
  console.log('  ✓ Cart created for customer1 (Rahim)');

  // ─── Orders ───────────────────────────────────────────────────────────────────
  const addressSnapshot = {
    label: 'Home',
    recipientName: 'Rahim Uddin',
    phone: '01711111111',
    line1: 'House 12, Road 5, Dhanmondi',
    line2: null,
    district: 'Dhaka',
    thana: 'Dhanmondi',
    postCode: '1209',
  };

  // Order 1 — COD, PENDING
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ARG-2026-000001',
      userId: customer1.id,
      status: OrderStatus.PENDING,
      subtotal: 5.00,
      deliveryCharge: 60.00,
      discount: 0,
      total: 65.00,
      addressSnapshot,
      paymentMethod: PaymentMethod.COD,
      notes: 'Please deliver before 6pm',
      items: {
        create: [
          {
            productId: napaProduct.id,
            productName: napaProduct.name,
            productSku: napaProduct.sku,
            quantity: 2,
            mrp: napaProduct.mrp,
            sellingPrice: napaProduct.sellingPrice,
            total: 3.00,
          },
          {
            productId: products[1].id, // Ace 500mg
            productName: products[1].name,
            productSku: products[1].sku,
            quantity: 1,
            mrp: products[1].mrp,
            sellingPrice: products[1].sellingPrice,
            total: 1.50,
          },
        ],
      },
      statusLogs: {
        create: { status: OrderStatus.PENDING, note: 'Order placed' },
      },
      payment: {
        create: {
          method: PaymentMethod.COD,
          amount: 65.00,
          status: PaymentStatus.PENDING,
        },
      },
    },
  });

  // Order 2 — SSLCOMMERZ, PAID, CONFIRMED
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ARG-2026-000002',
      userId: customer1.id,
      status: OrderStatus.CONFIRMED,
      subtotal: 120.00,
      deliveryCharge: 0,
      discount: 50.00,
      total: 70.00,
      couponCode: 'WELCOME50',
      addressSnapshot,
      paymentMethod: PaymentMethod.SSLCOMMERZ,
      items: {
        create: [
          {
            productId: vitaminC.id,
            productName: vitaminC.name,
            productSku: vitaminC.sku,
            quantity: 1,
            mrp: vitaminC.mrp,
            sellingPrice: vitaminC.sellingPrice,
            total: 120.00,
          },
        ],
      },
      statusLogs: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order placed' },
          { status: OrderStatus.CONFIRMED, note: 'Payment received via SSLCommerz. Val ID: SSL-VAL-001' },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.SSLCOMMERZ,
          amount: 70.00,
          status: PaymentStatus.PAID,
          gatewayTxnId: 'SSL-VAL-001',
          paidAt: new Date(),
        },
      },
    },
  });

  // Order 3 — COD, DELIVERED
  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ARG-2026-000003',
      userId: customer2.id,
      status: OrderStatus.DELIVERED,
      subtotal: 750.00,
      deliveryCharge: 0,
      discount: 0,
      total: 750.00,
      addressSnapshot: {
        label: 'Home',
        recipientName: 'Fatema Begum',
        phone: '01722222222',
        line1: 'Flat 3B, Mirpur 10',
        line2: null,
        district: 'Dhaka',
        thana: 'Mirpur',
        postCode: '1216',
      },
      paymentMethod: PaymentMethod.COD,
      items: {
        create: [
          {
            productId: products[7].id, // Cetaphil
            productName: products[7].name,
            productSku: products[7].sku,
            quantity: 1,
            mrp: products[7].mrp,
            sellingPrice: products[7].sellingPrice,
            total: 750.00,
          },
        ],
      },
      statusLogs: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order placed' },
          { status: OrderStatus.CONFIRMED, note: 'Confirmed by pharmacist' },
          { status: OrderStatus.PROCESSING, note: 'Being packed' },
          { status: OrderStatus.SHIPPED, note: 'Handed to delivery agent' },
          { status: OrderStatus.DELIVERED, note: 'Delivered successfully' },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.COD,
          amount: 750.00,
          status: PaymentStatus.PAID,
          paidAt: new Date(),
        },
      },
    },
  });

  // Order 4 — SSLCOMMERZ, PENDING (payment not yet completed — for testing initiate flow)
  await prisma.order.create({
    data: {
      orderNumber: 'ARG-2026-000004',
      userId: customer2.id,
      status: OrderStatus.PENDING,
      subtotal: 210.00,
      deliveryCharge: 0,
      discount: 0,
      total: 210.00,
      addressSnapshot: {
        label: 'Home',
        recipientName: 'Fatema Begum',
        phone: '01722222222',
        line1: 'Flat 3B, Mirpur 10',
        line2: null,
        district: 'Dhaka',
        thana: 'Mirpur',
        postCode: '1216',
      },
      paymentMethod: PaymentMethod.SSLCOMMERZ,
      items: {
        create: [
          {
            productId: products[5].id, // Calcium D3
            productName: products[5].name,
            productSku: products[5].sku,
            quantity: 1,
            mrp: products[5].mrp,
            sellingPrice: products[5].sellingPrice,
            total: 210.00,
          },
        ],
      },
      statusLogs: {
        create: { status: OrderStatus.PENDING, note: 'Order placed — awaiting payment' },
      },
      payment: {
        create: {
          method: PaymentMethod.SSLCOMMERZ,
          amount: 210.00,
          status: PaymentStatus.PENDING,
        },
      },
    },
  });

  console.log('  ✓ 4 orders created (PENDING COD, CONFIRMED SSL, DELIVERED COD, PENDING SSL)');

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed complete!\n');
  console.log('Test accounts (OTP is always 123456 in dev):');
  console.log('  Admin      → phone: 01700000001');
  console.log('  Pharmacist → phone: 01700000002');
  console.log('  Customer 1 → phone: 01711111111  (has cart + 2 orders)');
  console.log('  Customer 2 → phone: 01722222222  (has 2 orders incl. SSL pending)');
  console.log('\nCoupons: WELCOME50 (৳50 off, min ৳200) | SAVE10 (10%, min ৳500) | FLAT100 (৳100 off, min ৳1000)');
  console.log('SSL pending order for payment test: ARG-2026-000004');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
