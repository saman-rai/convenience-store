import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const storeSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  taxRate: z.number().default(13.0),
  currency: z.string().default('NPR'),
});

// GET /api/stores
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  const stores = await prisma.store.findMany({
    include: { _count: { select: { users: true, transactions: true } } },
  });
  res.json(stores);
});

// GET /api/stores/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const store = await prisma.store.findUnique({
    where: { id: Number(req.params.id) },
    include: { _count: { select: { users: true, transactions: true } } },
  });
  if (!store) {
    res.status(404).json({ error: 'Store not found' });
    return;
  }
  res.json(store);
});

// POST /api/stores
router.post('/', authMiddleware, requireRole('OWNER', 'MANAGER'), async (req: Request, res: Response) => {
  try {
    const data = storeSchema.parse(req.body);
    const store = await prisma.store.create({ data });
    res.status(201).json(store);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// PUT /api/stores/:id
router.put('/:id', authMiddleware, requireRole('OWNER', 'MANAGER'), async (req: Request, res: Response) => {
  try {
    const data = storeSchema.partial().parse(req.body);
    const store = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(store);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// DELETE /api/stores/:id
router.delete('/:id', authMiddleware, requireRole('OWNER'), async (req: Request, res: Response) => {
  await prisma.store.update({
    where: { id: Number(req.params.id) },
    data: { isActive: false },
  });
  res.json({ message: 'Store deactivated' });
});

export default router;
