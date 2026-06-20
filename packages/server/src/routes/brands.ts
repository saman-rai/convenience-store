import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const brandSchema = z.object({
  name: z.string().min(1),
});

// GET /api/brands
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(brands);
});

// POST /api/brands
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = brandSchema.parse(req.body);
    const brand = await prisma.brand.create({ data });
    res.status(201).json(brand);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create brand' });
  }
});

// PUT /api/brands/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = brandSchema.partial().parse(req.body);
    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(brand);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

// DELETE /api/brands/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await prisma.brand.update({
    where: { id: Number(req.params.id) },
    data: { isActive: false },
  });
  res.json({ message: 'Brand deactivated' });
});

export default router;
