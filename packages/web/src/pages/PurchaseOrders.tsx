import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface PO {
  id: number;
  poNumber: string;
  status: string;
  totalAmount: number | null;
  notes: string | null;
  receivedAt: string | null;
  createdAt: string;
  supplier: { id: number; name: string };
  store: { id: number; name: string };
  creator: { id: number; name: string };
  _count: { items: number };
}

interface POItem {
  id: number;
  productId: number;
  qtyOrdered: number;
  qtyReceived: number;
  unitPrice: number;
  total: number;
  product: { id: number; barcode: string; nameEn: string; unit: string };
}

interface PODetail extends PO {
  items: POItem[];
}

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  barcode: string;
  nameEn: string;
  price: number;
}

interface LineItem {
  productId: number;
  qtyOrdered: string;
  unitPrice: string;
}

export default function PurchaseOrders() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPO, setSelectedPO] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Form state
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { productId: 0, qtyOrdered: '', unitPrice: '' },
  ]);

  const storeId = 1;

  const { data: orders, isLoading } = useQuery<PO[]>({
    queryKey: ['purchase-orders', storeId],
    queryFn: async () => {
      const res = await api.get(`/purchase-orders?storeId=${storeId}`);
      return res.data;
    },
  });

  const { data: poDetail } = useQuery<PODetail>({
    queryKey: ['purchase-order', selectedPO],
    queryFn: async () => {
      const res = await api.get(`/purchase-orders/${selectedPO}`);
      return res.data;
    },
    enabled: !!selectedPO,
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await api.get('/suppliers');
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/purchase-orders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      resetForm();
    },
  });

  const receiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/purchase-orders/${id}/receive`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });

  const resetForm = () => {
    setSupplierId('');
    setNotes('');
    setLineItems([{ productId: 0, qtyOrdered: '', unitPrice: '' }]);
    setShowForm(false);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: 0, qtyOrdered: '', unitPrice: '' }]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const items = [...lineItems];
    items[index] = { ...items[index], [field]: field === 'productId' ? Number(value) : value };
    setLineItems(items);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = lineItems.map((li) => ({
      productId: li.productId,
      qtyOrdered: Number(li.qtyOrdered),
      unitPrice: Number(li.unitPrice),
    }));

    if (items.some((i) => !i.productId || !i.qtyOrdered || !i.unitPrice)) {
      return;
    }

    createMutation.mutate({
      supplierId: Number(supplierId),
      storeId,
      notes: notes || undefined,
      items,
    });
  };

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PARTIAL: 'bg-blue-100 text-blue-700',
    RECEIVED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + New Purchase Order
        </button>
      </div>

      {/* Create PO Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">New Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                  <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Select supplier...</option>
                    {suppliers?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Items</label>
                  <button type="button" onClick={addLineItem}
                    className="text-sm text-blue-600 hover:text-blue-800">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <select
                          value={item.productId}
                          onChange={(e) => updateLineItem(i, 'productId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        >
                          <option value={0}>Select product...</option>
                          {products?.map((p) => (
                            <option key={p.id} value={p.id}>{p.nameEn} ({p.barcode})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input type="number" min="1" placeholder="Qty" value={item.qtyOrdered}
                          onChange={(e) => updateLineItem(i, 'qtyOrdered', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                      </div>
                      <div className="w-28">
                        <input type="number" min="0" step="0.01" placeholder="Unit Price" value={item.unitPrice}
                          onChange={(e) => updateLineItem(i, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                      </div>
                      <button type="button" onClick={() => removeLineItem(i)}
                        className="text-red-500 text-lg px-2 pb-1">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Create Purchase Order'}
                </button>
                <button type="button" onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Detail modal */}
      {selectedPO && poDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{poDetail.poNumber}</h2>
              <button onClick={() => setSelectedPO(null)}
                className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div><span className="text-gray-500">Supplier:</span> <span className="font-medium">{poDetail.supplier.name}</span></div>
              <div><span className="text-gray-500">Status:</span>
                <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${statusColor[poDetail.status]}`}>{poDetail.status}</span>
              </div>
              <div><span className="text-gray-500">Total:</span> <span className="font-medium">NPR {poDetail.totalAmount}</span></div>
              <div><span className="text-gray-500">Created:</span> {new Date(poDetail.createdAt).toLocaleDateString()}</div>
              <div><span className="text-gray-500">By:</span> {poDetail.creator.name}</div>
              {poDetail.receivedAt && <div><span className="text-gray-500">Received:</span> {new Date(poDetail.receivedAt).toLocaleDateString()}</div>}
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-500">Product</th>
                  <th className="text-right py-2 font-medium text-gray-500">Ordered</th>
                  <th className="text-right py-2 font-medium text-gray-500">Received</th>
                  <th className="text-right py-2 font-medium text-gray-500">Unit Price</th>
                  <th className="text-right py-2 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {poDetail.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-2 text-gray-800">{item.product.nameEn}</td>
                    <td className="py-2 text-right">{item.qtyOrdered}</td>
                    <td className="py-2 text-right">{item.qtyReceived}</td>
                    <td className="py-2 text-right">NPR {item.unitPrice}</td>
                    <td className="py-2 text-right font-medium">NPR {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-3 mt-4">
              {poDetail.status === 'PENDING' && (
                <button onClick={() => { receiveMutation.mutate(poDetail.id); setSelectedPO(null); }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                  Receive All Items
                </button>
              )}
              <button onClick={() => setSelectedPO(null)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PO List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">PO #</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Supplier</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Total</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Items</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Created</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : orders?.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">No purchase orders</td></tr>
            ) : (
              orders?.map((po) => (
                <tr key={po.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPO(po.id)}>
                  <td className="px-6 py-3 text-sm font-mono font-medium text-gray-800">{po.poNumber}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{po.supplier.name}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-gray-800">NPR {po.totalAmount}</td>
                  <td className="px-6 py-3 text-sm text-center text-gray-600">{po._count.items}</td>
                  <td className="px-6 py-3 text-sm text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[po.status]}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-sm text-right text-blue-600 font-medium">View</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
