/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Activity, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Sale, Expense, Customer, UserRole } from '../types';

interface FinancialModuleProps {
  sales: Sale[];
  expenses: Expense[];
  customers: Array<Customer>;
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
}

export default function FinancialModule({
  sales,
  expenses,
  customers,
  activeRole,
  currency,
  language
}: FinancialModuleProps) {
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Annual'>('Monthly');

  // Income calculations
  const totalSalesRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCashCollected = sales.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalOperationalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Net Profit before tax
  const grossProfit = totalSalesRevenue; // sales of finished bags
  const netProfit = totalSalesRevenue - totalOperationalExpenses;
  const netMargin = totalSalesRevenue > 0 ? (netProfit / totalSalesRevenue) * 100 : 0;

  // Debt statistics
  const totalOutstandingDebt = customers.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  return (
    <div className="space-y-6" id="financials-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="text-emerald-400 w-5 h-5" />
            {language === 'en' ? 'Factory Income Ledger & Profit/Loss' : 'Rahoton Kudi da Siyarwa'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Real-time calculation of revenue, material COGS, operational expenses, and net profit margins.' 
              : 'Lissafin kudaden shiga gaba-daya, kudaden kashewa na yau da kullum, da riba.'}
          </p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl self-stretch sm:self-auto justify-around border border-slate-700/40">
          {(['Daily', 'Weekly', 'Monthly', 'Annual'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === filter 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Invoiced Sales */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Invoiced Sales Volume</span>
              <span className="text-2xl font-bold text-white block mt-1">{currency}{totalSalesRevenue.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center gap-1">
            {language === 'en' ? 'Cash Collected:' : 'Kudin shiga na hannu:'} <strong className="text-emerald-400 font-bold">{currency}{totalCashCollected.toLocaleString()}</strong>
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-red-500/40 transition-all shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Operational Expenses</span>
              <span className="text-2xl font-bold text-white block mt-1">{currency}{totalOperationalExpenses.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-semibold">
            {language === 'en' ? 'Includes diesel, maintenance, welfare' : 'Ya hada da kudin diesel da gyaran inji'}
          </p>
        </div>

        {/* Net Profit Margin */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-all shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Net Profit Margin</span>
              <span className={`text-2xl font-bold block mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {currency}{netProfit.toLocaleString()}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${netProfit >= 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-semibold">
            {language === 'en' ? 'Overall margin:' : 'Kashi na riba:'} <strong className={netProfit >= 0 ? 'text-indigo-400 font-bold' : 'text-rose-400 font-bold'}>{netMargin.toFixed(1)}%</strong>
          </p>
        </div>

      </div>

      {/* Structured Income Statement Ledger (Highly Professional) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income Statement sheet (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Income Statement ({timeFilter})</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Summary of revenue inflows, costs, and tax estimates.</p>
          </div>

          <div className="space-y-3.5 text-xs text-slate-300">
            {/* Revenue Inflow */}
            <div className="flex justify-between border-b border-slate-700/40 pb-2">
              <span className="font-semibold text-white">1. Gross Operational Revenue</span>
              <span className="font-mono text-white font-bold">{currency}{totalSalesRevenue.toLocaleString()}</span>
            </div>
            <div className="pl-4 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>• Finished Water Bags Sales</span>
                <span>{currency}{totalSalesRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Wholesale Depot Margins</span>
                <span>₦0</span>
              </div>
            </div>

            {/* Direct Expenses */}
            <div className="flex justify-between border-b border-slate-700/40 pb-2 pt-2">
              <span className="font-semibold text-white">2. Operational Outflows & COGS</span>
              <span className="font-mono text-rose-400 font-bold">({currency}{totalOperationalExpenses.toLocaleString()})</span>
            </div>
            <div className="pl-4 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>• Generator Fuel (Diesel)</span>
                <span>{currency}{(expenses.filter(e => e.category === 'Generator Fuel').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Machine Sealer Repairs & Maintenance</span>
                <span>{currency}{(expenses.filter(e => e.category === 'Repairs' || e.category === 'Maintenance').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Logistics Transport Fuel</span>
                <span>{currency}{(expenses.filter(e => e.category === 'Transport').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>• Auxiliary Staff Salaries</span>
                <span>{currency}{(expenses.filter(e => e.category === 'Salary').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</span>
              </div>
            </div>

            {/* Profits */}
            <div className="flex justify-between border-b border-slate-700/60 pb-2 pt-2 text-sm font-extrabold text-white">
              <span>3. Operating Net Profit</span>
              <span className={netProfit >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                {currency}{netProfit.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Estimated Corporate Income Tax (7.5%):</span>
              <span>{currency}{(netProfit > 0 ? netProfit * 0.075 : 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Outstanding Receivables sidebar (1 col) */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-700 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Outstanding Receivables
            </h3>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {customers.filter(c => c.outstandingBalance > 0).map(c => (
              <div key={c.id} className="text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                <div className="flex justify-between font-bold text-white">
                  <span className="truncate max-w-[120px]">{c.businessName}</span>
                  <span className="text-rose-400">{currency}{c.outstandingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-semibold">
                  <span>Owner: {c.name}</span>
                  <span>Limit: {currency}{c.creditLimit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-700/40 text-center">
            <span className="text-[10px] text-slate-500 block font-bold uppercase">Aggregate Unpaid Debt</span>
            <span className="text-xl font-black text-rose-400 block mt-1">{currency}{totalOutstandingDebt.toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
