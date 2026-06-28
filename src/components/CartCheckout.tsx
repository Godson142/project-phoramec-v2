import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, MapPin, Send, Plus, Minus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CartItem, CustomerOrder } from '../types';
import { WHATSAPP_NUMBER } from '../data';
import { speakText } from '../utils/speech';

interface CartCheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (order: CustomerOrder) => void;
}

export default function CartCheckout({
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
}: CartCheckoutProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; mapsUrl?: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Trigger Geolocation API for delivery
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      speakText("Your phone or browser does not support automatic location sharing.");
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    speakText("Querying device GPS for delivery location. Please confirm permissions.");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocation({ latitude, longitude, mapsUrl });
        setIsLocating(false);
        speakText("Delivery GPS location loaded successfully.");
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        speakText("Failed to access GPS. Please enter coordinates or instructions on WhatsApp.");
        alert("Failed to find location. Ensure GPS is enabled on your phone.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      speakText("Your cart is empty. Please select products first.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      speakText("Name and WhatsApp phone number are required for order delivery.");
      return;
    }

    // Prepare checkout log payload for the admin panel
    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      items: cartItems.map((item) => ({
        productTitle: `${item.product.brand} ${item.product.model}`,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      location: location || undefined,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
    };

    onSubmitOrder(newOrder);

    // Build perfect encoded WhatsApp handshake URL
    const itemsListString = cartItems
      .map((item) => `• ${item.quantity}x ${item.product.brand} ${item.product.model} (₵${(item.product.price * item.quantity).toLocaleString()})`)
      .join('\n');

    const emailString = email ? `\n📧 *Email:* ${email}` : '';
    const gpsString = location?.mapsUrl 
      ? `\n📍 *GPS Delivery Link:* ${location.mapsUrl}` 
      : '\n📍 *GPS Link:* Not shared (Will specify details in chat)';

    const whatsappMessage = 
      `*🛒 NEW PHORAMEC SHOPPING ORDER*\n` +
      `--------------------------------------\n` +
      `👤 *Customer Name:* ${name}\n` +
      `📞 *Phone Number:* ${phone}${emailString}\n` +
      `${gpsString}\n\n` +
      `*🛍️ Order Breakdown:*\n` +
      `${itemsListString}\n\n` +
      `--------------------------------------\n` +
      `💰 *Total Amount:* GHS ${totalAmount.toLocaleString()}\n` +
      `--------------------------------------\n` +
      `*Phoramec, please process and deliver this order for me!*`;

    const encodedMsg = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    speakText("Order logged! Handshaking directly with WhatsApp.");
    setOrderSuccess(true);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onClearCart();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white dark:bg-[#121212] shadow-2xl border-l border-neutral-200 dark:border-white/10 transition-all duration-300">
        
        {/* Cart Header Panel */}
        <div className="flex h-16 items-center justify-between border-b px-4 border-neutral-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 transition-all hover:bg-neutral-200 dark:hover:bg-white/5"
            onMouseEnter={() => speakText("Close cart panel and resume shopping.")}
            id="cart-close-btn"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white">
              Your WhatsApp Cart
            </h3>
          </div>

          <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-black text-yellow-600 dark:text-yellow-500">
            {cartItems.length} Products
          </span>
        </div>

        {orderSuccess ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-white dark:bg-[#121212]">
            <CheckCircle2 className="h-16 w-16 text-green-500 dark:text-green-400 animate-bounce" />
            <h4 className="mt-4 text-lg font-black text-neutral-900 dark:text-white">
              Order Logged Successfully!
            </h4>
            <p className="mt-2 text-sm text-neutral-500 dark:text-gray-400">
              Launching WhatsApp to complete payment and arrange delivery. Please stand by...
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-white dark:bg-[#121212]">
            <ShoppingCart className="h-16 w-16 text-neutral-300 dark:text-gray-700" />
            <h4 className="mt-4 text-base font-extrabold text-neutral-800 dark:text-gray-300">
              Your WhatsApp Cart is Empty
            </h4>
            <p className="mt-2 text-xs text-neutral-500 dark:text-gray-500">
              Browse our catalog of high-quality electronics, phones, and accessories, and tap "Add to Cart" to start!
            </p>
            <button
              onClick={onClose}
              className="mt-6 flex h-12 items-center justify-center rounded-xl bg-yellow-500 px-6 text-sm font-black text-black shadow-md active:scale-95 hover:bg-yellow-600"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#121212]">
            {/* Scrollable Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#1a1a1a] p-3"
                  id={`cart-row-${item.product.id}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.model}
                    className="h-14 w-14 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 overflow-hidden">
                    <h5 className="truncate text-sm font-extrabold text-neutral-900 dark:text-white">
                      {item.product.brand} {item.product.model}
                    </h5>
                    <p className="text-xs font-black text-yellow-600 dark:text-yellow-500 mt-0.5">
                      ₵{item.product.price.toLocaleString()}
                    </p>
                    
                    {/* Quantity Adjustment Buttons (Extreme Touch Targets >= 48px) */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 active:scale-90 hover:bg-neutral-200 dark:hover:bg-[#222]"
                        title="Decrease quantity"
                        id={`qty-minus-${item.product.id}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-neutral-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 active:scale-90 hover:bg-neutral-200 dark:hover:bg-[#222]"
                        title="Increase quantity"
                        id={`qty-plus-${item.product.id}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onRemoveItem(item.product.id);
                      speakText(`Removed ${item.product.brand} from cart.`);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20"
                    title="Delete item"
                    id={`cart-delete-${item.product.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Block & Checkout Form */}
            <div className="border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#121212] p-4">
              <div className="flex items-center justify-between font-display mb-4">
                <span className="text-sm font-extrabold text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                  Total GHS Amount:
                </span>
                <span className="text-xl font-black text-yellow-600 dark:text-yellow-500">
                  ₵{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-1 focus:ring-yellow-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="checkout-name"
                  />
                  
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-1 focus:ring-yellow-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="checkout-phone"
                  />

                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Optional Email (For Receipt)"
                      className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-1 focus:ring-yellow-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="checkout-email"
                    />
                  </div>

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={isLocating}
                    className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-xs font-bold transition-all ${
                      location 
                        ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-[#222]'
                    }`}
                    id="checkout-gps-btn"
                  >
                    <MapPin className={`h-4 w-4 ${isLocating ? 'animate-spin text-yellow-500' : ''}`} />
                    {isLocating 
                      ? 'Fetching GPS...' 
                      : location 
                        ? '📍 Delivery GPS Linked!' 
                        : 'Tap to Share Delivery Location (GPS)'}
                  </button>
                </div>

                {/* Submit Checkout Handshake (Extreme Touch target size 48px) */}
                <button
                  type="submit"
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 font-black text-black transition-all hover:bg-yellow-600 active:scale-95 shadow-md"
                  id="checkout-submit-btn"
                  onMouseEnter={() => speakText(`Confirm payment of ${totalAmount.toLocaleString()} Cedis and finalize order on WhatsApp.`)}
                >
                  <Send className="h-4 w-4" />
                  Order on WhatsApp (₵{totalAmount.toLocaleString()})
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
