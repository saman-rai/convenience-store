import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

interface Store {
  id: number;
  name: string;
  _count: { users: number; transactions: number };
}

export default function Dashboard() {
  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.get('/stores');
      return res.data;
    },
  });

  const stats = [
    { label: 'Total Stores', value: stores?.length || 0, color: 'bg-blue-500' },
    { label: 'Total Products', value: '—', color: 'bg-green-500' },
    { label: 'Today Sales', value: '—', color: 'bg-purple-500' },
    { label: 'Low Stock Items', value: '—', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-3`} />
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Stores list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Stores</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {stores?.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{store.name}</p>
                    <p className="text-sm text-gray-500">
                      {store._count.users} employees · {store._count.transactions} transactions
                    </p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                    View
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
