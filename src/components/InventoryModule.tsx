/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sliders, 
  Search, 
  AlertTriangle, 
  History, 
  SlidersHorizontal,
  FolderMinus,
  Briefcase
} from 'lucide-react';
import { InventoryItem, StockMovement, UserRole } from '../types';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  movements: StockMovement[];
  activeRole: UserRole;
  language: 'en' | 'ha';
  onAdjustStock: (itemId: string, qtyChange: number, type: 'Stock In' | 'Stock Out' | 'Adjustment', reason: string, operator: string) => void;
}

export default function InventoryModule({
  inventory,
  movements,
  activeRole,
  language,
  onAdjustStock
}: InventoryModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Raw Materials' | 'Finished Goods'>('All');
  
  // Adjustment state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'Stock In' | 'Stock Out' | 'Adjustment'>('Stock In');
  const [adjustReason, setAdjustReason] = useState('');

  const canWrite = activeRole === 'Administrator' || activeRole === 'Super Admin' || activeRole === 'Factory Manager' || activeRole === 'Store Keeper';

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!canWrite) {
      alert('Your current role does not permit adjusting inventory.');
      return;
    }

    // Convert Stock Out / Adjustments to correct sign
    let finalQty = adjustQty;
    if (adjustType === 'Stock Out') {
      finalQty = -adjustQty;
    } else if (adjustType === 'Adjustment') {
      // Just take original value as positive or negative based on user reason
      finalQty = adjustQty; // can be negative or positive depending on input
    }

    onAdjustStock(
      selectedItem.id,
      finalQty,
      adjustType,
      adjustReason,
      activeRole // operator name
    );

    // Reset Form
    setSelectedItem(null);
    setAdjustReason('');
    setAdjustQty(10);
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="inventory-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <Layers className="text-purple-400 w-5 h-5" />
            {language === 'en' ? 'Factory Inventory & Stock Control' : 'Ma\'aji da Gudanar da Kaya'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Real-time raw material weights and finished product bag levels.' 
              : 'Kulawa da nauyin ledar tace ruwa da kuma adadin jakar ruwan da aka tace.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Inventory List (Left 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-700/40">
              <div className="flex gap-1 bg-slate-900 p-1 rounded-lg font-sans">
                {(['All', 'Raw Materials', 'Finished Goods'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] font-display font-bold px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'All' ? (language === 'en' ? 'All Goods' : 'Duka Kaya') : 
                     cat === 'Raw Materials' ? (language === 'en' ? 'Raw Materials' : 'Kayan Tace') : 
                     (language === 'en' ? 'Finished Goods' : 'Ruwan da aka tace')}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48 font-sans">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search items...' : 'Nemo kaya...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 text-white border border-slate-700 rounded-lg py-1 pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 w-full"
                />
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => {
                const isLow = (item.type === 'Nylon' && item.quantity < 50) || 
                              (item.type === 'Pure Water Bag' && item.quantity < 500) || 
                               (item.type === 'Chemical' && item.quantity < 10);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-slate-900/50 border rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/35 transition-all ${
                      isLow ? 'border-rose-500/30 bg-rose-950/10' : 'border-slate-700/50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        {isLow && (
                          <span className="text-[9px] text-rose-400 font-display font-bold uppercase flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 animate-pulse" /> Low Stock
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-display font-bold text-white mt-2 leading-tight tracking-wide">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Cost basis: ₦{item.costPrice.toLocaleString()}/{item.unit}</p>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">Quantity Available</span>
                        <span className="text-xl font-mono font-bold text-white tracking-tight">
                          {item.quantity.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">{item.unit}</span>
                        </span>
                      </div>
                      {canWrite && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setAdjustType('Stock In');
                          }}
                          className="p-1.5 rounded-lg bg-purple-600/15 hover:bg-purple-600 text-purple-400 hover:text-white transition-all cursor-pointer text-xs"
                          title="Adjust stock ledger"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Adjust Stock Panel (Right 1 col) */}
        <div className="space-y-6">
          {selectedItem ? (
            <form onSubmit={handleAdjustmentSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg animate-in fade-in duration-200">
              <div className="border-b border-slate-700 pb-2 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-display font-bold uppercase text-purple-400">Stock Adjuster</span>
                  <h3 className="text-xs font-display font-bold text-white mt-0.5 truncate max-w-[180px]">{selectedItem.name}</h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedItem(null)} 
                  className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Adjust Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-bold text-slate-400">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl">
                  {(['Stock In', 'Stock Out', 'Adjustment'] as const).map(type => {
                    let icon = <SlidersHorizontal className="w-3.5 h-3.5" />;
                    if (type === 'Stock In') icon = <ArrowUpRight className="w-3.5 h-3.5" />;
                    if (type === 'Stock Out') icon = <ArrowDownLeft className="w-3.5 h-3.5" />;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAdjustType(type)}
                        className={`text-[9px] py-1.5 rounded-lg font-display font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          adjustType === type 
                            ? 'bg-purple-600 text-white shadow' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {icon} {type.split(' ')[1] || 'Adj'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-display font-bold text-slate-400">Quantity to Adjust ({selectedItem.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-display font-bold text-slate-400">Reason for Adjustment</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Vendor restock shipment, shelf damage"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer tracking-wider"
              >
                Apply Adjustment Ledger
              </button>
            </form>
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 text-center text-slate-400 space-y-2">
              <SlidersHorizontal className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
              <p className="text-xs font-sans font-medium">
                {language === 'en' ? 'Select an item to adjust its stock level manually.' : 'Zaɓi abu don daidaita adadinsu da kanka.'}
              </p>
            </div>
          )}

          {/* Audit Trail sidebar */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
              <History className="w-3.5 h-3.5 text-purple-400" /> Recent Movements
            </h3>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {movements.slice(0, 4).map(m => (
                <div key={m.id} className="text-[10px] font-sans text-slate-400 border-b border-slate-700/40 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center font-display font-semibold text-white">
                    <span>{m.itemName}</span>
                    <span className={`font-mono font-bold ${m.type === 'Stock In' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {m.type === 'Stock In' ? '+' : '-'}{m.quantity}
                    </span>
                  </div>
                  <p className="text-[9px] font-sans text-slate-500 mt-0.5">{m.reason} • {m.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
