import React, { useState, useEffect } from 'react';
import { Cpu, SquareCheck, Info, Sparkles, Battery, RefreshCw, Layers, AlertCircle, ShoppingCart } from 'lucide-react';
import { PCPart } from '../types';

export default function BuilderTab() {
  const [parts, setParts] = useState<PCPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected state for each component category
  const [selections, setSelections] = useState<Record<string, PCPart | null>>({
    CPU: null,
    GPU: null,
    Motherboard: null,
    RAM: null,
    Storage: null,
    PSU: null,
    Case: null,
    Cooler: null
  });

  // Current category the user is browsing and picking
  const [activeCategory, setActiveCategory] = useState<string>('CPU');

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await fetch('/api/pc-parts');
        if (!res.ok) throw new Error('Failed to load PC hardware parts list.');
        const data = await res.json();
        setParts(data);
      } catch (err: any) {
        setError(err.message || 'Database error occurred whilst loading PC components.');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  const categories = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case', 'Cooler'];

  const selectPart = (category: string, part: PCPart) => {
    setSelections(prev => ({
      ...prev,
      [category]: part
    }));
  };

  const removeSelection = (category: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const resetBuild = () => {
    setSelections({
      CPU: null,
      GPU: null,
      Motherboard: null,
      RAM: null,
      Storage: null,
      PSU: null,
      Case: null,
      Cooler: null
    });
    setActiveCategory('CPU');
  };

  // Calculations
  const totalPrice = (Object.values(selections) as (PCPart | null)[]).reduce((sum, item) => sum + (item ? item.price : 0), 0);
  
  const estimatedPowerUsage = (Object.values(selections) as (PCPart | null)[]).reduce((sum, item) => sum + (item ? item.watts : 0), 0) + 15; // +15W for motherboard overhead / minor accessories
  
  // Find selected PSU rating
  const psuWattage = selections.PSU 
    ? parseInt(selections.PSU.specs.match(/(\d+)W/)?.[1] || selections.PSU.part_name.match(/(\d+)W/)?.[1] || '0') 
    : 0;

  // Compatibility Rules evaluation
  const getCompatibilityStatus = () => {
    const warnings: string[] = [];
    const successes: string[] = [];

    // 1. Socket Compatibility
    const cpu = selections.CPU;
    const mobo = selections.Motherboard;
    if (cpu && mobo) {
      const cpuSocket = cpu.specs.includes('AM4') ? 'AM4' : cpu.specs.includes('AM5') ? 'AM5' : cpu.specs.includes('LGA1700') ? 'LGA1700' : 'Other';
      const moboSocket = mobo.specs.includes('AM4') ? 'AM4' : mobo.specs.includes('AM5') ? 'AM5' : mobo.specs.includes('LGA1700') ? 'LGA1700' : 'Other';

      if (cpuSocket !== 'Other' && moboSocket !== 'Other' && cpuSocket !== moboSocket) {
        warnings.push(`⚠️ Socket Mismatch: Selected CPU has ${cpuSocket} socket, but Motherboard is ${moboSocket}. They will not physically fit.`);
      } else {
        successes.push(`✓ Motherboard & CPU share compatible sockets (${cpuSocket}).`);
      }
    }

    // 2. RAM compatibility (DDR4 vs DDR5)
    const ram = selections.RAM;
    if (mobo && ram) {
      const moboDdr = mobo.specs.includes('DDR4') ? 'DDR4' : mobo.specs.includes('DDR5') ? 'DDR5' : 'Other';
      const ramDdr = ram.specs.includes('DDR4') ? 'DDR4' : ram.specs.includes('DDR5') ? 'DDR5' : ram.part_name.includes('DDR4') ? 'DDR4' : ram.part_name.includes('DDR5') ? 'DDR5' : 'Other';

      if (moboDdr !== 'Other' && ramDdr !== 'Other' && moboDdr !== ramDdr) {
        warnings.push(`⚠️ RAM Memory Standard Conflict: Motherboard is engineered for ${moboDdr}, but selected RAM is ${ramDdr}.`);
      } else {
        successes.push(`✓ RAM and Motherboard are standard compatible (${ramDdr}).`);
      }
    }

    // 3. Wattage calculations
    if (selections.PSU) {
      if (psuWattage > 0) {
        if (estimatedPowerUsage > psuWattage) {
          warnings.push(`⚠️ Power Deficit: Selected parts consume ~${estimatedPowerUsage}W, which exceeds your PSU's maximum safety index of ${psuWattage}W.`);
        } else if (estimatedPowerUsage * 1.25 > psuWattage) {
          warnings.push(`⚠️ Tight Power Ceiling: PSU (${psuWattage}W) handles components (~${estimatedPowerUsage}W), but leaves less than 20% overclocking/peak overhead safety buffer.`);
        } else {
          successes.push(`✓ Power supply handles estimated build consumption safely with ~${psuWattage - estimatedPowerUsage}W headroom.`);
        }
      }
    } else if (estimatedPowerUsage > 15) {
      warnings.push(`💡 Power Index: Choose a Power Supply (PSU) rated for at least ${Math.round((estimatedPowerUsage + 75) * 1.25)}W to power your build.`);
    }

    return { warnings, successes };
  };

  const { warnings, successes } = getCompatibilityStatus();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" id="builder-tab-container">
      {/* Left Pane - Pick Category and Parts Grid list */}
      <div className="xl:col-span-8 space-y-6">
        {/* Step tab selection wrapper */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-4 overflow-x-auto scrollbar-none" id="builder-category-navigation">
          <div className="flex items-center gap-1.5 min-w-[620px]">
            {categories.map((cat) => {
              const hasSelection = selections[cat] !== null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 text-center py-2 px-3 rounded-lg border text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#E24B4A] hover:bg-[#A32D2D] border-transparent text-white'
                      : hasSelection
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                      : 'bg-black/20 hover:bg-black/40 border-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono tracking-widest opacity-60">
                    {hasSelection ? 'Added' : 'Select'}
                  </div>
                  <div className="truncate mt-0.5">{cat}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading and Error check */}
        {loading && (
          <div className="text-center py-24 text-white/50" id="builder-parts-loader">
            <span className="w-8 h-8 border-4 border-t-[#E24B4A] border-white/10 rounded-full animate-spin inline-block"></span>
            <p className="text-xs font-mono tracking-wider mt-3">Fetching parts parameters from DB...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-200 p-4 rounded-xl text-center text-sm" id="builder-parts-error">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Display Components matching activeCategory key */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="component-choices-grid">
            {parts
              .filter(p => p.type === activeCategory)
              .map(part => {
                const isSelected = selections[activeCategory]?.id === part.id;
                return (
                  <div 
                    key={part.id}
                    onClick={() => selectPart(activeCategory, part)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-[#E24B4A]/10 border-[#E24B4A] shadow-lg shadow-[#E24B4A]/5' 
                        : 'bg-[#1e1e1e] hover:bg-[#252525] border-white/5'
                    }`}
                    id={`builder-part-${part.id}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#F09595] font-semibold tracking-widest uppercase">{part.brand}</span>
                          <h4 className="font-semibold text-white text-sm group-hover:text-[#E24B4A] mt-0.5">{part.part_name}</h4>
                        </div>
                        {isSelected && (
                          <span className="bg-[#E24B4A] text-white p-1 rounded-md">
                            <SquareCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-mono mt-2 leading-relaxed">{part.specs}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <div className="text-white/40">
                        {part.watts > 0 ? (
                          <span className="flex items-center gap-1">
                            <Battery className="w-3.5 h-3.5 text-amber-500" />
                            <span>{part.watts}W consumption</span>
                          </span>
                        ) : 'Overhead neutral'}
                      </div>
                      <div className="text-sm font-bold text-white select-all">
                        ₱{part.price.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Right Pane - Selected Parts, Compatibility and Quote summary */}
      <div className="xl:col-span-4 space-y-6">
        {/* Running list */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 flex flex-col" id="builder-cart-card">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E24B4A]" />
              <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Spec Rig Checklist</h3>
            </div>
            <button 
              onClick={resetBuild}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-2 py-1 rounded font-mono transition-colors"
            >
              Reset RIG
            </button>
          </div>

          {/* Render chosen products or placeholders */}
          <div className="space-y-3 flex-1">
            {categories.map((cat) => {
              const selected = selections[cat];
              return (
                <div 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selected 
                      ? 'bg-black/30 border-white/10 hover:border-[#E24B4A]/50' 
                      : 'bg-black/5 border-dashed border-white/5 hover:bg-black/15'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 font-bold text-xs ${
                      selected ? 'bg-[#E24B4A]/25 text-[#E24B4A]' : 'bg-white/5 text-white/30'
                    }`}>
                      {cat.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="text-left overflow-hidden">
                      <span className="text-[10px] font-mono text-white/30 block uppercase tracking-wider">{cat}</span>
                      <span className="text-xs text-white font-medium truncate py-0 block max-w-[200px]" title={selected?.part_name || "Unselected"}>
                        {selected ? selected.part_name : <span className="text-white/20 italic">Select Component</span>}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {selected ? (
                      <div className="text-xs font-mono font-bold text-[#F09595]">
                        ₱{selected.price.toLocaleString('en-US')}
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/20 font-mono">--</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Running Totals */}
          <div className="bg-black/30 mt-6 p-4 rounded-xl border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-white/50">
              <span>ENERGY CONSUMPTION:</span>
              <span className="text-amber-500 font-bold">{estimatedPowerUsage} Watts</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>ESTIMATED PARTS:</span>
              <span>{Object.values(selections).filter(Boolean).length} of {categories.length} Selected</span>
            </div>
            <div className="flex justify-between items-center text-white pt-2 border-t border-white/5">
              <span className="font-semibold text-white/80">TOTAL PRICE:</span>
              <span className="text-[#E24B4A] text-lg font-bold select-all">
                ₱{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (totalPrice === 0) {
                alert("Please add hardware before printing a proposal build.");
                return;
              }
              alert(`Specification build generated! Base quote: ₱${totalPrice.toLocaleString()}.\nPlease present this configuration index to the MJSTECH Talisay City front desk or call James A. Meguiso at 09944061005.`);
            }}
            className="w-full bg-[#E24B4A] hover:bg-[#A32D2D] active:scale-95 text-white font-sans font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 tracking-widest uppercase transition-all mt-4 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Request Quote Proposal</span>
          </button>
        </div>

        {/* Compatibility checks logs box */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="builder-compatibility-card">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Compatibility Analyzer</h3>
          </div>

          <div className="space-y-2.5 font-mono text-[11px] leading-relaxed">
            {warnings.map((warn, i) => (
              <div key={i} className="text-amber-400 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                {warn}
              </div>
            ))}
            {successes.map((succ, i) => (
              <div key={i} className="text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                {succ}
              </div>
            ))}
            {warnings.length === 0 && successes.length === 0 && (
              <div className="text-white/30 text-center py-4 italic">
                Pick hardware parts to evaluate board sizing & powers compatibility factors.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
