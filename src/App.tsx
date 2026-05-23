import React, { useState } from 'react';
import { ShoppingBag, Wrench, Landmark, Cpu, Layers, Shield } from 'lucide-react';
import CatalogTab from './components/ProductCatalog';
import BuilderTab from './components/PCBuilder';
import RepairTab from './components/FAQ'; 
import MapTab from './components/MapComponent';
import AdminTab from './components/DeliveryTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'repairs' | 'location' | 'admin'>('catalog');

  // Statistics summaries
  const stats = [
    { label: "Active Cebu Clients", value: "500+" },
    { label: "Hardware SLA Success Rate", value: "98%" },
    { label: "Avg. Turnaround Diagnostic", value: "24h" }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#f0ede8] font-sans antialiased flex flex-col justify-between selection:bg-[#E24B4A]/30 selection:text-white" id="mjs-app-root">
      
      {/* Dynamic Background elements with high-contrast subtle glowing gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#E24B4A]/10 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-[#E24B4A]/5 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Top Header bar */}
        <header className="border-b border-white/5 bg-[#111111]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Store brand */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#E24B4A] flex items-center justify-center shadow-lg shadow-[#E24B4A]/25">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-sm font-black tracking-[0.2em] uppercase text-white block">MJS<span className="text-[#E24B4A]">TECH</span></span>
                <span className="text-[10px] text-[#9a9590] uppercase tracking-wider block font-mono">Computer Shop · Talisay Cebu</span>
              </div>
            </div>

            {/* Navigation options */}
            <nav className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5" id="major-navigation-tabs">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg tracking-wider transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-[#E24B4A] text-white'
                    : 'text-[#9a9590] hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hardware Catalog</span>
                <span className="md:hidden">Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg tracking-wider transition-all cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-[#E24B4A] text-white'
                    : 'text-[#9a9590] hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Custom Build RIG</span>
                <span className="md:hidden">Builder</span>
              </button>

              <button
                onClick={() => setActiveTab('repairs')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg tracking-wider transition-all cursor-pointer ${
                  activeTab === 'repairs'
                    ? 'bg-[#E24B4A] text-white'
                    : 'text-[#9a9590] hover:text-white hover:bg-white/5'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Repair Services</span>
                <span className="md:hidden">Repairs</span>
              </button>

              <button
                onClick={() => setActiveTab('location')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg tracking-wider transition-all cursor-pointer ${
                  activeTab === 'location'
                    ? 'bg-[#E24B4A] text-white'
                    : 'text-[#9a9590] hover:text-white hover:bg-white/5'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Talisay Landmark Map</span>
                <span className="md:hidden">Directions</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg tracking-wider transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#E24B4A] text-white'
                    : 'text-[#9a9590] hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin Desk</span>
                <span className="md:hidden">Admin</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Area / App Header panel */}
        <section className="border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent py-10 px-4 sm:px-6 relative overflow-hidden" id="about-us-hero-panel">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 text-[10.5px] uppercase font-semibold font-mono tracking-widest text-[#E24B4A] bg-[#E24B4A]/10 px-3.5 py-1 rounded-full border border-[#E24B4A]/25">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Established Store HQ · Cebu, PH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
                High-Performance Computer Shop in <span className="text-[#E24B4A]">Talisay Cebu</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9a9590] leading-relaxed max-w-xl font-sans">
                Authentic, high-performance parts, certified system assembly, custom hardware configs, and elite hardware servicing directly handled out of Barangay Poblacion.
              </p>
            </div>

            {/* Statistics indicators */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto min-w-[320px]" id="counter-stats-grid">
              {stats.map((st) => (
                <div key={st.label} className="bg-[#1e1e1e] border border-white/5 hover:border-white/10 rounded-xl p-4 text-center transition-all">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#E24B4A] tracking-tight">{st.value}</div>
                  <div className="text-[10px] text-[#9a9590] font-sans font-medium uppercase mt-1 leading-snug">{st.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Dynamic Display Panels based on activeTab */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 z-10 relative">
          
          {/* Active Tab rendering */}
          {activeTab === 'catalog' && <CatalogTab />}
          {activeTab === 'builder' && <BuilderTab />}
          {activeTab === 'repairs' && <RepairTab />}
          {activeTab === 'location' && <MapTab />}
          {activeTab === 'admin' && <AdminTab />}

        </main>
      </div>

      {/* Footer bar */}
      <footer className="border-t border-white/5 bg-[#0d0d0d] px-4 py-8 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-widest text-white uppercase">MJS<span>TECH</span></span>
            <span className="text-[10px] text-[#9a9590] border-l border-white/10 pl-2">Computer Solutions Center</span>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[11px] text-[#9a9590] leading-relaxed">
              Designed &amp; Managed by James A. Meguiso · Talisay City, Cebu, Central Visayas, Philippines
            </p>
            <p className="text-[10px] text-white/30 font-mono mt-0.5">
              Powered by Node.js, Express, and Structured SQLite SQL Engine
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
