import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { recordMovement } from '../services/stock';
import { z } from 'zod';

const router = Router();

const poItemSchema = z.object({
  productId: z.number(),
  qtyOrdered: z.number().positive(),
  unitPrice: z.number().positive(),
});

const createPOSchema = z.object({
  supplierId: z.number(),
  storeId: z.number(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1),
});

// GET /api/purchase-orders
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const storeId = Number(req.query.storeId) || req.user?.storeId;
  const orders = await prisma.purchaseOrder.findMany({
    where: storeId ? { storeId } : {},
    include: {
      supplier: { select: { id: true, name: true } },
      store: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(orders);
});

// GET /api/purchase-orders/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const order = await prisma.purchaseOrder.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      supplier: true,
      store: true,
      creator: { select: { id: true, name: true } },
      items: {
        include: { product: { select: { id: true, barcode: true, nameEn: true, unit: true } } },
      },
    },
  });
  if (!order) {
    res.status(404).json({ error: 'Purchase order not found' });
    return;
  }
  res.json(order);
});

// POST /api/purchase-orders
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = createPOSchema.parse(req.body);

    // Generate PO number
    const count = await prisma.purchaseOrder.count();
    const poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        storeId: data.storeId,
        notes: data.notes,
        createdBy: req.user!.userId,
        totalAmount: data.items.reduce((sum, i) => sum + i.qtyOrdered * i.unitPrice, 0),
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            qtyOrdered: i.qtyOrdered,
            unitPrice: i.unitPrice,
            total: i.qtyOrdered * i.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        supplier: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(order);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// POST /api/purchase-orders/:id/receive
router.post('/:id/receive', authMiddleware, async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    if (order.status === 'RECEIVED') {
      res.status(400).json({ error: 'Purchase order already fully received' });
      return;
    }
    if (order.status === 'CANCELLED') {
      res.status(400).json({ error: 'Purchase order is cancelled' });
      return;
    }

    // Receive each item — record stock IN movement
    for (const item of order.items) {
      const remaining = item.qtyOrdered - item.qtyReceived;
      if (remaining <= 0) continue;

      await recordMovement({
        productId: item.productId,
        storeId: order.storeId,
        type: 'IN',
        quantity: remaining,
        note: `PO #${order.poNumber}`,
        userId: req.user!.userId,
      });

      await prisma.purchaseOrderItem.update({
        where: { id: item.id },
        data: { qtyReceived: item.qtyOrdered },
      });
    }

    // Mark PO as received
    const updated = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        status: 'RECEIVED',
        receivedAt: new Date(),
      },
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, nameEn: true } } } },
      },
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to receive purchase order' });
  }
});

// POST /api/purchase-orders/:id/cancel
router.post('/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
  const order = await prisma.purchaseOrder.update({
    where: { id: Number(req.params.id) },
    data: { status: 'CANCELLED' },
  });
  res.json(order);
});

export default router;
