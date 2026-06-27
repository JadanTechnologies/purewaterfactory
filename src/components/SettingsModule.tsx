/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Database, 
  Download, 
  Upload, 
  RefreshCcw, 
  Info, 
  Languages, 
  DollarSign, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { FactorySettings, UserRole } from '../types';

interface SettingsModuleProps {
  settings: FactorySettings;
  activeRole: UserRole;
  language: 'en' | 'ha';
  onSaveSettings: (settings: FactorySettings) => void;
  onResetDatabase: () => void;
  onExportDatabase: () => string;
  onImportDatabase: (jsonString: string) => boolean;
}

export default function SettingsModule({
  settings,
  activeRole,
  language,
  onSaveSettings,
  onResetDatabase,
  onExportDatabase,
  onImportDatabase
}: SettingsModuleProps) {
  
  // Local state copy
  const [factoryName, setFactoryName] = useState(settings.factoryName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [currency, setCurrency] = useState(settings.currency);
  const [nylonConversionRate, setNylonConversionRate] = useState(settings.nylonConversionRate);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [lowStockThresholdNylon, setLowStockThresholdNylon] = useState(settings.lowStockThresholdNylon);
  const [lowStockThresholdWater, setLowStockThresholdWater] = useState(settings.lowStockThresholdWater);
  const [activeLang, setActiveLang] = useState<'en' | 'ha'>(settings.language);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canWrite = activeRole === 'Administrator';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Only administrators are permitted to save system configurations.');
      return;
    }

    onSaveSettings({
      factoryName,
      address,
      phone,
      email,
      currency,
      nylonConversionRate,
      taxRate,
      lowStockThresholdNylon,
      lowStockThresholdWater,
      language: activeLang
    });

    alert('Factory configurations updated successfully.');
  };

  const handleBackupDownload = () => {
    const dataStr = onExportDatabase();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pwfms_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRestoreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = onImportDatabase(json);
      if (success) {
        alert('Database restored successfully from backup! Reloading page to apply structural states...');
        window.location.reload();
      } else {
        alert('Failed to parse backup JSON. Please confirm the file format is intact.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = () => {
    const confirm = window.confirm('DANGER ZONE: This will wipe all current transactions, customer statements, and production runs, reverting Nile Premium to demo data. Proceed?');
    if (confirm) {
      onResetDatabase();
      alert('Database reverted to initial states.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6" id="settings-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="text-sky-400 w-5 h-5" />
            {language === 'en' ? 'System Configuration Panel' : 'Saitun Masana\'anta'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Configure business logo cards, tax structures, and backup parameters.' 
              : 'Gudanar da sunan masana\'anta, iyakar kayayyaki kafin yin lissafi, da kiyaye bayanai.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Parameters Forms (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Enterprise Parameters</h3>
              {!canWrite && (
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Read-Only Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Factory name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Factory Trading Name</label>
                <input
                  type="text"
                  required
                  disabled={!canWrite}
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Trading Email</label>
                <input
                  type="email"
                  required
                  disabled={!canWrite}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Factory Support Line</label>
                <input
                  type="text"
                  required
                  disabled={!canWrite}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Default Currency Symbol</label>
                <input
                  type="text"
                  required
                  disabled={!canWrite}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Nylon ratio */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Conversion Rate: 1 kg Nylon = X bags</label>
                <input
                  type="number"
                  min="1"
                  required
                  disabled={!canWrite}
                  value={nylonConversionRate}
                  onChange={(e) => setNylonConversionRate(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Tax rate */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Value Added Tax (VAT %)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  disabled={!canWrite}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Threshold Nylon */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Low Nylon Stock Alert Threshold (kg)</label>
                <input
                  type="number"
                  required
                  disabled={!canWrite}
                  value={lowStockThresholdNylon}
                  onChange={(e) => setLowStockThresholdNylon(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Threshold Finished */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Low Finished Bags Stock Alert Threshold</label>
                <input
                  type="number"
                  required
                  disabled={!canWrite}
                  value={lowStockThresholdWater}
                  onChange={(e) => setLowStockThresholdWater(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Language toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-sky-400" /> Active System Language
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl">
                  <button
                    type="button"
                    disabled={!canWrite}
                    onClick={() => setActiveLang('en')}
                    className={`text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-all ${
                      activeLang === 'en' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English (UK)
                  </button>
                  <button
                    type="button"
                    disabled={!canWrite}
                    onClick={() => setActiveLang('ha')}
                    className={`text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-all ${
                      activeLang === 'ha' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hausa (Harshe)
                  </button>
                </div>
              </div>

            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Physical Address</label>
              <input
                type="text"
                required
                disabled={!canWrite}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
              />
            </div>

            {canWrite && (
              <div className="flex justify-end pt-3 border-t border-slate-700/60">
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Configuration Parameters
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Backups & Restore System (1 col) */}
        <div className="space-y-6">
          
          {/* Backups Panel */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
              <Database className="w-3.5 h-3.5 text-sky-400" /> Database Utilities
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Export the current table water factory ledger as a JSON database file, or upload a backup file to restore.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleBackupDownload}
                className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" /> Download Backup File
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRestoreUpload}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" /> Restore from File
              </button>
            </div>
          </div>

          {/* Reset factory default values */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" /> Factory Reset
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Restore the entire Nile Pure Water Factory database ledger back to the demo/starting configurations.
            </p>

            <button
              onClick={handleResetConfirm}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCcw className="w-4 h-4" /> Restore Demo Database
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
