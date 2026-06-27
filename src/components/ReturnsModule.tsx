/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Plus, 
  History, 
  User, 
  TrendingUp, 
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import { ReturnedWater, Customer, UserRole } from '../types';

interface ReturnsModuleProps {
  returns: ReturnedWater[];
  customers: Customer[];
  activeRole: UserRole;
  language: 'en' | 'ha';
  onAddReturn: (ret: Omit<ReturnedWater, 'id'>) => void;
}

export default function ReturnsModule({
  returns,
  customers,
  activeRole,
  language,
  onAddReturn
}: ReturnsModuleProps) {
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-002');
  const [quantityBags, setQuantityBags] = useState<number>(10);
  const [reason, setReason] = useState<'Unsold' | 'Leaked' | 'Damaged' | 'Expired' | 'Wrong Delivery'>('Unsold');

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Sales Officer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording returns.');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    onAddReturn({
      customerId: selectedCustomerId,
      customerName: customer.name,
      invoiceNumber,
      quantityBags,
      reason,
      date: new Date().toISOString().split('T')[0],
      receivedBy: activeRole // simulation
    });

    // Reset Form
    setShowForm(false);
    setQuantityBags(10);
    setInvoiceNumber('INV-2026-002');
    setReason('Unsold');
  };

  return (
    <div className="space-y-6" id="returns-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <RotateCcw className="text-orange-400 w-5 h-5" />
            {language === 'en' ? 'Customer Returns & Reclaimed Stock' : 'Ruwan da aka Dawo Da Shi / Mayar da Kaya'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Track damaged, leaked, or unsold client batches. Automatically adjusts ledger and inventory bounds.' 
              : 'Shigar da lissafin ruwan da aka dawo da shi saboda lalacewa ko zube. Yana gyara lissafin kaya ta atomatik.'}
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Log Customer Return' : 'Shigar da Dawo da Ruwa'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-700/60 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Return Sheet</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Identify reasons to trigger proper restocking or waste accounting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.businessName} ({c.name})</option>
                ))}
              </select>
            </div>

            {/* Invoice */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Reference Invoice Number</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-002"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Qty */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Quantity (Bags)</label>
              <input
                type="number"
                min="1"
                required
                value={quantityBags}
                onChange={(e) => setQuantityBags(Number(e.target.value))}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Reason for Return</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                <option value="Unsold">Unsold (Deduct ledger and restock)</option>
                <option value="Leaked">Leaked (Discard finished bags & record damage)</option>
                <option value="Damaged">Damaged (Discard finished bags & record damage)</option>
                <option value="Expired">Expired (Discard finished bags)</option>
                <option value="Wrong Delivery">Wrong Delivery (Deduct bill & restock bags)</option>
              </select>
            </div>

          </div>

          {/* Helper calculation widget */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-orange-400" />
            <p className="text-[11px] text-slate-400 leading-normal">
              {reason === 'Unsold' || reason === 'Wrong Delivery' 
                ? 'Note: This action WILL restock finished pure water bags into inventory, and deduct the corresponding purchase cost from the client\'s credit ledger.'
                : 'Note: Leakages or damaged returns will NOT be restocked, but will be logged in the Leakage tracker and client ledger.'}
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              Save Return Log
            </button>
          </div>
        </form>
      )}

      {/* Table List */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4 font-sans">
        <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">Reclaimed Water Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-display font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Invoice Ref</th>
                <th className="py-3 px-3">Qty Reclaimed</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-slate-900/30 text-slate-300">
                  <td className="py-3.5 px-3 font-mono text-slate-400">{r.date}</td>
                  <td className="py-3.5 px-3 font-display font-semibold text-white">{r.customerName}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{r.invoiceNumber}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-orange-400">{r.quantityBags} bags</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-display font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {r.reason}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-display">{r.receivedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
