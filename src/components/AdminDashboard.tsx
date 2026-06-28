import React, { useState } from 'react';
import { Database, PlusCircle, ArrowLeft, Trash2, ClipboardList, CheckCircle, Smartphone, HardDrive, ShoppingCart, Lock } from 'lucide-react';
import { Product, CategoryType, CustomImportRequest, CustomerOrder } from '../types';
import { SEC_PASSWORD } from '../data';
import { speakText } from '../utils/speech';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleStockStatus: (id: string) => void;
  customRequests: CustomImportRequest[];
  customerOrders: CustomerOrder[];
  onUpdateOrderStatus?: (orderId: string, nextStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => void;
  onClose: () => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onDeleteProduct,
  onToggleStockStatus,
  customRequests,
  customerOrders,
  onUpdateOrderStatus,
  onClose,
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Passcode Security & Reset States
  const [storedPasscode, setStoredPasscode] = useState<string>(() => {
    return localStorage.getItem('phoramec_admin_passcode') || '1234';
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentPassVal, setCurrentPassVal] = useState('');
  const [newPassVal, setNewPassVal] = useState('');
  const [confirmPassVal, setConfirmPassVal] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const hasUppercase = /[A-Z]/.test(newPassVal);
  const hasLowercase = /[a-z]/.test(newPassVal);
  const hasNumber = /[0-9]/.test(newPassVal);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassVal);
  const isLengthValid = newPassVal.length >= 5;

  let strength: 'weak' | 'moderate' | 'strong' | '' = '';
  if (newPassVal.length > 0) {
    if (newPassVal.length <= 4) {
      strength = 'weak';
    } else if (newPassVal.length >= 5 && newPassVal.length <= 7) {
      strength = 'moderate';
    } else {
      strength = 'strong';
    }
  }

  const allCriteriaMet = hasUppercase && hasLowercase && hasNumber && hasSpecial && isLengthValid;

  const handlePasscodeReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (currentPassVal !== storedPasscode) {
      setResetError('Incorrect current passcode.');
      speakText('Incorrect current passcode.');
      return;
    }

    if (!allCriteriaMet) {
      setResetError('New passcode does not satisfy the requirements.');
      speakText('New passcode does not satisfy the requirements.');
      return;
    }

    if (newPassVal !== confirmPassVal) {
      setResetError('Passwords do not match.');
      speakText('Passwords do not match.');
      return;
    }

    localStorage.setItem('phoramec_admin_passcode', newPassVal);
    setStoredPasscode(newPassVal);
    setResetSuccess('Passcode reset successfully!');
    speakText('Admin passcode successfully updated.');

    // Clear
    setCurrentPassVal('');
    setNewPassVal('');
    setConfirmPassVal('');
    setTimeout(() => {
      setShowResetModal(false);
      setResetSuccess('');
    }, 2000);
  };

  // Form states for Product Injector
  const [category, setCategory] = useState<CategoryType>('Phones');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [specs, setSpecs] = useState('');
  const [price, setPrice] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock'>('In Stock');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPasscode) {
      setIsAuthenticated(true);
      setErrorMsg('');
      speakText("Admin access granted. Loading database and injector form.");
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
      speakText("Incorrect passcode. Try again.");
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brand.trim() || !model.trim() || !price.trim()) {
      alert("Please fill in Brand, Model and Price.");
      return;
    }

    // Assign fallback realistic Unsplash image depending on category if blank
    let fallbackImg = imageUrl.trim();
    if (!fallbackImg) {
      if (category === 'Phones') fallbackImg = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80';
      else if (category === 'Laptops') fallbackImg = 'https://images.unsplash.com/photo-1496181130204-7552cc14AC1a?w=500&auto=format&fit=crop&q=80';
      else if (category === 'Home Appliances') fallbackImg = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80';
      else fallbackImg = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80';
    }

    const specificationsList = specs
      ? specs.split(',').map((s) => s.trim())
      : ['Standard specifications'];

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      category,
      brand: brand.trim(),
      model: model.trim(),
      specifications: specificationsList,
      price: parseFloat(price) || 0,
      stockStatus,
      imageUrl: fallbackImg,
      description: `${brand} ${model}, price: ${price} Ghana Cedis, specs: ${specificationsList.join(', ')}.`
    };

    onAddProduct(newProduct);
    
    // Clear form
    setBrand('');
    setModel('');
    setSpecs('');
    setPrice('');
    setImageUrl('');
    setSuccessMsg('Product successfully injected into active store stock catalog!');
    speakText("New item successfully injected into active stock catalog.");

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <form onSubmit={handleLogin} className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-extrabold text-neutral-900 dark:text-white">
              Phoramec Portal Auth
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-gray-400">
              Please enter business manager pin to gain portal privileges.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                required
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-center text-sm font-black tracking-widest text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:tracking-normal focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter Passcode (default is 1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="admin-passcode"
              />
            </div>

            {errorMsg && (
              <p className="text-center text-xs font-bold text-red-600 dark:text-red-400">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                Back to Shop
              </button>
              <button
                type="submit"
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-yellow-500 text-xs font-black text-black hover:bg-yellow-600"
              >
                Verify Passcode
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
        <div>
          <span className="inline-flex items-center rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-extrabold text-yellow-600 dark:text-yellow-500">
            <Database className="mr-1 h-3 w-3" /> Phoramec Imports Avenue Backend
          </span>
          <h2 className="font-display text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-1">
            <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
            Manager Control Dashboard
          </h2>
          <p className="text-xs text-neutral-500 dark:text-gray-400">
            Provision new items, audit current stock, and oversee client requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/5 transition-all"
            id="admin-reset-pwd-btn"
          >
            <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            Reset Passcode
          </button>

          <button
            onClick={onClose}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/5"
            id="admin-exit-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Admin Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 1. Advanced Product Injector Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddProductSubmit} className="space-y-4 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5 shadow-lg">
            <div className="border-b border-neutral-200 dark:border-white/10 pb-2">
              <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <PlusCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                Product Injector
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-gray-400">
                Instantly populate your live catalog page.
              </p>
            </div>

            {successMsg && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-xs font-bold text-green-600 dark:text-green-400">
                {successMsg}
              </div>
            )}

            <div className="space-y-3.5">
              {/* Category Dropdown */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Category Type
                </label>
                <select
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  id="inject-category"
                >
                  <option value="Phones">Phones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Shoes/Clothes">Shoes/Clothes</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple, Dell, Nike"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  id="inject-brand"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Model / Variant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 15 Pro, S24 Ultra"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  id="inject-model"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Specifications (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 256GB Storage, 8GB RAM, Red Color"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  id="inject-specs"
                />
              </div>

              {/* Price in GHS */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Price (GHS / Ghana Cedis) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  id="inject-price"
                />
              </div>

              {/* Stock status toggle */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Active Stock Level Status
                </label>
                <select
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value as 'In Stock' | 'Out of Stock')}
                  id="inject-stock"
                >
                  <option value="In Stock">In Stock (Active Purchase Enabled)</option>
                  <option value="Out of Stock">Out of Stock (SOLD OUT Badge Enabled)</option>
                </select>
              </div>

              {/* Custom Image URL */}
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Custom Image URL (Web link)
                </label>
                <input
                  type="url"
                  placeholder="Paste reference image link (optional)"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  id="inject-image-url"
                />
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 text-sm font-black text-black hover:bg-yellow-600 active:scale-95 shadow-md"
                id="inject-submit-btn"
              >
                Incorporate New Item Listing
              </button>
            </div>
          </form>
        </div>

        {/* 2. Captured Data Lists (Requests & Orders Tables) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Custom Import Requests Table */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5 shadow-lg">
            <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5 border-b border-neutral-200 dark:border-white/10 pb-2">
              <ClipboardList className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              Captured Client Import Requests ({customRequests.length})
            </h3>
            
            {customRequests.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-400 dark:text-gray-500">
                No custom requests captured in local history yet.
              </p>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="mt-3 w-full border-collapse text-left text-xs font-semibold text-neutral-700 dark:text-gray-300">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-gray-500 uppercase tracking-wider">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Client info</th>
                      <th className="py-2 px-3">Wanted Item Description</th>
                      <th className="py-2 px-3 text-right">Max Budget</th>
                      <th className="py-2 px-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                    {customRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                        <td className="py-3 px-3 text-neutral-400 dark:text-gray-500 whitespace-nowrap">{req.timestamp.split(',')[0]}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-neutral-900 dark:text-white">{req.name}</div>
                          <div className="text-[10px] text-neutral-500 dark:text-gray-400">{req.phone}</div>
                          {req.email && <div className="text-[10px] text-yellow-600 dark:text-yellow-500">{req.email}</div>}
                        </td>
                        <td className="py-3 px-3">
                          <div className="line-clamp-2 max-w-xs font-medium text-neutral-700 dark:text-gray-300">{req.description}</div>
                          {req.imageLink && (
                            <a href={req.imageLink} target="_blank" rel="noreferrer" className="text-[10px] text-yellow-600 dark:text-yellow-500 hover:underline">
                              Reference Photo Link
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-yellow-600 dark:text-yellow-500">₵{req.budget.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          {req.location?.mapsUrl ? (
                            <a href={req.location.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-md bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-600 dark:text-yellow-500">
                              📍 View GPS
                            </a>
                          ) : (
                            <span className="text-[10px] text-neutral-400 dark:text-gray-500">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Captured Shopping Orders Table */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5 shadow-lg">
            <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5 border-b border-neutral-200 dark:border-white/10 pb-2">
              <ShoppingCart className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              Captured Client Shopping Orders ({customerOrders.length})
            </h3>
            
            {customerOrders.length === 0 ? (
              <p className="py-6 text-center text-xs text-neutral-400 dark:text-gray-500">
                No local shopping cart checkouts captured yet.
              </p>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="mt-3 w-full border-collapse text-left text-xs font-semibold text-neutral-700 dark:text-gray-300">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-gray-500 uppercase tracking-wider">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Client Info</th>
                      <th className="py-2 px-3">Ordered Items</th>
                      <th className="py-2 px-3 text-right">Invoice Bill</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3 text-center">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                    {customerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                        <td className="py-3 px-3 text-neutral-400 dark:text-gray-500 whitespace-nowrap">{ord.timestamp.split(',')[0]}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-neutral-900 dark:text-white">{ord.name}</div>
                          <div className="text-[10px] text-neutral-500 dark:text-gray-400">{ord.phone}</div>
                          {ord.email && <div className="text-[10px] text-yellow-600 dark:text-yellow-500">{ord.email}</div>}
                        </td>
                        <td className="py-3 px-3">
                          <ul className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <li key={idx} className="text-[11px] font-medium text-neutral-700 dark:text-gray-300">
                                {it.quantity}x {it.productTitle}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-yellow-600 dark:text-yellow-500">₵{ord.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          {ord.location?.mapsUrl ? (
                            <a href={ord.location.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-md bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-600 dark:text-yellow-500">
                              📍 View GPS
                            </a>
                          ) : (
                            <span className="text-[10px] text-neutral-400 dark:text-gray-500">None</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <select
                            value={ord.status || 'Pending'}
                            onChange={(e) => {
                              if (onUpdateOrderStatus) {
                                onUpdateOrderStatus(ord.id, e.target.value as any);
                              }
                            }}
                            className="rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1a1a1a] px-2 py-1.5 text-xs font-bold text-neutral-800 dark:text-gray-200 focus:border-yellow-500"
                          >
                            <option value="Pending">Pending Approval</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Manage Active Catalog List (with Delete button) */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5 shadow-lg">
            <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5 border-b border-neutral-200 dark:border-white/10 pb-2">
              <Smartphone className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              Manage Active Catalog ({products.length} Items)
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#1e1e1e] p-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={p.imageUrl} alt={p.model} className="h-9 w-9 rounded-md object-cover" referrerPolicy="no-referrer" />
                    <div className="overflow-hidden">
                      <h5 className="truncate text-xs font-extrabold text-neutral-900 dark:text-white">
                        {p.brand} {p.model}
                      </h5>
                      <span className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold">{p.category} • ₵{p.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onToggleStockStatus(p.id);
                        speakText(`Toggled ${p.brand} ${p.model} status to ${p.stockStatus === 'In Stock' ? 'Out of Stock' : 'In Stock'}.`);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black rounded-lg border transition-all ${
                        p.stockStatus === 'In Stock'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20'
                      }`}
                      title="Click to toggle availability status"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${p.stockStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                      {p.stockStatus === 'In Stock' ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.brand} ${p.model} from catalog?`)) {
                          onDeleteProduct(p.id);
                          speakText("Deleted product.");
                        }
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
              <h3 className="font-display text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                Reset Admin Passcode
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetError('');
                  setResetSuccess('');
                  setCurrentPassVal('');
                  setNewPassVal('');
                  setConfirmPassVal('');
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasscodeReset} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Current Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter active passcode"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={currentPassVal}
                  onChange={(e) => setCurrentPassVal(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  New Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter robust new passcode"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={newPassVal}
                  onChange={(e) => setNewPassVal(e.target.value)}
                />
              </div>

              {/* Real-time complexity check */}
              {newPassVal.length > 0 && (
                <div className="space-y-2 rounded-xl bg-neutral-50 dark:bg-[#121212] p-4 text-xs border border-neutral-200 dark:border-white/5">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-neutral-500 dark:text-gray-400">Password Strength:</span>
                    {strength === 'weak' && (
                      <span className="rounded-md bg-red-500/10 px-2 py-0.5 font-black text-red-600 dark:text-red-400 uppercase">
                        Weak & Unacceptable ❌
                      </span>
                    )}
                    {strength === 'moderate' && (
                      <span className="rounded-md bg-yellow-500/10 px-2 py-0.5 font-black text-yellow-600 dark:text-yellow-500 uppercase">
                        Moderate (Acceptable) ✅
                      </span>
                    )}
                    {strength === 'strong' && (
                      <span className="rounded-md bg-green-500/10 px-2 py-0.5 font-black text-green-600 dark:text-green-400 uppercase">
                        Strong ✅
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${isLengthValid ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
                      <span className={isLengthValid ? "text-green-600 dark:text-green-400 font-bold" : "text-neutral-400 dark:text-gray-500"}>
                        At least 5 characters (Currently: {newPassVal.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${hasUppercase ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
                      <span className={hasUppercase ? "text-green-600 dark:text-green-400 font-bold" : "text-neutral-400 dark:text-gray-500"}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${hasLowercase ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
                      <span className={hasLowercase ? "text-green-600 dark:text-green-400 font-bold" : "text-neutral-400 dark:text-gray-500"}>
                        At least one lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${hasNumber ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
                      <span className={hasNumber ? "text-green-600 dark:text-green-400 font-bold" : "text-neutral-400 dark:text-gray-500"}>
                        At least one number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${hasSpecial ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`} />
                      <span className={hasSpecial ? "text-green-600 dark:text-green-400 font-bold" : "text-neutral-400 dark:text-gray-500"}>
                        At least one special symbol (e.g., !@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Confirm New Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new passcode"
                  className="block h-11 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-3 text-sm font-semibold text-neutral-900 dark:text-white focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212]"
                  value={confirmPassVal}
                  onChange={(e) => setConfirmPassVal(e.target.value)}
                />
              </div>

              {resetError && (
                <p className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 text-center">
                  ⚠️ {resetError}
                </p>
              )}

              {resetSuccess && (
                <p className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 p-2.5 rounded-lg border border-green-500/20 text-center">
                  🎉 {resetSuccess}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetError('');
                    setResetSuccess('');
                    setCurrentPassVal('');
                    setNewPassVal('');
                    setConfirmPassVal('');
                  }}
                  className="flex-1 h-11 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!allCriteriaMet}
                  className={`flex-1 h-11 rounded-xl text-xs font-black transition-colors ${
                    allCriteriaMet
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600 cursor-pointer'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Save New Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
