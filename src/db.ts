/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FactorySettings, 
  ProductionBatch, 
  InventoryItem, 
  StockMovement, 
  Sale, 
  Customer, 
  CustomerPayment, 
  ReturnedWater, 
  LeakDamage, 
  Expense, 
  Employee, 
  AttendanceRecord, 
  DeliveryNote, 
  AuditLog, 
  NotificationItem,
  UserRole,
  UserAccount,
  CustomRole,
  LockdownState,
  EndOfDayReport,
  Tenant
} from './types';

// Storage keys
const KEYS = {
  SETTINGS: 'pwfms_settings',
  PRODUCTION: 'pwfms_production',
  INVENTORY: 'pwfms_inventory',
  STOCK_MOVEMENTS: 'pwfms_stock_movements',
  SALES: 'pwfms_sales',
  CUSTOMERS: 'pwfms_customers',
  PAYMENTS: 'pwfms_payments',
  RETURNS: 'pwfms_returns',
  LEAKAGES: 'pwfms_leakages',
  EXPENSES: 'pwfms_expenses',
  EMPLOYEES: 'pwfms_employees',
  ATTENDANCE: 'pwfms_attendance',
  DELIVERIES: 'pwfms_deliveries',
  AUDIT_LOGS: 'pwfms_audit_logs',
  NOTIFICATIONS: 'pwfms_notifications',
  USERS: 'pwfms_users',
  ROLES: 'pwfms_roles',
  END_OF_DAY_REPORTS: 'pwfms_endofday_reports',
  TENANTS: 'pwfms_tenants'
};

const DEFAULT_SETTINGS: FactorySettings = {
  factoryName: 'Nile Premium Table Water Factory',
  address: 'Plot 42, Challawa Industrial Estate, Kano, Nigeria',
  phone: '+234 803 123 4567',
  email: 'info@niletablewater.com',
  currency: '₦',
  nylonConversionRate: 100, // 1 kg = 100 bags of 20 sachets
  taxRate: 7.5,
  lowStockThresholdNylon: 50, // kg
  lowStockThresholdWater: 500, // bags
  language: 'en',
  logoUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=200&auto=format&fit=crop'
};

const DEFAULT_USERS: UserAccount[] = [
  { id: 'usr-0', name: 'Platform Owner', username: 'super', email: 'superadmin@nile.com', phone: '+234 803 000 0000', role: 'Super Admin', password: 'super' },
  { id: 'usr-1', name: 'Adamu Ibrahim', username: 'admin', email: 'admin@nile.com', phone: '+234 803 111 2222', role: 'Administrator', password: 'admin' }
];

const DEFAULT_TENANTS: Tenant[] = [
  { id: 'tenant-1', name: 'Nile Premium Factory', businessName: 'Nile Premium Table Water', username: 'admin', email: 'admin@nile.com', phone: '+234 803 111 2222', address: 'Plot 42, Challawa Industrial Estate, Kano, Nigeria', status: 'active', paymentStatus: 'paid', plan: 'Enterprise', startDate: '2026-01-01', endDate: '2027-01-01', adminUserId: 'usr-1' }
];

const DEFAULT_ROLES: CustomRole[] = [
  { id: 'Super Admin', name: 'Super Admin', allowedModules: ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'staff', 'deliveries', 'financials', 'reports', 'settings'] },
  { id: 'Administrator', name: 'Administrator', allowedModules: ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'staff', 'deliveries', 'financials', 'reports', 'settings'] },
  { id: 'Factory Manager', name: 'Factory Manager', allowedModules: ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'deliveries', 'financials', 'reports'] },
  { id: 'Production Officer', name: 'Production Officer', allowedModules: ['dashboard', 'production', 'leakages'] },
  { id: 'Sales & Cashier Officer', name: 'Sales & Cashier Officer', allowedModules: ['dashboard', 'sales', 'customers', 'returns', 'deliveries', 'expenses', 'financials'] },
  { id: 'Sales Officer', name: 'Sales Officer', allowedModules: ['dashboard', 'sales', 'customers', 'returns', 'deliveries'] },
  { id: 'Cashier', name: 'Cashier', allowedModules: ['dashboard', 'customers', 'expenses', 'financials'] },
  { id: 'Store Keeper', name: 'Store Keeper', allowedModules: ['dashboard', 'inventory'] }
];

