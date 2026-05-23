import React, { useState, useEffect } from 'react';
import { Search, Monitor, Laptop, Filter, ShoppingBag, Eye, X, AlertCircle } from 'lucide-react';
import { Product } from '../types';

const localProducts: Product[] = [];

export default function CatalogTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom item specification modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
      // Bypassing the network fetch to load static assets directly
      if (localProducts && localProducts.length > 0) {
        setProducts(localProducts);
      } else {
        throw new Error('Local catalog data array is empty.');
      }
    } catch (err: any) {
      setError(err.message || 'Database error occurred.');
    } finally {
      setLoading(false);
    }
    })();
    return () => { mounted = false; };
  }, []);

  const categories = ['All', 'Laptop', 'Desktop'];

  const filteredProducts = products.filter(prod => {
    const matchSearch = prod.name.toLowerCase().includes(search.toLowerCase()) || 
                        prod.specs.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6" id="catalog-tab-container">
      {/* Catalog Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e1e1e] border border-white/5 p-4 rounded-xl" id="catalog-controls-card">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            className="w-full bg-black/40 text-sm pl-10 pr-4 py-2 rounded-lg border border-white/10 text-white placeholder-white/30 focus:border-[#E24B4A] focus:outline-none transition-colors"
            placeholder="Search laptops, setups, specs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="product-search-input"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-1.5 rounded-md font-medium tracking-wide transition-all uppercase cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? 'All Hardware' : cat === 'Laptop' ? 'Laptops' : 'Prebuilt PCs'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-24 text-white/50 space-y-3" id="catalog-loader">
          <span className="w-8 h-8 border-4 border-t-[#E24B4A] border-white/10 rounded-full animate-spin inline-block"></span>
          <p className="text-xs font-mono tracking-wider">Syncing SQL Catalog index...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm" id="catalog-error">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-[#1e1e1e] border border-white/5 rounded-xl text-white/40" id="catalog-empty">
          <p className="text-sm">No items match your specifications filters.</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="text-xs text-[#E24B4A] font-medium underline mt-2 hover:opacity-85"
          >
            Clear searching params
          </button>
        </div>
      )}

      {/* Grid List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="catalog-grid">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden flex flex-col group hover:border-white/10 transition-all duration-300 transform"
              id={`product-card-${prod.id}`}
            >
              {/* Product Thumbnail image */}
              <div className="relative aspect-video bg-black/40 overflow-hidden">
                <img 
                  src={prod.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60'} 
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  {prod.category === 'Laptop' ? <Laptop className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  <span>{prod.category}</span>
                </div>
              </div>

              {/* Specs body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#E24B4A] transition-colors leading-snug">{prod.name}</h3>
                  <p className="text-xs text-white/50 line-clamp-2 mt-2 leading-relaxed min-h-[3rem]">
                    {prod.specs}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/5 pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Talisay Outlet Price</span>
                      <span className="text-lg font-bold text-white select-all">
                        ₱{prod.price.toLocaleString('en-US')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setActiveModalProduct(prod)}
                        className="p-2 rounded-lg bg-[#2e2e2e] hover:bg-[#3e3e3e] border border-white/5 text-white/90 transition-all active:scale-95 cursor-pointer"
                        title="Inspect detailed specifications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => alert(`Purchase of "${prod.name}" requested at physical landmark HQ. James A. Meguiso (Sales Desk) will contact you!`)}
                        className="flex items-center gap-1.5 bg-[#E24B4A] hover:bg-[#A32D2D] text-white text-xs font-semibold px-4 py-2 rounded-lg tracking-wide transition-all active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Stock counter */}
                  <div className="flex items-center gap-1.5 mt-3 text-[11px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${prod.stock <= 3 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className={prod.stock <= 3 ? 'text-amber-400 font-medium' : 'text-white/40'}>
                      {prod.stock <= 3 ? `Hurry! Only ${prod.stock} units left in stock` : `${prod.stock} units physically in stock`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specifications Inspect Overlay Dialog Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" id="specs-modal">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 border border-white/5 text-white/50 hover:text-white hover:bg-black/80 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6">
              <span className="text-[10px] bg-[#E24B4A]/10 text-[#E24B4A] border border-[#E24B4A]/20 font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 font-mono">
                {activeModalProduct.category} Specifications Index
              </span>
              <h2 className="text-xl font-bold text-white mb-4 pr-10">{activeModalProduct.name}</h2>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-5">
                <img 
                  src={activeModalProduct.image} 
                  alt={activeModalProduct.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-xs">
                <div className="flex border-b border-white/5 pb-2">
                  <span className="text-white/40 w-28 shrink-0">STORE PRICE:</span>
                  <span className="text-emerald-400 font-bold">₱{activeModalProduct.price.toLocaleString('en-US')}</span>
                </div>
                <div className="flex border-b border-white/5 pb-2">
                  <span className="text-white/40 w-28 shrink-0">AVAILABILITY:</span>
                  <span className="text-white/80">{activeModalProduct.stock} Units in Cebu Warehouse</span>
                </div>
                <div className="flex">
                  <span className="text-white/40 w-28 shrink-0">HARDWARE SPECS:</span>
                  <span className="text-white/90 leading-relaxed whitespace-pre-line flex-1 text-[11px]">
                    {activeModalProduct.specs}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button 
                  onClick={() => setActiveModalProduct(null)}
                  className="flex-1 bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white text-sm font-semibold py-2.5 rounded-xl border border-white/5 transition-all cursor-pointer"
                >
                  Close Inspect
                </button>
                <button 
                  onClick={() => {
                    alert(`Order query logged for "${activeModalProduct.name}"! MJSTECH Sales Desk (James A. Meguiso) will call you on coordination.`);
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 bg-[#E24B4A] hover:bg-[#A32D2D] text-white text-sm font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Secure Hardware</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
