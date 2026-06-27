/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  TrendingUp, 
  Layers, 
  Users, 
  RotateCcw, 
  TrendingDown, 
  DollarSign, 
  Truck, 
  FileText, 
  Settings, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Languages, 
  Sun, 
  Moon,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { db } from './db';
import { 
  UserRole, 
  Sale, 
  ProductionBatch, 
  InventoryItem, 
  ReturnedWater, 
  LeakDamage, 
  Customer, 
  CustomerPayment, 
  Expense, 
  Employee, 
  AttendanceRecord, 
  DeliveryNote, 
  AuditLog, 
  NotificationItem, 
  FactorySettings,
  UserAccount,
  CustomRole 
} from './types';

// Importing modules
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import ProductionModule from './components/ProductionModule';
import InventoryModule from './components/InventoryModule';
import SalesModule from './components/SalesModule';
import CustomerModule from './components/CustomerModule';
import ReturnsModule from './components/ReturnsModule';
import LeakageModule from './components/LeakageModule';
import ExpenseModule from './components/ExpenseModule';
import StaffModule from './components/StaffModule';
import DeliveryModule from './components/DeliveryModule';
import FinancialModule from './components/FinancialModule';
import ReportsModule from './components/ReportsModule';
import SettingsModule from './components/SettingsModule';
import ProfileModal from './components/ProfileModal';

// Translators
const translationDictionary: Record<'en' | 'ha', Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    production: "Production Runs",
    inventory: "Inventory Audit",
    sales: "Invoices & Sales",
    customers: "Client Ledgers",
    returns: "Customer Returns",
    leakages: "Damages & Leaks",
    expenses: "Operational Expenses",
    staff: "Human Resources",
    deliveries: "Logistics Fleet",
    financials: "Profit & Loss",
    reports: "Report Compiler",
    settings: "System Settings",
    todayProduction: "Today's Production",
    todaySales: "Today's Sales",
    todayRevenue: "Today's Revenue",
    currentStock: "Current Water Stock",
    returnedWater: "Returned Bags",
    leakedWater: "Leaked Bags",
    nylonRemaining: "Nylon film Weight",
    customersOwing: "Buyers Owing Debt",
    recentTransactions: "Recent Transactions"
  },
  ha: {
    dashboard: "Gidan Kulawa",
    production: "Tace Ruwa",
    inventory: "Kayan Ma'aji",
    sales: "Daftarin Siyarwa",
    customers: "Masu Sayen Ruwa",
    returns: "Dawo da Ruwa",
    leakages: "Asara da Zubewa",
    expenses: "Kudaden Kashewa",
    staff: "Ma'aikatanmu",
    deliveries: "Direbobi da Motoci",
    financials: "Riba da Asara",
    reports: "Duba Rahotanni",
    settings: "Saitunan Inji",
    todayProduction: "Tace Ruwa na Yau",
    todaySales: "Kasuwancin Yau",
    todayRevenue: "Kudin Shiga na Yau",
    currentStock: "Ruwan dake Ma'aji",
    returnedWater: "Ruwan da aka Dawo da shi",
    leakedWater: "Ruwan da ya Zube",
    nylonRemaining: "Nauyin Leda (kg)",
    customersOwing: "Masu Siyan Bashi",
    recentTransactions: "Kasuwancin Karshe"
  }
};

