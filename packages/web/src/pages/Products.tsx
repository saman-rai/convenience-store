import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

interface Product {
  id: number;
  barcode: string;
  nameEn: string;
  nameNe: string | null;
  price: number;
  costPrice: number | null;
  unit: string;
  category: { id: number; nameEn: string } | null;
  brand: { id: number; name: string } | null;
  minStock: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface Category {
  id: number;
  nameEn: string;
  nameNe: string | null;
}

export default function Products() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['products', search, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('categoryId', categoryFilter);
      const res = await api.get(`/products?${params}`);
      return res.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, barcode, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Barcode</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name (EN)</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name (NE)</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Price</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Min Stock</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              data?.products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono text-gray-600">{product.barcode}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{product.nameEn}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{product.nameNe || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{product.category?.nameEn || '—'}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-gray-800">
                    NPR {product.price}
                  </td>
                  <td className="px-6 py-3 text-sm text-center text-gray-600">{product.minStock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <p className="text-sm text-gray-500 mt-3">
          Showing {data.products.length} of {data.total} products
        </p>
      )}
    </div>
  );
}
