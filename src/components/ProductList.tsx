import { useState } from 'react';
import { ShoppingBag, HelpCircle, ArrowLeft, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product, CategoryType } from '../types';
import { speakText } from '../utils/speech';

interface ProductListProps {
  category: CategoryType;
  products: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductList({
  category,
  products,
  onBack,
  onAddToCart,
}: ProductListProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc'>('newest');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under500' | '500-2000' | 'over2000'>('all');
  
  // Grouping logic for Jumia/CompuGhana sub-sectioning rules
  const getGroupedSections = () => {
    let categoryProducts = products.filter((p) => p.category === category);

    // Apply Price budget filters
    if (priceFilter === 'under500') {
      categoryProducts = categoryProducts.filter((p) => p.price < 500);
    } else if (priceFilter === '500-2000') {
      categoryProducts = categoryProducts.filter((p) => p.price >= 500 && p.price <= 2000);
    } else if (priceFilter === 'over2000') {
      categoryProducts = categoryProducts.filter((p) => p.price > 2000);
    }

    // Apply Sorting
    if (sortBy === 'priceAsc') {
      categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
    } else {
      // Default / Newest Arrivals: Keep original list order (since they are prepended at creation)
    }

    if (category === 'Phones') {
      // Sectioned by brand
      const brands = ['Apple', 'Samsung', 'Tecno'];
      return brands.map((b) => ({
        title: `${b} Smartphones`,
        description: `Premium to entry-level Android and iOS models from ${b}.`,
        items: categoryProducts.filter((p) => p.brand.toLowerCase() === b.toLowerCase()),
      })).filter((sec) => sec.items.length > 0);
    }

    if (category === 'Laptops') {
      // Grouped by Specs (Premium/i7 vs Student/Budget)
      const premium = categoryProducts.filter((p) => {
        const specsStr = p.specifications.join(' ').toLowerCase();
        return specsStr.includes('i7') || specsStr.includes('m3') || specsStr.includes('unified');
      });
      const budget = categoryProducts.filter((p) => {
        const specsStr = p.specifications.join(' ').toLowerCase();
        return !specsStr.includes('i7') && !specsStr.includes('m3') && !specsStr.includes('unified');
      });

      return [
        {
          title: 'Premium & Business Laptops (Core i7 / Apple Silicon)',
          description: 'High-performance machines for professionals, software developers, and creatives.',
          items: premium,
        },
        {
          title: 'Student & Budget Laptops (Core i5 / AMD / Chromebook)',
          description: 'Affordable, reliable machines for education, daily administration, and office tasks.',
          items: budget,
        },
      ].filter((sec) => sec.items.length > 0);
    }

    if (category === 'Home Appliances') {
      // Sectioned by Product Type and Brand
      const entertainment = categoryProducts.filter((p) => p.model.toLowerCase().includes('tv'));
      const cooling = categoryProducts.filter((p) => p.model.toLowerCase().includes('fridge') || p.brand.toLowerCase() === 'nasco');
      const domestic = categoryProducts.filter((p) => 
        !p.model.toLowerCase().includes('tv') && 
        !p.model.toLowerCase().includes('fridge') && 
        p.brand.toLowerCase() !== 'nasco'
      );

      return [
        {
          title: 'Entertainment & Smart TVs',
          description: 'Ultra HD screens, Tizen OS, and home theater integration.',
          items: entertainment,
        },
        {
          title: 'Refrigeration & Heavy Cooling',
          description: 'No frost refrigerators, energy-saving double doors, and chest freezers.',
          items: cooling,
        },
        {
          title: 'Cooking & Small Domestic Gadgets',
          description: 'Premium iron presses, kitchen airfryers, blenders, and vital household helpers.',
          items: domestic,
        },
      ].filter((sec) => sec.items.length > 0);
    }

    if (category === 'Shoes/Clothes') {
      // Sectioned by Varieties (Sneakers vs Apparel vs Loafers)
      const sneakers = categoryProducts.filter((p) => p.model.toLowerCase().includes('sneakers') || p.model.toLowerCase().includes('shoes') && p.brand.toLowerCase() !== 'clarks');
      const clothing = categoryProducts.filter((p) => p.model.toLowerCase().includes('shirt') || p.model.toLowerCase().includes('linen') || p.model.toLowerCase().includes('clothes'));
      const casuals = categoryProducts.filter((p) => p.model.toLowerCase().includes('loafers') || p.brand.toLowerCase() === 'clarks');

      return [
        {
          title: 'Footwear & Athletic Sneakers',
          description: 'Air-cushioned trainers, runners, and premium active walking shoes.',
          items: sneakers,
        },
        {
          title: 'Apparel & Casual Wear',
          description: 'Premium linen shirts, polos, and warm-weather styles.',
          items: clothing,
        },
        {
          title: 'Smart Casuals & Loafers',
          description: 'Comfort ortholite slip-ons and formal wear accessories.',
          items: casuals,
        },
      ].filter((sec) => sec.items.length > 0);
    }

    return [{
      title: 'General Stock',
      description: 'Handpicked premium models imported from overseas.',
      items: categoryProducts,
    }];
  };

  const sections = getGroupedSections();

  const handleSpeakProduct = (product: Product) => {
    const stockMsg = product.stockStatus === 'In Stock' 
      ? 'In Stock and ready for instant delivery.' 
      : 'Currently Out of Stock. Let us know if you want us to import one specifically for you.';
    speakText(`${product.brand} ${product.model}. Price: ${product.price.toLocaleString()} Ghana Cedis. Specifications: ${product.specifications.join(', ')}. ${stockMsg}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Category Header Back Button */}
      <div className="mb-6 flex items-center justify-between animate-fade-in">
        <button
          onClick={onBack}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-bold text-neutral-700 dark:text-gray-300 transition-all hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95"
          onMouseEnter={() => speakText("Tap here to go back to the home category catalog list.")}
          id="cat-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </button>

        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white sm:text-2xl flex items-center gap-2">
          <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
          {category} Catalog
        </h2>
      </div>

      {/* Sorting & Price Filter Bar */}
      <div className="mb-8 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#121212] p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-xs animate-fade-in">
        {/* Price Range Filter */}
        <div className="space-y-1.5 flex-1">
          <span className="text-[10px] font-black text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
            Filter by Budget (Ghana Cedis)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Budgets' },
              { id: 'under500', label: 'Under GHS 500' },
              { id: '500-2000', label: 'GHS 500 - 2,000' },
              { id: 'over2000', label: 'Over GHS 2,000' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setPriceFilter(opt.id as any);
                  speakText(`Filtering catalog to ${opt.label}.`);
                }}
                className={`h-9 px-3 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                  priceFilter === opt.id
                    ? 'bg-yellow-500 border-yellow-500 text-black font-extrabold'
                    : 'bg-neutral-50 dark:bg-[#1a1a1a] border-neutral-200 dark:border-white/5 text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
                id={`filter-btn-${opt.id}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="space-y-1.5 sm:w-60">
          <label htmlFor="sort-select" className="text-[10px] font-black text-neutral-500 dark:text-gray-400 uppercase tracking-wider block">
            Sort Catalog
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value as any;
              setSortBy(val);
              speakText(`Sorting catalog by ${val === 'priceAsc' ? 'Price: Low to High' : 'Newest Arrivals'}.`);
            }}
            className="block h-9 w-full rounded-lg border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#1a1a1a] px-3 text-xs font-bold text-neutral-700 dark:text-gray-300 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] cursor-pointer"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
          </select>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 dark:border-white/10 p-8 text-center bg-white dark:bg-[#1a1a1a]">
          <HelpCircle className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-4 text-base font-bold text-neutral-800 dark:text-gray-300">
            {priceFilter !== 'all' ? 'No items match your selected budget range' : `No active stock available for ${category}`}
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            {priceFilter !== 'all' ? 'Try selecting "All Budgets" or adjusting your filter.' : 'Tap back and try another category, or make a custom import request!'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {/* Variety Sub-Section Divider Title */}
              <div className="border-b border-neutral-200 dark:border-white/10 pb-2">
                <h3 className="font-display text-base font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-lg">
                  {section.title}
                </h3>
                <p className="text-xs font-medium text-neutral-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>

              {/* Grid of Section Items */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((product) => {
                  const isOutOfStock = product.stockStatus === 'Out of Stock';

                  return (
                    <div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-4 transition-all ${
                        isOutOfStock 
                          ? 'border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-[#1a1a1a]/50 opacity-60 grayscale' 
                          : 'border-neutral-200 dark:border-white/5 bg-white dark:bg-[#1a1a1a] hover:border-yellow-500/50 hover:shadow-lg'
                      }`}
                      onMouseEnter={() => handleSpeakProduct(product)}
                      onFocus={() => handleSpeakProduct(product)}
                      tabIndex={0}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-950">
                        <img
                          src={product.imageUrl}
                          alt={`${product.brand} ${product.model}`}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Audio Assist Icon Trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakProduct(product);
                          }}
                          className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#1e1e1e] text-yellow-600 dark:text-yellow-500 shadow-md backdrop-blur-xs transition-transform active:scale-90 hover:bg-neutral-100 dark:hover:bg-[#222] border border-neutral-200 dark:border-none"
                          title="Listen to product specs"
                          aria-label="Speak product specifications"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>

                        {/* Inventory Badging */}
                        <div className="absolute bottom-2 left-2 flex gap-1.5">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-400 uppercase">
                              <AlertCircle className="h-3 w-3" /> SOLD OUT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-green-500/20 px-2 py-0.5 text-[10px] font-black text-green-400 uppercase">
                              <CheckCircle2 className="h-3 w-3" /> IN STOCK
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info Area */}
                      <div className="mt-4 flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                              {product.brand}
                            </span>
                            <h4 className="font-display text-base font-bold text-neutral-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                              {product.model}
                            </h4>
                          </div>
                          <span className="text-xl font-black text-yellow-600 dark:text-yellow-500">
                            ₵{product.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Specs bullet-list */}
                        <div className="mt-3 flex-1">
                          <ul className="space-y-1">
                            {product.specifications.map((spec, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-white/10" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tap Action Target (Extreme Target >= 48px) */}
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/5">
                          <button
                            disabled={isOutOfStock}
                            onClick={() => {
                              onAddToCart(product);
                              speakText(`Added ${product.brand} ${product.model} to shopping cart.`);
                            }}
                            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                              isOutOfStock
                                ? 'bg-neutral-200 dark:bg-[#1e1e1e] text-neutral-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-500 text-black hover:bg-yellow-600 font-black'
                            }`}
                            id={`add-to-cart-${product.id}`}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            {isOutOfStock ? 'Sold Out / Unavailable' : 'Add to WhatsApp Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
