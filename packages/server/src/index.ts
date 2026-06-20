import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import storeRoutes from './routes/stores';
import categoryRoutes from './routes/categories';
import productRoutes from './routes/products';
import brandRoutes from './routes/brands';
import stockRoutes from './routes/stock';
import supplierRoutes from './routes/suppliers';
import purchaseOrderRoutes from './routes/purchase-orders';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);

app.listen(PORT, () => {
  console.log(`CU System API running on http://localhost:${PORT}`);
});

export default app;
