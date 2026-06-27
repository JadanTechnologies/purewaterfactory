/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  History, 
  FileText, 
  AlertCircle,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { Expense, UserRole } from '../types';

interface ExpenseModuleProps {
  expenses: Expense[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export default function ExpenseModule({
  expenses,
  activeRole,
  currency,
  language,
  onAddExpense
}: ExpenseModuleProps) {
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [category, setCategory] = useState<Expense['category']>('Generator Fuel');
  const [amount, setAmount] = useState<number>(5000);
  const [description, setDescription] = useState('');

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Cashier';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording operational expenditures.');
      return;
    }

    onAddExpense({
      date: new Date().toISOString().split('T')[0],
      category,
      amount,
      description,
      recordedBy: activeRole // simulation
    });

    setShowForm(false);
    setDescription('');
    setAmount(5000);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group expenses for visual representation
  const categoriesGrouped = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6" id="expenses-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="text-amber-400 w-5 h-5" />
            {language === 'en' ? 'Operational Expense Ledger' : 'Rubutun Kudaden Kashewa'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Log generator fuel, mechanical repairs, transport logic, and auxiliary costs.' 
              : 'Shigar da kudaden diesel na janareta, gyaran injina, da kudaden jigila.'}
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Log Business Expense' : 'Shigar da Sabon Expense'}
          </button>
        )}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Expense lists (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-700/60 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Expense Voucher</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Expense Class</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
                  >
                    <option value="Generator Fuel">Generator Fuel (Diesel)</option>
                    <option value="Repairs">Mechanical Repairs</option>
                    <option value="Transport">Transport / Delivery Fuel</option>
                    <option value="Maintenance">Water Treatment Maintenance</option>
                    <option value="Electricity">PHCN Electricity Bill</option>
                    <option value="Salary">Staff Salary / Welfare</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Cost Value (₦)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Expense Voucher Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Bought 20 liters of diesel for water pumping backup power"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Save Voucher Entry
                </button>
              </div>
            </form>
          )}

          {/* List Table */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Operational Expense Logs</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Expense Category</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Cost Amount</th>
                    <th className="py-3 px-3">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-slate-900/30 text-slate-300">
                      <td className="py-3.5 px-3 font-mono">{e.date}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{e.description}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{currency}{e.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-slate-400">{e.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: Expense breakdown (1 col) */}
        <div className="space-y-6">
          
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
              <PieChart className="w-3.5 h-3.5 text-amber-400" /> Category Outlays
            </h3>
            
            <div className="space-y-3.5">
              {Object.entries(categoriesGrouped).map(([cat, amt]) => {
                const percentage = Math.min(100, (amt / totalExpenses) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-300">
                      <span>{cat}</span>
                      <span className="font-bold text-white">{currency}{amt.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-700/40 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Aggregate Outgoings</span>
              <span className="text-2xl font-black text-rose-400 tracking-tight block mt-1">{currency}{totalExpenses.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
