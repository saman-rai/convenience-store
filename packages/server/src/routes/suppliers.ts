import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const supplierSchema = z.object({
  name: z.string().min(1),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  panNo: z.string().optional(),
});

// GET /api/suppliers
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  const suppliers = await prisma.supplier.findMany({
    where: { isActive: true },
    include: { _count: { select: { purchaseOrders: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(suppliers);
});

// GET /api/suppliers/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: Number(req.params.id) },
    include: { purchaseOrders: { include: { items: true, store: { select: { name: true } } } } },
  });
  if (!supplier || !supplier.isActive) {
    res.status(404).json({ error: 'Supplier not found' });
    return;
  }
  res.json(supplier);
});

// POST /api/suppliers
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = supplierSchema.parse(req.body);
    const supplier = await prisma.supplier.create({ data });
    res.status(201).json(supplier);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// PUT /api/suppliers/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = supplierSchema.partial().parse(req.body);
    const supplier = await prisma.supplier.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(supplier);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// DELETE /api/suppliers/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await prisma.supplier.update({
    where: { id: Number(req.params.id) },
    data: { isActive: false },
  });
  res.json({ message: 'Supplier deactivated' });
});

export default router;
