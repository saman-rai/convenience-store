import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a default store
  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'CU Nepal Store #1',
      address: 'Kathmandu, Nepal',
      phone: '01-4XXXXXX',
      taxRate: 13.0,
      currency: 'NPR',
    },
  });

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cu.com' },
    update: {},
    create: {
      name: 'Store Owner',
      email: 'admin@cu.com',
      passwordHash,
      role: Role.OWNER,
      storeId: store.id,
    },
  });

  // Sample categories (bilingual)
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nameEn: 'Snacks', nameNe: 'खाजा', parentId: null },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, nameEn: 'Beverages', nameNe: 'पेय पदार्थ', parentId: null },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, nameEn: 'Dairy', nameNe: 'दुग्धजन्य', parentId: null },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, nameEn: 'Instant Noodles', nameNe: 'चाउचाउ', parentId: null },
    }),
  ]);

  // Sample products
  await Promise.all([
    prisma.product.upsert({
      where: { barcode: '8901012345678' },
      update: {},
      create: {
        barcode: '8901012345678',
        nameEn: 'Wai Wai Noodles',
        nameNe: 'वाइ वाइ चाउचाउ',
        categoryId: 4,
        price: 20,
        costPrice: 16,
        unit: 'pcs',
        taxRate: 13.0,
        minStock: 20,
      },
    }),
    prisma.product.upsert({
      where: { barcode: '8901012345679' },
      update: {},
      create: {
        barcode: '8901012345679',
        nameEn: 'Coca-Cola 500ml',
        nameNe: 'कोकाकोला ५०० मिली',
        categoryId: 2,
        price: 75,
        costPrice: 60,
        unit: 'pcs',
        taxRate: 13.0,
        minStock: 10,
      },
    }),
    prisma.product.upsert({
      where: { barcode: '8901012345680' },
      update: {},
      create: {
        barcode: '8901012345680',
        nameEn: 'Lays Chips Classic',
        nameNe: 'लेज चिप्स क्लासिक',
        categoryId: 1,
        price: 30,
        costPrice: 24,
        unit: 'pcs',
        taxRate: 13.0,
        minStock: 15,
      },
    }),
    prisma.product.upsert({
      where: { barcode: '8901012345681' },
      update: {},
      create: {
        barcode: '8901012345681',
        nameEn: 'Dairy Milk Chocolate',
        nameNe: 'डेरी मिल्क चकलेट',
        categoryId: 1,
        price: 100,
        costPrice: 80,
        unit: 'pcs',
        taxRate: 13.0,
        minStock: 10,
      },
    }),
  ]);

  // Stock initial
  await prisma.stock.upsert({
    where: { productId_storeId_batchNo: { productId: 1, storeId: store.id, batchNo: 'INITIAL' } },
    update: {},
    create: { productId: 1, storeId: store.id, quantity: 100, batchNo: 'INITIAL' },
  });

  console.log('Seed complete!');
  console.log(`Login with admin@cu.com / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
