import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface StockItem {
  id: number;
  productId: number;
  quantity: number;
  batchNo: string | null;
  expiryDate: string | null;
  product: {
    id: number;
    barcode: string;
    nameEn: string;
    nameNe: string | null;
    price: number;
    minStock: number;
    unit: string;
  };
}

interface Movement {
  id: number;
  type: string;
  quantity: number;
  note: string | null;
  createdAt: string;
  product: { id: number; barcode: string; nameEn: string };
  user: { id: number; name: string };
}

interface LowStockAlert extends StockItem {
  alert: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface ExpiringItem {
  id: number;
  productId: number;
  quantity: number;
  batchNo: string | null;
  expiryDate: string | null;
  daysRemaining: number | null;
  isExpired: boolean;
  product: {
    id: number;
    barcode: string;
    nameEn: string;
    nameNe: string | null;
    unit: string;
    price: number;
  };
}

interface Product {
  id: number;
  barcode: string;
  nameEn: string;
}

interface Store {
  id: number;
  name: string;
}

type Tab = 'stock' | 'movements' | 'alerts' | 'transfers' | 'expiry';

export default function Stock() {
  const [tab, setTab] = useState<Tab>('stock');
  const [showMovement, setShowMovement] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const queryClient = useQueryClient();

  // Movement form state
  const [formProduct, setFormProduct] = useState('');
  const [formType, setFormType] = useState<'IN' | 'OUT' | 'ADJUST'>('IN');
  const [formQty, setFormQty] = useState('');
  const [formBatch, setFormBatch] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState('');

  // Transfer form state
  const [transferProduct, setTransferProduct] = useState('');
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferError, setTransferError] = useState('');

  // Store ID — hardcoded to 1 for now (multi-store support later)
  const storeId = 1;

  const { data: stock, isLoading: stockLoading } = useQuery<StockItem[]>({
    queryKey: ['stock', storeId],
    queryFn: async () => {
      const res = await api.get(`/stock?storeId=${storeId}`);
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: movements } = useQuery<Movement[]>({
    queryKey: ['stock-movements', storeId],
    queryFn: async () => {
      const res = await api.get(`/stock/movements?storeId=${storeId}&limit=20`);
      return res.data;
    },
  });

  const { data: alerts } = useQuery<LowStockAlert[]>({
    queryKey: ['stock-alerts', storeId],
    queryFn: async () => {
      const res = await api.get(`/stock/low-stock?storeId=${storeId}`);
      return res.data;
    },
    refetchInterval: 15000,
  });

  const { data: expiring } = useQuery<ExpiringItem[]>({
    queryKey: ['stock-expiring', storeId],
    queryFn: async () => {
      const res = await api.get(`/stock/expiring?storeId=${storeId}&withinDays=90`);
      return res.data;
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products-simple'],
    queryFn: async () => {
      const res = await api.get('/products?limit=500');
      return res.data.products;
    },
  });

  const { data: stores } = useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.get('/stores');
      return res.data;
    },
  });