export const INITIAL_INVENTORY: InventoryItem[] = [];

const INITIAL_CUSTOMERS: Customer[] = [];

const INITIAL_SALES: Sale[] = [];

const INITIAL_PRODUCTION: ProductionBatch[] = [];

const INITIAL_EXPENSES: Expense[] = [];

const INITIAL_RETURNS: ReturnedWater[] = [];

const INITIAL_LEAKAGES: LeakDamage[] = [];

const INITIAL_EMPLOYEES: Employee[] = [];

const INITIAL_DELIVERIES: DeliveryNote[] = [];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [];

const INITIAL_PAYMENTS: CustomerPayment[] = [];

const INITIAL_AUDIT: AuditLog[] = [];

// Lockdown State keys
const LOCKDOWN_KEY = 'pwfms_lockdown_state';
const LOCKDOWN_DURATION_DAYS = 7;

const DEFAULT_LOCKDOWN_STATE: LockdownState = {
  lockdownEndDate: null,
  isLocked: false,
  unlockToken: null
};

// Database core
export const db = {
  // Init
  init() {
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(LOCKDOWN_KEY)) {
      localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(DEFAULT_LOCKDOWN_STATE));
    }
    if (!localStorage.getItem(KEYS.INVENTORY)) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(KEYS.SALES)) {
      localStorage.setItem(KEYS.SALES, JSON.stringify(INITIAL_SALES));
    }
    if (!localStorage.getItem(KEYS.PRODUCTION)) {
      localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(INITIAL_PRODUCTION));
    }
    if (!localStorage.getItem(KEYS.EXPENSES)) {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    }
    if (!localStorage.getItem(KEYS.RETURNS)) {
      localStorage.setItem(KEYS.RETURNS, JSON.stringify(INITIAL_RETURNS));
    }
    if (!localStorage.getItem(KEYS.LEAKAGES)) {
      localStorage.setItem(KEYS.LEAKAGES, JSON.stringify(INITIAL_LEAKAGES));
    }
    if (!localStorage.getItem(KEYS.EMPLOYEES)) {
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!localStorage.getItem(KEYS.DELIVERIES)) {
      localStorage.setItem(KEYS.DELIVERIES, JSON.stringify(INITIAL_DELIVERIES));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(KEYS.STOCK_MOVEMENTS)) {
      localStorage.setItem(KEYS.STOCK_MOVEMENTS, JSON.stringify(INITIAL_STOCK_MOVEMENTS));
    }
    if (!localStorage.getItem(KEYS.PAYMENTS)) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(KEYS.ROLES)) {
      localStorage.setItem(KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
    }
    if (!localStorage.getItem(KEYS.TENANTS)) {
      localStorage.setItem(KEYS.TENANTS, JSON.stringify(DEFAULT_TENANTS));
    }
  },

  reset() {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(INITIAL_PRODUCTION));
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(KEYS.RETURNS, JSON.stringify(INITIAL_RETURNS));
    localStorage.setItem(KEYS.LEAKAGES, JSON.stringify(INITIAL_LEAKAGES));
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(KEYS.DELIVERIES, JSON.stringify(INITIAL_DELIVERIES));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(KEYS.STOCK_MOVEMENTS, JSON.stringify(INITIAL_STOCK_MOVEMENTS));
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT));
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
    localStorage.setItem(KEYS.TENANTS, JSON.stringify(DEFAULT_TENANTS));
  },

  exportDatabase(): string {
    const data: Record<string, any> = {};
    Object.entries(KEYS).forEach(([keyName, lsKey]) => {
      const val = localStorage.getItem(lsKey);
      data[keyName] = val ? JSON.parse(val) : null;
    });
    return JSON.stringify(data, null, 2);
  },

  importDatabase(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(KEYS).forEach(([keyName, lsKey]) => {
        if (data[keyName] !== undefined && data[keyName] !== null) {
          localStorage.setItem(lsKey, JSON.stringify(data[keyName]));
        }
      });
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  // GETTERS & SETTERS

  // Settings
  getSettings(): FactorySettings {
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? JSON.parse(s) : DEFAULT_SETTINGS;
  },
  saveSettings(settings: FactorySettings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    this.addAudit('Administrator', 'Update Settings', 'Changed global factory settings');
  },

  // Production Batches
  getProduction(): ProductionBatch[] {
    const p = localStorage.getItem(KEYS.PRODUCTION);
    return p ? JSON.parse(p) : [];
  },
  saveProduction(batch: Omit<ProductionBatch, 'id'>) {
    const batches = this.getProduction();
    const newBatch: ProductionBatch = {
      ...batch,
      id: 'batch-' + Date.now()
    };
    batches.unshift(newBatch);
    localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(batches));

    // Update inventory automatically (decrements Nylon, increments finished bags)
    const inventory = this.getInventory();
    const nylonItem = inventory.find(i => i.type === 'Nylon');
    const waterItem = inventory.find(i => i.type === 'Pure Water Bag');

    if (nylonItem) {
      nylonItem.quantity = Math.max(0, nylonItem.quantity - batch.nylonUsedKg);
      this.saveStockMovementRaw(nylonItem.id, nylonItem.name, 'Stock Out', batch.nylonUsedKg, `Production Batch ${batch.batchNumber}`, batch.operator);
    }
    if (waterItem) {
      waterItem.quantity += batch.bagsProduced;
      this.saveStockMovementRaw(waterItem.id, waterItem.name, 'Stock In', batch.bagsProduced, `Production Batch ${batch.batchNumber}`, batch.operator);
    }
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));

    // Audit Log
    this.addAudit('Production Officer', 'Add Production Batch', `Created batch ${batch.batchNumber} with ${batch.bagsProduced} bags.`);
    
    // Check if low stocks triggered
    this.checkStockAlerts();

    return newBatch;
  },

  // Inventory Items
  getInventory(): InventoryItem[] {
    const i = localStorage.getItem(KEYS.INVENTORY);
    return i ? JSON.parse(i) : [];
  },
  saveInventoryItem(item: InventoryItem) {
    const items = this.getInventory();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx > -1) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  },
  adjustInventoryStock(itemId: string, qtyChange: number, type: 'Stock In' | 'Stock Out' | 'Adjustment', reason: string, operator: string) {
    const items = this.getInventory();
    const idx = items.findIndex(i => i.id === itemId);
    if (idx > -1) {
      const item = items[idx];
      item.quantity += qtyChange;
      if (item.quantity < 0) item.quantity = 0;
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
      
      this.saveStockMovementRaw(itemId, item.name, type, Math.abs(qtyChange), reason, operator);
      this.addAudit('Store Keeper', 'Adjust Inventory', `Adjusted ${item.name} by ${qtyChange} units (${reason}).`);
      this.checkStockAlerts();
    }
  },

  // Stock Movements
  getStockMovements(): StockMovement[] {
    const m = localStorage.getItem(KEYS.STOCK_MOVEMENTS);
    return m ? JSON.parse(m) : [];
  },
  saveStockMovementRaw(itemId: string, itemName: string, type: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Transfer', quantity: number, reason: string, operator: string) {
    const movements = this.getStockMovements();
    movements.unshift({
      id: 'move-' + Date.now() + Math.random().toString(36).substring(2, 5),
      itemId,
      itemName,
      date: new Date().toISOString().split('T')[0],
      type,
      quantity,
      reason,
      operator
    });
    localStorage.setItem(KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));
  },

  // Sales
  getSales(): Sale[] {
    const s = localStorage.getItem(KEYS.SALES);
    return s ? JSON.parse(s) : [];
  },
  saveSale(sale: Omit<Sale, 'id'>) {
    const sales = this.getSales();
    const newSale: Sale = {
      ...sale,
      id: 'sale-' + Date.now()
    };
    sales.unshift(newSale);
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));

    // Deduct finished goods inventory
    const inventory = this.getInventory();
    const waterItem = inventory.find(i => i.type === 'Pure Water Bag');
    if (waterItem) {
      waterItem.quantity = Math.max(0, waterItem.quantity - sale.quantityBags);
      this.saveStockMovementRaw(waterItem.id, waterItem.name, 'Stock Out', sale.quantityBags, `Sales Invoice ${sale.invoiceNumber}`, sale.salesOfficer);
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));
    }

    // Update customer outstanding if credit or partial
    if (sale.status === 'Unpaid') {
      this.adjustCustomerBalance(sale.customerId, sale.totalAmount);
    } else if (sale.status === 'Partially Paid') {
      const debt = sale.totalAmount - sale.amountPaid;
      this.adjustCustomerBalance(sale.customerId, debt);
      // Log partial payment too
      if (sale.amountPaid > 0) {
        this.savePaymentRaw(sale.customerId, sale.customerName, sale.amountPaid, 'POS', `Inv Partial Payment: ${sale.invoiceNumber}`);
      }
    } else {
      // Paid
      this.savePaymentRaw(sale.customerId, sale.customerName, sale.amountPaid, 'Cash', `Inv Paid: ${sale.invoiceNumber}`);
    }

    this.addAudit('Sales Officer', 'Create Invoice', `Invoice ${sale.invoiceNumber} for ${sale.customerName} (₦${sale.totalAmount})`);
    this.checkStockAlerts();
    return newSale;
  },

  // Customers
  getCustomers(): Customer[] {
    const c = localStorage.getItem(KEYS.CUSTOMERS);
    return c ? JSON.parse(c) : [];
  },
  saveCustomer(customer: Omit<Customer, 'id' | 'createdAt'> & { id?: string }) {
    const customers = this.getCustomers();
    if (customer.id) {
      const idx = customers.findIndex(c => c.id === customer.id);
      if (idx > -1) {
        customers[idx] = {
          ...customers[idx],
          ...customer
        } as Customer;
      }
    } else {
      const newCust: Customer = {
        ...customer,
        id: 'cust-' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      } as Customer;
      customers.push(newCust);
    }
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  adjustCustomerBalance(customerId: string, change: number) {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === customerId);
    if (idx > -1) {
      customers[idx].outstandingBalance += change;
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    }
  },

  // Payments Ledger
  getPayments(): CustomerPayment[] {
    const p = localStorage.getItem(KEYS.PAYMENTS);
    return p ? JSON.parse(p) : [];
  },
  recordPayment(customerId: string, amount: number, method: 'Cash' | 'Transfer' | 'POS', reference: string, cashierName: string) {
    const customers = this.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    // Deduct from outstanding balance
    this.adjustCustomerBalance(customerId, -amount);

    const payment = this.savePaymentRaw(customerId, customer.name, amount, method, reference);
    this.addAudit('Cashier', 'Record Payment', `Received ₦${amount} from ${customer.name} via ${method}`);
    
    return payment;
  },
  savePaymentRaw(customerId: string, customerName: string, amount: number, method: 'Cash' | 'Transfer' | 'POS', reference: string): CustomerPayment {
    const payments = this.getPayments();
    const newPayment: CustomerPayment = {
      id: 'pay-' + Date.now(),
      customerId,
      customerName,
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMethod: method,
      reference
    };
    payments.unshift(newPayment);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
    return newPayment;
  },

  // Returns Module
  getReturns(): ReturnedWater[] {
    const r = localStorage.getItem(KEYS.RETURNS);
    return r ? JSON.parse(r) : [];
  },
  saveReturn(ret: Omit<ReturnedWater, 'id'>) {
    const returns = this.getReturns();
    const newReturn: ReturnedWater = {
      ...ret,
      id: 'ret-' + Date.now()
    };
    returns.unshift(newReturn);
    localStorage.setItem(KEYS.RETURNS, JSON.stringify(returns));

    // Update inventory automatically based on returns
    // In water factories, returned water is usually wasted/discarded (leakages) OR restocked if unsold
    const inventory = this.getInventory();
    const waterItem = inventory.find(i => i.type === 'Pure Water Bag');
    if (waterItem) {
      if (ret.reason === 'Unsold' || ret.reason === 'Wrong Delivery') {
        // Restock finished bags
        waterItem.quantity += ret.quantityBags;
        this.saveStockMovementRaw(waterItem.id, waterItem.name, 'Stock In', ret.quantityBags, `Returned Water (Restock: ${ret.reason})`, ret.receivedBy);
      } else {
        // Leaked/Damaged: Do not restock finished goods, but record as leak/loss!
        this.saveLeakDamage({
          batchNumber: 'Unknown/Returned',
          quantityBags: ret.quantityBags,
          reason: ret.reason === 'Leaked' ? 'Packaging Fault' : 'Handling',
          date: ret.date,
          employeeResponsible: ret.receivedBy,
          lossValue: ret.quantityBags * 150 // using 150 cost price
        });
      }
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));
    }

    // Deduct from outstanding balance if the returns offset debt
    // E.g., if credit customer returns unsold water, deduct the purchase value from their bill
    this.adjustCustomerBalance(ret.customerId, -(ret.quantityBags * 200)); // assuming ₦200 per bag standard

    this.addAudit('Sales Officer', 'Log Return', `Logged return of ${ret.quantityBags} bags from ${ret.customerName}. Reason: ${ret.reason}`);
    return newReturn;
  },

  // Leakage / Loss
  getLeakages(): LeakDamage[] {
    const l = localStorage.getItem(KEYS.LEAKAGES);
    return l ? JSON.parse(l) : [];
  },
  saveLeakDamage(leak: Omit<LeakDamage, 'id'>) {
    const leakages = this.getLeakages();
    const newLeak: LeakDamage = {
      ...leak,
      id: 'leak-' + Date.now()
    };
    leakages.unshift(newLeak);
    localStorage.setItem(KEYS.LEAKAGES, JSON.stringify(leakages));

    this.addAudit('Production Officer', 'Record Damage', `Recorded damage of ${leak.quantityBags} bags (${leak.reason}). Value: ₦${leak.lossValue}`);
    return newLeak;
  },

  // Expenses
  getExpenses(): Expense[] {
    const e = localStorage.getItem(KEYS.EXPENSES);
    return e ? JSON.parse(e) : [];
  },
  saveExpense(expense: Omit<Expense, 'id'>) {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: 'exp-' + Date.now()
    };
    expenses.unshift(newExpense);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));

    this.addAudit('Cashier', 'Record Expense', `Expense: ₦${expense.amount} under ${expense.category} (${expense.description})`);
    return newExpense;
  },

  // Employees & Attendance
  getEmployees(): Employee[] {
    const e = localStorage.getItem(KEYS.EMPLOYEES);
    return e ? JSON.parse(e) : [];
  },
  saveEmployee(employee: Employee) {
    const emps = this.getEmployees();
    const idx = emps.findIndex(e => e.id === employee.id);
    if (idx > -1) {
      emps[idx] = employee;
    } else {
      emps.push(employee);
    }
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(emps));
  },
  getAttendance(): AttendanceRecord[] {
    const a = localStorage.getItem(KEYS.ATTENDANCE);
    return a ? JSON.parse(a) : [];
  },
  saveAttendance(records: Omit<AttendanceRecord, 'id'>[]) {
    const current = this.getAttendance();
    const timestamp = Date.now();
    const newRecords = records.map((r, index) => ({
      ...r,
      id: `att-${timestamp}-${index}`
    }));
    // Append
    const updated = [...newRecords, ...current];
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(updated));
    this.addAudit('Factory Manager', 'Record Attendance', `Logged attendance for ${records.length} staff members.`);
  },

  // Delivery Notes
  getDeliveries(): DeliveryNote[] {
    const d = localStorage.getItem(KEYS.DELIVERIES);
    return d ? JSON.parse(d) : [];
  },
  saveDelivery(delivery: Omit<DeliveryNote, 'id'>) {
    const deliveries = this.getDeliveries();
    const newDel: DeliveryNote = {
      ...delivery,
      id: 'del-' + Date.now()
    };
    deliveries.unshift(newDel);
    localStorage.setItem(KEYS.DELIVERIES, JSON.stringify(deliveries));

    this.addAudit('Sales Officer', 'Create Delivery Note', `Created Delivery Note ${delivery.deliveryNumber} for ${delivery.customerName}`);
    return newDel;
  },
  updateDeliveryStatus(id: string, status: 'Delivered' | 'Pending' | 'Returned') {
    const deliveries = this.getDeliveries();
    const idx = deliveries.findIndex(d => d.id === id);
    if (idx > -1) {
      deliveries[idx].status = status;
      localStorage.setItem(KEYS.DELIVERIES, JSON.stringify(deliveries));
      this.addAudit('Factory Manager', 'Update Delivery Status', `Updated Delivery ${deliveries[idx].deliveryNumber} to ${status}`);
    }
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const a = localStorage.getItem(KEYS.AUDIT_LOGS);
    return a ? JSON.parse(a) : [];
  },
  addAudit(role: UserRole, action: string, details: string) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      user: this.getRoleUser(role),
      role,
      action,
      details
    });
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100))); // keep last 100
  },
  getRoleUser(role: UserRole): string {
    switch (role) {
      case 'Super Admin': return 'Platform Owner (Super Admin)';
      case 'Administrator': return 'Adamu Ibrahim (Admin)';
      case 'Factory Manager': return 'Garba Shehu (Manager)';
      case 'Production Officer': return 'Shehu Garba (Production)';
      case 'Sales Officer': return 'Maryam Yusuf (Sales)';
      case 'Cashier': return 'Kabir Aliyu (Cashier)';
      case 'Sales & Cashier Officer': return 'Maryam Yusuf (Sales & Cashier)';
      case 'Store Keeper': return 'Abubakar Sani (Store)';
      default: return 'Anonymous';
    }
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const n = localStorage.getItem(KEYS.NOTIFICATIONS);
    return n ? JSON.parse(n) : [];
  },
  addNotification(type: 'stock' | 'debt' | 'production' | 'sales' | 'system', title: string, message: string) {
    const list = this.getNotifications();
    list.unshift({
      id: 'not-' + Date.now(),
      timestamp: new Date().toISOString(),
      type,
      title,
      message,
      read: false
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list.slice(0, 50)));
  },
  markNotificationsAsRead() {
    const list = this.getNotifications();
    list.forEach(n => n.read = true);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // Internal stock checking trigger
  checkStockAlerts() {
    const inventory = this.getInventory();
    const settings = this.getSettings();
    const nylon = inventory.find(i => i.type === 'Nylon');
    const water = inventory.find(i => i.type === 'Pure Water Bag');

    if (nylon && nylon.quantity < settings.lowStockThresholdNylon) {
      // Check if alert already exists recently
      const notices = this.getNotifications();
      const duplicate = notices.some(n => n.type === 'stock' && n.message.includes('Nylon film') && !n.read);
      if (!duplicate) {
        this.addNotification('stock', 'Low Nylon Stock', `Nylon film is at ${nylon.quantity}kg, which is below the threshold of ${settings.lowStockThresholdNylon}kg.`);
      }
    }

    if (water && water.quantity < settings.lowStockThresholdWater) {
      const notices = this.getNotifications();
      const duplicate = notices.some(n => n.type === 'stock' && n.message.includes('Finished Pure') && !n.read);
      if (!duplicate) {
        this.addNotification('stock', 'Low Pure Water Stock', `Finished water bags are at ${water.quantity} bags, which is below the threshold of ${settings.lowStockThresholdWater} bags.`);
      }
    }
  },

  // Users Management
  getUsers(): UserAccount[] {
    const u = localStorage.getItem(KEYS.USERS);
    return u ? JSON.parse(u) : DEFAULT_USERS;
  },
  saveUser(user: UserAccount) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.addAudit('Administrator', 'Save User Account', `Saved user account ${user.name} (${user.role})`);
  },
  deleteUser(id: string) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
    this.addAudit('Administrator', 'Delete User Account', `Deleted user account ID: ${id}`);
  },

  // Custom Roles Management
  getRoles(): CustomRole[] {
    const r = localStorage.getItem(KEYS.ROLES);
    return r ? JSON.parse(r) : DEFAULT_ROLES;
  },
  saveRole(role: CustomRole) {
    const roles = this.getRoles();
    const idx = roles.findIndex(r => r.id === role.id);
    if (idx > -1) {
      roles[idx] = role;
    } else {
      roles.push(role);
    }
    localStorage.setItem(KEYS.ROLES, JSON.stringify(roles));
    this.addAudit('Administrator', 'Save Custom Role', `Saved role ${role.name} with modules: ${role.allowedModules.join(', ')}`);
  },
  deleteRole(id: string) {
    const roles = this.getRoles();
    const filtered = roles.filter(r => r.id !== id);
    localStorage.setItem(KEYS.ROLES, JSON.stringify(filtered));
    this.addAudit('Administrator', 'Delete Custom Role', `Deleted custom role: ${id}`);
  },

  // Lockdown State Management
  getLockdownState(): LockdownState {
    const ls = localStorage.getItem(LOCKDOWN_KEY);
    return ls ? JSON.parse(ls) : { ...DEFAULT_LOCKDOWN_STATE };
  },

  activateLockdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + LOCKDOWN_DURATION_DAYS);
    const state: LockdownState = {
      lockdownEndDate: endDate.toISOString(),
      isLocked: false,
      unlockToken: null
    };
    localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(state));
    this.addAudit('Administrator', 'System Lockdown Activated', `System locked for ${LOCKDOWN_DURATION_DAYS} days. Lockdown ends: ${endDate.toDateString()}`);
    return state;
  },

  checkLockdownExpired(): boolean {
    const state = this.getLockdownState();
    if (!state.lockdownEndDate) return false;
    return new Date() >= new Date(state.lockdownEndDate);
  },

  lockSystem() {
    const state = this.getLockdownState();
    state.isLocked = true;
    localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(state));
    this.addAudit('System', 'System Locked', 'System locked - awaiting developer token for unlock.');
  },

  unlockSystem(token: string) {
    const state = this.getLockdownState();
    state.isLocked = false;
    state.lockdownEndDate = null;
    state.unlockToken = null;
    localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(state));
    this.addAudit('Administrator', 'System Unlocked', `System unlocked with valid developer token.`);
    return true;
  },

  verifyUnlockToken(token: string): boolean {
    const state = this.getLockdownState();
    return state.unlockToken === token && token !== null;
  },

  setUnlockToken(token: string) {
    const state = this.getLockdownState();
    state.unlockToken = token;
    localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(state));
  },

  clearLockdown() {
    localStorage.setItem(LOCKDOWN_KEY, JSON.stringify(DEFAULT_LOCKDOWN_STATE));
    this.addAudit('Administrator', 'Lockdown Cleared', 'Lockdown state has been reset.');
  },

  // End of Day Reports
  getEndOfDayReports(): EndOfDayReport[] {
    const r = localStorage.getItem(KEYS.END_OF_DAY_REPORTS);
    return r ? JSON.parse(r) : [];
  },

  generateEndOfDayReport(report: Omit<EndOfDayReport, 'id' | 'closedAt'>) {
    const reports = this.getEndOfDayReports();
    const newReport: EndOfDayReport = {
      ...report,
      id: 'eod-' + Date.now(),
      closedAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(KEYS.END_OF_DAY_REPORTS, JSON.stringify(reports.slice(0, 365))); // Keep last 365 days
    this.addAudit('Administrator', 'End of Day Report', `Generated EOD report for ${report.date}`);
    return newReport;
  },

  getLastEndOfDayReport(): EndOfDayReport | null {
    const reports = this.getEndOfDayReports();
    return reports[0] || null;
  },

  // Tenants Management
  getTenants(): Tenant[] {
    const t = localStorage.getItem(KEYS.TENANTS);
    return t ? JSON.parse(t) : DEFAULT_TENANTS;
  },
  saveTenant(tenant: Tenant) {
    const tenants = this.getTenants();
    const idx = tenants.findIndex(t => t.id === tenant.id);
    if (idx > -1) {
      tenants[idx] = tenant;
    } else {
      tenants.push(tenant);
    }
    localStorage.setItem(KEYS.TENANTS, JSON.stringify(tenants));
    this.addAudit('Super Admin', 'Save Tenant', `Saved tenant ${tenant.name} (${tenant.status})`);
  },
  deleteTenant(id: string) {
    const tenants = this.getTenants();
    const filtered = tenants.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TENANTS, JSON.stringify(filtered));
    this.addAudit('Super Admin', 'Delete Tenant', `Deleted tenant ID: ${id}`);
  }
};
