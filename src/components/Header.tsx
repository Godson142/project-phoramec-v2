import { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Sparkles, Terminal, Volume2, VolumeX, Wifi, WifiOff, Package } from 'lucide-react';
import { Product } from '../types';
import { speakText } from '../utils/speech';

interface HeaderProps {
  allProducts: Product[];
  onProductSelect: (product: Product) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigateHome: () => void;
  isOnline: boolean;
  isScreenReaderEnabled: boolean;
  toggleScreenReader: () => void;
  onNavigateMyOrders: () => void;
}

export default function Header({
  allProducts,
  onProductSelect,
  isDarkMode,
  toggleTheme,
  onNavigateHome,
  isOnline,
  isScreenReaderEnabled,
  toggleScreenReader,
  onNavigateMyOrders,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant real-time character filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter((p) => {
      return (
        p.brand.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.specifications.some((spec) => spec.toLowerCase().includes(query))
      );
    });

    setSearchResults(filtered.slice(0, 5)); // Limit to top 5 results for sleek mobile display
    setIsDropdownOpen(true);
  }, [searchQuery, allProducts]);

  const handleSelectResult = (product: Product) => {
    onProductSelect(product);
    setSearchQuery('');
    setIsDropdownOpen(false);
    speakText(`Selected ${product.brand} ${product.model}. Redirecting to product page.`);
  };

  const speakSearchInput = () => {
    speakText("Search bar. Type any phone, laptop, or appliance brand here to search our catalog instantly.");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-[#121212]/95 border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={onNavigateHome}
            className="flex cursor-pointer items-center gap-2"
            id="brand-logo-trigger"
            onMouseEnter={() => speakText("Phoramec Imports Avenue. Tap here to go home.")}
            onFocus={() => speakText("Phoramec Imports Avenue. Tap here to go home.")}
            tabIndex={0}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-black shadow-md shadow-yellow-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                PHORAMEC IMPORTS
              </h1>
              <p className="text-[10px] font-semibold tracking-wider text-yellow-600 dark:text-yellow-500 uppercase">
                Avenue Ghana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Service Worker Status Indicator Pill */}
            <div 
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black border transition-colors ${
                isOnline 
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse'
              }`}
              title={isOnline ? "Internet & Service Worker Online" : "Operating in Offline Mode"}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
              <span className="hidden xs:inline">{isOnline ? 'Active Link' : 'Offline Mode'}</span>
            </div>

            {/* Screen Reader Toggle Button */}
            <button
              onClick={toggleScreenReader}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-500 dark:text-gray-300 transition-all hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95"
              id="screen-reader-toggle-btn"
              title={isScreenReaderEnabled ? "Turn screen reader off" : "Turn screen reader on"}
              aria-label="Toggle voice assistance screen reader"
              onMouseEnter={() => speakText(isScreenReaderEnabled ? "Disable Screen Reader voice support." : "Enable screen reader read out aloud.")}
            >
              {isScreenReaderEnabled ? (
                <Volume2 className="h-5 w-5 text-green-600 dark:text-yellow-500" />
              ) : (
                <VolumeX className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              )}
            </button>

            {/* My Orders Button */}
            <button
              onClick={onNavigateMyOrders}
              className="flex h-12 gap-2 px-3.5 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 transition-all hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95 cursor-pointer"
              id="my-orders-btn"
              title="View My Orders"
              aria-label="View My Orders"
              onMouseEnter={() => speakText("Tap here to view your past purchases and track order status.")}
              onFocus={() => speakText("Tap here to view your past purchases and track order status.")}
            >
              <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <span className="hidden sm:inline text-xs font-black">My Orders</span>
            </button>

            {/* Theme Switcher Toggle (100% Functional) */}
            <button
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-500 dark:text-gray-400 transition-all hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95"
              id="theme-toggle-btn"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle Light or Dark Theme"
              onMouseEnter={() => speakText(`Currently in ${isDarkMode ? 'dark' : 'light'} mode. Tap to toggle background theme.`)}
              onFocus={() => speakText(`Currently in ${isDarkMode ? 'dark' : 'light'} mode. Tap to toggle background theme.`)}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600 dark:text-yellow-500" />
              )}
            </button>
          </div>
        </div>

        {/* Predictive Autocomplete Search Bar */}
        <div className="relative mt-3" ref={dropdownRef}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] pl-10 pr-4 text-sm font-medium text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:border-yellow-500 dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
            placeholder="Search phones, laptops, TVs, brands (Apple, HP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={speakSearchInput}
            aria-label="Search Phoramec Catalog"
            id="catalog-search-input"
          />

          {/* Dropdown Suggestions */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121212] p-2 shadow-xl">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-[10px] font-bold text-neutral-400 dark:text-gray-500 uppercase tracking-wider">
                    Matching Results ({searchResults.length})
                  </p>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectResult(product)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
                      onMouseEnter={() => speakText(`${product.brand} ${product.model}, GHS ${product.price}`)}
                      id={`search-item-${product.id}`}
                    >
                      <img
                        src={product.imageUrl}
                        alt={`${product.brand} ${product.model}`}
                        className="h-10 w-10 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                            {product.brand} {product.model}
                          </span>
                          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500 whitespace-nowrap">
                            ₵{product.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="truncate text-xs text-neutral-500 dark:text-gray-400">
                          {product.category} • {product.specifications.join(', ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-gray-400">
                  No matching items found for <span className="font-semibold text-neutral-900 dark:text-white">"{searchQuery}"</span>. 
                  <p className="mt-1 text-xs text-neutral-400 dark:text-gray-500">Try searching a brand, category, or model name.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
