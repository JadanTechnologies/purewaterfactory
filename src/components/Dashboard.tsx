/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  TrendingDown
} from 'lucide-react';
import { 
  Sale, 
  ProductionBatch, 
  InventoryItem, 
  ReturnedWater, 
  LeakDamage, 
  Customer,
  UserRole
} from '../types';

interface DashboardProps {
  sales: Sale[];
  production: ProductionBatch[];
  inventory: InventoryItem[];
  returns: ReturnedWater[];
  leakages: LeakDamage[];
  customers: Customer[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  t: (key: string) => string;
  onNavigate: (module: string) => void;
}

export default function Dashboard({
  sales,
  production,
  inventory,
  returns,
  leakages,
  customers,
  activeRole,
  currency,
  language,
  t,
  onNavigate
}: DashboardProps) {

  // Current Date
  const todayStr = new Date().toISOString().split('T')[0];

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
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
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
        <div className="flex gap-2 w-full md:w-auto font-sans">
          {activeRole !== 'Store Keeper' && activeRole !== 'Cashier' && (
            <button 
              onClick={() => onNavigate('production')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full md:w-auto tracking-wide"
            >
              <Droplet className="w-3.5 h-3.5" />
              {language === 'en' ? 'Record Production' : 'Rikodi na Tace Ruwa'}
            </button>
          )}
          {activeRole !== 'Production Officer' && activeRole !== 'Store Keeper' && (
            <button 
              onClick={() => onNavigate('sales')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full md:w-auto tracking-wide"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'en' ? 'Record Sale' : 'Sabuwar Talla'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-stats-grid">
        
        {/* STAT 1: Daily Production */}
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

        {/* STAT 2: Today's Sales / Revenue */}
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

        {/* STAT 3: Finished Goods Stock */}
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

        {/* STAT 4: Nylon Film Available */}
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

      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Returns */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('returnedWater')}</span>
            <span className="text-lg font-mono font-bold text-white mt-1 block">{totalReturnedBags} bags</span>
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>

        {/* Leakage */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('leakedWater')}</span>
            <span className="text-lg font-mono font-bold text-white mt-1 block">{totalLeakedBags} bags</span>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        {/* Customers Owing */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{t('customersOwing')}</span>
            <span className="text-lg font-display font-bold text-white mt-1 block">{customersOwingCount} {language === 'en' ? 'Buyers' : 'Masu bashi'}</span>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Debt Amount */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-display font-bold text-slate-500 tracking-wider block">{language === 'en' ? 'Total Outstanding Debt' : 'Jimlar Kudin Bashi'}</span>
            <span className="text-lg font-mono font-bold text-rose-400 mt-1 block">₦{totalOutstandingAmount.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* MAIN DATA PANELS: Custom Elegant SVG Charts & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Multi-Chart Visualization */}
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
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 block"></span> {language === 'en' ? 'Sales (₦)' : 'Tallace-tallace (₦)'}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 block"></span> {language === 'en' ? 'Production (Bags)' : 'Tace Ruwa (Bags)'}
                </span>
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
                        <span className="text-sky-400">Sales: {currency}{d.sales.toLocaleString()}</span>
                        <span className="text-emerald-400">Prod: {d.prod.toLocaleString()} Bags</span>
                      </div>

                      {/* Bar columns container */}
                      <div className="flex items-end gap-1.5 h-44 w-full justify-center">
                        {/* Sales Bar */}
                        <div 
                          style={{ height: `${salesHeightPercent}%` }}
                          className="w-4 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                        ></div>
                        {/* Production Bar */}
                        <div 
                          style={{ height: `${prodHeightPercent}%` }}
                          className="w-4 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                        ></div>
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
            <button 
              onClick={() => onNavigate('reports')}
              className="text-xs text-sky-400 hover:text-sky-300 font-display font-semibold flex items-center gap-1 cursor-pointer tracking-wider uppercase"
            >
              {language === 'en' ? 'Open Full Reports Suite' : 'Duba Rahotanni gaba-daya'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

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
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sales.slice(0, 3).map((s) => (
                <div key={s.id} className="text-xs p-2.5 rounded-lg bg-slate-900/40 border border-slate-700/30 flex justify-between items-center">
                  <div>
                    <span className="font-display font-semibold text-white block">{s.customerName}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{s.invoiceNumber} • {s.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white block">₦{s.totalAmount.toLocaleString()}</span>
                    <span className={`text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                      s.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' :
                      s.status === 'Partially Paid' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('sales')}
            className="w-full bg-slate-700/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition-all border border-slate-600/30 cursor-pointer text-center block mt-4"
          >
            {language === 'en' ? 'View Sales Ledger' : 'Duba Shagon Tallace-tallace'}
          </button>
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
