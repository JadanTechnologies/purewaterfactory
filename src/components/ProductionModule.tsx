/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  Calendar, 
  Clock, 
  Layers, 
  Cpu, 
  User, 
  FileText, 
  CheckCircle,
  Download,
  Search,
  QrCode
} from 'lucide-react';
import { ProductionBatch, UserRole } from '../types';

interface ProductionModuleProps {
  production: ProductionBatch[];
  conversionRate: number; // e.g. 100 bags per kg of Nylon
  activeRole: UserRole;
  language: 'en' | 'ha';
  onAddBatch: (batch: Omit<ProductionBatch, 'id'>) => void;
}

export default function ProductionModule({
  production,
  conversionRate,
  activeRole,
  language,
  onAddBatch
}: ProductionModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form fields
  const [shift, setShift] = useState<'Morning' | 'Night'>('Morning');
  const [nylonType, setNylonType] = useState('Premium HD Polyethylene');
  const [nylonUsedKg, setNylonUsedKg] = useState<number>(10);
  const [productionLine, setProductionLine] = useState('Line A (Automatic)');
  const [operator, setOperator] = useState('Shehu Garba');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [remarks, setRemarks] = useState('');
  
  // Selected batch for barcode/QR previewing
  const [selectedBatchQR, setSelectedBatchQR] = useState<ProductionBatch | null>(null);

  // Read-only logic check for permissions
  const canWrite = activeRole === 'Administrator' || activeRole === 'Super Admin' || activeRole === 'Factory Manager' || activeRole === 'Production Officer';

  // Live auto calculation
  const bagsProduced = nylonUsedKg * conversionRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit recording production.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const batchNumber = `BAT-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    onAddBatch({
      batchNumber,
      date: today,
      shift,
      nylonType,
      nylonUsedKg,
      bagsProduced,
      productionLine,
      operator,
      startTime,
      endTime,
      remarks
    });

    // Reset Form
    setShowAddForm(false);
    setRemarks('');
  };

  const filteredProduction = production.filter(batch => {
    return (
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.productionLine.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportCSV = () => {
    const headers = ['Date', 'Batch No', 'Shift', 'Nylon Type', 'Nylon Used (kg)', 'Bags Produced', 'Line', 'Operator', 'Remarks'];
    const rows = filteredProduction.map(b => [
      b.date, b.batchNumber, b.shift, b.nylonType, b.nylonUsedKg, b.bagsProduced, b.productionLine, b.operator, b.remarks
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `production_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="production-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <Droplet className="text-sky-400 fill-sky-500/10 w-5 h-5" />
            {language === 'en' ? 'Daily Water Production Logging' : 'Rikodin Tace Ruwa na Kullum'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {language === 'en' 
              ? 'Calculates bag yield automatically based on Nylon raw material film usage weight.' 
              : 'Ana lissafta adadin ruwan da aka tace ta hanyar auna nauyin ledar da aka yi amfani da ita.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canWrite && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-display font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-full sm:w-auto tracking-wide"
            >
              <Plus className="w-4 h-4" />
              {language === 'en' ? 'Log Daily Shift Batch' : 'Tattara Bayanan Shift na Yau'}
            </button>
          )}
        </div>
      </div>

      {/* Production Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Production Run Entry Sheet' : 'Takardar Shigar da Bayanan Tace Ruwa'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              {language === 'en' ? 'Ensure accurate weights are measured and logged for compliance.' : 'Tabbatar an auna kuma an shigar da cikakken nauyi daidai.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
            
            {/* Shift Select */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Shift' : 'Shift'}
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as 'Morning' | 'Night')}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="Morning">{language === 'en' ? 'Morning Shift (AM)' : 'Safe (Morning)'}</option>
                <option value="Night">{language === 'en' ? 'Night Shift (PM)' : 'Dare (Night)'}</option>
              </select>
            </div>

            {/* Nylon Type */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Nylon Raw Type' : 'Irin Leda'}
              </label>
              <input
                type="text"
                required
                value={nylonType}
                onChange={(e) => setNylonType(e.target.value)}
                placeholder="e.g. Standard HD 0.25mm"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            {/* Nylon Used (kg) */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Nylon Used (kg)' : 'Nauyin Leda (kg)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={nylonUsedKg}
                  onChange={(e) => setNylonUsedKg(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 pl-3 pr-10 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[10px] font-mono text-slate-500">KG</span>
              </div>
            </div>

            {/* Production Line */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Production Line' : 'Layukan Inji'}
              </label>
              <select
                value={productionLine}
                onChange={(e) => setProductionLine(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="Line A (Automatic)">Line A (Automatic)</option>
                <option value="Line B (Semi-Auto)">Line B (Semi-Auto)</option>
                <option value="Line C (Bottling Line)">Line C (Bottling Line)</option>
              </select>
            </div>

            {/* Operator */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Operator' : 'Inji Man / Ma\'aikaci'}
              </label>
              <input
                type="text"
                required
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Operator's full name"
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Start / End Time' : 'Fara / Kare'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="08:00"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-center"
                />
                <input
                  type="text"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="16:00"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-center"
                />
              </div>
            </div>

          </div>

          {/* Dynamic Conversion Yield Calculation Widget */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">{language === 'en' ? 'Calculated Conversion Output' : 'Adadin Jaka da Za a Tace'}</span>
              <span className="text-xs text-slate-500 mt-0.5 block font-sans">
                {language === 'en' ? `Based on defined ratio: 1 kg Nylon = ${conversionRate} bags` : `Dangane da ma'auni: Leda 1kg = Jaka ${conversionRate}`}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-mono font-bold text-emerald-400 tracking-tight flex items-center gap-1">
                {bagsProduced.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider">Bags</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">({bagsProduced * 20} sachets generated)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" /> {language === 'en' ? 'Remarks / Quality Auditing Comments' : 'Karin Bayani / Nazarin Inganci'}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Water TDS checked at 120ppm. pH levels normal. Bags sealed cleanly without seam splits."
              rows={2}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-sans font-medium text-xs transition-all cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'Soke'}
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-display font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 tracking-wide"
            >
              <CheckCircle className="w-4 h-4" />
              {language === 'en' ? 'Save Production Run' : 'Ajiye Bayanan Tace Ruwan'}
            </button>
          </div>
        </form>
      )}

      {/* Production List & Search */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-2 border-b border-slate-700/50">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            {language === 'en' ? 'Production History Ledger' : 'Tarihin Aikin Tace Ruwa'}
          </h3>
          <div className="flex w-full sm:w-auto gap-2 font-sans">
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder={language === 'en' ? 'Search batch / operator...' : 'Nemo lamba ko ma\'aikaci...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40 w-full"
              />
            </div>
            <button
              onClick={exportCSV}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-display font-semibold"
              title="Export report to CSV"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-display font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">{language === 'en' ? 'Date' : 'Kwanan Wata'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Batch Number' : 'Lambar Aiki'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Shift' : 'Lokaci'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Nylon Used' : 'Ledar da aka Yi Amfani da Ita'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Bags Produced' : 'Adadin da aka Tace'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Line' : 'Layin Inji'}</th>
                <th className="py-3 px-3">{language === 'en' ? 'Operator' : 'Inji Man'}</th>
                <th className="py-3 px-3 text-center">{language === 'en' ? 'QR Code' : 'QR Lambar'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredProduction.length > 0 ? (
                filteredProduction.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/30 text-slate-300 transition-colors">
                    <td className="py-3.5 px-3 font-mono">{b.date}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-white">{b.batchNumber}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-display font-bold uppercase tracking-wider ${
                        b.shift === 'Morning' ? 'bg-sky-500/10 text-sky-400' : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {b.shift}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">{b.nylonUsedKg} kg</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{b.bagsProduced.toLocaleString()} bags</td>
                    <td className="py-3.5 px-3 font-sans">{b.productionLine}</td>
                    <td className="py-3.5 px-3 font-sans text-white">{b.operator}</td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedBatchQR(b)}
                        className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-sky-400 cursor-pointer inline-flex items-center justify-center"
                        title="Generate Batch Batch Label"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    {language === 'en' ? 'No production records match criteria' : 'Babu bayanan da kake nema a halin yanzu'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Batch Label Simulator Modal */}
      {selectedBatchQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-in scale-in duration-150">
            <div className="text-center border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{language === 'en' ? 'Batch Production Label' : 'Lambar Shaida ta Ruwa'}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{selectedBatchQR.batchNumber}</p>
            </div>

            <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center space-y-3 shadow-inner">
              
              {/* Simulated QR Code matrix using elegant nested divs */}
              <div className="w-32 h-32 bg-slate-900 rounded-lg p-2.5 flex flex-wrap gap-1 items-center justify-center">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-8 h-8 rounded-xs ${
                      (idx + 1) % 3 === 0 || idx === 0 || idx === 4 || idx === 8
                        ? 'bg-white' 
                        : 'bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>

              <div className="text-center text-slate-900">
                <span className="text-[10px] font-mono tracking-widest uppercase block font-extrabold">NILE PREMIUM WATER</span>
                <span className="text-xs font-bold block mt-1">Batch Yield: {selectedBatchQR.bagsProduced} Bags</span>
                <span className="text-[9px] text-slate-500 font-mono block">Operator: {selectedBatchQR.operator}</span>
                <span className="text-[9px] text-slate-500 font-mono block">Date: {selectedBatchQR.date}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setSelectedBatchQR(null)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                {language === 'en' ? 'Close Label' : 'Rufe'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