export default function App() {
  // Initialization
  useEffect(() => {
    db.init();
  }, []);

  // Auth & Roles state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const savedUsers = db.getUsers();
    return savedUsers[0] || { id: 'usr-1', name: 'Adamu Ibrahim', email: 'admin@nile.com', phone: '+234 803 111 2222', role: 'Administrator', password: 'password123' };
  });
  const [authenticatedRole, setAuthenticatedRole] = useState<string>('Administrator');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Mobile menu control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global search input state
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);

  // Notifications toggle drawer
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Database States
  const [settings, setSettings] = useState<FactorySettings>(() => db.getSettings());
  const [production, setProduction] = useState<ProductionBatch[]>(() => db.getProduction());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventory());
  const [sales, setSales] = useState<Sale[]>(() => db.getSales());
  const [customers, setCustomers] = useState<Customer[]>(() => db.getCustomers());
  const [returns, setReturns] = useState<ReturnedWater[]>(() => db.getReturns());
  const [leakages, setLeakages] = useState<LeakDamage[]>(() => db.getLeakages());
  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses());
  const [movements, setMovements] = useState(() => db.getStockMovements());
  const [payments, setPayments] = useState(() => db.getPayments());
  const [employees, setEmployees] = useState(() => db.getEmployees());
  const [attendance, setAttendance] = useState(() => db.getAttendance());
  const [deliveries, setDeliveries] = useState(() => db.getDeliveries());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => db.getNotifications());
  const [users, setUsers] = useState<UserAccount[]>(() => db.getUsers());
  const [roles, setRoles] = useState<CustomRole[]>(() => db.getRoles());

  const language = settings.language;

  // Translation function helper
  const t = (key: string) => {
    return translationDictionary[language][key] || key;
  };

  // Synchronizers to sync local state and database files
  const syncDatabaseStates = () => {
    setSettings(db.getSettings());
    setProduction(db.getProduction());
    setInventory(db.getInventory());
    setSales(db.getSales());
    setCustomers(db.getCustomers());
    setReturns(db.getReturns());
    setLeakages(db.getLeakages());
    setExpenses(db.getExpenses());
    setMovements(db.getStockMovements());
    setPayments(db.getPayments());
    setEmployees(db.getEmployees());
    setAttendance(db.getAttendance());
    setDeliveries(db.getDeliveries());
    setNotifications(db.getNotifications());
    setUsers(db.getUsers());
    setRoles(db.getRoles());
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setAuthenticatedRole(user.role);
    setIsLoggedIn(true);
    db.addAudit(user.role as any, 'Sign In', `User ${user.name} authenticated successfully.`);
    syncDatabaseStates();
  };

  const handleLogout = () => {
    db.addAudit(currentUser.role as any, 'Sign Out', `User ${currentUser.name} logged out.`);
    setAuthenticatedRole('Administrator');
    setIsLoggedIn(false);
  };

  // Actions routing under state changes
  const addProductionBatch = (batch: Omit<ProductionBatch, 'id'>) => {
    db.saveProduction(batch);
    syncDatabaseStates();
  };

  const adjustStock = (itemId: string, qtyChange: number, type: 'Stock In' | 'Stock Out' | 'Adjustment', reason: string, operator: string) => {
    db.adjustInventoryStock(itemId, qtyChange, type, reason, operator);
    syncDatabaseStates();
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    db.saveSale(sale);
    syncDatabaseStates();
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    db.saveCustomer(customer);
    syncDatabaseStates();
  };

  const recordPayment = (customerId: string, amount: number, method: 'Cash' | 'Transfer' | 'POS', reference: string) => {
    db.recordPayment(customerId, amount, method, reference, currentUser.name);
    syncDatabaseStates();
  };

  const addReturn = (ret: Omit<ReturnedWater, 'id'>) => {
    db.saveReturn(ret);
    syncDatabaseStates();
  };

  const addLeakage = (leak: Omit<LeakDamage, 'id'>) => {
    db.saveLeakDamage(leak);
    syncDatabaseStates();
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    db.saveExpense(expense);
    syncDatabaseStates();
  };

  const saveAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    db.saveAttendance(records);
    syncDatabaseStates();
  };

  const addEmployee = (emp: Employee) => {
    db.saveEmployee(emp);
    syncDatabaseStates();
  };

  const addDelivery = (delivery: Omit<DeliveryNote, 'id'>) => {
    db.saveDelivery(delivery);
    syncDatabaseStates();
  };

  const updateDeliveryStatus = (id: string, status: 'Delivered' | 'Pending' | 'Returned') => {
    db.updateDeliveryStatus(id, status);
    syncDatabaseStates();
  };

  const saveSettings = (newSettings: FactorySettings) => {
    db.saveSettings(newSettings);
    syncDatabaseStates();
  };

  const handleSaveUser = (user: UserAccount) => {
    db.saveUser(user);
    // If saving/updating current user from settings, sync current user state too
    if (user.id === currentUser.id) {
      setCurrentUser(user);
    }
    syncDatabaseStates();
  };

  const handleUpdateProfile = (updatedUser: UserAccount) => {
    db.saveUser(updatedUser);
    setCurrentUser(updatedUser);
    db.addAudit(updatedUser.role as any, 'Update Profile', `User ${updatedUser.name} updated their personal profile credentials.`);
    syncDatabaseStates();
  };

  const handleDeleteUser = (id: string) => {
    db.deleteUser(id);
    syncDatabaseStates();
  };

  const handleSaveRole = (role: CustomRole) => {
    db.saveRole(role);
    syncDatabaseStates();
  };

  const handleDeleteRole = (id: string) => {
    db.deleteRole(id);
    syncDatabaseStates();
  };

  const handleNotificationsRead = () => {
    db.markNotificationsAsRead();
    setNotifications(db.getNotifications());
    setShowNotificationDrawer(false);
  };

  // Quick switch active role mock tool (makes user testing of authorization rules highly delightful)
  const handleQuickRoleSwitch = (role: string) => {
    if (authenticatedRole !== 'Administrator') {
      alert("Unauthorized: Only an Administrator can switch roles.");
      return;
    }
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      setCurrentUser({
        id: `mock-${role.toLowerCase()}`,
        name: `Demo ${role}`,
        email: `demo-${role.toLowerCase()}@nile.com`,
        phone: '',
        role: role,
        password: 'password123'
      });
    }
    db.addAudit(role as any, 'Role Hot Swap', `Swapped active workspace privilege to ${role}`);
    syncDatabaseStates();
  };

  // Navigation panel access checker
  const hasAccess = (moduleName: string): boolean => {
    const roleName = currentUser.role;
    // Check if dynamic role is defined in roles
    const matchingRole = roles.find(r => r.id === roleName);
    if (matchingRole) {
      return matchingRole.allowedModules.includes(moduleName);
    }

    if (roleName === 'Administrator') return true;
    if (roleName === 'Factory Manager') {
      return ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'deliveries', 'financials', 'reports'].includes(moduleName);
    }
    if (roleName === 'Production Officer') {
      return ['dashboard', 'production', 'leakages'].includes(moduleName);
    }
    if (roleName === 'Sales Officer') {
      return ['dashboard', 'sales', 'customers', 'returns', 'deliveries'].includes(moduleName);
    }
    if (roleName === 'Sales & Cashier Officer') {
      return ['dashboard', 'sales', 'customers', 'returns', 'deliveries', 'expenses', 'financials'].includes(moduleName);
    }
    if (roleName === 'Store Keeper') {
      return ['dashboard', 'inventory'].includes(moduleName);
    }
    if (roleName === 'Cashier') {
      return ['dashboard', 'customers', 'expenses', 'financials'].includes(moduleName);
    }
    return false;
  };

  const navigationItems = [
    { name: 'dashboard', label: t('dashboard'), icon: Layers },
    { name: 'production', label: t('production'), icon: Droplet },
    { name: 'inventory', label: t('inventory'), icon: Layers },
    { name: 'sales', label: t('sales'), icon: TrendingUp },
    { name: 'customers', label: t('customers'), icon: Users },
    { name: 'returns', label: t('returns'), icon: RotateCcw },
    { name: 'leakages', label: t('leakages'), icon: TrendingDown },
    { name: 'expenses', label: t('expenses'), icon: DollarSign },
    { name: 'staff', label: t('staff'), icon: Users },
    { name: 'deliveries', label: t('deliveries'), icon: Truck },
    { name: 'financials', label: t('financials'), icon: DollarSign },
    { name: 'reports', label: t('reports'), icon: FileText },
    { name: 'settings', label: t('settings'), icon: Settings }
  ];

  // Perform search matches across customers, invoices, batches
  const performSearchQuery = () => {
    if (!globalSearch) return [];
    const query = globalSearch.toLowerCase();
    const results: Array<{ type: string; title: string; subtitle: string; actionModule: string }> = [];

    // Search Customers
    customers.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.businessName.toLowerCase().includes(query)) {
        results.push({ type: 'Client', title: c.businessName, subtitle: `Owner: ${c.name} (${c.phone})`, actionModule: 'customers' });
      }
    });

    // Search Sales Invoices
    sales.forEach(s => {
      if (s.invoiceNumber.toLowerCase().includes(query) || s.customerName.toLowerCase().includes(query)) {
        results.push({ type: 'Sales Invoice', title: s.invoiceNumber, subtitle: `${s.customerName} - ₦${s.totalAmount.toLocaleString()}`, actionModule: 'sales' });
      }
    });

    // Search Production Batches
    production.forEach(b => {
      if (b.batchNumber.toLowerCase().includes(query) || b.operator.toLowerCase().includes(query)) {
        results.push({ type: 'Production Batch', title: b.batchNumber, subtitle: `Operator: ${b.operator} - ${b.bagsProduced} bags`, actionModule: 'production' });
      }
    });

    return results;
  };

  const searchResults = performSearchQuery();

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-100 flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Dynamic Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
            className="md:hidden p-1.5 text-slate-400 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Droplet className="w-6 h-6 text-sky-400 fill-sky-500/20" />
            <span className="font-extrabold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              NILE PURE WATER
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:block relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search customers, invoices, batches..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setShowGlobalSearchResults(true);
            }}
            onFocus={() => setShowGlobalSearchResults(true)}
            className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
            id="global-search-input"
          />

          {/* Search Dropdown Panel */}
          {showGlobalSearchResults && globalSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
              <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold px-2 py-1 border-b border-slate-800">
                <span>Matches found ({searchResults.length})</span>
                <button onClick={() => setShowGlobalSearchResults(false)} className="hover:text-white">Close</button>
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (hasAccess(r.actionModule)) {
                        setActiveModule(r.actionModule);
                      } else {
                        alert('Your current active role does not have authorization to view this segment.');
                      }
                      setGlobalSearch('');
                      setShowGlobalSearchResults(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800 flex justify-between items-center mt-1 cursor-pointer"
                  >
                    <div>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded-full text-sky-400 font-bold uppercase">{r.type}</span>
                      <span className="text-xs font-bold text-white block mt-1">{r.title}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.subtitle}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-slate-500">No records found matching criteria.</p>
              )}
            </div>
          )}
        </div>

        {/* Right controls: Theme, Language, Notifications, Roles-Toggle, SignOut */}
        <div className="flex items-center gap-3">
          
          {/* Quick privilege Switch tool (DELIGHTFUL FOR WORKSPACE REVIEWING) */}
          {authenticatedRole === 'Administrator' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl max-w-lg overflow-x-auto">
              <span className="text-[10px] text-slate-500 uppercase font-bold px-2 whitespace-nowrap">Role Switch:</span>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleQuickRoleSwitch(r.id)}
                  className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    currentUser.role === r.id 
                      ? 'bg-sky-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Hot-swap to ${r.name} view privileges`}
                >
                  {r.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Theme button */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer relative"
              id="notifications-toggle-btn"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotificationDrawer && (
              <div className="absolute top-full right-0 mt-3 bg-slate-900 border border-slate-800 w-80 rounded-2xl p-4 shadow-2xl z-50 text-slate-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Factory Notifications</h4>
                  <button 
                    onClick={handleNotificationsRead}
                    className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div key={n.id} className={`text-xs p-2.5 rounded-lg border flex gap-2 ${
                      n.read ? 'bg-slate-950/20 border-slate-800 text-slate-400' : 'bg-slate-900 border-sky-500/20 text-slate-200'
                    }`}>
                      <div className="mt-0.5">
                        {n.type === 'stock' ? '⚠️' : n.type === 'debt' ? '💰' : '🔔'}
                      </div>
                      <div>
                        <span className="font-semibold block text-white">{n.title}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Sign-out dropdown */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-left hover:bg-slate-800/50 p-1 px-2 rounded-xl transition-all cursor-pointer group"
              title="Update Profile Credentials"
              id="profile-trigger-btn"
            >
              <div className="p-1.5 bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 rounded-lg transition-all">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-white block truncate max-w-[110px] group-hover:text-sky-400 transition-colors">{currentUser.name}</span>
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">{currentUser.role}</span>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl transition-all cursor-pointer"
              title="End session"
              id="logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block transition-all duration-300 ${isSidebarCollapsed ? 'w-16 p-2' : 'w-60 p-4'} bg-slate-900/60 border-r border-slate-800/80 space-y-2 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto`}>
          <div className="flex items-center justify-between mb-3 px-1">
            {!isSidebarCollapsed && <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider pl-2 block">Privilege Navigation</span>}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all mx-auto cursor-pointer flex items-center justify-center"
              title={isSidebarCollapsed ? "Expand Navigation" : "Collapse Navigation"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          {navigationItems.filter(item => hasAccess(item.name)).map(item => {
            const Icon = item.icon;
            const active = activeModule === item.name;
            const permitted = hasAccess(item.name);

            return (
              <button
                key={item.name}
                disabled={!permitted}
                onClick={() => setActiveModule(item.name)}
                className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} relative ${
                  !permitted ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  active 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
                id={`sidebar-link-${item.name}`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!permitted && !isSidebarCollapsed && <Lock className="w-3 h-3 absolute right-3 text-slate-600" />}
              </button>
            );
          })}
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden flex">
            <div className="w-64 bg-slate-950 p-4 flex flex-col justify-between h-full border-r border-slate-800">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="font-extrabold text-xs text-sky-400">NILE PURE WATER</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {navigationItems.filter(item => hasAccess(item.name)).map(item => {
                    const Icon = item.icon;
                    const active = activeModule === item.name;
                    const permitted = hasAccess(item.name);

                    return (
                      <button
                        key={item.name}
                        disabled={!permitted}
                        onClick={() => {
                          setActiveModule(item.name);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-3 relative ${
                          !permitted ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          active 
                            ? 'bg-sky-600 text-white' 
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span>{item.label}</span>
                        {!permitted && <Lock className="w-3 h-3 absolute right-3 text-slate-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Role Swapper inside menu */}
              {authenticatedRole === 'Administrator' && (
                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block pl-1">Evaluate Active Role:</span>
                  <select
                    value={currentUser.role}
                    onChange={(e) => handleQuickRoleSwitch(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Core Main Viewport Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          
          {/* Safeguard Check: Active module belongs to role */}
          {hasAccess(activeModule) ? (
            <>
              {activeModule === 'dashboard' && (
                <Dashboard
                  sales={sales}
                  production={production}
                  inventory={inventory}
                  returns={returns}
                  leakages={leakages}
                  customers={customers}
                  expenses={expenses}
                  payments={payments}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  t={t}
                  onNavigate={(mod) => setActiveModule(mod)}
                  hasAccess={hasAccess}
                />
              )}

              {activeModule === 'production' && (
                <ProductionModule
                  production={production}
                  conversionRate={settings.nylonConversionRate}
                  activeRole={currentUser.role}
                  language={language}
                  onAddBatch={addProductionBatch}
                />
              )}

              {activeModule === 'inventory' && (
                <InventoryModule
                  inventory={inventory}
                  movements={movements}
                  activeRole={currentUser.role}
                  language={language}
                  onAdjustStock={adjustStock}
                />
              )}

              {activeModule === 'sales' && (
                <SalesModule
                  sales={sales}
                  customers={customers}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  onAddSale={addSale}
                  settings={settings}
                  currentUser={currentUser}
                />
              )}

              {activeModule === 'customers' && (
                <CustomerModule
                  customers={customers}
                  payments={payments}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  onAddCustomer={addCustomer}
                  onRecordPayment={recordPayment}
                />
              )}

              {activeModule === 'returns' && (
                <ReturnsModule
                  returns={returns}
                  customers={customers}
                  activeRole={currentUser.role}
                  language={language}
                  onAddReturn={addReturn}
                />
              )}

              {activeModule === 'leakages' && (
                <LeakageModule
                  leakages={leakages}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  onAddLeakage={addLeakage}
                />
              )}

              {activeModule === 'expenses' && (
                <ExpenseModule
                  expenses={expenses}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  onAddExpense={addExpense}
                />
              )}

              {activeModule === 'staff' && (
                <StaffModule
                  employees={employees}
                  attendance={attendance}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  onSaveAttendance={saveAttendance}
                  onAddEmployee={addEmployee}
                />
              )}

              {activeModule === 'deliveries' && (
                <DeliveryModule
                  deliveries={deliveries}
                  customers={customers}
                  activeRole={currentUser.role}
                  language={language}
                  onAddDelivery={addDelivery}
                  onUpdateStatus={updateDeliveryStatus}
                />
              )}

              {activeModule === 'financials' && (
                <FinancialModule
                  sales={sales}
                  expenses={expenses}
                  payments={payments}
                  customers={customers}
                  activeRole={currentUser.role}
                  currency={settings.currency}
                  language={language}
                  hasAccess={hasAccess}
                />
              )}

              {activeModule === 'reports' && (
                <ReportsModule
                  sales={sales}
                  production={production}
                  inventory={inventory}
                  returns={returns}
                  leakages={leakages}
                  customers={customers}
                  expenses={expenses}
                  movements={movements}
                  employees={employees}
                  currency={settings.currency}
                  language={language}
                />
              )}

              {activeModule === 'settings' && (
                <SettingsModule
                  settings={settings}
                  activeRole={currentUser.role}
                  language={language}
                  onSaveSettings={saveSettings}
                  onResetDatabase={db.reset}
                  onExportDatabase={db.exportDatabase}
                  onImportDatabase={db.importDatabase}
                  users={users}
                  roles={roles}
                  onSaveUser={handleSaveUser}
                  onDeleteUser={handleDeleteUser}
                  onSaveRole={handleSaveRole}
                  onDeleteRole={handleDeleteRole}
                />
              )}
            </>
          ) : (
            /* Privileges Access Warning Panel */
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md mx-auto text-center space-y-4 shadow-xl">
              <Lock className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">Access Warning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your currently active privilege level (<strong className="text-rose-400 font-bold">{currentUser.role}</strong>) does not have authorization to view this segment. Please hot-swap roles using the panel in the header to preview.
              </p>
            </div>
          )}

        </main>

      </div>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={handleUpdateProfile}
        language={language}
      />

    </div>
  );
}
