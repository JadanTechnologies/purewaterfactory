/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Printer, 
  Share2, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Send,
  MessageSquare
} from 'lucide-react';
import { Sale, Customer, UserRole } from '../types';

interface SalesModuleProps {
  sales: Sale[];
  customers: Customer[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
}

export default function SalesModule({
  sales,
  customers,
  activeRole,
  currency,
  language,
  onAddSale
}: SalesModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected Invoice for printing/receipt modal
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  
  // Form fields
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [quantityBags, setQuantityBags] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>(200);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'POS' | 'Credit'>('Cash');
  const [status, setStatus] = useState<'Paid' | 'Partially Paid' | 'Unpaid'>('Paid');
  const [amountPaid, setAmountPaid] = useState<number>(20000); // 100 * 200 = 20000
  const [remarks, setRemarks] = useState('');

  // Alerts / Simulations
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Sales Officer';

  const totalAmount = quantityBags * unitPrice;

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
  };

  const handleQuantityOrPriceChange = (qty: number, price: number) => {
    setQuantityBags(qty);
    setUnitPrice(price);
    const total = qty * price;
    setAmountPaid(total); // default full paid
  };

  const handlePaymentMethodChange = (method: 'Cash' | 'Transfer' | 'POS' | 'Credit') => {
    setPaymentMethod(method);
    if (method === 'Credit') {
      setStatus('Unpaid');
      setAmountPaid(0);
    } else {
      setStatus('Paid');
      setAmountPaid(totalAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording sales.');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    // Check Credit Limit Warning
    if (paymentMethod === 'Credit' && (customer.outstandingBalance + totalAmount) > customer.creditLimit) {
      const confirmExceed = window.confirm(`Warning: This sale will put customer outstanding balance to ${currency}${(customer.outstandingBalance + totalAmount).toLocaleString()}, which exceeds their credit limit of ${currency}${customer.creditLimit.toLocaleString()}. Proceed anyway?`);
      if (!confirmExceed) return;
    }

    const today = new Date().toISOString().split('T')[0];
    const invoiceNumber = `INV-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newSale: Omit<Sale, 'id'> = {
      invoiceNumber,
      date: today,
      customerId: selectedCustomerId,
      customerName: customer.name,
      salesOfficer: activeRole, // using role as name for simulation
      quantityBags,
      unitPrice,
      totalAmount,
      paymentMethod,
      status,
      amountPaid: status === 'Paid' ? totalAmount : (status === 'Unpaid' ? 0 : amountPaid),
      remarks
    };

    onAddSale(newSale);

    // Reset Form
    setShowAddForm(false);
    setRemarks('');
    setQuantityBags(100);
    setUnitPrice(200);
    setPaymentMethod('Cash');
    setStatus('Paid');
  };

  const filteredSales = sales.filter(s => {
    return (
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.salesOfficer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const triggerWhatsappSimulation = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  const triggerSmsSimulation = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  return (
    <div className="space-y-6" id="sales-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <TrendingUp className="text-emerald-400 w-5 h-5" />
            {language === 'en' ? 'Invoicing & Sales Book' : 'Rubutun Kudin Shiga da Tallace-tallace'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Issue immediate invoices, manage payment terms, check customer credit limits.' 
              : 'Fitarda daftarin kudi ga masu sayen ruwa, duba bashi, da lissafin tallace-tallace.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canWrite && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full sm:w-auto uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              {language === 'en' ? 'New Invoice Creation' : 'Sabuwar Invoice'}
            </button>
          )}
        </div>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Invoice Generation Form' : 'Daftarin Samar da Siyarwa'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'en' ? 'Always verify outstanding credit history prior to dispatching cargo.' : 'Koyaushe duba matsayin bashin abokin ciniki kafin aika kaya.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Customer Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                {language === 'en' ? 'Target Customer' : 'Abokin Ciniki'}
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.name}) - Balance: {currency}{c.outstandingBalance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Bags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                {language === 'en' ? 'Quantity (Bags of Pure Water)' : 'Adadin Jaka'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantityBags}
                onChange={(e) => handleQuantityOrPriceChange(Number(e.target.value), unitPrice)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                {language === 'en' ? 'Unit Selling Price (₦)' : 'Farashin Jaka Guda (₦)'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={unitPrice}
                onChange={(e) => handleQuantityOrPriceChange(quantityBags, Number(e.target.value))}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">{language === 'en' ? 'Payment Method' : 'Hanyar Biyan Kudi'}</label>
              <select
                value={paymentMethod}
                onChange={(e) => handlePaymentMethodChange(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Cash">Cash (Kudi Hannu)</option>
                <option value="Transfer">Bank Transfer (Tura Kudi ta Bank)</option>
                <option value="POS">POS Machine</option>
                <option value="Credit">Credit Term (Bashi)</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">{language === 'en' ? 'Payment Status' : 'Matsayin Biya'}</label>
              <select
                value={status}
                disabled={paymentMethod === 'Credit'}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
              >
                <option value="Paid">Fully Paid (An biya duka)</option>
                <option value="Partially Paid">Partially Paid (An biya rabi)</option>
                <option value="Unpaid">Unpaid (Ba a biya ba)</option>
              </select>
            </div>

            {/* Partial Amount Paid (Only shown if status is Partially Paid) */}
            {status === 'Partially Paid' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-rose-400">Amount Paid (₦)</label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount - 1}
                  required
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full bg-slate-900 text-rose-300 border border-rose-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>
            )}

          </div>

          {/* Real-time Invoice Calculations Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Billing summary</span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {quantityBags} bags × {currency}{unitPrice} each.
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-bold text-emerald-400 tracking-tight flex items-center gap-1">
                {currency}{totalAmount.toLocaleString()}
              </span>
              {paymentMethod === 'Credit' && (
                <span className="text-[10px] text-rose-400 block font-bold uppercase mt-0.5">Will be added to client ledger</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">{language === 'en' ? 'Invoice Remarks' : 'Bayani akan Invoice'}</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Needs delivery by 4 PM. Authorized credit terms applied."
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Generate & Save Invoice
            </button>
          </div>
        </form>
      )}

      {/* Invoice Grid */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-2 border-b border-slate-700/50">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            {language === 'en' ? 'Sales Invoices & Transactions' : 'Invoices da Tallace-tallace'}
          </h3>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by customer, invoice...' : 'Nemo ta hanyar suna ko lamba...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 text-white border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 w-full"
            />
          </div>
        </div>

        {/* Responsive Invoice List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-display font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Sales Officer</th>
                <th className="py-3 px-3">Qty Sold</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/30 text-slate-300">
                  <td className="py-3 px-3 font-mono text-slate-400">{s.date}</td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-400">{s.invoiceNumber}</td>
                  <td className="py-3 px-3 text-white font-display font-medium">{s.customerName}</td>
                  <td className="py-3 px-3 font-display">{s.salesOfficer}</td>
                  <td className="py-3 px-3 font-mono">{s.quantityBags} bags</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">₦{s.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-display font-bold uppercase tracking-wider ${
                      s.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      s.status === 'Partially Paid' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {s.paymentMethod} - {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedInvoice(s);
                        setWhatsappSent(false);
                        setSmsSent(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sky-400 cursor-pointer inline-flex items-center gap-1 text-[11px] font-display font-bold uppercase tracking-wider"
                    >
                      <Printer className="w-3.5 h-3.5" /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Invoice Print & Simulated Sharing Modal */}
      {selectedInvoice && (
        <>
          {/* Hidden POS Thermal Receipt for Browser window.print() */}
          <div id="pos-print-section" className="hidden" style={{ color: '#000', backgroundColor: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 3px 0', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                NILE PREMIUM WATER
              </h2>
              <p style={{ fontSize: '9px', margin: '2px 0', fontFamily: 'monospace' }}>Plot 42, Challawa Ind. Estate, Kano</p>
              <p style={{ fontSize: '9px', margin: '2px 0', fontFamily: 'monospace' }}>Tel: +234 803 123 4567 | +234 905 987 6543</p>
              <p style={{ fontSize: '10px', fontWeight: 'bold', borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '5px 0', margin: '10px 0 5px 0', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                * TRANSACTION INVOICE *
              </p>
            </div>

            <div style={{ fontSize: '9.5px', marginBottom: '10px', lineHeight: '1.4', fontFamily: 'monospace' }}>
              <div><strong>INVOICE NO :</strong> {selectedInvoice.invoiceNumber}</div>
              <div><strong>DATE/TIME  :</strong> {selectedInvoice.date} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
              <div><strong>CLIENT     :</strong> {selectedInvoice.customerName.toUpperCase()}</div>
              <div><strong>CASHIER    :</strong> {selectedInvoice.salesOfficer.toUpperCase()}</div>
              <div><strong>PAY METHOD :</strong> {selectedInvoice.paymentMethod.toUpperCase()}</div>
              <div><strong>STATUS     :</strong> {selectedInvoice.status.toUpperCase()}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px', margin: '10px 0', fontFamily: 'monospace' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000', fontWeight: 'bold' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '4px' }}>ITEM DESCRIPTION</th>
                  <th style={{ textAlign: 'center', paddingBottom: '4px' }}>QTY</th>
                  <th style={{ textAlign: 'right', paddingBottom: '4px' }}>PRICE</th>
                  <th style={{ textAlign: 'right', paddingBottom: '4px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px dashed #000' }}>
                  <td style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                    PURE WATER BAGS<br />
                    <span style={{ fontSize: '8px', color: '#333' }}>20 Sachet (0.5L)</span>
                  </td>
                  <td style={{ textAlign: 'center', paddingTop: '6px', paddingBottom: '6px' }}>{selectedInvoice.quantityBags}</td>
                  <td style={{ textAlign: 'right', paddingTop: '6px', paddingBottom: '6px' }}>₦{selectedInvoice.unitPrice}</td>
                  <td style={{ textAlign: 'right', paddingTop: '6px', paddingBottom: '6px' }}>₦{selectedInvoice.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '10px', lineHeight: '1.5', fontFamily: 'monospace' }}>
              <div>SUBTOTAL: ₦{selectedInvoice.totalAmount.toLocaleString()}</div>
              <div>VAT (7.5%): INCLUDED</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', borderTop: '1px dashed #000', paddingTop: '4px', marginTop: '4px' }}>
                TOTAL AMOUNT: ₦{selectedInvoice.totalAmount.toLocaleString()}
              </div>
              <div>AMOUNT PAID: ₦{selectedInvoice.amountPaid.toLocaleString()}</div>
              {selectedInvoice.totalAmount - selectedInvoice.amountPaid > 0 ? (
                <div style={{ color: '#000', fontWeight: 'bold', borderTop: '1px dashed #000', paddingTop: '2px', marginTop: '2px' }}>
                  BALANCE DUE: ₦{(selectedInvoice.totalAmount - selectedInvoice.amountPaid).toLocaleString()}
                </div>
              ) : (
                <div style={{ fontWeight: 'bold', color: 'green', borderTop: '1px dashed #000', paddingTop: '2px', marginTop: '2px' }}>
                  *** PAID IN FULL ***
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px dashed #000', marginTop: '15px', paddingTop: '10px', fontSize: '9px', textAlign: 'center', lineHeight: '1.4', fontFamily: 'monospace' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>CUSTOMER SIGNATURE: _________________</p>
              <p style={{ margin: '4px 0 2px 0' }}>Thank you for doing business with us!</p>
              <p style={{ margin: '2px 0', fontSize: '8px', color: '#555' }}>Water once delivered in good condition is NOT returnable.</p>
              <p style={{ margin: '8px 0', fontSize: '8px', letterSpacing: '2px' }}>
                ||||| | ||||| || |||| ||||| ||||<br />
                *{selectedInvoice.invoiceNumber}*
              </p>
              <p style={{ marginTop: '6px', fontSize: '7.5px', color: '#777' }}>PWFMS Enterprise Cloud Run v1.4</p>
            </div>
          </div>

          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in scale-in duration-150 flex flex-col md:flex-row gap-6">
              
              {/* Left Column: Visual Print Receipt layout */}
              <div className="flex-1 bg-white p-5 rounded-xl shadow-inner text-slate-900 font-mono text-[11px] leading-tight space-y-4 border-b-8 border-dashed border-slate-300" id="thermal-receipt-layout">
                <div className="text-center border-b border-dashed border-slate-400 pb-3">
                  <span className="font-extrabold text-xs block tracking-widest text-slate-950">NILE PREMIUM WATER</span>
                  <span className="text-[9px] block text-slate-600 mt-1">Plot 42, Challawa Ind. Estate, Kano</span>
                  <span className="text-[9px] block text-slate-600">Tel: +234 803 123 4567</span>
                  <span className="text-[10px] font-bold block mt-2 border border-slate-800 py-0.5 rounded uppercase">TAX INVOICE / RECEIPT</span>
                </div>

                <div className="space-y-1 text-slate-800 border-b border-dashed border-slate-300 pb-2">
                  <div><strong>Invoice No:</strong> <span className="text-slate-950 font-bold">{selectedInvoice.invoiceNumber}</span></div>
                  <div><strong>Date/Time:</strong> {selectedInvoice.date} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div><strong>Customer:</strong> {selectedInvoice.customerName}</div>
                  <div><strong>Cashier:</strong> {selectedInvoice.salesOfficer}</div>
                  <div><strong>Pay Method:</strong> {selectedInvoice.paymentMethod}</div>
                </div>

                <table className="w-full text-left border-b border-dashed border-slate-300 py-1">
                  <thead>
                    <tr className="font-extrabold text-slate-950 border-b border-dashed border-slate-300 pb-1 text-[10px]">
                      <th className="pb-1">Item Description</th>
                      <th className="text-center pb-1">Qty</th>
                      <th className="text-right pb-1">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="py-1">
                      <td className="truncate max-w-[120px] pt-1">Pure Water Bags (20 Sachet)</td>
                      <td className="text-center pt-1">{selectedInvoice.quantityBags}</td>
                      <td className="text-right pt-1">₦{selectedInvoice.unitPrice}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="space-y-1 text-right text-slate-800">
                  <div>Subtotal: ₦{selectedInvoice.totalAmount.toLocaleString()}</div>
                  <div>VAT (7.5%): Included</div>
                  <div className="text-xs font-extrabold pt-1 border-t border-dashed border-slate-300 text-emerald-800">
                    TOTAL BILL: ₦{selectedInvoice.totalAmount.toLocaleString()}
                  </div>
                  <div>Paid: ₦{selectedInvoice.amountPaid.toLocaleString()}</div>
                  {selectedInvoice.totalAmount - selectedInvoice.amountPaid > 0 ? (
                    <div className="text-[10px] text-red-600 font-extrabold border-t border-dashed border-slate-300 pt-1">
                      Balance Due: ₦{(selectedInvoice.totalAmount - selectedInvoice.amountPaid).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-[10px] text-emerald-600 font-extrabold border-t border-dashed border-slate-300 pt-1 text-right">
                      *** PAID IN FULL ***
                    </div>
                  )}
                </div>

                <div className="text-center border-t border-dashed border-slate-300 pt-3">
                  <span className="font-bold block uppercase text-[10px] text-slate-950">Thank you for your patronage!</span>
                  <p className="text-[8px] text-slate-500 mt-1">Water once delivered in good condition is not returnable.</p>
                  <p className="mt-2 text-[8px] tracking-widest text-slate-400 font-sans">
                    |||||| | |||||| || | ||||<br />
                    *{selectedInvoice.invoiceNumber}*
                  </p>
                </div>
              </div>

              {/* Right Column: Sharing & Notification Simulation Panels */}
              <div className="md:w-48 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2">Print & Dispatch</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                    Send commands to wireless thermal printer or dispatch digital invoice options directly.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-[10.5px] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-md"
                    >
                      <Printer className="w-4 h-4" /> Print Thermal POS
                    </button>

                    <button
                      onClick={triggerWhatsappSimulation}
                      className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-display font-bold text-[10px] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Share
                    </button>

                    <button
                      onClick={triggerSmsSimulation}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-display font-bold text-[10px] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                    >
                      <Send className="w-3.5 h-3.5" /> SMS Notify
                    </button>
                  </div>
                </div>

                {/* Simulation feedback banner */}
                <div className="space-y-2">
                  {whatsappSent && (
                    <div className="bg-green-950/40 border border-green-800 text-green-400 p-2.5 rounded-xl text-[10px] animate-pulse font-sans">
                      ✅ WhatsApp dispatch initiated! Customer notified.
                    </div>
                  )}
                  {smsSent && (
                    <div className="bg-sky-950/40 border border-sky-800 text-sky-400 p-2.5 rounded-xl text-[10px] animate-pulse font-sans">
                      ✅ SMS billing notification dispatched to phone.
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="w-full py-2.5 bg-slate-900 border border-slate-700 text-slate-300 font-display font-bold text-xs rounded-xl cursor-pointer text-center uppercase tracking-wider"
                  >
                    Close Receipt
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}
