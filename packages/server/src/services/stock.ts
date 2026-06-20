import prisma from '../lib/prisma';

interface MovementInput {
  productId: number;
  storeId: number;
  type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  quantity: number;
  batchNo?: string;
  expiryDate?: string | null;
  note?: string;
  userId: number;
}

export async function recordMovement(input: MovementInput) {
  const { productId, storeId, type, quantity, batchNo, expiryDate, note, userId } = input;

  if (quantity <= 0) throw new Error('Quantity must be positive');

  // Create the movement record
  const movement = await prisma.stockMovement.create({
    data: {
      productId,
      storeId,
      type,
      quantity,
      note,
      userId,
    },
  });

  // For OUT/TRANSFER_OUT without a batch, find the first available batch
  let batch = batchNo || 'DEFAULT';

  if ((type === 'OUT' || type === 'TRANSFER_OUT') && !batchNo) {
    const existing = await prisma.stock.findFirst({
      where: { productId, storeId },
      orderBy: { expiryDate: 'asc' },
    });
    if (existing) {
      batch = existing.batchNo || 'DEFAULT';
    }
  }

  if (type === 'IN' || type === 'TRANSFER_IN') {
    await prisma.stock.upsert({
      where: { productId_storeId_batchNo: { productId, storeId, batchNo: batch } },
      create: {
        productId,
        storeId,
        quantity,
        batchNo: batch,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      update: {
        quantity: { increment: quantity },
        ...(expiryDate ? { expiryDate: new Date(expiryDate) } : {}),
      },
    });
  } else if (type === 'OUT' || type === 'TRANSFER_OUT') {
    const stock = await prisma.stock.findUnique({
      where: { productId_storeId_batchNo: { productId, storeId, batchNo: batch } },
    });

    if (!stock || stock.quantity < quantity) {
      throw new Error(`Insufficient stock for product ${productId} (batch: ${batch})`);
    }

    await prisma.stock.update({
      where: { productId_storeId_batchNo: { productId, storeId, batchNo: batch } },
      data: { quantity: { decrement: quantity } },
    });
  } else if (type === 'ADJUST') {
    await prisma.stock.upsert({
      where: { productId_storeId_batchNo: { productId, storeId, batchNo: batch } },
      create: {
        productId,
        storeId,
        quantity,
        batchNo: batch,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      update: {
        quantity,
        ...(expiryDate ? { expiryDate: new Date(expiryDate) } : {}),
      },
    });
  }

  return movement;
}

export async function getStockByStore(storeId: number) {
  return prisma.stock.findMany({
    where: { storeId },
    include: {
      product: {
        select: {
          id: true,
          barcode: true,
          nameEn: true,
          nameNe: true,
          price: true,
          minStock: true,
          unit: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getMovements(storeId: number, limit = 50) {
  return prisma.stockMovement.findMany({
    where: { storeId },
    include: {
      product: { select: { id: true, barcode: true, nameEn: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getLowStock(storeId: number) {
  const stocks = await prisma.stock.findMany({
    where: { storeId },
    include: {
      product: {
        select: { id: true, barcode: true, nameEn: true, nameNe: true, minStock: true, unit: true },
      },
    },
  });

  return stocks
    .filter((s) => s.quantity <= s.product.minStock)
    .map((s) => ({
      ...s,
      alert: s.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
    }));
}
