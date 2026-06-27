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
  AlertTriangle,
  Shield,
  Key,
  Users,
  Plus,
  Trash2,
  Edit,
  UserCheck,
  Check,
  X,
  Lock,
  LockKeyhole
} from 'lucide-react';
import { FactorySettings, UserRole, UserAccount, CustomRole } from '../types';

interface SettingsModuleProps {
  settings: FactorySettings;
  activeRole: string;
  language: 'en' | 'ha';
  onSaveSettings: (settings: FactorySettings) => void;
  onResetDatabase: () => void;
  onExportDatabase: () => string;
  onImportDatabase: (jsonString: string) => boolean;
  users?: UserAccount[];
  roles?: CustomRole[];
  onSaveUser?: (user: UserAccount) => void;
  onDeleteUser?: (id: string) => void;
  onSaveRole?: (role: CustomRole) => void;
  onDeleteRole?: (id: string) => void;
}

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard Overview', desc: 'Main factory performance summary and dynamic digital clock' },
  { id: 'production', label: 'Production Log', desc: 'Record water batches and nylon roll conversion logs' },
  { id: 'inventory', label: 'Inventory & Nylon Stock', desc: 'Manage raw materials, finished goods bags, and stocks' },
  { id: 'sales', label: 'Invoices & POS Sales', desc: 'Record retail sales, print thermal POS invoices (80mm)' },
  { id: 'customers', label: 'Customer Balances & Ledgers', desc: 'Track credit limits, wholesale deposits, and statements' },
  { id: 'returns', label: 'Returned Water Log', desc: 'Manage burst bags, replacements, and dynamic re-stocking' },
  { id: 'leakages', label: 'Leakages & Damages', desc: 'Log water purification losses and nylon tearing sheets' },
  { id: 'expenses', label: 'Expenses & Payments', desc: 'Manage salaries, fuel, electricity, and water chemicals' },
  { id: 'staff', label: 'Staff Attendance & Wages', desc: 'Track clock-ins, daily payroll logs, and shift schedules' },
  { id: 'deliveries', label: 'Dispatch & Deliveries', desc: 'Log dispatch logs, truck assignments, and customer notes' },
  { id: 'financials', label: 'Cash Flow & Accounts', desc: 'Track profit calculations, cash-at-hand, and banking logs' },
  { id: 'reports', label: 'Production & Sales Reports', desc: 'Visualize factory capacity charts and sales trends' },
  { id: 'settings', label: 'Factory Settings', desc: 'Access VAT rate, backup files, and system privileges' }
];

