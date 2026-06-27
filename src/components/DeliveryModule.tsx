/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { DeliveryNote, Customer, UserRole } from '../types';

interface DeliveryModuleProps {
  deliveries: DeliveryNote[];
  customers: Customer[];
  activeRole: UserRole;
  language: 'en' | 'ha';
  onAddDelivery: (delivery: Omit<DeliveryNote, 'id'>) => void;
  onUpdateStatus: (id: string, status: 'Delivered' | 'Pending' | 'Returned') => void;
}

export default function DeliveryModule({
  deliveries,
  customers,
  activeRole,
  language,
  onAddDelivery,
  onUpdateStatus
}: DeliveryModuleProps) {
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [driverName, setDriverName] = useState('Danjuma Bala');
  const [vehicleNumber, setVehicleNumber] = useState('KAN-924-XX');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [destination, setDestination] = useState('Zoo Road Water Depot, Kano');
  const [quantityBags, setQuantityBags] = useState<number>(150);

  const canWrite = activeRole === 'Administrator' || activeRole === 'Factory Manager' || activeRole === 'Sales Officer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording shipments.');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    const today = new Date().toISOString().split('T')[0];
    const deliveryNumber = `DN-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    onAddDelivery({
      deliveryNumber,
      date: today,
      driverName,
      vehicleNumber,
      customerId: selectedCustomerId,
      customerName: customer.name,
      destination,
      quantityBags,
      status: 'Pending'
    });

    setShowForm(false);
    setQuantityBags(150);
  };

  return (
    <div className="space-y-6" id="delivery-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="text-sky-400 w-5 h-5" />
            {language === 'en' ? 'Logistics Fleet & Delivery Notes' : 'Gudanar da Kai Kayan Ruwa'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Compile vehicle dispatch lists, driver registers, destination notes, and cargo status.' 
              : 'Gudanar da motocin rarraba ruwa, sunayen direbobi, wuraren da za a kai ruwan.'}
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Compile Delivery Note' : 'Sabuwar Takardar Kai Kaya'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-slate-700/60 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Logistics Dispatch Voucher</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Driver */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" /> Driver Name
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-400" /> Vehicle License Plate
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Target Client</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.businessName}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Quantity (Bags)</label>
              <input
                type="number"
                min="1"
                required
                value={quantityBags}
                onChange={(e) => setQuantityBags(Number(e.target.value))}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

            {/* Destination */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Shipping Destination Address
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
              />
            </div>

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
              className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              Dispatch Cargo Note
            </button>
          </div>
        </form>
      )}

      {/* Deliveries Grid */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Cargo Deliveries</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveries.map(del => (
            <div key={del.id} className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 space-y-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">{del.deliveryNumber} • {del.date}</span>
                  <h4 className="text-xs font-extrabold text-white mt-1">{del.customerName}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  del.status === 'Delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                  del.status === 'Pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {del.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Driver: <strong className="text-white font-bold">{del.driverName}</strong> ({del.vehicleNumber})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-[280px]">Dest: {del.destination}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Volume: <strong className="text-white font-bold">{del.quantityBags} bags</strong> of pure water</span>
                </div>
              </div>

              {/* Status adjust controls (Only Manager / admin) */}
              {(activeRole === 'Administrator' || activeRole === 'Factory Manager') && del.status === 'Pending' && (
                <div className="flex gap-2 pt-2 border-t border-slate-800/60 justify-end">
                  <button
                    onClick={() => onUpdateStatus(del.id, 'Returned')}
                    className="py-1 px-2 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white transition-all text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Mark Returned
                  </button>
                  <button
                    onClick={() => onUpdateStatus(del.id, 'Delivered')}
                    className="py-1 px-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark Delivered
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
