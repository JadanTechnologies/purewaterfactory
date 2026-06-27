/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  Layers, 
  TrendingUp, 
  RotateCcw, 
  TrendingDown,
  DollarSign,
  Users,
  Briefcase
} from 'lucide-react';
import { 
  Sale, 
  ProductionBatch, 
  InventoryItem, 
  ReturnedWater, 
  LeakDamage, 
  Customer, 
  Expense,
  StockMovement,
  Employee
} from '../types';

interface ReportsModuleProps {
  sales: Sale[];
  production: ProductionBatch[];
  inventory: InventoryItem[];
  returns: ReturnedWater[];
  leakages: LeakDamage[];
  customers: Customer[];
  expenses: Expense[];
  movements: StockMovement[];
  employees: Employee[];
  currency: string;
  language: 'en' | 'ha';
}

type ReportType = 
  | 'Daily Production' 
  | 'Daily Sales' 
  | 'Inventory Report' 
  | 'Leak Report' 
  | 'Return Report' 
  | 'Profit & Loss' 
  | 'Expenses' 
  | 'Stock Movement'
  | 'Staff Performance';

export default function ReportsModule({
  sales,
  production,
  inventory,
  returns,
  leakages,
  customers,
  expenses,
  movements,
  employees,
  currency,
  language
}: ReportsModuleProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('Daily Production');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const reportOptions: { type: ReportType; label: string; icon: any }[] = [
    { type: 'Daily Production', label: 'Daily Production Run', icon: Layers },
    { type: 'Daily Sales', label: 'Daily Sales Ledger', icon: TrendingUp },
    { type: 'Inventory Report', label: 'Inventory Audit', icon: FileText },
    { type: 'Leak Report', label: 'Damage & Leakages', icon: TrendingDown },
    { type: 'Return Report', label: 'Customer Returns', icon: RotateCcw },
    { type: 'Profit & Loss', label: 'Profit & Loss Statement', icon: DollarSign },
    { type: 'Expenses', label: 'Expense Reports', icon: DollarSign },
    { type: 'Stock Movement', label: 'Stock Movement Audit', icon: FileText },
    { type: 'Staff Performance', label: 'Staff Performance Register', icon: Users }
  ];

  // CSV Generation & File Download Trigger
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    const fileName = `${selectedReport.toLowerCase().replace(/ /g, '_')}_${filterDate}.csv`;

    if (selectedReport === 'Daily Production') {
      headers = ['Batch Number', 'Shift', 'Nylon Type', 'Nylon Used (kg)', 'Bags Produced', 'Line', 'Operator', 'StartTime', 'EndTime'];
      const prodList = production.filter(p => p.date === filterDate);
      rows = prodList.map(p => [p.batchNumber, p.shift, p.nylonType, p.nylonUsedKg, p.bagsProduced, p.productionLine, p.operator, p.startTime, p.endTime]);
    } else if (selectedReport === 'Daily Sales') {
      headers = ['Invoice Number', 'Customer', 'Qty Sold (Bags)', 'Total Amount (₦)', 'Payment Method', 'Status', 'Amount Paid', 'Sales Officer'];
      const salesList = sales.filter(s => s.date === filterDate);
      rows = salesList.map(s => [s.invoiceNumber, s.customerName, s.quantityBags, s.totalAmount, s.paymentMethod, s.status, s.amountPaid, s.salesOfficer]);
    } else if (selectedReport === 'Inventory Report') {
      headers = ['Item Name', 'Category', 'Quantity Available', 'Unit', 'Cost Price (₦)', 'Selling Price (₦)'];
      rows = inventory.map(i => [i.name, i.category, i.quantity, i.unit, i.costPrice, i.sellingPrice || 'N/A']);
    } else if (selectedReport === 'Leak Report') {
      headers = ['Batch Number', 'Quantity (Bags)', 'Reason', 'Cost Loss Value (₦)', 'Responsible Employee'];
      const leakList = leakages.filter(l => l.date === filterDate);
      rows = leakList.map(l => [l.batchNumber, l.quantityBags, l.reason, l.lossValue, l.employeeResponsible]);
    } else if (selectedReport === 'Return Report') {
      headers = ['Customer Name', 'Invoice Ref', 'Quantity (Bags)', 'Reason', 'Received By'];
      const retList = returns.filter(r => r.date === filterDate);
      rows = retList.map(r => [r.customerName, r.invoiceNumber, r.quantityBags, r.reason, r.receivedBy]);
    } else if (selectedReport === 'Profit & Loss') {
      headers = ['Line Item', 'Credit Amount (₦)', 'Debit Amount (₦)'];
      const salesRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const expenseTotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      rows = [
        ['Operational Sales Revenue', salesRevenue, 0],
        ['Raw Material COGS & Expenses', 0, expenseTotal],
        ['Net Profit Before Tax', salesRevenue - expenseTotal, 0]
      ];
    } else if (selectedReport === 'Expenses') {
      headers = ['Expense Category', 'Voucher Description', 'Amount Paid (₦)', 'Recorded By'];
      const expList = expenses.filter(e => e.date === filterDate);
      rows = expList.map(e => [e.category, e.description, e.amount, e.recordedBy]);
    } else if (selectedReport === 'Stock Movement') {
      headers = ['Item Name', 'Date', 'Type', 'Quantity', 'Reason', 'Operator'];
      rows = movements.map(m => [m.itemName, m.date, m.type, m.quantity, m.reason, m.operator]);
    } else if (selectedReport === 'Staff Performance') {
      headers = ['Staff Name', 'Role', 'Monthly Salary (₦)', 'Joined Date', 'Performance Rating'];
      rows = employees.map(emp => [emp.name, emp.role, emp.salary, emp.joinedDate, emp.performanceRating]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('report-printable-area')?.innerHTML;
    if (printContent) {
      const newWindow = window.open('', '', 'width=800,height=800');
      newWindow?.document.write(`
        <html>
          <head>
            <title>PWFMS Printable Report</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #111; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
              .footer { text-align: center; font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  return (
    <div className="space-y-6" id="reports-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <FileText className="text-sky-400 w-5 h-5" />
            {language === 'en' ? 'Factory Report Compiler' : 'Dandalin Rahotanni'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Compile and download high-fidelity vector reports for accounting audits.' 
              : 'Zaɓi rahoton da kake buƙata don bugawa ko zazzagewa zuwa Excel.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left selector Sidebar */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-lg space-y-1.5 h-fit font-sans">
          <span className="text-[10px] font-display text-slate-400 font-bold uppercase tracking-wider pl-2 block mb-2">Available Registers</span>
          {reportOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                onClick={() => setSelectedReport(opt.type)}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl font-display font-semibold text-xs transition-all cursor-pointer flex items-center gap-2.5 uppercase tracking-wide ${
                  selectedReport === opt.type 
                    ? 'bg-sky-600 text-white shadow-md border border-sky-500/30' 
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Right Preview Pane */}
        <div className="lg:col-span-3 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
          
          {/* Filter row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {selectedReport !== 'Inventory Report' && selectedReport !== 'Profit & Loss' && selectedReport !== 'Stock Movement' && selectedReport !== 'Staff Performance' && (
                <div className="relative w-full sm:w-44">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <Filter className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-slate-900 text-white border border-slate-700 rounded-lg py-1.5 pl-8 pr-2.5 text-xs focus:outline-none w-full"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrint}
                className="py-2 px-3.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:text-white text-slate-300 font-display font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Printer className="w-3.5 h-3.5" /> Print Preview
              </button>

              <button
                onClick={handleExportCSV}
                className="py-2 px-3.5 bg-sky-600 hover:bg-sky-500 text-white font-display font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider"
              >
                <Download className="w-3.5 h-3.5" /> Export to Excel
              </button>
            </div>
          </div>

          {/* Printable Report Wrapper Container */}
          <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-5" id="report-printable-area">
            
            {/* Print Header */}
            <div className="text-center pb-5 mb-5 border-b border-slate-700/80">
              <span className="text-sm font-display font-extrabold text-white tracking-widest uppercase block">NILE PREMIUM TABLE WATER FACTORY</span>
              <span className="text-xs font-display text-sky-400 font-bold block mt-1 tracking-wide">{selectedReport.toUpperCase()} STATEMENT</span>
              {selectedReport !== 'Inventory Report' && selectedReport !== 'Profit & Loss' && selectedReport !== 'Stock Movement' && selectedReport !== 'Staff Performance' && (
                <span className="text-[10px] text-slate-400 font-mono block mt-1">Audit Filter Date: {filterDate}</span>
              )}
            </div>

            {/* DYNAMIC REPORTS COMPILING */}
            {selectedReport === 'Daily Production' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Batch Code</th>
                    <th className="py-2.5">Shift</th>
                    <th className="py-2.5">Nylon Film (kg)</th>
                    <th className="py-2.5 text-right">Bags Yield</th>
                    <th className="py-2.5">Line</th>
                    <th className="py-2.5">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {production.filter(p => p.date === filterDate).length > 0 ? (
                    production.filter(p => p.date === filterDate).map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-mono text-white">{p.batchNumber}</td>
                        <td className="py-3">{p.shift}</td>
                        <td className="py-3 font-mono">{p.nylonUsedKg} kg</td>
                        <td className="py-3 text-right font-bold text-emerald-400">{p.bagsProduced} bags</td>
                        <td className="py-3">{p.productionLine}</td>
                        <td className="py-3 text-white">{p.operator}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">No production runs recorded on this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {selectedReport === 'Daily Sales' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Invoice No</th>
                    <th className="py-2.5">Customer Name</th>
                    <th className="py-2.5">Quantity (Bags)</th>
                    <th className="py-2.5 text-right">Bill Value</th>
                    <th className="py-2.5">Payment Term</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sales.filter(s => s.date === filterDate).length > 0 ? (
                    sales.filter(s => s.date === filterDate).map(s => (
                      <tr key={s.id}>
                        <td className="py-3 font-mono text-white">{s.invoiceNumber}</td>
                        <td className="py-3 font-semibold text-white">{s.customerName}</td>
                        <td className="py-3">{s.quantityBags} bags</td>
                        <td className="py-3 text-right font-bold text-white">{currency}{s.totalAmount.toLocaleString()}</td>
                        <td className="py-3">{s.paymentMethod}</td>
                        <td className="py-3 font-bold text-emerald-400">{s.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">No sales transactions logged on this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {selectedReport === 'Inventory Report' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5">Item Class</th>
                    <th className="py-2.5">Raw Stock Weight/Qty</th>
                    <th className="py-2.5">Measurement Unit</th>
                    <th className="py-2.5 text-right">Cost Price Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold text-white">{item.name}</td>
                      <td className="py-3">{item.category}</td>
                      <td className="py-3 font-mono text-white font-semibold">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 uppercase font-semibold">{item.unit}</td>
                      <td className="py-3 text-right font-mono">{currency}{item.costPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedReport === 'Leak Report' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Batch Ref</th>
                    <th className="py-2.5">Quantity lost</th>
                    <th className="py-2.5">Loss Cause Category</th>
                    <th className="py-2.5 text-right">Est Expense Damage</th>
                    <th className="py-2.5">Responsible Personnel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leakages.filter(l => l.date === filterDate).length > 0 ? (
                    leakages.filter(l => l.date === filterDate).map(l => (
                      <tr key={l.id}>
                        <td className="py-3 font-mono text-white">{l.batchNumber}</td>
                        <td className="py-3 font-mono">{l.quantityBags} bags</td>
                        <td className="py-3 font-semibold">{l.reason}</td>
                        <td className="py-3 text-right font-bold text-rose-400">{currency}{l.lossValue.toLocaleString()}</td>
                        <td className="py-3">{l.employeeResponsible}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">No factory loss events recorded on this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {selectedReport === 'Return Report' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Client Profile</th>
                    <th className="py-2.5">Invoice Ref</th>
                    <th className="py-2.5">Qty Reclaimed</th>
                    <th className="py-2.5">Reason for return</th>
                    <th className="py-2.5">Warehouse Custodian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {returns.filter(r => r.date === filterDate).length > 0 ? (
                    returns.filter(r => r.date === filterDate).map(r => (
                      <tr key={r.id}>
                        <td className="py-3 font-semibold text-white">{r.customerName}</td>
                        <td className="py-3 font-mono">{r.invoiceNumber}</td>
                        <td className="py-3 font-mono">{r.quantityBags} bags</td>
                        <td className="py-3 font-semibold text-orange-400">{r.reason}</td>
                        <td className="py-3">{r.receivedBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">No client return vouchers compiled on this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {selectedReport === 'Profit & Loss' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400 font-mono">
                    <th className="py-2.5">Statement Line Item</th>
                    <th className="py-2.5 text-right">Inflow Amount (Credit)</th>
                    <th className="py-2.5 text-right">Outflow Amount (Debit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3 font-bold text-white">Gross Operational Siyarwa Revenue</td>
                    <td className="py-3 text-right text-emerald-400 font-mono">+{currency}{(sales.reduce((acc, curr) => acc + curr.totalAmount, 0)).toLocaleString()}</td>
                    <td className="py-3 text-right">₦0</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Operating Expense Outflows</td>
                    <td className="py-3 text-right">₦0</td>
                    <td className="py-3 text-right text-rose-400 font-mono">({currency}{(expenses.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()})</td>
                  </tr>
                  <tr className="border-t-2 border-slate-600 font-extrabold text-sm text-white bg-slate-900/40">
                    <td className="py-3">Net Operational Yield (P&L profit)</td>
                    <td colSpan={2} className="py-3 text-right text-indigo-400 font-mono font-black">
                      {currency}{(sales.reduce((acc, curr) => acc + curr.totalAmount, 0) - expenses.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {selectedReport === 'Expenses' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Voucher Description</th>
                    <th className="py-2.5 text-right">Voucher Cost</th>
                    <th className="py-2.5">Voucher Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {expenses.filter(e => e.date === filterDate).length > 0 ? (
                    expenses.filter(e => e.date === filterDate).map(e => (
                      <tr key={e.id}>
                        <td className="py-3 font-bold text-white">{e.category}</td>
                        <td className="py-3 text-slate-400">{e.description}</td>
                        <td className="py-3 text-right font-bold text-white">{currency}{e.amount.toLocaleString()}</td>
                        <td className="py-3">{e.recordedBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">No expense vouchers compiled on this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {selectedReport === 'Stock Movement' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Item Name</th>
                    <th className="py-2.5">Movement Date</th>
                    <th className="py-2.5">Movement Type</th>
                    <th className="py-2.5 text-right">Adjust Qty</th>
                    <th className="py-2.5">Voucher Reason</th>
                    <th className="py-2.5">Attendant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {movements.map(m => (
                    <tr key={m.id}>
                      <td className="py-3 font-bold text-white">{m.itemName}</td>
                      <td className="py-3 font-mono">{m.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          m.type === 'Stock In' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-white">{m.quantity}</td>
                      <td className="py-3 text-slate-400">{m.reason}</td>
                      <td className="py-3">{m.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedReport === 'Staff Performance' && (
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5">Attendant</th>
                    <th className="py-2.5">Designation</th>
                    <th className="py-2.5 text-right">Monthly Base Salary</th>
                    <th className="py-2.5">Onboarding Date</th>
                    <th className="py-2.5 text-center">Performance Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td className="py-3 font-bold text-white">{emp.name}</td>
                      <td className="py-3 text-sky-400">{emp.role}</td>
                      <td className="py-3 text-right font-mono">{currency}{emp.salary.toLocaleString()}</td>
                      <td className="py-3 font-mono">{emp.joinedDate}</td>
                      <td className="py-3 text-center text-amber-400 font-bold">{emp.performanceRating} / 5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Print Footer */}
            <div className="text-center pt-5 mt-5 border-t border-slate-700/80 text-[10px] text-slate-500 font-mono">
              <span>Verified and Compiled under secure local storage cloud protocols on {new Date().toLocaleDateString()}.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
