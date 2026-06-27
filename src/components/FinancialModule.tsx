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
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Download,
  Calendar,
  X,
  Printer,
  Coins
} from 'lucide-react';
import { Sale, Expense, Customer, CustomerPayment, UserRole } from '../types';

interface FinancialModuleProps {
  sales: Sale[];
  expenses: Expense[];
  payments: CustomerPayment[];
  customers: Array<Customer>;
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  hasAccess: (module: string) => boolean;
}

export default function FinancialModule({
  sales,
  expenses,
  payments = [],
  customers,
  activeRole,
  currency,
  language,
  hasAccess
}: FinancialModuleProps) {
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Annual'>('Monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  // Unified Transaction History states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'payment' | 'expense'>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  // Income calculations
  const totalSalesRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCashCollectedFromSales = sales.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalDebtPaymentsReceived = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOperationalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Total cash received = cash from sales + specific debt payments
  const totalActualCashInflow = totalCashCollectedFromSales + totalDebtPaymentsReceived;

  // Net Profit calculations (Invoiced sales vs Expenses)
  const netProfit = totalSalesRevenue - totalOperationalExpenses;
  const netMargin = totalSalesRevenue > 0 ? (netProfit / totalSalesRevenue) * 100 : 0;

  // Debt statistics
  const totalOutstandingDebt = customers.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  // Compile Unified Transactions list
  const unifiedTransactions = [
    ...(hasAccess('sales') ? sales.map(s => ({
      id: s.id,
      date: s.date,
      type: 'Sale' as const,
      reference: s.invoiceNumber,
      party: s.customerName,
      description: `Invoice issued: ${s.quantityBags} bags of pure water`,
      method: s.paymentMethod,
      amount: s.totalAmount,
      amountPaid: s.amountPaid,
      status: s.status,
      operator: s.salesOfficer,
      flow: 'inflow' as const
    })) : []),
    ...(hasAccess('sales') || hasAccess('customers') || hasAccess('financials') ? payments.map(p => ({
      id: p.id,
      date: p.date,
      type: 'Payment' as const,
      reference: p.reference || `REF-${p.id.substring(p.id.length - 6).toUpperCase()}`,
      party: p.customerName,
      description: `Customer debt payment received`,
      method: p.paymentMethod,
      amount: p.amount,
      amountPaid: p.amount,
      status: 'Paid',
      operator: 'Cashier',
      flow: 'debt_payment' as const
    })) : []),
    ...(hasAccess('expenses') ? expenses.map(e => ({
      id: e.id,
      date: e.date,
      type: 'Expense' as const,
      reference: `EXP-${e.id.substring(e.id.length - 6).toUpperCase()}`,
      party: e.category,
      description: e.description,
      method: 'Cash',
      amount: e.amount,
      amountPaid: e.amount,
      status: 'Paid',
      operator: e.recordedBy,
      flow: 'outflow' as const
    })) : [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter unified transactions
  const filteredTransactions = unifiedTransactions.filter(txn => {
    // Search match
    const matchesSearch = 
      txn.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.operator.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'sale' && txn.type === 'Sale') ||
      (filterType === 'payment' && txn.type === 'Payment') ||
      (filterType === 'expense' && txn.type === 'Expense');

    // Payment Method filter
    const matchesMethod = 
      filterMethod === 'all' || 
      txn.method.toLowerCase() === filterMethod.toLowerCase();

    return matchesSearch && matchesType && matchesMethod;
  });

  // Export filtered transactions to CSV file
  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Reference', 'Party/Category', 'Description', 'Method', 'Amount', 'Amount Paid', 'Operator'];
    const rows = filteredTransactions.map(txn => [
      txn.date,
      txn.type,
      txn.reference,
      txn.party,
      txn.description.replace(/,/g, ' '),
      txn.method,
      txn.amount,
      txn.amountPaid,
      txn.operator
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nile_water_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const playPrintAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
      
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Transaction printed successfully");
        msg.rate = 1.0;
        window.speechSynthesis.speak(msg);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6" id="financials-module">
      
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="text-emerald-400 w-5 h-5" />
            {language === 'en' ? 'Factory Income Ledger & Transactions' : 'Rahoton Kudi da Kasuwanci'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Real-time calculations of profit & loss, cash flows, and complete unified transaction history.' 
              : 'Lissafin kudaden shiga gaba-daya, kudaden kashewa na yau da kullum, da tarihin ciniki.'}
          </p>
        </div>

        {/* Tab Controls and Timeframe Selector */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Main Module Tabs */}
          <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'bg-sky-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Financial Performance' : 'Riba da Asara'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'history' 
                  ? 'bg-sky-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
              id="transaction-history-tab"
            >
              {language === 'en' ? 'Transaction History Log' : 'Tarihin Kasuwanci'}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/40 self-stretch sm:self-auto justify-around">
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
          )}
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Grid Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Total Invoiced Sales */}
            {hasAccess('sales') ? (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-sky-500/40 transition-all shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoiced Sales Volume</span>
                    <span className="text-2xl font-bold text-white block mt-1">{currency}{totalSalesRevenue.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center justify-between">
                  <span>{language === 'en' ? 'Direct Invoice Paid:' : 'An Biyan Kuɗi:'}</span>
                  <strong className="text-emerald-400 font-bold">{currency}{totalCashCollectedFromSales.toLocaleString()}</strong>
                </p>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Invoiced Sales</span>
                <span className="text-xs text-slate-500 mt-1">Access Restricted</span>
              </div>
            )}

            {/* Total Cash Collected */}
            {hasAccess('sales') ? (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Cash Inflow</span>
                    <span className="text-2xl font-bold text-emerald-400 block mt-1">{currency}{totalActualCashInflow.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center justify-between">
                  <span>{language === 'en' ? 'Customer Debt Payments:' : 'Biyan Bashi:'}</span>
                  <span className="text-sky-400 font-bold">{currency}{totalDebtPaymentsReceived.toLocaleString()}</span>
                </p>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Cash Inflow</span>
                <span className="text-xs text-slate-500 mt-1">Access Restricted</span>
              </div>
            )}

            {/* Expenses */}
            {hasAccess('expenses') ? (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-red-500/40 transition-all shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Operational Expenses</span>
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
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Operational Expenses</span>
                <span className="text-xs text-slate-500 mt-1">Access Restricted</span>
              </div>
            )}

            {/* Net Profit Margin */}
            {(hasAccess('sales') && hasAccess('expenses')) ? (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-all shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Profit Margin</span>
                    <span className={`text-2xl font-bold block mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currency}{netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${netProfit >= 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center justify-between">
                  <span>{language === 'en' ? 'Overall margin:' : 'Kashi na riba:'}</span>
                  <strong className={netProfit >= 0 ? 'text-indigo-400 font-bold' : 'text-rose-400 font-bold'}>{netMargin.toFixed(1)}%</strong>
                </p>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Net Profit Margin</span>
                <span className="text-xs text-slate-500 mt-1">Access Restricted</span>
              </div>
            )}

          </div>

          {/* Structured Income Statement Ledger (Highly Professional) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Income Statement sheet (2 cols) */}
            {(hasAccess('sales') && hasAccess('expenses')) ? (
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
                      <span>• Customer Debt Payments Recorded</span>
                      <span>{currency}{totalDebtPaymentsReceived.toLocaleString()}</span>
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
            ) : (
              <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-10 h-10 text-slate-500 mb-2" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Income Statement</h3>
                <p className="text-xs text-slate-400 mt-2">Requires active Sales and Expenses permissions to generate full income sheet statements.</p>
              </div>
            )}

            {/* Outstanding Receivables sidebar (1 col) */}
            {(hasAccess('sales') || hasAccess('customers')) ? (
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
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center">
                <ShieldAlert className="w-8 h-8 text-slate-500 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Outstanding Debtors</h3>
                <p className="text-[11px] text-slate-400 mt-1">Requires Customer management permission.</p>
              </div>
            )}

          </div>
        </>
      ) : (
        /* Unified Transaction History Log */
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6" id="transaction-log-container">
          
          {/* Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-700/40">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search reference, client, details..." : "Nemo ciniki..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs py-2 pl-9 pr-4 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500/40 transition-all"
                  id="txn-search-input"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none cursor-pointer"
                  id="txn-type-filter"
                >
                  <option value="all">All Transactions</option>
                  <option value="sale">Sales (Invoices)</option>
                  <option value="payment">Customer Payments</option>
                  <option value="expense">Expenses</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Method:</span>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="bg-slate-950 text-white text-xs border border-slate-800 rounded-lg p-2 focus:outline-none cursor-pointer"
                  id="txn-method-filter"
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                  <option value="pos">POS</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

            </div>

            {/* Export and Total Stats Summary */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Filtered Results</span>
                <span className="text-xs font-semibold text-sky-400 block">{filteredTransactions.length} items matched</span>
              </div>
              <button
                onClick={exportToCSV}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all uppercase tracking-wider shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Unified Transactions Table */}
          <div className="overflow-x-auto border border-slate-700/40 rounded-xl" id="transaction-table-wrapper">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-3.5">{language === 'en' ? 'Date' : 'Kwanan Wata'}</th>
                  <th className="p-3.5">{language === 'en' ? 'Transaction Type' : 'Irin Ciniki'}</th>
                  <th className="p-3.5">{language === 'en' ? 'Reference' : 'Lambar Shaida'}</th>
                  <th className="p-3.5">{language === 'en' ? 'Party/Category' : 'Abokin Siyarwa'}</th>
                  <th className="p-3.5">{language === 'en' ? 'Description' : 'Karin Bayani'}</th>
                  <th className="p-3.5">{language === 'en' ? 'Method' : 'Yadda Aka Biya'}</th>
                  <th className="p-3.5 text-right">{language === 'en' ? 'Amount' : 'Adadin Kudi'}</th>
                  <th className="p-3.5 text-center">{language === 'en' ? 'Audit' : 'Auna'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, idx) => (
                    <tr 
                      key={txn.id + '-' + idx} 
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Date */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{txn.date}</span>
                        </div>
                      </td>

                      {/* Transaction Type Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                          txn.type === 'Sale' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          txn.type === 'Payment' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {txn.type === 'Sale' && <ArrowUpRight className="w-2.5 h-2.5" />}
                          {txn.type === 'Payment' && <ArrowUpRight className="w-2.5 h-2.5" />}
                          {txn.type === 'Expense' && <ArrowDownRight className="w-2.5 h-2.5" />}
                          {txn.type === 'Sale' ? 'Sale Invoice' : txn.type}
                        </span>
                      </td>

                      {/* Reference */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-[10px] text-slate-300 font-bold">
                        {txn.reference}
                      </td>

                      {/* Party / Category */}
                      <td className="p-3.5 whitespace-nowrap font-semibold text-white">
                        {txn.party}
                      </td>

                      {/* Description */}
                      <td className="p-3.5 text-slate-400 max-w-xs truncate" title={txn.description}>
                        {txn.description}
                      </td>

                      {/* Payment Method */}
                      <td className="p-3.5 whitespace-nowrap text-[11px] font-semibold text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 uppercase text-[9px] font-mono">
                          {txn.method}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5 text-right font-mono font-bold text-white whitespace-nowrap">
                        <span className={
                          txn.type === 'Sale' ? 'text-sky-300' :
                          txn.type === 'Payment' ? 'text-emerald-400' :
                          'text-rose-400'
                        }>
                          {txn.type === 'Expense' ? '-' : ''}{currency}{txn.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Audit Details Trigger */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all cursor-pointer"
                          title="Open Digital Receipt Audit"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">
                      No transactions match the selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Interactive Audit Digital Receipt Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in scale-in duration-150 relative">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header branding */}
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Nile Pure Water Factory</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">Transaction Audit Receipt</h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1">SECURE AUDIT RECORD SYSTEM</p>
            </div>

            {/* Receipt Body */}
            <div className="mt-4 space-y-3.5 text-xs">
              
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-white">{selectedTxn.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Date/Time Logged:</span>
                <span className="font-mono text-slate-200">{selectedTxn.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Reference Token:</span>
                <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded text-[10px]">{selectedTxn.reference}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Audit Type:</span>
                <span className="font-bold text-white">{selectedTxn.type.toUpperCase()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Counter-Party / Category:</span>
                <span className="font-bold text-white">{selectedTxn.party}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Transaction Description</span>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{selectedTxn.description}</p>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway/Method:</span>
                <span className="uppercase font-mono text-slate-200">{selectedTxn.method}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Authorizing Officer:</span>
                <span className="text-slate-200">{selectedTxn.operator}</span>
              </div>

              {/* Grand Total Row */}
              <div className="pt-3 border-t border-dashed border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">LEDGER VALUE:</span>
                <span className={`font-mono font-black text-base ${
                  selectedTxn.type === 'Sale' ? 'text-sky-400' :
                  selectedTxn.type === 'Payment' ? 'text-emerald-400' :
                  'text-rose-400'
                }`}>
                  {selectedTxn.type === 'Expense' ? '-' : ''}{currency}{selectedTxn.amount.toLocaleString()}
                </span>
              </div>

              {selectedTxn.type === 'Sale' && (
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Invoice Status: <strong className="text-white uppercase">{selectedTxn.status}</strong></span>
                  <span>Direct Paid: <strong className="text-emerald-400 font-mono">₦{selectedTxn.amountPaid.toLocaleString()}</strong></span>
                </div>
              )}

            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  playPrintAlarm();
                  window.print();
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Record
              </button>
              <button
                onClick={() => setSelectedTxn(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer text-center"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
