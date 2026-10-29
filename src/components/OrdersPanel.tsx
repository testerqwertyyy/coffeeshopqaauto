import React, { useState, useEffect } from 'react';
import { ordersApi, Order } from '../services/api';

interface OrdersPanelProps {
  onBack: () => void;
}

const OrdersPanel: React.FC<OrdersPanelProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.list()
      .then(setOrders)
      .catch(err => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-800 hover:text-amber-600 mb-6 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </button>

      <h2 className="text-2xl font-bold text-stone-800 mb-6">Your Orders</h2>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-amber-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-amber-50">
          <span className="text-5xl mb-4 block">📦</span>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">No orders yet</h3>
          <p className="text-stone-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-amber-50 overflow-hidden">
              <div className="p-5 border-b border-amber-50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-stone-500">Order #{order.id}</p>
                  <p className="text-xs text-stone-400">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-stone-100 text-stone-700'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-amber-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-700">
                        {item.product_name} <span className="text-stone-400">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-stone-800">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-amber-50 text-sm text-stone-500">
                  📍 {order.address}, {order.city} {order.zip_code}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
