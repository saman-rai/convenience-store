import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const categorySchema = z.object({
  nameEn: z.string().min(1),
  nameNe: z.string().optional(),
  parentId: z.number().optional(),
});

// GET /api/categories
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } }, parent: { select: { id: true, nameEn: true } } },
    orderBy: { nameEn: 'asc' },
  });
  res.json(categories);
});

// GET /api/categories/tree — nested hierarchy
router.get('/tree', authMiddleware, async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        include: { children: { where: { isActive: true } } },
      },
    },
    orderBy: { nameEn: 'asc' },
  });
  res.json(categories);
});

// POST /api/categories
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = categorySchema.partial().parse(req.body);
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await prisma.category.update({
    where: { id: Number(req.params.id) },
    data: { isActive: false },
  });
  res.json({ message: 'Category deactivated' });
});

export default router;