export default function SettingsModule({
  settings,
  activeRole,
  language,
  onSaveSettings,
  onResetDatabase,
  onExportDatabase,
  onImportDatabase,
  users = [],
  roles = [],
  onSaveUser,
  onDeleteUser,
  onSaveRole,
  onDeleteRole
}: SettingsModuleProps) {
  
  // Tabs management
  const [activeSubTab, setActiveSubTab] = useState<'parameters' | 'roles' | 'users'>('parameters');

  // Parameters form state copy
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
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');

  // Custom roles editor state
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);

  // User Accounts state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);

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
      language: activeLang,
      logoUrl
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

  // Roles CRUD logic
  const handleOpenRoleForm = (role?: CustomRole) => {
    if (role) {
      setEditingRoleId(role.id);
      setRoleName(role.name);
      setSelectedModules(role.allowedModules);
    } else {
      setEditingRoleId(null);
      setRoleName('');
      setSelectedModules(['dashboard']); // Dashboard is default allowed
    }
    setShowRoleForm(true);
  };

  const handleSaveRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const id = editingRoleId || roleName.trim();
    if (onSaveRole) {
      onSaveRole({
        id,
        name: roleName.trim(),
        allowedModules: selectedModules
      });
      alert('Custom role saved successfully.');
      setShowRoleForm(false);
    }
  };

  const handleDeleteRoleClick = (id: string) => {
    if (id === 'Administrator') {
      alert('Cannot delete the root Administrator role.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the "${id}" role? All users assigned this role will lose permissions.`)) {
      if (onDeleteRole) {
        onDeleteRole(id);
        alert('Role removed successfully.');
      }
    }
  };

  const toggleModuleSelection = (modId: string) => {
    if (selectedModules.includes(modId)) {
      if (modId === 'dashboard') return; // Dashboard is essential
      setSelectedModules(selectedModules.filter(m => m !== modId));
    } else {
      setSelectedModules([...selectedModules, modId]);
    }
  };

  // Users CRUD logic
  const handleOpenUserForm = (user?: UserAccount) => {
    if (user) {
      setEditingUserId(user.id);
      setUserFullName(user.name);
      setUserEmail(user.email);
      setUserPhone(user.phone || '');
      setUserRole(user.role);
      setUserPassword(user.password || 'password123');
    } else {
      setEditingUserId(null);
      setUserFullName('');
      setUserEmail('');
      setUserPhone('');
      setUserRole(roles[0]?.id || 'Administrator');
      setUserPassword('password123');
    }
    setShowUserForm(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFullName.trim() || !userEmail.trim()) return;

    const id = editingUserId || 'usr-' + Date.now();
    if (onSaveUser) {
      onSaveUser({
        id,
        name: userFullName.trim(),
        email: userEmail.trim(),
        phone: userPhone.trim(),
        role: userRole,
        password: userPassword
      });
      alert('User credentials updated successfully.');
      setShowUserForm(false);
    }
  };

  const handleDeleteUserClick = (id: string) => {
    if (id === 'usr-1') {
      alert('Cannot delete the primary root system administrator.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user account? This cannot be undone.')) {
      if (onDeleteUser) {
        onDeleteUser(id);
        alert('User removed from database successfully.');
      }
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
              ? 'Configure business logo cards, roles permission parameters, and factory settings.' 
              : 'Gudanar da sunan masana\'anta, iyakar kayayyaki, duba rabe-raben aiki.'}
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector (Admin Only!) */}
      {canWrite && (
        <div className="flex border-b border-slate-700 gap-1 overflow-x-auto">
          <button
            onClick={() => { setActiveSubTab('parameters'); setShowRoleForm(false); setShowUserForm(false); }}
            className={`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeSubTab === 'parameters'
                ? 'border-sky-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              Factory Parameters
            </span>
          </button>
          <button
            onClick={() => { setActiveSubTab('roles'); setShowRoleForm(false); setShowUserForm(false); }}
            className={`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeSubTab === 'roles'
                ? 'border-sky-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              Roles & Permissions
            </span>
          </button>
          <button
            onClick={() => { setActiveSubTab('users'); setShowRoleForm(false); setShowUserForm(false); }}
            className={`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeSubTab === 'users'
                ? 'border-sky-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Users & Passwords
            </span>
          </button>
        </div>
      )}

      {/* Tab content 1: General Parameters */}
      {activeSubTab === 'parameters' && (
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

              {/* Factory Logo URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Factory Logo (Image URL)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="url"
                    disabled={!canWrite}
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=200"
                    className="flex-1 w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none disabled:opacity-50"
                  />
                  {logoUrl && (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                      <img 
                        src={logoUrl} 
                        alt="Factory Logo" 
                        referrerPolicy="no-referrer" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          // Handle broken image URL gracefully
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=200';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">Provide an image URL for the factory logo (e.g. PNG, JPG, or SVG). This logo will be automatically pulled into the POS thermal print layout.</p>
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
      )}

      {/* Tab content 2: Custom Roles & Permissions */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-700/40">
            <div>
              <h3 className="text-sm font-bold text-white">Dynamic Role Privileges</h3>
              <p className="text-xs text-slate-400 mt-0.5">Define employee titles and configure custom checkboxed allowed workspaces.</p>
            </div>
            {!showRoleForm && (
              <button
                onClick={() => handleOpenRoleForm()}
                className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Custom Role
              </button>
            )}
          </div>

          {showRoleForm ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {editingRoleId ? `Edit Role: ${editingRoleId}` : 'Create New Custom Role'}
                </h4>
                <button
                  onClick={() => setShowRoleForm(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveRoleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block">Role Identifier / Designation Name</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingRoleId}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Senior Supervisor, Logistics Controller"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none disabled:opacity-50"
                  />
                  {!editingRoleId && (
                    <p className="text-[10px] text-slate-500">Designation name acts as the system identifier.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 block">Workspaces Permissions (Access-Control Matrix)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {AVAILABLE_MODULES.map((mod) => {
                      const isChecked = selectedModules.includes(mod.id);
                      const isEssential = mod.id === 'dashboard';
                      return (
                        <div
                          key={mod.id}
                          onClick={() => toggleModuleSelection(mod.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                            isChecked
                              ? 'bg-sky-950/20 border-sky-500/80 text-white'
                              : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div className="mt-0.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center text-white transition-all ${
                              isChecked ? 'bg-sky-500 border-sky-400' : 'border-slate-600 bg-slate-950'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold block">{mod.label}</span>
                            <span className="text-[10px] text-slate-500 leading-normal block">{mod.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowRoleForm(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Access Rules
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest block">Role Name</span>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-sky-400" />
                          {r.name}
                        </h4>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenRoleForm(r)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Edit role access permissions"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {r.id !== 'Administrator' && (
                          <button
                            onClick={() => handleDeleteRoleClick(r.id)}
                            className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            title="Delete role designation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Has direct privilege to check out {r.allowedModules.length} custom workspaces dashboards.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                    <span className="text-[10px] text-slate-500 block">Allowed modules:</span>
                    <div className="flex flex-wrap gap-1">
                      {r.allowedModules.map(m => (
                        <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-900 text-sky-400 rounded-md border border-slate-700/50 uppercase">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab content 3: User Accounts & Passwords */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-700/40">
            <div>
              <h3 className="text-sm font-bold text-white">Registered Workspace Accounts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage operator credentials, assign customized roles, and view/modify log-in passwords.</p>
            </div>
            {!showUserForm && (
              <button
                onClick={() => handleOpenUserForm()}
                className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add User Account
              </button>
            )}
          </div>

          {showUserForm ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {editingUserId ? `Modify Credentials: ${userFullName}` : 'Register New Employee Account'}
                </h4>
                <button
                  onClick={() => setShowUserForm(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Full Trading Name</label>
                  <input
                    type="text"
                    required
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    placeholder="e.g. Maryam Bello"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Workspace Email Address</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. maryam@nilewater.com"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Mobile Phone Line</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +234 803 000 1111"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Assigned Dynamic Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <LockKeyhole className="w-3.5 h-3.5 text-sky-400" /> Account Security Password
                  </label>
                  <input
                    type="text"
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="Set log-in password"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500">Must be securely shared with the employee for log-in.</p>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save User Credentials
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700/80 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-5 font-bold">Operator Name</th>
                      <th className="py-3.5 px-5 font-bold">Trading Email</th>
                      <th className="py-3.5 px-5 font-bold">Mobile Line</th>
                      <th className="py-3.5 px-5 font-bold">Designated Role</th>
                      <th className="py-3.5 px-5 font-bold">Security Password</th>
                      <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-700/20 transition-all">
                        <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sky-600/10 border border-sky-500/20 flex items-center justify-center font-bold text-sky-400 text-[10px]">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-300">{u.email}</td>
                        <td className="py-3.5 px-5 text-slate-300 font-mono">{u.phone || '-'}</td>
                        <td className="py-3.5 px-5">
                          <span className="px-2 py-0.5 rounded bg-sky-950/40 text-sky-400 border border-sky-500/10 font-bold uppercase text-[10px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-amber-400 font-bold tracking-widest">{u.password || 'password123'}</td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleOpenUserForm(u)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Edit user password or role"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {u.id !== 'usr-1' && (
                              <button
                                onClick={() => handleDeleteUserClick(u.id)}
                                className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                title="Revoke account access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
