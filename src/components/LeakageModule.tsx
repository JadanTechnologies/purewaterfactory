/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingDown, 
  Plus, 
  AlertTriangle, 
  History, 
  User, 
  Settings,
  Cpu,
  Truck,
  Inbox
} from 'lucide-react';
import { LeakDamage, UserRole } from '../types';

interface LeakageModuleProps {
  leakages: LeakDamage[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  onAddLeakage: (leak: Omit<LeakDamage, 'id'>) => void;
}

export default function LeakageModule({
  leakages,
  activeRole,
  currency,
  language,
  onAddLeakage
}: LeakageModuleProps) {
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [batchNumber, setBatchNumber] = useState('BAT-20260627-101');
  const [quantityBags, setQuantityBags] = useState<number>(5);
  const [reason, setReason] = useState<'Machine Fault' | 'Packaging Fault' | 'Transportation' | 'Handling'>('Machine Fault');
  const [employee, setEmployee] = useState('Shehu Garba');

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Production Officer';

  // Average cost of one bag is 150 naira (as defined in inventory)
  const COST_PER_BAG = 150;
  const computedLossValue = quantityBags * COST_PER_BAG;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording factory damage.');
      return;
    }

    onAddLeakage({
      batchNumber,
      quantityBags,
      reason,
      date: new Date().toISOString().split('T')[0],
      employeeResponsible: employee,
      lossValue: computedLossValue
    });

    setShowForm(false);
    setQuantityBags(5);
  };

  const totalLossBags = leakages.reduce((acc, curr) => acc + curr.quantityBags, 0);
  const totalLossValue = leakages.reduce((acc, curr) => acc + curr.lossValue, 0);

  return (
    <div className="space-y-6" id="leakage-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <TrendingDown className="text-red-400 w-5 h-5" />
            {language === 'en' ? 'Factory Leakage & Loss Ledger' : 'Rikodin Asarar Ruwa da Zubewa'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Track physical shrinkage, machine sealer misalignments, or transit damage.' 
              : 'Gano asarar ruwa yayin tace shi, matsalolin inji, ko lalacewa yayin jigila.'}
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Log Factory Shrinkage' : 'Shigar da Kuskuren Zubewa'}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400">Aggregate Loss Volume</span>
            <span className="text-2xl font-mono font-bold text-white block mt-1">{totalLossBags.toLocaleString()} bags</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400">Calculated Loss Value (Cost Basis)</span>
            <span className="text-2xl font-mono font-bold text-rose-400 block mt-1">₦{totalLossValue.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-700/60 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Factory Loss Event</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Input details below to keep the mechanical and logistics departments updated.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Batch */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Production Batch Code</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BAT-20260627-101"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Qty */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Quantity Damaged (Bags)</label>
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
              <label className="text-xs font-semibold text-slate-400">Fault Cause Class</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                <option value="Machine Fault">Machine Sealer Seam Fault</option>
                <option value="Packaging Fault">Raw Nylon Seam Puncture</option>
                <option value="Transportation">Vehicle Transit Shocks</option>
                <option value="Handling">Loader / Handler Ruptures</option>
              </select>
            </div>

            {/* Employee */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Attendant Responsible</label>
              <input
                type="text"
                required
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 flex justify-between items-center text-xs">
            <span className="text-slate-400">Estimated Expense Value:</span>
            <span className="font-mono font-bold text-red-400">
              {quantityBags} bags × {currency}{COST_PER_BAG} = {currency}{computedLossValue.toLocaleString()}
            </span>
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
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              Log Loss Event
            </button>
          </div>
        </form>
      )}

      {/* Loss Log Table */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4 font-sans">
        <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">Shrinkage & Damage Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-display font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Batch Code</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Estimated Cost Loss</th>
                <th className="py-3 px-3">Fault Category</th>
                <th className="py-3 px-3">Attendant Involved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {leakages.map(l => {
                let icon = <Cpu className="w-3.5 h-3.5 text-red-400" />;
                if (l.reason === 'Transportation') icon = <Truck className="w-3.5 h-3.5 text-red-400" />;
                if (l.reason === 'Handling') icon = <Inbox className="w-3.5 h-3.5 text-red-400" />;

                return (
                  <tr key={l.id} className="hover:bg-slate-900/30 text-slate-300">
                    <td className="py-3.5 px-3 font-mono text-slate-400">{l.date}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-white">{l.batchNumber}</td>
                    <td className="py-3.5 px-3 font-display font-semibold text-white">{l.quantityBags} bags</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-rose-400">₦{l.lossValue.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <span className="flex items-center gap-1.5 font-display font-bold text-[10px] text-slate-300 uppercase tracking-wider">
                        {icon} {l.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-display">{l.employeeResponsible}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