  const movementMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/stock/movement', { ...data, storeId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['stock-expiring'] });
      resetMovementForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.error || err.message || 'Failed to record movement');
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/stock/transfer', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['stock-expiring'] });
      resetTransferForm();
    },
    onError: (err: any) => {
      setTransferError(err.response?.data?.error || err.message || 'Failed to transfer stock');
    },
  });

  const resetMovementForm = () => {
    setFormProduct('');
    setFormType('IN');
    setFormQty('');
    setFormBatch('');
    setFormExpiry('');
    setFormNote('');
    setFormError('');
    setShowMovement(false);
  };

  const resetTransferForm = () => {
    setTransferProduct('');
    setTransferFrom('');
    setTransferTo('');
    setTransferQty('');
    setTransferNote('');
    setTransferError('');
    setShowTransfer(false);
  };

  const handleMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const productId = Number(formProduct);
    if (!productId) {
      setFormError('Select a product');
      return;
    }
    const qty = Number(formQty);
    if (!qty || qty <= 0) {
      setFormError('Quantity must be positive');
      return;
    }
    movementMutation.mutate({
      productId,
      type: formType,
      quantity: qty,
      batchNo: formBatch || undefined,
      expiryDate: formExpiry || undefined,
      note: formNote || undefined,
    });
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const productId = Number(transferProduct);
    if (!productId) {
      setTransferError('Select a product');
      return;
    }
    const fromStoreId = Number(transferFrom);
    if (!fromStoreId) {
      setTransferError('Select source store');
      return;
    }
    const toStoreId = Number(transferTo);
    if (!toStoreId) {
      setTransferError('Select destination store');
      return;
    }
    if (fromStoreId === toStoreId) {
      setTransferError('Source and destination must be different');
      return;
    }
    const qty = Number(transferQty);
    if (!qty || qty <= 0) {
      setTransferError('Quantity must be positive');
      return;
    }
    transferMutation.mutate({
      productId,
      fromStoreId,
      toStoreId,
      quantity: qty,
      note: transferNote || undefined,
    });
  };

  const alertCount = alerts?.length || 0;
  const expiredCount = expiring?.filter((e) => e.isExpired).length || 0;
  const expiringSoonCount = expiring?.filter((e) => !e.isExpired).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Stock & Inventory</h1>
          {alertCount > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {alertCount} alert{alertCount > 1 ? 's' : ''}
            </span>
          )}
          {expiredCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {expiredCount} expired
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransfer(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Transfer Stock
          </button>
          <button
            onClick={() => setShowMovement(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Record Movement
          </button>
        </div>
      </div>

      {/* Movement form modal */}
      {showMovement && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Record Stock Movement</h2>
            <form onSubmit={handleMovement} className="space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{formError}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select product...</option>
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameEn} ({p.barcode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="IN">Stock In</option>
                    <option value="OUT">Stock Out</option>
                    <option value="ADJUST">Adjust</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch No.</label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={(e) => setFormBatch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Optional note"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={movementMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {movementMutation.isPending ? 'Recording...' : 'Record Movement'}
                </button>
                <button
                  type="button"
                  onClick={resetMovementForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer form modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Transfer Stock Between Stores</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              {transferError && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{transferError}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={transferProduct}
                  onChange={(e) => setTransferProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select product...</option>
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameEn} ({p.barcode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Store</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select source...</option>
                    {stores?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Store</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select destination...</option>
                    {stores?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Optional reason for transfer"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={transferMutation.isPending}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {transferMutation.isPending ? 'Transferring...' : 'Transfer Stock'}
                </button>
                <button
                  type="button"
                  onClick={resetTransferForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
        {(['stock', 'movements', 'alerts', 'transfers', 'expiry'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'stock' && 'Current Stock'}
            {t === 'movements' && 'Movements'}
            {t === 'alerts' && `Alerts (${alertCount})`}
            {t === 'transfers' && 'Transfers'}
            {t === 'expiry' && `Expiry (${expiringSoonCount + expiredCount})`}
          </button>
        ))}
      </div>

      {/* Stock view */}
      {tab === 'stock' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Barcode</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Qty</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Batch</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {stockLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : stock?.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No stock records</td></tr>
              ) : (
                stock?.map((item) => {
                  const isLow = item.quantity <= item.product.minStock;
                  return (
                    <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      isLow ? 'bg-orange-50' : ''
                    }`}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">{item.product.nameEn}</td>
                      <td className="px-6 py-3 text-sm font-mono text-gray-500">{item.product.barcode}</td>
                      <td className={`px-6 py-3 text-sm text-right font-semibold ${
                        item.quantity === 0 ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-gray-800'
                      }`}>
                        {item.quantity} {item.product.unit}
                        {isLow && <span className="ml-2 text-xs">⚠️</span>}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.batchNo || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Movements view */}
      {tab === 'movements' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Type</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Qty</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Note</th>
              </tr>
            </thead>
            <tbody>
              {movements?.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No movements</td></tr>
              ) : (
                movements?.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{m.product.nameEn}</td>
                    <td className="px-6 py-3 text-sm text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        m.type === 'IN' || m.type === 'TRANSFER_IN' ? 'bg-green-100 text-green-700' :
                        m.type === 'OUT' || m.type === 'TRANSFER_OUT' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">{m.quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{m.user.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-400">{m.note || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Alerts view */}
      {tab === 'alerts' && (
        <div className="space-y-3">
          {alerts?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
              All stock levels are healthy ✅
            </div>
          ) : (
            alerts?.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between ${
                  item.alert === 'OUT_OF_STOCK' ? 'border-red-200' : 'border-orange-200'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800">{item.product.nameEn}</p>
                  <p className="text-sm text-gray-500">
                    {item.product.barcode} · Min: {item.product.minStock} {item.product.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    item.alert === 'OUT_OF_STOCK' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {item.quantity} {item.product.unit}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.alert === 'OUT_OF_STOCK'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.alert === 'OUT_OF_STOCK' ? 'OUT OF STOCK' : 'LOW STOCK'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Transfers view */}
      {tab === 'transfers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <p className="text-lg mb-2">🔄 Stock Transfers</p>
          <p className="text-sm">Transfer stock between stores using the "Transfer Stock" button above.</p>
          <p className="text-sm mt-1">Completed transfers appear in the Movements tab with TRANSFER_IN / TRANSFER_OUT types.</p>
        </div>
      )}

      {/* Expiry view */}
      {tab === 'expiry' && (
        <div className="space-y-4">
          {!expiring || expiring.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
              No items with expiry dates tracked ✅
            </div>
          ) : (
            <>
              {/* Expired items */}
              {expiredCount > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">
                    Expired ({expiredCount})
                  </h3>
                  <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-red-100 bg-red-50">
                          <th className="text-left px-6 py-3 text-sm font-medium text-red-600">Product</th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-red-600">Qty</th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-red-600">Batch</th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-red-600">Expired</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiring?.filter((e) => e.isExpired).map((item) => (
                          <tr key={item.id} className="border-b border-red-50 hover:bg-red-50">
                            <td className="px-6 py-3 text-sm font-medium text-gray-800">{item.product.nameEn}</td>
                            <td className="px-6 py-3 text-sm text-right font-semibold text-red-600">{item.quantity} {item.product.unit}</td>
                            <td className="px-6 py-3 text-sm text-gray-500">{item.batchNo || '—'}</td>
                            <td className="px-6 py-3 text-sm text-red-600">{(item as any).daysRemaining} days ago</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expiring soon */}
              {expiringSoonCount > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-2 uppercase tracking-wide">
                    Expiring Soon ({expiringSoonCount})
                  </h3>
                  <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-amber-100 bg-amber-50">
                          <th className="text-left px-6 py-3 text-sm font-medium text-amber-600">Product</th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-amber-600">Qty</th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-amber-600">Batch</th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-amber-600">Expiry Date</th>
                          <th className="text-right px-6 py-3 text-sm font-medium text-amber-600">Days Left</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiring?.filter((e) => !e.isExpired).map((item) => {
                          const days = item.daysRemaining ?? 0;
                          const urgency = days <= 7 ? 'text-red-600 font-bold' : days <= 30 ? 'text-orange-600' : 'text-amber-600';
                          return (
                            <tr key={item.id} className="border-b border-amber-50 hover:bg-amber-50">
                              <td className="px-6 py-3 text-sm font-medium text-gray-800">{item.product.nameEn}</td>
                              <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">{item.quantity} {item.product.unit}</td>
                              <td className="px-6 py-3 text-sm text-gray-500">{item.batchNo || '—'}</td>
                              <td className="px-6 py-3 text-sm text-gray-600">
                                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                              </td>
                              <td className={`px-6 py-3 text-sm text-right ${urgency}`}>
                                {days}d
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
