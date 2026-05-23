import React, { useState, useEffect } from 'react';
import { 
  Lock, Shield, Terminal, Database, Edit2, Trash2, PlusCircle, 
  Check, X, ClipboardList, ShoppingBag, RefreshCw, KeyRound, 
  AlertCircle, Search, HelpCircle, Truck, Package, DollarSign
} from 'lucide-react';
import { Product, Repair } from '../types';
import SqlConsoleTab from './SqlConsoleTab';

export default function AdminTab() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('mjstech_admin_auth') === 'true');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin sub-navigation tabs
  const [adminSubTab, setAdminSubTab] = useState<'inventory' | 'orders' | 'sql'>('inventory');

  // Inventories States
  const [products, setProducts] = useState<Product[]>([]);
  const [prodSearch, setProdSearch] = useState('');
  const [loadingProds, setLoadingProds] = useState(false);
  const [prodError, setProdError] = useState<string | null>(null);
  const [editingProdId, setEditingProdId] = useState<number | null>(null);

  // New Product Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Laptop');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState('');
  const [newProdStock, setNewProdStock] = useState('5');
  const [newProdImage, setNewProdImage] = useState('');

  // Editing row state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');

  // Orders / Deliveries state
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [repairsSearch, setRepairsSearch] = useState('');
  const [loadingRepairs, setLoadingRepairs] = useState(false);
  const [repairsError, setRepairsError] = useState<string | null>(null);
  const [editingRepairId, setEditingRepairId] = useState<number | null>(null);
  
  // Repair editing values
  const [editRepClient, setEditRepClient] = useState('');
  const [editRepContact, setEditRepContact] = useState('');
  const [editRepDevice, setEditRepDevice] = useState('');
  const [editRepStatus, setEditRepStatus] = useState<Repair['status']>('Pending');
  const [editRepIssue, setEditRepIssue] = useState('');
  const [editRepCost, setEditRepCost] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load backend data if admin is logged in
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchRepairs();
    }
  }, [isAdmin]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
  };

  const fetchProducts = async () => {
    setLoadingProds(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Could not pull products.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setProdError(err.message || 'Error occurred while loading product index.');
    } finally {
      setLoadingProds(false);
    }
  };

  const fetchRepairs = async () => {
    setLoadingRepairs(true);
    try {
      const res = await fetch('/api/repairs');
      if (!res.ok) throw new Error('Could not pull repairs list.');
      const data = await res.json();
      setRepairs(data);
    } catch (err: any) {
      setRepairsError(err.message || 'Error occurred while loading delivery or service records.');
    } finally {
      setLoadingRepairs(false);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === '6045' || cleanPass === 'mjstech' || cleanPass === 'admin' || cleanPass === 'meguiso') {
      sessionStorage.setItem('mjstech_admin_auth', 'true');
      setIsAdmin(true);
      setLoginError(null);
      showToast('Access Approved. Welcome back Administrator!', 'success');
    } else {
      setLoginError('Invalid Passcode. Enter correct authentication password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mjstech_admin_auth');
    setIsAdmin(false);
    setPasscode('');
    showToast('Logged out of Admin Session successfully.');
  };

  // Create Product Submit Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSpecs || !newProdPrice) {
      showToast('Please specify valid product parameters.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: parseInt(newProdPrice) || 0,
          specs: newProdSpecs,
          stock: parseInt(newProdStock) || 0,
          image: newProdImage || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60'
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to seed product.');
      }

      showToast(`Product "${newProdName}" added successfully to the catalog!`);
      // Reset form
      setNewProdName('');
      setNewProdCategory('Laptop');
      setNewProdPrice('');
      setNewProdSpecs('');
      setNewProdStock('5');
      setNewProdImage('');
      setShowAddForm(false);
      // Reload products
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error executing write database state.', 'error');
    }
  };

  // Start Editing product row
  const startEditProduct = (prod: Product) => {
    setEditingProdId(prod.id);
    setEditName(prod.name);
    setEditCategory(prod.category);
    setEditPrice(String(prod.price));
    setEditSpecs(prod.specs);
    setEditStock(String(prod.stock));
    setEditImage(prod.image || '');
  };

  // Save Product Update Handler
  const saveProductUpdate = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          category: editCategory,
          price: parseInt(editPrice) || 0,
          specs: editSpecs,
          stock: parseInt(editStock) || 0,
          image: editImage
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed updating product payload.');
      }

      showToast('Inventory database record updated successfully!');
      setEditingProdId(null);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error occurred while saving modifications.', 'error');
    }
  };

  // Delete Product Handler
  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you completely sure you want to write-off and remove "${name}" from Talisay inventories index?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion request rejected by SQLite server.');
      showToast(`Product "${name}" deleted from records successfully!`);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error while requesting hardware purging.', 'error');
    }
  };

  // Start Editing service booking row
  const startEditRepair = (rep: Repair) => {
    setEditingRepairId(rep.id);
    setEditRepClient(rep.client_name);
    setEditRepContact(rep.contact);
    setEditRepDevice(rep.device);
    setEditRepStatus(rep.status);
    setEditRepIssue(rep.issue);
    setEditRepCost(String(rep.cost));
  };

  // Save Repair Status / Cost / Details Handler
  const saveRepairUpdate = async (id: number) => {
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: editRepClient,
          contact: editRepContact,
          device: editRepDevice,
          status: editRepStatus,
          issue: editRepIssue,
          cost: parseInt(editRepCost) || 0
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed updating service booking.');
      }

      showToast(`Repair/Delivery tracked booking modified successfully!`);
      setEditingRepairId(null);
      fetchRepairs();
    } catch (err: any) {
      showToast(err.message || 'Error occurred while matching repairs update.', 'error');
    }
  };

  const deleteRepairTick = async (id: number, trackingCode: string) => {
    if (!confirm(`Are you sure you want to absolute-purge repair booking ${trackingCode}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion rejected.');
      showToast(`Repair booking file ${trackingCode} cleared.`);
      fetchRepairs();
    } catch (err: any) {
      showToast(err.message || 'Failed deleting repair record.', 'error');
    }
  };

  // Row filtering mechanics
  const filteredProducts = products.filter(prod => {
    return prod.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
           prod.specs.toLowerCase().includes(prodSearch.toLowerCase()) || 
           prod.category.toLowerCase().includes(prodSearch.toLowerCase());
  });

  const filteredRepairs = repairs.filter(rep => {
    return rep.client_name.toLowerCase().includes(repairsSearch.toLowerCase()) ||
           rep.tracking_number.toLowerCase().includes(repairsSearch.toLowerCase()) ||
           rep.device.toLowerCase().includes(repairsSearch.toLowerCase()) ||
           rep.status.toLowerCase().includes(repairsSearch.toLowerCase());
  });

  // Login screening panel
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="admin-workspace-login">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-b from-[#E24B4A]/5 to-transparent rounded-full filter blur-[50px] pointer-events-none z-0" />
        
        <div className="relative z-10 text-center space-y-6">
          <div className="w-16 h-16 bg-[#E24B4A]/10 border border-[#E24B4A]/20 rounded-2xl flex items-center justify-center mx-auto text-[#E24B4A]" id="admin-desktop-shield">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white tracking-widest uppercase font-sans">MJSTECH ADMIN PANEL</h2>
            <p className="text-xs text-white/50 leading-relaxed font-sans max-w-sm mx-auto">
              Protected computer systems management environment. High-security access only to edit product inventories, catalog details, live repair bookings, and execute console tasks.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 font-mono" id="admin-login-fail">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-3 pt-2" id="admin-secured-form">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                className="w-full bg-black/40 text-sm pl-10 pr-4 py-3 rounded-xl border border-white/10 text-white placeholder-white/25 font-mono text-center focus:border-[#E24B4A] focus:outline-none focus:ring-1 focus:ring-[#E24B4A]"
                placeholder="Secure Access Password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                id="admin-workspace-pwd-input"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E24B4A] hover:bg-[#A32D2D] active:scale-95 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest transition-all cursor-pointer"
              id="admin-unlock-cmd"
            >
              Verify Credentials
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 font-mono space-y-1 leading-normal">
            <div>Authentication domain: {window.location.hostname}</div>
            <div>Secure hint: Enter administrative passcode (e.g., &apos;admin&apos; or Talent-team shop registry name &apos;mjstech&apos; or Talisay City ZIP &apos;6045&apos;)</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-terminal-workspace">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-bounce ${
          notification.type === 'error' 
            ? 'bg-red-500/90 border-red-400/20 text-white' 
            : 'bg-[#1e1e1e]/95 border-emerald-500/20 text-emerald-400'
        }`} id="admin-workspace-toast">
          <Check className="w-4 h-4" />
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Admin Module Panel Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1e1e1e] border border-white/5 rounded-2xl p-5" id="admin-workspace-header">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono tracking-widest text-[#E24B4A] uppercase font-bold">SESSION: ACTIVE ADMINISTRATOR</span>
          </div>
          <h2 className="text-xl font-bold font-sans text-white uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E24B4A]" />
            MJS<span className="text-[#E24B4A]">tech</span> Operations Control Desk
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-between md:justify-end">
          <span className="text-xs text-white/50 font-mono hidden lg:inline">Talisay Cebu Center Node</span>
          <button 
            onClick={handleLogout}
            className="bg-[#2a2a2a] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-white/80 border border-white/10 text-xs font-semibold font-mono tracking-wider px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
            id="admin-logout-btn"
          >
            End Secure Session
          </button>
        </div>
      </div>

      {/* Admin Operations Sub-Navigation bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5" id="admin-sub-sections">
        <button
          onClick={() => setAdminSubTab('inventory')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg tracking-wider transition-all cursor-pointer uppercase ${
            adminSubTab === 'inventory'
              ? 'bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Inventories</span>
        </button>

        <button
          onClick={() => setAdminSubTab('orders')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg tracking-wider transition-all cursor-pointer uppercase ${
            adminSubTab === 'orders'
              ? 'bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Deliveries &amp; Repairs</span>
        </button>

        <button
          onClick={() => setAdminSubTab('sql')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg tracking-wider transition-all cursor-pointer uppercase ${
            adminSubTab === 'sql'
              ? 'bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Raw SQL Console</span>
        </button>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* 1. PRODUCT INVENTORIES SUB-TAB */}
      {/* -------------------------------------------------------------------------- */}
      {adminSubTab === 'inventory' && (
        <div className="space-y-5" id="inventory-management-segment">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1e1e1e] border border-white/5 p-4 rounded-xl">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                className="w-full bg-black/40 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white placeholder-white/30 focus:border-[#E24B4A] focus:outline-none transition-colors"
                placeholder="Filter stock by name, tags, or specifications..."
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                id="admin-prod-search"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <button 
                onClick={fetchProducts}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg transition-all active:scale-95 cursor-pointer"
                title="Sync database tables"
              >
                <RefreshCw className={`w-4 h-4 ${loadingProds ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 bg-[#E24B4A] hover:bg-[#A32D2D] text-white text-xs font-bold px-4 py-2.5 rounded-lg tracking-wider transition-all cursor-pointer active:scale-95 uppercase shadow-md shadow-[#E24B4A]/10"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{showAddForm ? 'Close Intake Form' : 'Register New Hardware'}</span>
              </button>
            </div>
          </div>

          {/* New Product Registration Form */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden" id="add-product-form">
              <div className="absolute top-0 left-0 w-1 bg-[#E24B4A] h-full" />
              <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <Package className="w-4 h-4 text-[#E24B4A]" />
                Store Inventory Registration Intake
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Hardware Item Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none"
                    placeholder="e.g. Asus Vivobook Pro 15"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Category Tag</label>
                  <select
                    className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="Laptop" className="bg-[#1e1e1e]">Laptop</option>
                    <option value="Desktop" className="bg-[#1e1e1e]">Desktop (Prebuilt Setup)</option>
                    <option value="Component" className="bg-[#1e1e1e]">PC Component</option>
                    <option value="Accessory" className="bg-[#1e1e1e]">Peripheral Accessories</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Retail Price (₱)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none font-mono"
                      placeholder="e.g. 29500"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Initial Stock</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none font-mono"
                      placeholder="e.g. 5"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Detailed Configuration Specs</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none"
                    placeholder="e.g. Intel Core i5 / 16GB RAM / 512GB NVMe / 15.6 in FHD"
                    value={newProdSpecs}
                    onChange={(e) => setNewProdSpecs(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase font-mono font-medium block">Visual Image Address (Optional URL)</label>
                  <input
                    type="url"
                    className="w-full bg-black/40 text-xs px-3 py-2 rounded-lg border border-white/5 text-white focus:border-[#E24B4A] focus:outline-none font-mono"
                    placeholder="Leave empty for generic pc banner"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-6 py-2.5 rounded-lg tracking-wider transition-all uppercase cursor-pointer"
                >
                  Write to SQL Catalog
                </button>
              </div>
            </form>
          )}

          {/* Catalog Index Grid / Table list */}
          {loadingProds ? (
            <div className="text-center py-16 text-white/40 font-mono text-xs">
              <span className="w-7 h-7 border-4 border-t-[#E24B4A] border-white/10 rounded-full animate-spin inline-block mb-2"></span>
              <div>Querying live catalogs table...</div>
            </div>
          ) : prodError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-4 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{prodError}</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#1e1e1e] border border-white/5 rounded-xl text-white/30 text-xs">
              No matching computer hardware products registered in database.
            </div>
          ) : (
            <div className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden" id="inventory-table-container">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-white/80">
                  <thead className="bg-black/40 border-b border-white/5 text-[10px] uppercase font-mono text-white/50 tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-center">ID</th>
                      <th className="px-4 py-3 min-w-[180px]">Product Info (Name &amp; Class)</th>
                      <th className="px-4 py-3 min-w-[240px]">Equipment Specifications</th>
                      <th className="px-4 py-3 min-w-[100px] text-right">Price (₱)</th>
                      <th className="px-4 py-3 min-w-[80px] text-center">Stock Level</th>
                      <th className="px-4 py-3 text-center min-w-[120px]">Actions / DB Edits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((prod) => {
                      const isEditing = editingProdId === prod.id;
                      return (
                        <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors" id={`admin-inv-row-${prod.id}`}>
                          {/* ID */}
                          <td className="px-4 py-3 text-center font-mono text-white/40 font-bold">{prod.id}</td>
                          
                          {/* Name & Category */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="space-y-1.5 min-w-[150px]">
                                <input
                                  type="text"
                                  className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-white/15 text-white font-semibold"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                                <select
                                  className="w-full bg-black/60 text-[11px] px-2 py-1 rounded border border-white/10 text-white/80 font-mono"
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                >
                                  <option value="Laptop">Laptop</option>
                                  <option value="Desktop">Desktop</option>
                                  <option value="Component">Component</option>
                                  <option value="Accessory">Accessory</option>
                                </select>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-white leading-snug">{prod.name}</div>
                                <span className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full">
                                  {prod.category}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Technical Specs & Image editing */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="space-y-1.5">
                                <textarea
                                  rows={2}
                                  className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-white/15 text-white/90 font-sans"
                                  placeholder="Specs"
                                  value={editSpecs}
                                  onChange={(e) => setEditSpecs(e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="w-full bg-black/60 text-[10px] px-2 py-1 rounded border border-white/10 text-white/50 font-mono"
                                  placeholder="Image URL"
                                  value={editImage}
                                  onChange={(e) => setEditImage(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-white/60 leading-normal font-sans line-clamp-2 md:line-clamp-none">{prod.specs}</p>
                                {prod.image && (
                                  <div className="text-[10px] font-mono font-medium text-white/30 truncate" title={prod.image}>
                                    Asset URL: {prod.image.slice(0, 48)}...
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">
                            {isEditing ? (
                              <input
                                type="number"
                                required
                                className="w-24 ml-auto bg-black/60 text-xs text-right px-2 py-1 rounded border border-white/15 text-white"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                              />
                            ) : (
                              <span>₱{prod.price.toLocaleString('en-US')}</span>
                            )}
                          </td>

                          {/* Stock Level */}
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                required
                                className="w-16 mx-auto bg-black/60 text-xs text-center px-1 py-1 rounded border border-white/15 text-white font-mono"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                              />
                            ) : (
                              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                                prod.stock === 0 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/15' 
                                  : prod.stock < 3 
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' 
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                              }`}>
                                {prod.stock} PCS
                              </span>
                            )}
                          </td>

                          {/* Row Actions */}
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => saveProductUpdate(prod.id)}
                                  className="p-1.5 bg-emerald-600/90 hover:bg-emerald-700 text-white rounded transition-all active:scale-90"
                                  title="Commit update actions"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingProdId(null)}
                                  className="p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded transition-all active:scale-90"
                                  title="Discard modifications"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => startEditProduct(prod)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-white/70 rounded transition-all active:scale-90 cursor-pointer"
                                  title="Edit properties"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(prod.id, prod.name)}
                                  className="p-1.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/15 text-white/50 rounded transition-all active:scale-90 cursor-pointer"
                                  title="Remove catalog item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}


      {/* -------------------------------------------------------------------------- */}
      {/* 2. DELIVERIES & SERVICE BOOKINGS */}
      {/* -------------------------------------------------------------------------- */}
      {adminSubTab === 'orders' && (
        <div className="space-y-5" id="repair-orders-management-segment">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1e1e1e] border border-white/5 p-4 rounded-xl">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                className="w-full bg-black/40 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white placeholder-white/30 focus:border-[#E24B4A] focus:outline-none transition-colors"
                placeholder="Search deliveries, clients, issue keywords or tracking codes..."
                value={repairsSearch}
                onChange={(e) => setRepairsSearch(e.target.value)}
                id="admin-repairs-search"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button 
                onClick={fetchRepairs}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white tracking-wide transition-all active:scale-95 cursor-pointer uppercase"
                title="Sync database tables"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRepairs ? 'animate-spin' : ''}`} />
                <span>Reload Orders Grid</span>
              </button>
            </div>
          </div>

          {/* Orders / Delivery Logs Sheet */}
          {loadingRepairs ? (
            <div className="text-center py-16 text-white/40 font-mono text-xs">
              <span className="w-7 h-7 border-4 border-t-[#E24B4A] border-white/10 rounded-full animate-spin inline-block mb-2"></span>
              <div>Retreiving workshop order files...</div>
            </div>
          ) : repairsError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-4 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{repairsError}</span>
            </div>
          ) : filteredRepairs.length === 0 ? (
            <div className="text-center py-16 bg-[#1e1e1e] border border-white/5 rounded-xl text-white/30 text-xs">
              No matching client repairs or equipment bookings logged in database.
            </div>
          ) : (
            <div className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden" id="repairs-table-container">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-white/80">
                  <thead className="bg-black/40 border-b border-white/5 text-[10px] uppercase font-mono text-white/50 tracking-wider">
                    <tr>
                      <th className="px-4 py-3 min-w-[125px]">Tracking ID</th>
                      <th className="px-4 py-3 min-w-[150px]">Customer / Client</th>
                      <th className="px-4 py-3 min-w-[150px]">Hardware Element</th>
                      <th className="px-4 py-3 min-w-[200px]">Diagnosed Defect / Job description</th>
                      <th className="px-4 py-3 text-center min-w-[140px]">Live Service Stage</th>
                      <th className="px-4 py-3 text-right min-w-[110px]">Quote Cost (₱)</th>
                      <th className="px-4 py-3 text-center min-w-[110px]">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRepairs.map((rep) => {
                      const isEditing = editingRepairId === rep.id;
                      return (
                        <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors" id={`admin-rep-row-${rep.id}`}>
                          
                          {/* Tracking Number */}
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-bold text-white tracking-wide block">{rep.tracking_number}</span>
                            <span className="text-[10px] text-white/30 font-mono italic block mt-0.5">{rep.created_at}</span>
                          </td>

                          {/* Client Info */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="space-y-1.5 min-w-[120px]">
                                <input
                                  type="text"
                                  className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-white/10 text-white"
                                  placeholder="Client Name"
                                  value={editRepClient}
                                  onChange={(e) => setEditRepClient(e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="w-full bg-black/60 text-[11px] px-2 py-1 rounded border border-white/10 text-white/75 font-mono"
                                  placeholder="Contact Number"
                                  value={editRepContact}
                                  onChange={(e) => setEditRepContact(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-white">{rep.client_name}</div>
                                <div className="text-[10.5px] text-white/55 font-mono">{rep.contact}</div>
                              </div>
                            )}
                          </td>

                          {/* Device description */}
                          <td className="px-4 py-3 text-white/90">
                            {isEditing ? (
                              <input
                                type="text"
                                className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-white/15 text-white"
                                value={editRepDevice}
                                onChange={(e) => setEditRepDevice(e.target.value)}
                              />
                            ) : (
                              <span className="font-semibold">{rep.device}</span>
                            )}
                          </td>

                          {/* Job description / Issue */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <textarea
                                rows={2}
                                className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-white/15 text-white/90 font-sans"
                                value={editRepIssue}
                                onChange={(e) => setEditRepIssue(e.target.value)}
                              />
                            ) : (
                              <p className="text-white/50 leading-relaxed max-w-xs">{rep.issue}</p>
                            )}
                          </td>

                          {/* Service Status dropdown/label */}
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <select
                                className="w-full bg-black/60 text-xs px-2 py-1 rounded border border-[#E24B4A]/40 text-[#E24B4A] focus:outline-none font-semibold font-mono"
                                value={editRepStatus}
                                onChange={(e) => setEditRepStatus(e.target.value as Repair['status'])}
                              >
                                <option value="Pending">Pending Diagnostic</option>
                                <option value="Diagnosis">Conducting Diagnosis</option>
                                <option value="In Progress">Job In Progress</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                                <option value="Completed">System Completed</option>
                              </select>
                            ) : (
                              <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded text-center border ${
                                rep.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                  : rep.status === 'Ready for Pickup'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                                    : rep.status === 'In Progress'
                                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/25'
                                      : rep.status === 'Diagnosis'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                                        : 'bg-white/5 text-white/60 border-white/10'
                              }`}>
                                {rep.status}
                              </span>
                            )}
                          </td>

                          {/* Quote diagnostic Cost */}
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">
                            {isEditing ? (
                              <div className="relative max-w-[120px] ml-auto">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40">₱</span>
                                <input
                                  type="number"
                                  className="w-full bg-black/60 text-xs text-right pl-5 pr-2 py-1 rounded border border-white/15 text-white"
                                  value={editRepCost}
                                  onChange={(e) => setEditRepCost(e.target.value)}
                                />
                              </div>
                            ) : (
                              <span>
                                {rep.cost === 0 ? (
                                  <span className="text-white/40 italic font-sans font-medium text-[11px]">Free Diagnosis</span>
                                ) : (
                                  `₱${rep.cost.toLocaleString('en-US')}`
                                )}
                              </span>
                            )}
                          </td>

                          {/* Action cell */}
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => saveRepairUpdate(rep.id)}
                                  className="p-1.5 bg-emerald-600/90 hover:bg-emerald-700 text-white rounded transition-all active:scale-90"
                                  title="Confirm modifications"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingRepairId(null)}
                                  className="p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded transition-all active:scale-90"
                                  title="Cancel changes"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => startEditRepair(rep)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-white/70 rounded transition-all active:scale-90 cursor-pointer"
                                  title="Edit status/cost"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteRepairTick(rep.id, rep.tracking_number)}
                                  className="p-1.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/15 text-white/50 rounded transition-all active:scale-90 cursor-pointer"
                                  title="Purge repair ticket"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}


      {/* -------------------------------------------------------------------------- */}
      {/* 3. EMBEDDED INTERACTIVE RAW SQL CONSOLE CLIENT */}
      {/* -------------------------------------------------------------------------- */}
      {adminSubTab === 'sql' && (
        <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden p-5" id="embedded-sql-section">
          <div className="mb-4 bg-yellow-500/5 border border-yellow-500/20 text-yellow-200/90 rounded-xl p-3.5 text-xs text-left leading-relaxed font-sans max-w-4xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wide mr-1 font-mono">Operator Advisory Notice:</span>
              This raw SQLite direct interface is executing statements straight against the active runtime buffer of your node cluster in Cebu. Remember to handle updates or inserts cautiously as changes instantly propagate to client hardware catalogs, inventory counts, and service status tracking.
            </div>
          </div>

          {/* Standalone SqlConsoleTab included inside */}
          <SqlConsoleTab />
        </div>
      )}

    </div>
  );
}
