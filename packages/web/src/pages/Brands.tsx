import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface Brand {
  id: number;
  name: string;
  isActive: boolean;
  _count: { products: number };
}

export default function Brands() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await api.get('/brands');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.post('/brands', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setName('');
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      const res = await api.put(`/brands/${data.id}`, { name: data.name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setName('');
      setEditingId(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, name });
    } else {
      createMutation.mutate({ name });
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setShowForm(true);
  };

  const cancelForm = () => {
    setName('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Brand
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Brand' : 'New Brand'}
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Products</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : brands?.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">No brands found</td>
              </tr>
            ) : (
              brands?.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{brand.name}</td>
                  <td className="px-6 py-3 text-sm text-center text-gray-600">{brand._count.products}</td>
                  <td className="px-6 py-3 text-sm text-right space-x-2">
                    <button
                      onClick={() => startEdit(brand)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Deactivate this brand?')) deleteMutation.mutate(brand.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
