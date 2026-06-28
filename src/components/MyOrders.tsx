import { ArrowLeft, Package, Calendar, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { CustomerOrder } from '../types';
import { speakText } from '../utils/speech';
import { useState, useEffect } from 'react';

interface MyOrdersProps {
  onBack: () => void;
}

export default function MyOrders({ onBack }: MyOrdersProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  const fetchOrders = () => {
    const saved = localStorage.getItem('phoramec_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    speakText("Opening your past order history section. Here you can track your submitted import and local orders.");
  }, []);

  const getStatusBadge = (status?: string) => {
    const s = status || 'Pending';
    switch (s) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-black text-green-600 dark:text-green-400 border border-green-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-black text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-black text-red-600 dark:text-red-400 border border-red-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-black text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-ping" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header section with Exit button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <Package className="h-6 w-6" />
            <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white sm:text-2xl">
              My Orders & Purchases
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
            Client dashboard & instant status tracker
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchOrders();
              speakText("Order status list refreshed.");
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e] px-4 text-xs font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-95"
            title="Refresh order history"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          <button
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-xs font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95"
            id="orders-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Store</span>
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-white/10 p-12 text-center space-y-4 bg-white dark:bg-[#121212] shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-gray-500">
            <Package className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
              No Purchases Logged Yet
            </h3>
            <p className="max-w-xs mx-auto text-xs text-neutral-500 dark:text-gray-400 font-medium">
              You haven't submitted any checkout orders yet. Go to our product catalog, add items to your cart, and check out via WhatsApp to log your orders here!
            </p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-500 px-6 font-black text-xs text-black hover:bg-yellow-600 transition-all active:scale-95 shadow-lg shadow-yellow-500/15"
          >
            Browse Products Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateStr = order.timestamp.split(',')[0];
            return (
              <div 
                key={order.id} 
                className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#141414] p-5 shadow-md hover:border-yellow-500/20 transition-all space-y-4"
              >
                {/* Header of card */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-neutral-100 dark:bg-white/5 p-2 text-neutral-600 dark:text-gray-300">
                      <Package className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs font-black text-neutral-900 dark:text-white">
                        ORDER ID: <span className="text-yellow-600 dark:text-yellow-500">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400 dark:text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{order.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items listing */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                    Purchased Item Details
                  </span>
                  <div className="divide-y divide-neutral-100 dark:divide-white/5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 text-xs">
                        <div className="font-extrabold text-neutral-800 dark:text-gray-300">
                          <span className="text-yellow-600 dark:text-yellow-500 font-black mr-1">{item.quantity}x</span>
                          {item.productTitle}
                        </div>
                        <div className="font-black text-neutral-900 dark:text-white whitespace-nowrap">
                          ₵{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer details: GPS location, contact info, total amount */}
                <div className="flex flex-col gap-4 pt-3 border-t border-neutral-100 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    {order.location?.mapsUrl && (
                      <a 
                        href={order.location.mapsUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 rounded-lg bg-yellow-500/10 px-2.5 py-1.5 font-bold text-[11px] text-yellow-600 dark:text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Saved GPS Location</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <span className="text-neutral-500 dark:text-gray-400 font-medium">
                      Deliver to: <span className="font-bold text-neutral-900 dark:text-white">{order.name} ({order.phone})</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider block">
                      Total Invoice Amount
                    </span>
                    <span className="font-black text-base text-yellow-600 dark:text-yellow-500">
                      GHS {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
