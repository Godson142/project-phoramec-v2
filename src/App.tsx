import { useState, useEffect } from 'react';
import { Phone, MessageSquare, ShoppingBag, ArrowLeft, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';
import { INITIAL_PRODUCTS, OFFICE_CONTACT } from './data';
import { Product, CartItem, CategoryType, CustomImportRequest, CustomerOrder } from './types';
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import ProductList from './components/ProductList';
import CustomRequestForm from './components/CustomRequestForm';
import CartCheckout from './components/CartCheckout';
import AdminDashboard from './components/AdminDashboard';
import MyOrders from './components/MyOrders';
import { speakText } from './utils/speech';

export default function App() {
  // Navigation & UI States
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'custom-request' | 'admin' | 'my-orders'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Core Data States (Synchronizing with localStorage for persistent business operations)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('phoramec_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const [customRequests, setCustomRequests] = useState<CustomImportRequest[]>(() => {
    const saved = localStorage.getItem('phoramec_custom_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('phoramec_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Natively Synced System Theme Mode Setup (100% Functional with manual storage override)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem('phoramec_theme');
    if (cached) {
      return cached === 'dark';
    }
    return true; // Default to Sophisticated Dark
  });

  // Screen Reader Accessibility State
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>(() => {
    const cached = localStorage.getItem('phoramec_screen_reader_enabled');
    return cached !== 'false'; // Defaults to true
  });

  // Online / Offline state tracking with Toast trigger
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showNetworkStatusToast, setShowNetworkStatusToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkStatusToast(true);
      speakText("Internet connection restored. Live WhatsApp search and checkout functions are online.");
      const timer = setTimeout(() => setShowNetworkStatusToast(false), 5000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkStatusToast(true);
      // When offline, immediately cancel active speech to prevent backlog
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speakText("Internet connection lost. Entering offline mode. WhatsApp checkout and search features may be limited.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('phoramec_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('phoramec_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync Products list to local storage
  useEffect(() => {
    localStorage.setItem('phoramec_products', JSON.stringify(products));
  }, [products]);

  // Sync Custom Requests
  useEffect(() => {
    localStorage.setItem('phoramec_custom_requests', JSON.stringify(customRequests));
  }, [customRequests]);

  // Sync Customer Orders
  useEffect(() => {
    localStorage.setItem('phoramec_orders', JSON.stringify(customerOrders));
  }, [customerOrders]);

  // Theme Toggler
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // Since state is asynchronous, we compute what the next text-to-speech should be
    const nextTheme = !isDarkMode ? 'dark' : 'light';
    speakText(`Switched to ${nextTheme} visual theme.`);
  };

  // Screen Reader Toggler
  const toggleScreenReader = () => {
    const nextState = !isScreenReaderEnabled;
    setIsScreenReaderEnabled(nextState);
    localStorage.setItem('phoramec_screen_reader_enabled', nextState ? 'true' : 'false');
    if (nextState) {
      setTimeout(() => {
        speakText("Voice Screen Reader enabled.");
      }, 50);
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Data operations
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStockStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stockStatus: p.stockStatus === 'In Stock' ? 'Out of Stock' : 'In Stock',
            }
          : p
      )
    );
  };

  const handleAddCustomRequest = (newRequest: CustomImportRequest) => {
    setCustomRequests((prev) => [newRequest, ...prev]);
  };

  const handleAddCustomerOrder = (newOrder: CustomerOrder) => {
    setCustomerOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    setCustomerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  // Autocomplete predictive search card selection handler
  const handleSelectSearchedProduct = (product: Product) => {
    setSelectedCategory(product.category);
    setActiveView('catalog');
    
    // Auto Scroll and focus onto specific card after short timeout
    setTimeout(() => {
      const cardEl = document.getElementById(`product-card-${product.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardEl.classList.add('voice-speaking');
        // Speech detail read back
        speakText(
          `Found ${product.brand} ${product.model} in ${product.category}. Price is GHS ${product.price.toLocaleString()}.`
        );
        setTimeout(() => cardEl.classList.remove('voice-speaking'), 3000);
      }
    }, 300);
  };

  // Direct Call API
  const handleCallOffice = () => {
    window.location.href = `tel:${OFFICE_CONTACT.replace(/\s+/g, '')}`;
    speakText(`Calling Phoramec Imports Avenue head office now.`);
  };

  // Admin secret clicks tracker (triple-tap specific footer section)
  const [footerTapCount, setFooterTapCount] = useState(0);
  const handleFooterTap = () => {
    const newCount = footerTapCount + 1;
    if (newCount >= 3) {
      setFooterTapCount(0);
      setActiveView('admin');
      speakText("Manager authentication gateway active. Enter business password.");
    } else {
      setFooterTapCount(newCount);
      // Reset tap count after 2.5 seconds of inactivity
      setTimeout(() => setFooterTapCount(0), 2500);
    }
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-[#0A0A0A] dark:text-white transition-colors duration-300 pb-24">
      {/* 1. Header with integrated autocomplete and system toggle */}
      <Header
        allProducts={products}
        onProductSelect={handleSelectSearchedProduct}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onNavigateHome={() => {
          setActiveView('home');
          setSelectedCategory(null);
          speakText("Returning to main store catalog index.");
        }}
        isOnline={isOnline}
        isScreenReaderEnabled={isScreenReaderEnabled}
        toggleScreenReader={toggleScreenReader}
        onNavigateMyOrders={() => {
          setActiveView('my-orders');
          speakText("Viewing your logged orders and order statuses.");
        }}
      />

      {/* Persistent Network Status / Internet Dropped Warning Banner */}
      {!isOnline && (
        <div className="sticky top-[73px] z-30 bg-red-600 text-white text-xs font-black py-2.5 px-4 flex items-center justify-center gap-2 shadow-md animate-pulse">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>⚠️ Offline Mode: Your internet connection drops. Search & WhatsApp delivery might be limited.</span>
        </div>
      )}

      {/* 2. Main Content Views (SPA Switcher Grid) */}
      <main className="flex-1">
        {activeView === 'home' && (
          <CategoryGrid
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setActiveView('catalog');
            }}
            onOpenCustomRequest={() => {
              setActiveView('custom-request');
              speakText("Loading WhatsApp style custom import request form. Describe what you want us to ship for you.");
            }}
            onCallDirect={handleCallOffice}
          />
        )}

        {activeView === 'catalog' && selectedCategory && (
          <ProductList
            category={selectedCategory}
            products={products}
            onBack={() => {
              setActiveView('home');
              setSelectedCategory(null);
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'custom-request' && (
          <CustomRequestForm
            onBack={() => setActiveView('home')}
            onSubmitRequest={handleAddCustomRequest}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleStockStatus={handleToggleStockStatus}
            customRequests={customRequests}
            customerOrders={customerOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClose={() => {
              setActiveView('home');
              speakText("Exiting manager portal. Returning to customer store catalog.");
            }}
          />
        )}

        {activeView === 'my-orders' && (
          <MyOrders
            onBack={() => {
              setActiveView('home');
              speakText("Returning to store catalog.");
            }}
          />
        )}
      </main>

      {/* 3. Ergonomic Floating Thumb Navigation Action Bar (HCI Priority) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121212]/95 p-3 shadow-2xl border-t border-neutral-200 dark:border-white/10 backdrop-blur-md text-neutral-900 dark:text-white transition-all">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          
          {/* Action 1: Tap to Call */}
          <button
            onClick={handleCallOffice}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500/10 text-xs font-extrabold text-amber-700 dark:text-yellow-500 border border-yellow-300 dark:border-yellow-500/20 hover:bg-yellow-500/20 transition-transform active:scale-95"
            title="Call Phoramec Direct Phone"
            id="bar-call-btn"
            onMouseEnter={() => speakText("Tap here to call our office directly.")}
          >
            <Phone className="h-4 w-4 text-amber-700 dark:text-yellow-500" />
            <span>Call Us</span>
          </button>

          {/* Action 2: WhatsApp Chat */}
          <a
            href={`https://wa.me/233551525354?text=Hello%20Phoramec%20Imports%20Avenue,%20I'm%20inquiring%20about%20import%20deals.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-green-500/10 text-xs font-extrabold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/20 hover:bg-green-500/20 transition-transform active:scale-95 shadow-md"
            title="Inquire on WhatsApp"
            id="bar-whatsapp-btn"
            onMouseEnter={() => speakText("Tap here to start live chat with us on WhatsApp.")}
          >
            <MessageSquare className="h-4 w-4 text-green-700 dark:text-green-400" />
            <span>WhatsApp</span>
          </a>

          {/* Action 3: Persistent Cart Button with dynamic counter */}
          <button
            onClick={() => {
              setIsCartOpen(true);
              speakText(`Opening shopping cart. You have ${cartTotalItems} items ready.`);
            }}
            className="relative flex h-12 w-16 items-center justify-center rounded-xl bg-yellow-500 text-black font-black transition-all hover:bg-yellow-600 active:scale-95"
            title="Open WhatsApp Cart"
            aria-label="View Shopping Cart"
            id="bar-cart-btn"
            onMouseEnter={() => speakText(`Cart button. Contains ${cartTotalItems} items.`)}
          >
            <ShoppingBag className="h-5 w-5" />
            
            {/* Dynamic Counter Badge */}
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black ring-2 ring-yellow-500 animate-bounce">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Slide-over checkout drawer overlay */}
      {isCartOpen && (
        <CartCheckout
          cartItems={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onSubmitOrder={handleAddCustomerOrder}
        />
      )}

      {/* 5. Accessible Footer with Secret Manager Portal Trigger */}
      <footer className="mt-12 border-t border-neutral-200 dark:border-white/10 py-6 bg-neutral-100 dark:bg-[#121212] text-center">
        <div className="mx-auto max-w-7xl px-4 text-xs font-semibold text-neutral-400 space-y-1">
          <p className="tracking-widest uppercase font-bold text-gray-500">PHORAMEC IMPORTS AVENUE GHANA</p>
          <p className="text-[11px] text-gray-600">Accra Central Retail Center, Cantonments Road, Accra, Ghana.</p>
          
          {/* Triple-tap target */}
          <button
            onClick={handleFooterTap}
            className="mt-3 block mx-auto text-[10px] text-neutral-500 dark:text-white/30 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors py-1.5 px-4 border border-dashed border-neutral-300 dark:border-white/10 rounded-md bg-neutral-50 dark:bg-white/5"
            title="Administration Switch"
            id="admin-secret-portal-trigger"
          >
            Manager Panel Secure Portal Link
          </button>
        </div>
      </footer>

      {/* 6. Dynamic Temporary Internet Status Connection Drop Alert Toast */}
      {showNetworkStatusToast && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-2xl transition-all duration-300 border ${
          isOnline 
            ? 'bg-green-600 text-white border-green-500' 
            : 'bg-red-600 text-white border-red-500'
        }`}>
          <div className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span className="text-xs font-black">
            {isOnline 
              ? 'Internet connection restored! Functions are fully online.' 
              : 'Internet connection lost. Search and checkout functionality is limited.'}
          </span>
        </div>
      )}
    </div>
  );
}
