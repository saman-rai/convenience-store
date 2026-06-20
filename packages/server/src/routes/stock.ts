import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { recordMovement, getStockByStore, getMovements, getLowStock } from '../services/stock';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

const movementSchema = z.object({
  productId: z.number(),
  storeId: z.number(),
  type: z.enum(['IN', 'OUT', 'ADJUST', 'TRANSFER_IN', 'TRANSFER_OUT']),
  quantity: z.number().positive(),
  batchNo: z.string().optional(),
  expiryDate: z.string().optional(),
  note: z.string().optional(),
});

const transferSchema = z.object({
  productId: z.number(),
  fromStoreId: z.number(),
  toStoreId: z.number(),
  quantity: z.number().positive(),
  batchNo: z.string().optional(),
  note: z.string().optional(),
});

// POST /api/stock/transfer — atomic transfer between stores
router.post('/transfer', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = transferSchema.parse(req.body);

    if (data.fromStoreId === data.toStoreId) {
      res.status(400).json({ error: 'Source and destination stores must be different' });
      return;
    }

    // Check both stores exist
    const [fromStore, toStore] = await Promise.all([
      prisma.store.findUnique({ where: { id: data.fromStoreId } }),
      prisma.store.findUnique({ where: { id: data.toStoreId } }),
    ]);
    if (!fromStore || !fromStore.isActive) {
      res.status(404).json({ error: 'Source store not found' });
      return;
    }
    if (!toStore || !toStore.isActive) {
      res.status(404).json({ error: 'Destination store not found' });
      return;
    }

    // Record TRANSFER_OUT from source
    await recordMovement({
      productId: data.productId,
      storeId: data.fromStoreId,
      type: 'TRANSFER_OUT',
      quantity: data.quantity,
      batchNo: data.batchNo,
      note: data.note ? `Transfer to store ${data.toStoreId}: ${data.note}` : `Transfer to store ${data.toStoreId}`,
      userId: req.user!.userId,
    });

    // Record TRANSFER_IN to destination
    const transferIn = await recordMovement({
      productId: data.productId,
      storeId: data.toStoreId,
      type: 'TRANSFER_IN',
      quantity: data.quantity,
      batchNo: data.batchNo,
      note: data.note ? `Transfer from store ${data.fromStoreId}: ${data.note}` : `Transfer from store ${data.fromStoreId}`,
      userId: req.user!.userId,
    });

    res.status(201).json({ message: 'Transfer completed', movement: transferIn });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to transfer stock' });
  }
});

// GET /api/stock/expiring?storeId=1&withinDays=30
router.get('/expiring', authMiddleware, async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.query.storeId) || req.user?.storeId;
    const withinDays = Number(req.query.withinDays) || 30;
    if (!storeId) {
      res.status(400).json({ error: 'storeId required' });
      return;
    }

    const now = new Date();
    const threshold = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);

    const expiring = await prisma.stock.findMany({
      where: {
        storeId,
        expiryDate: { not: null, lte: threshold },
        quantity: { gt: 0 },
      },
      include: {
        product: {
          select: { id: true, barcode: true, nameEn: true, nameNe: true, unit: true, price: true },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    const result = expiring.map((s) => ({
      ...s,
      daysRemaining: s.expiryDate
        ? Math.ceil((s.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
      isExpired: s.expiryDate ? s.expiryDate < now : false,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expiring stock' });
  }
});

// GET /api/stock?storeId=1
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.query.storeId) || req.user?.storeId;
    if (!storeId) {
      res.status(400).json({ error: 'storeId required' });
      return;
    }
    const stock = await getStockByStore(storeId);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// GET /api/stock/movements?storeId=1&limit=50
router.get('/movements', authMiddleware, async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.query.storeId) || req.user?.storeId;
    const limit = Number(req.query.limit) || 50;
    if (!storeId) {
      res.status(400).json({ error: 'storeId required' });
      return;
    }
    const movements = await getMovements(storeId, limit);
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movements' });
  }
});

// GET /api/stock/low-stock?storeId=1
router.get('/low-stock', authMiddleware, async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.query.storeId) || req.user?.storeId;
    if (!storeId) {
      res.status(400).json({ error: 'storeId required' });
      return;
    }
    const alerts = await getLowStock(storeId);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
});

// POST /api/stock/movement
router.post('/movement', authMiddleware, async (req: Request, res: Response) => {
  try {
    const parsed = movementSchema.parse(req.body);
    const movement = await recordMovement({ ...parsed, userId: req.user!.userId });
    res.status(201).json(movement);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to record movement' });
  }
});

export default router;
