/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Droplet, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  UserCheck, 
  ArrowUpRight, 
  ChevronRight,
  TrendingDown,
  Calculator,
  Calendar,
  FileText
} from 'lucide-react';
import { 
  Sale, 
  ProductionBatch, 
  InventoryItem, 
  ReturnedWater, 
  LeakDamage, 
  Customer,
  UserRole,
  Expense,
  CustomerPayment,
  EndOfDayReport
} from '../types';

interface DashboardProps {
  sales: Sale[];
  production: ProductionBatch[];
  inventory: InventoryItem[];
  returns: ReturnedWater[];
  leakages: LeakDamage[];
  customers: Customer[];
  expenses: Expense[];
  payments: CustomerPayment[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  t: (key: string) => string;
  onNavigate: (module: string) => void;
  hasAccess: (moduleName: string) => boolean;
  onGenerateEndOfDay?: () => void;
  endOfDayReports?: EndOfDayReport[];
}

export default function Dashboard({
  sales,
  production,
  inventory,
  returns,
  leakages,
  customers,
  expenses = [],
  payments = [],
  activeRole,
  currency,
  language,
  t,
  onNavigate,
  hasAccess,
  onGenerateEndOfDay,
  endOfDayReports
}: DashboardProps) {

  // Clock & Calculator States
  const [time, setTime] = useState(new Date());
  const [calcInput, setCalcInput] = useState('');
  const [showCalc, setShowCalc] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCalcPress = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
    } else if (val === '=') {
      try {
        if (/^[0-9+\-*/.() ]+$/.test(calcInput)) {
          // eslint-disable-next-line no-eval
          const result = eval(calcInput);
          setCalcInput(Number.isFinite(result) ? String(parseFloat(result.toFixed(4))) : 'Error');
        } else {
          setCalcInput('Error');
        }
      } catch (err) {
        setCalcInput('Error');
      }
    } else {
      if (calcInput === 'Error') {
        setCalcInput(val);
      } else {
        setCalcInput(calcInput + val);
      }
    }
  };

  // Current Date
  const todayStr = new Date().toISOString().split('T')[0];

  // Unified Recent Transactions List (Sales, Customer Payments, Expenses)
  const unifiedRecentTransactions = [
    ...(hasAccess('sales') ? sales.map(s => ({
      id: s.id,
      date: s.date,
      type: 'Sale' as const,
      title: s.customerName,
      subtitle: s.invoiceNumber,
      amount: s.totalAmount,
      status: s.status,
      flow: 'inflow' as const
    })) : []),
    ...(hasAccess('customers') || hasAccess('financials') || hasAccess('sales') ? payments.map(p => ({
      id: p.id,
      date: p.date,
      type: 'Payment' as const,
      title: p.customerName,
      subtitle: p.reference || `REF-${p.id.substring(p.id.length - 4).toUpperCase()}`,
      amount: p.amount,
      status: 'Paid',
      flow: 'debt_payment' as const
    })) : []),
    ...(hasAccess('expenses') ? expenses.map(e => ({
      id: e.id,
      date: e.date,
      type: 'Expense' as const,
      title: e.category,
      subtitle: e.description,
      amount: e.amount,
      status: 'Paid',
      flow: 'outflow' as const
    })) : [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Stats Aggregations
  const todaySalesList = sales.filter(s => s.date === todayStr);
  const todaySalesBags = todaySalesList.reduce((acc, curr) => acc + curr.quantityBags, 0);
  const todayRevenue = todaySalesList.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const todayProdList = production.filter(p => p.date === todayStr);
  const todayProductionBags = todayProdList.reduce((acc, curr) => acc + curr.bagsProduced, 0);

  const finishedWaterItem = inventory.find(i => i.type === 'Pure Water Bag');
  const currentStockBags = finishedWaterItem ? finishedWaterItem.quantity : 0;

  const nylonItem = inventory.find(i => i.type === 'Nylon');
  const nylonRemainingKg = nylonItem ? nylonItem.quantity : 0;

  const totalReturnedBags = returns.reduce((acc, curr) => acc + curr.quantityBags, 0);
  const totalLeakedBags = leakages.reduce((acc, curr) => acc + curr.quantityBags, 0);

  const customersOwingCount = customers.filter(c => c.outstandingBalance > 0).length;
  const totalOutstandingAmount = customers.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  // Stock Warnings
  const lowStockAlerts = inventory.filter(item => {
    if (item.type === 'Nylon' && item.quantity < 50) return true;
    if (item.type === 'Pure Water Bag' && item.quantity < 500) return true;
    if (item.type === 'Chemical' && item.quantity < 10) return true;
    return false;
  });

  // Simple SVG Charts Helper Data
  // Monthly Sales Chart Data (Mocking last 6 months)
  const monthlySalesData = [
    { month: 'Jan', sales: 480000, prod: 2600 },
    { month: 'Feb', sales: 520000, prod: 2800 },
    { month: 'Mar', sales: 610000, prod: 3200 },
    { month: 'Apr', sales: 580000, prod: 3000 },
    { month: 'May', sales: 720000, prod: 3800 },
    { month: 'Jun', sales: 840000, prod: 4400 }
  ];

  const maxSales = Math.max(...monthlySalesData.map(d => d.sales));
  const maxProd = Math.max(...monthlySalesData.map(d => d.prod));

  return (
    <div className="space-y-6" id="dashboard-module">
      
      {/* Welcome Banner */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex-1">
          <span className="text-[10px] font-display font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full">
            {language === 'en' ? 'Active Session' : 'Zama na Yanzu'} - {activeRole}
          </span>
          <h1 className="text-2xl font-display font-extrabold text-white mt-2.5 flex items-center gap-2 tracking-tight">
            {language === 'en' ? 'Operational Overview' : 'Bayanin Aiki na Gaba-daya'}
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-1">
            {language === 'en' 
              ? 'Real-time production, packaging, inventory balances, and ledger oversight.'
              : 'Kulawa da tace ruwa, leda, abokan ciniki, da kasuwanci a lokacin aiki.'}
          </p>
        </div>

        {/* Real-time Clock & Interactive Calculator Widget */}
        <div className="flex flex-row items-center gap-4 bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl shadow-inner relative w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-start">
          {/* Clock */}
          <div className="text-left sm:text-right pr-4 border-r border-slate-700/60">
            <span className="text-[9px] font-display font-bold text-slate-500 block uppercase tracking-wider">
              {language === 'en' ? 'FACTORY DIGITAL CLOCK' : 'AGOGON MASANA\'ANTA'}
            </span>
            <span className="text-sm font-mono font-bold text-sky-400 tracking-wider block drop-shadow-[0_0_8px_rgba(56,189,248,0.2)]">
              {time.toLocaleTimeString(language === 'en' ? 'en-US' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Calculator Popover Anchor */}
          <div className="relative">
            <button
              onClick={() => setShowCalc(!showCalc)}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-emerald-500/40 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider shadow-sm"
              title="Open Quick Calculator"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Calc' : 'Kalku'}</span>
            </button>

            {/* Calculator Panel */}
            {showCalc && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                  <span className="text-[9px] font-display font-extrabold text-slate-400 uppercase tracking-wider">Workspace Calculator</span>
                  <button 
                    onClick={() => setShowCalc(false)} 
                    className="text-slate-400 hover:text-white text-base leading-none p-1 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {/* Display */}
                <div className="bg-slate-950 p-2.5 rounded-lg text-right mb-2.5 font-mono text-sm font-bold text-white min-h-[36px] flex items-center justify-end truncate border border-slate-800">
                  {calcInput || '0'}
                </div>

                {/* Grid of buttons */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-bold">
                  {['7', '8', '9', '/'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors">{k}</button>
                  ))}
                  {['4', '5', '6', '*'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors">{k}</button>
                  ))}
                  {['1', '2', '3', '-'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors">{k}</button>
                  ))}
                  <button onClick={() => handleCalcPress('C')} className="p-2 bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:bg-rose-900 hover:text-white rounded-lg cursor-pointer transition-all">C</button>
                  <button onClick={() => handleCalcPress('0')} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors">0</button>
                  <button onClick={() => handleCalcPress('=')} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer transition-colors">=</button>
                  <button onClick={() => handleCalcPress('+')} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors">+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full xl:w-auto font-sans">
          {hasAccess('production') && (
            <button 
              onClick={() => onNavigate('production')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full md:w-auto tracking-wide"
            >
              <Droplet className="w-3.5 h-3.5" />
              {language === 'en' ? 'Record Production' : 'Rikodi na Tace Ruwa'}
            </button>
          )}
          {hasAccess('sales') && (
            <button 
              onClick={() => onNavigate('sales')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full md:w-auto tracking-wide"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'en' ? 'Record Sale' : 'Sabuwar Talla'}
            </button>
          )}
          {hasAccess('settings') && (
            <button 
              onClick={onGenerateEndOfDay}
              className="bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full md:w-auto tracking-wide"
              title="Generate End of Day Report"
            >
              <Calendar className="w-3.5 h-3.5" />
              {language === 'en' ? 'End of Day' : 'Kusan na Yau'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-stats-grid">
        
        {/* STAT 1: Daily Production */}
        {hasAccess('production') && (
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-lg group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <Droplet className="w-5 h-5 fill-sky-400/20" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{language === 'en' ? 'Today' : 'Yau'}</span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">{t('todayProduction')}</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight block mt-1">
                {todayProductionBags.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400 uppercase tracking-wider">bags</span>
              </span>
              <p className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-400 font-bold">+{todayProdList.length}</span> {language === 'en' ? 'completed shifts' : 'shif-shif da aka tace'}
              </p>
            </div>
          </div>
        )}

        {/* STAT 2: Today's Sales / Revenue */}
        {hasAccess('sales') && (
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-lg group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{language === 'en' ? 'Today' : 'Yau'}</span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">{t('todaySales')}</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight block mt-1">
                {todaySalesBags.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400 uppercase tracking-wider">bags</span>
              </span>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono font-bold">
                <DollarSign className="w-3 h-3" /> {currency}{todayRevenue.toLocaleString()} {language === 'en' ? 'Rev' : 'Kudi'}
              </p>
            </div>
          </div>
        )}

        {/* STAT 3: Finished Goods Stock */}
        {hasAccess('inventory') && (
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-lg group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{language === 'en' ? 'Active' : 'Akwai'}</span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">{t('currentStock')}</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight block mt-1">
                {currentStockBags.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400 uppercase tracking-wider">bags</span>
              </span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (currentStockBags / 5000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* STAT 4: Nylon Film Available */}
        {hasAccess('inventory') && (
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-lg group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{language === 'en' ? 'Raw Materials' : 'Kayan Tace'}</span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">{t('nylonRemaining')}</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight block mt-1">
                {nylonRemainingKg.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400 uppercase tracking-wider">kg</span>
              </span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">
                {language === 'en' ? 'Equivalent to' : 'Daidai yake da'} <span className="text-amber-400 font-bold">{nylonRemainingKg * 100}</span> bags
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Returns */}
        {hasAccess('returns') && (
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('returnedWater')}</span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">{totalReturnedBags} bags</span>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Leakage */}
        {hasAccess('leakages') && (
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('leakedWater')}</span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">{totalLeakedBags} bags</span>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Customers Owing */}
        {hasAccess('customers') && (
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('customersOwing')}</span>
              <span className="text-lg font-display font-bold text-white mt-1 block">{customersOwingCount} {language === 'en' ? 'Buyers' : 'Masu bashi'}</span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Debt Amount */}
        {hasAccess('sales') && (
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{language === 'en' ? 'Total Outstanding Debt' : 'Jimlar Kudin Bashi'}</span>
              <span className="text-lg font-mono font-bold text-rose-400 mt-1 block">₦{totalOutstandingAmount.toLocaleString()}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        )}

      </div>

      {/* MAIN DATA PANELS: Custom Elegant SVG Charts & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Multi-Chart Visualization */}
        {(hasAccess('sales') || hasAccess('production')) ? (
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {language === 'en' ? 'Factory Performance Index (6 Months)' : 'Alamar Aikin Masana\'anta (Wata 6)'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'en' ? 'Comparison of monthly sales value versus production volume' : 'Kwatanta kudaden shiga da adadin ruwan da aka tace'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  {hasAccess('sales') && (
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 block"></span> {language === 'en' ? 'Sales (₦)' : 'Tallace-tallace (₦)'}
                    </span>
                  )}
                  {hasAccess('production') && (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 block"></span> {language === 'en' ? 'Production (Bags)' : 'Tace Ruwa (Bags)'}
                    </span>
                  )}
                </div>
              </div>

              {/* Custom Responsive High-Fidelity SVG Chart */}
              <div className="relative w-full h-64 bg-slate-900/60 border border-slate-700/30 rounded-xl p-4 flex items-end justify-between gap-1 mt-2">
                
                {/* Y-Axis labels */}
                <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 flex flex-col justify-between h-52 pointer-events-none text-right">
                  <span>{currency}{(maxSales/1000).toFixed(0)}k</span>
                  <span>{currency}{((maxSales*0.6)/1000).toFixed(0)}k</span>
                  <span>{currency}{((maxSales*0.3)/1000).toFixed(0)}k</span>
                  <span>₦0</span>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
                  <div className="border-b border-white w-full"></div>
                  <div className="border-b border-white w-full"></div>
                  <div className="border-b border-white w-full"></div>
                  <div className="border-b border-white w-full"></div>
                </div>

                {/* Chart Bars */}
                <div className="w-full h-full flex items-end justify-around pl-10 z-10">
                  {monthlySalesData.map((d, index) => {
                    const salesHeightPercent = (d.sales / maxSales) * 80; // Scale to max 80% height
                    const prodHeightPercent = (d.prod / maxProd) * 80;

                    return (
                      <div key={index} className="flex flex-col items-center group relative w-16">
                        
                        {/* Interactive Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2 bg-slate-950/95 border border-slate-700 text-slate-200 text-[10px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-20 w-32 flex flex-col gap-1">
                          <span className="font-bold border-b border-slate-800 pb-0.5 text-white">{d.month} Statistics</span>
                          {hasAccess('sales') && <span className="text-sky-400">Sales: {currency}{d.sales.toLocaleString()}</span>}
                          {hasAccess('production') && <span className="text-emerald-400">Prod: {d.prod.toLocaleString()} Bags</span>}
                        </div>

                        {/* Bar columns container */}
                        <div className="flex items-end gap-1.5 h-44 w-full justify-center">
                          {/* Sales Bar */}
                          {hasAccess('sales') && (
                            <div 
                              style={{ height: `${salesHeightPercent}%` }}
                              className="w-4 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                            ></div>
                          )}
                          {/* Production Bar */}
                          {hasAccess('production') && (
                            <div 
                              style={{ height: `${prodHeightPercent}%` }}
                              className="w-4 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                            ></div>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 mt-2 block">{d.month}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-xs text-slate-400 leading-tight font-sans">
                {language === 'en' ? 'Calculated conversion efficiency rate:' : 'Adadin aiki na canza leda zuwa jaka:'} <strong className="text-emerald-400 font-bold font-mono">98.4%</strong>
              </span>
              {hasAccess('reports') && (
                <button 
                  onClick={() => onNavigate('reports')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-display font-semibold flex items-center gap-1 cursor-pointer tracking-wider uppercase"
                >
                  {language === 'en' ? 'Open Full Reports Suite' : 'Duba Rahotanni gaba-daya'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
            <ShieldAlert className="w-10 h-10 text-slate-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">Operational Data Hidden</h4>
            <p className="text-[11px] text-slate-500 mt-1">You do not have active clearance for Sales or Production analytics.</p>
          </div>
        )}

        {/* Right 1 Column: Stock Alerts & Recent Transactions */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white mb-3">
              {language === 'en' ? 'Active Stock Alerts' : 'Faɗakarwar Kaya'}
            </h3>

            {lowStockAlerts.length > 0 ? (
              <div className="space-y-2 mb-4" id="stock-alerts-list">
                {lowStockAlerts.map(item => (
                  <div key={item.id} className="bg-slate-900/60 border border-slate-700/40 p-3 rounded-xl flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-display font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                        {language === 'en' ? 'Only' : 'Sauran'} <span className="text-rose-400 font-mono font-semibold">{item.quantity} {item.unit}</span> left in stock!
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/40 p-4 rounded-xl text-center border border-slate-700/20 mb-4">
                <span className="text-xs text-slate-400 block font-sans font-medium">✅ {language === 'en' ? 'All stock levels healthy' : 'Dukan kaya suna cikin koshin lafiya'}</span>
              </div>
            )}

            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white mb-2 pt-2 border-t border-slate-700/40">
              {language === 'en' ? 'Recent Transactions' : 'Harkokin Karshe'}
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {unifiedRecentTransactions.map((txn, index) => (
                <div key={txn.id + '-' + index} className="text-xs p-2.5 rounded-lg bg-slate-900/40 border border-slate-700/30 flex justify-between items-center hover:bg-slate-900/80 transition-all">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <div className={`p-1.5 rounded-lg ${
                      txn.flow === 'inflow' ? 'bg-sky-500/10 text-sky-400' :
                      txn.flow === 'debt_payment' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {txn.flow === 'inflow' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                       txn.flow === 'debt_payment' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                       <ArrowUpRight className="w-3.5 h-3.5 rotate-90" />}
                    </div>
                    <div className="truncate">
                      <span className="font-display font-semibold text-white block truncate">{txn.title}</span>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5 block truncate">
                        {txn.type === 'Sale' ? 'Invoice' : txn.type} • {txn.subtitle} • {txn.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold block ${
                      txn.flow === 'inflow' ? 'text-sky-400' :
                      txn.flow === 'debt_payment' ? 'text-emerald-400' :
                      'text-rose-400'
                    }`}>
                      {txn.flow === 'outflow' ? '-' : ''}{currency}{txn.amount.toLocaleString()}
                    </span>
                    <span className={`text-[8px] font-display font-bold uppercase tracking-wider px-1 rounded mt-1 inline-block ${
                      txn.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' :
                      txn.status === 'Partially Paid' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
              {unifiedRecentTransactions.length === 0 && (
                <p className="text-center py-4 text-xs text-slate-500">No transactions recorded yet.</p>
              )}
            </div>
          </div>

          {hasAccess('financials') && (
            <button 
              onClick={() => onNavigate('financials')}
              className="w-full bg-slate-700/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition-all border border-slate-600/30 cursor-pointer text-center block mt-4"
            >
              {language === 'en' ? 'View Unified Financial Ledger' : 'Duba Daftarin Kudi'}
            </button>
          )}
        </div>

      </div>

      {/* FOOTER AUDIT LOG (Only visible to admin and manager for auditing tracking compliance) */}
      {(activeRole === 'Administrator' || activeRole === 'Factory Manager') && (
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Audit Log & Live Activity Tracker' : 'Rikodin Kulawa da Canje-canje'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Real-time backup secure</span>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto">
            {production.slice(0, 1).map((b) => (
              <p key={b.id} className="py-1 border-b border-slate-700/30">
                <span className="text-emerald-400">[{new Date().toISOString().split('T')[0]}]</span> [Production] {b.operator} recorded batch {b.batchNumber} ({b.bagsProduced} bags produced)
              </p>
            ))}
            {sales.slice(0, 2).map((s) => (
              <p key={s.id} className="py-1 border-b border-slate-700/30">
                <span className="text-sky-400">[{s.date}]</span> [Invoice] {s.salesOfficer} issued {s.invoiceNumber} to {s.customerName} - {currency}{s.totalAmount.toLocaleString()}
              </p>
            ))}
            <p className="py-1">
              <span className="text-amber-400">[{todayStr}]</span> [System] System synced with localStorage. DB state is healthy.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
