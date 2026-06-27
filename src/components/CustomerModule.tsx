/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  History, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone
} from 'lucide-react';
import { Customer, CustomerPayment, UserRole } from '../types';

interface CustomerModuleProps {
  customers: Customer[];
  payments: CustomerPayment[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onRecordPayment: (customerId: string, amount: number, method: 'Cash' | 'Transfer' | 'POS', reference: string) => void;
}

export default function CustomerModule({
  customers,
  payments,
  activeRole,
  currency,
  language,
  onAddCustomer,
  onRecordPayment
}: CustomerModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Customer Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(100000);

  // Record Payment Form fields
  const [payCustomerId, setPayCustomerId] = useState(customers[0]?.id || '');
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Transfer' | 'POS'>('Cash');
  const [payReference, setPayReference] = useState('');

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Sales Officer' || activeRole === 'Cashier' || activeRole === 'Sales & Cashier Officer';

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your role does not permit creating clients.');
      return;
    }
    onAddCustomer({
      name,
      phone,
      address,
      businessName,
      creditLimit,
      outstandingBalance: 0
    });

    // Reset Form
    setShowAddForm(false);
    setName('');
    setPhone('');
    setAddress('');
    setBusinessName('');
    setCreditLimit(100000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your role does not permit logging ledger payments.');
      return;
    }

    const ref = payReference || `REF-${Math.floor(100000 + Math.random() * 900000)}`;

    onRecordPayment(
      payCustomerId,
      payAmount,
      payMethod,
      ref
    );

    // Reset Form
    setShowPaymentForm(false);
    setPayReference('');
    setPayAmount(10000);
  };

  const filteredCustomers = customers.filter(c => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6" id="customer-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400 w-5 h-5" />
            {language === 'en' ? 'Client Ledgers & Creditors Book' : 'Abokan Ciniki da Rikodin Bashi'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Store addresses, customize client credit limits, and record incoming ledger payments.' 
              : 'Gudanar da adireshin masu sayen ruwa, saita iyakar bashi, da rikodin biya.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canWrite && (
            <>
              <button
                onClick={() => {
                  setShowPaymentForm(true);
                  setShowAddForm(false);
                }}
                className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-indigo-700/50 transition-all cursor-pointer shadow-sm flex-1 sm:flex-initial text-center justify-center flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                {language === 'en' ? 'Log Ledger Payment' : 'Shigar da Biyan Kudi'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setShowPaymentForm(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex-1 sm:flex-initial text-center justify-center flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {language === 'en' ? 'Register New Client' : 'Sabuwar Abokin Ciniki'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <form onSubmit={handleCustomerSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-700/60 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Client Onboarding Portal</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Fill in credentials and set credit ceilings for proper bookkeeping.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Owner Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alhaji Musa Danladi"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Business / Store Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Musa & Sons Water Depot"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Phone Contact</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 111 2222"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Credit Limit Ceiling (₦)</label>
              <input
                type="number"
                min="0"
                required
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                placeholder="100000"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Delivery Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plot 5, Zoo Road, Kano"
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
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Register Client
            </button>
          </div>
        </form>
      )}

      {/* Record Payment Form */}
      {showPaymentForm && (
        <form onSubmit={handlePaymentSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-700/60 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Record Incoming Outstanding payment</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Deduct payments from client ledgers to restore their credit lines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Select Debtor</label>
              <select
                value={payCustomerId}
                onChange={(e) => setPayCustomerId(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} - Due: {currency}{c.outstandingBalance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Amount Received (₦)</label>
              <input
                type="number"
                min="100"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Payment Gateway</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Transfer">Bank Transfer</option>
                <option value="POS">POS Machine</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Receipt / Transaction Reference</label>
              <input
                type="text"
                value={payReference}
                onChange={(e) => setPayReference(e.target.value)}
                placeholder="e.g. TXN-10492579"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Save Ledger Entry
            </button>
          </div>
        </form>
      )}

      {/* Main ledger list and side stats columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Registered Client Ledger</h3>
            <div className="relative w-48">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Filter clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded-lg py-1 pl-8 pr-2 text-xs focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredCustomers.map(c => {
              const exceedsLimit = c.outstandingBalance >= c.creditLimit;
              const ratio = Math.min(100, (c.outstandingBalance / c.creditLimit) * 100);

              return (
                <div key={c.id} className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-white block">{c.businessName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-slate-500" /> {c.name} • {c.phone}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Outstanding Debt</span>
                      <span className={`text-sm font-bold block ${c.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {currency}{c.outstandingBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Credit Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                      <span>Debt Utilization Ratio ({ratio.toFixed(0)}%)</span>
                      <span className="flex items-center gap-1">
                        Credit Cap: {currency}{c.creditLimit.toLocaleString()}
                        {exceedsLimit && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${exceedsLimit ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Location & Details */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <span className="flex items-center gap-1 text-slate-500"><MapPin className="w-3 h-3 text-slate-500" /> {c.address}</span>
                    <span className="text-slate-500 font-semibold font-mono">Registered {c.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incoming Ledger Payments history (1 col) */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
            <History className="w-3.5 h-3.5 text-indigo-400" /> Ledger Payments Log
          </h3>
          <div className="space-y-3.5 max-h-96 overflow-y-auto">
            {payments.map(p => (
              <div key={p.id} className="text-xs border-b border-slate-700/30 pb-2.5 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center font-bold text-slate-200">
                  <span className="truncate max-w-[120px]">{p.customerName}</span>
                  <span className="text-emerald-400 font-extrabold">+{currency}{p.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
                  <span>{p.paymentMethod} • {p.reference}</span>
                  <span>{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
