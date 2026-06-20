import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const productSchema = z.object({
  barcode: z.string().min(1),
  nameEn: z.string().min(1),
  nameNe: z.string().optional(),
  sku: z.string().optional(),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  unit: z.string().default('pcs'),
  price: z.number().positive(),
  costPrice: z.number().positive().optional(),
  taxRate: z.number().default(13.0),
  minStock: z.number().default(0),
});

// GET /api/products
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const { search, categoryId, barcode, page = '1', limit = '50' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { nameEn: { contains: String(search) } },
      { nameNe: { contains: String(search) } },
      { barcode: { contains: String(search) } },
      { sku: { contains: String(search) } },
    ];
  }
  if (categoryId) where.categoryId = Number(categoryId);
  if (barcode) where.barcode = String(barcode);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, nameEn: true } }, brand: { select: { id: true, name: true } } },
      skip,
      take: Number(limit),
      orderBy: { nameEn: 'asc' },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ products, total, page: Number(page), limit: Number(limit) });
});

// GET /api/products/:barcode — lookup by barcode
router.get('/barcode/:barcode', authMiddleware, async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { barcode: req.params.barcode },
    include: { category: true, brand: true },
  });
  if (!product || !product.isActive) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// POST /api/products
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { isActive: false },
  });
  res.json({ message: 'Product deactivated' });
});

export default router;
