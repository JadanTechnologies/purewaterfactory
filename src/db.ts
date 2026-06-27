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
  CustomRole
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
  ROLES: 'pwfms_roles'
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
  { id: 'usr-1', name: 'Adamu Ibrahim', email: 'admin@nile.com', phone: '+234 803 111 2222', role: 'Administrator', password: 'password123' },
  { id: 'usr-2', name: 'Garba Shehu', email: 'manager@nile.com', phone: '+234 803 222 3333', role: 'Factory Manager', password: 'password123' },
  { id: 'usr-3', name: 'Shehu Garba', email: 'production@nile.com', phone: '+234 803 333 4444', role: 'Production Officer', password: 'password123' },
  { id: 'usr-4', name: 'Maryam Yusuf', email: 'sales@nile.com', phone: '+234 803 444 5555', role: 'Sales Officer', password: 'password123' },
  { id: 'usr-5', name: 'Abubakar Sani', email: 'store@nile.com', phone: '+234 803 555 6666', role: 'Store Keeper', password: 'password123' },
  { id: 'usr-6', name: 'Kabir Aliyu', email: 'cashier@nile.com', phone: '+234 803 666 7777', role: 'Cashier', password: 'password123' }
];

const DEFAULT_ROLES: CustomRole[] = [
  { id: 'Administrator', name: 'Administrator', allowedModules: ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'staff', 'deliveries', 'financials', 'reports', 'settings'] },
  { id: 'Factory Manager', name: 'Factory Manager', allowedModules: ['dashboard', 'production', 'inventory', 'sales', 'customers', 'returns', 'leakages', 'expenses', 'deliveries', 'financials', 'reports'] },
  { id: 'Production Officer', name: 'Production Officer', allowedModules: ['dashboard', 'production', 'leakages'] },
  { id: 'Sales Officer', name: 'Sales Officer', allowedModules: ['dashboard', 'sales', 'customers', 'returns', 'deliveries'] },
  { id: 'Store Keeper', name: 'Store Keeper', allowedModules: ['dashboard', 'inventory'] },
  { id: 'Cashier', name: 'Cashier', allowedModules: ['dashboard', 'customers', 'expenses', 'financials'] }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Raw Nylon Film (Standard)', category: 'Raw Materials', type: 'Nylon', quantity: 245, unit: 'kg', costPrice: 2100 },
  { id: 'inv-2', name: 'Water Treatment Chlorine', category: 'Raw Materials', type: 'Chemical', quantity: 42, unit: 'liters', costPrice: 4500 },
  { id: 'inv-3', name: 'Micro-Filtration Cartridges', category: 'Raw Materials', type: 'Chemical', quantity: 18, unit: 'pieces', costPrice: 8500 },
  { id: 'inv-4', name: 'Finished Pure Water Bags (20 Sachet/Bag)', category: 'Finished Goods', type: 'Pure Water Bag', quantity: 1850, unit: 'bags', costPrice: 150, sellingPrice: 200 }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Alhaji Ibrahim Musa', phone: '+234 805 987 6543', address: 'Bompai Industrial Area, Kano', businessName: 'Musa & Sons Wholesale Stores', creditLimit: 150000, outstandingBalance: 65000, createdAt: '2026-05-10' },
  { id: 'cust-2', name: 'Hajiya Amina Bello', phone: '+234 809 333 4444', address: 'Kwara Avenue, Sabon Gari, Kano', businessName: 'Amina Cold Drinks Spot', creditLimit: 80000, outstandingBalance: 32000, createdAt: '2026-05-15' },
  { id: 'cust-3', name: 'Musa Danladi Grocery', phone: '+234 812 444 5555', address: 'Zaria Road, Kano', businessName: 'Danladi Retail Outlet', creditLimit: 40000, outstandingBalance: 0, createdAt: '2026-06-01' },
  { id: 'cust-4', name: 'Afolabi John Stores', phone: '+234 802 777 8888', address: 'Zoo Road, Kano', businessName: 'Afolabi Supermarket', creditLimit: 120000, outstandingBalance: 15000, createdAt: '2026-06-05' }
];

const INITIAL_SALES: Sale[] = [
  { id: 'sale-1', invoiceNumber: 'INV-2026-001', date: '2026-06-25', customerId: 'cust-1', customerName: 'Alhaji Ibrahim Musa', salesOfficer: 'Maryam Yusuf', quantityBags: 300, unitPrice: 200, totalAmount: 60000, paymentMethod: 'Cash', status: 'Paid', amountPaid: 60000 },
  { id: 'sale-2', invoiceNumber: 'INV-2026-002', date: '2026-06-26', customerId: 'cust-2', customerName: 'Hajiya Amina Bello', salesOfficer: 'Maryam Yusuf', quantityBags: 250, unitPrice: 200, totalAmount: 50000, paymentMethod: 'Credit', status: 'Unpaid', amountPaid: 0 },
  { id: 'sale-3', invoiceNumber: 'INV-2026-003', date: '2026-06-26', customerId: 'cust-4', customerName: 'Afolabi John Stores', salesOfficer: 'Maryam Yusuf', quantityBags: 150, unitPrice: 200, totalAmount: 30000, paymentMethod: 'POS', status: 'Partially Paid', amountPaid: 15000 },
  { id: 'sale-4', invoiceNumber: 'INV-2026-004', date: '2026-06-27', customerId: 'cust-3', customerName: 'Musa Danladi Grocery', salesOfficer: 'Maryam Yusuf', quantityBags: 200, unitPrice: 200, totalAmount: 40000, paymentMethod: 'Transfer', status: 'Paid', amountPaid: 40000 }
];

const INITIAL_PRODUCTION: ProductionBatch[] = [
  { id: 'batch-1', batchNumber: 'BAT-2026-101', date: '2026-06-24', shift: 'Morning', nylonType: 'Standard HD 0.25mm', nylonUsedKg: 15, bagsProduced: 1500, productionLine: 'Line A (Automatic)', operator: 'Shehu Garba', startTime: '08:00', endTime: '14:30', remarks: 'Optimized speed, perfect seals.' },
  { id: 'batch-2', batchNumber: 'BAT-2026-102', date: '2026-06-25', shift: 'Night', nylonType: 'Standard HD 0.25mm', nylonUsedKg: 10, bagsProduced: 1000, productionLine: 'Line B (Semi-Auto)', operator: 'Usman Ibrahim', startTime: '20:00', endTime: '02:00', remarks: 'Required slight jaw alignment.' },
  { id: 'batch-3', batchNumber: 'BAT-2026-103', date: '2026-06-26', shift: 'Morning', nylonType: 'Standard HD 0.25mm', nylonUsedKg: 18, bagsProduced: 1800, productionLine: 'Line A (Automatic)', operator: 'Shehu Garba', startTime: '08:00', endTime: '15:15', remarks: 'Excellent throughput.' }
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', date: '2026-06-24', category: 'Generator Fuel', amount: 45000, description: 'Purchased 50L diesel for main factory generator', recordedBy: 'Kabir Aliyu' },
  { id: 'exp-2', date: '2026-06-25', category: 'Repairs', amount: 15000, description: 'Serrated cutting jaw replacement for Line B sealer', recordedBy: 'Kabir Aliyu' },
  { id: 'exp-3', date: '2026-06-26', category: 'Transport', amount: 8500, description: 'Fuel replenishment for Delivery Van Toyota Hiace', recordedBy: 'Kabir Aliyu' },
  { id: 'exp-4', date: '2026-06-27', category: 'Maintenance', amount: 12000, description: 'Water treatment reverse osmosis system pre-filter wash', recordedBy: 'Kabir Aliyu' }
];

const INITIAL_RETURNS: ReturnedWater[] = [
  { id: 'ret-1', customerId: 'cust-2', customerName: 'Hajiya Amina Bello', invoiceNumber: 'INV-2026-002', quantityBags: 10, reason: 'Leaked', date: '2026-06-26', receivedBy: 'Abubakar Sani' },
  { id: 'ret-2', customerId: 'cust-1', customerName: 'Alhaji Ibrahim Musa', invoiceNumber: 'INV-2026-001', quantityBags: 5, reason: 'Damaged', date: '2026-06-25', receivedBy: 'Abubakar Sani' }
];

const INITIAL_LEAKAGES: LeakDamage[] = [
  { id: 'leak-1', batchNumber: 'BAT-2026-101', quantityBags: 12, reason: 'Machine Fault', date: '2026-06-24', employeeResponsible: 'Shehu Garba', lossValue: 1800 },
  { id: 'leak-2', batchNumber: 'BAT-2026-102', quantityBags: 8, reason: 'Packaging Fault', date: '2026-06-25', employeeResponsible: 'Usman Ibrahim', lossValue: 1200 }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Shehu Garba', role: 'Production Supervisor', phone: '+234 803 111 2222', salary: 90000, joinedDate: '2025-01-10', performanceRating: 4.8 },
  { id: 'emp-2', name: 'Maryam Yusuf', role: 'Sales & Marketing Manager', phone: '+234 803 333 4444', salary: 85000, joinedDate: '2025-02-15', performanceRating: 4.9 },
  { id: 'emp-3', name: 'Abubakar Sani', role: 'Warehouse Store Keeper', phone: '+234 803 555 6666', salary: 70000, joinedDate: '2025-03-01', performanceRating: 4.5 },
  { id: 'emp-4', name: 'Kabir Aliyu', role: 'Senior Cashier & Accountant', phone: '+234 803 777 8888', salary: 80000, joinedDate: '2025-01-20', performanceRating: 4.7 },
  { id: 'emp-5', name: 'Danjuma Bala', role: 'Lead Delivery Driver', phone: '+234 803 999 0000', salary: 60000, joinedDate: '2025-04-10', performanceRating: 4.2 }
];

const INITIAL_DELIVERIES: DeliveryNote[] = [
  { id: 'del-1', deliveryNumber: 'DN-2026-001', date: '2026-06-25', driverName: 'Danjuma Bala', vehicleNumber: 'KAN-924-XX', customerId: 'cust-1', customerName: 'Alhaji Ibrahim Musa', destination: 'Bompai Stores', quantityBags: 200, status: 'Delivered' },
  { id: 'del-2', deliveryNumber: 'DN-2026-002', date: '2026-06-26', driverName: 'Danjuma Bala', vehicleNumber: 'KAN-924-XX', customerId: 'cust-2', customerName: 'Hajiya Amina Bello', destination: 'Sabon Gari Cold Room', quantityBags: 150, status: 'Pending' }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'not-1', timestamp: '2026-06-26T10:30:00Z', type: 'stock', title: 'Low Stock Alert', message: 'Water Chlorine levels are at 42L. Consider restocking soon.', read: false },
  { id: 'not-2', timestamp: '2026-06-27T08:00:00Z', type: 'debt', title: 'Outstanding Balance Exceeded', message: 'Alhaji Ibrahim Musa has outstanding debt of ₦65,000.', read: false },
  { id: 'not-3', timestamp: '2026-06-27T12:00:00Z', type: 'production', title: 'Daily Production Complete', message: 'Batch BAT-2026-103 Morning shift production complete: 1,800 bags recorded.', read: true }
];

const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  { id: 'move-1', itemId: 'inv-1', itemName: 'Raw Nylon Film (Standard)', date: '2026-06-24', type: 'Stock Out', quantity: 15, reason: 'Production Batch BAT-2026-101', operator: 'Abubakar Sani' },
  { id: 'move-2', itemId: 'inv-4', itemName: 'Finished Pure Water Bags', date: '2026-06-24', type: 'Stock In', quantity: 1500, reason: 'Production Batch BAT-2026-101', operator: 'Abubakar Sani' },
  { id: 'move-3', itemId: 'inv-1', itemName: 'Raw Nylon Film (Standard)', date: '2026-06-25', type: 'Stock Out', quantity: 10, reason: 'Production Batch BAT-2026-102', operator: 'Abubakar Sani' },
  { id: 'move-4', itemId: 'inv-4', itemName: 'Finished Pure Water Bags', date: '2026-06-25', type: 'Stock In', quantity: 1000, reason: 'Production Batch BAT-2026-102', operator: 'Abubakar Sani' }
];

const INITIAL_PAYMENTS: CustomerPayment[] = [
  { id: 'pay-1', customerId: 'cust-1', customerName: 'Alhaji Ibrahim Musa', date: '2026-06-25', amount: 50000, paymentMethod: 'Transfer', reference: 'TXN-98240598' },
  { id: 'pay-2', customerId: 'cust-2', customerName: 'Hajiya Amina Bello', date: '2026-06-26', amount: 18000, paymentMethod: 'Cash', reference: 'CSH-02840' }
];

const INITIAL_AUDIT: AuditLog[] = [
  { id: 'audit-1', timestamp: '2026-06-25T08:15:00Z', user: 'Shehu Garba', role: 'Production Officer', action: 'Log Production', details: 'Created production batch BAT-2026-101 (1500 Bags)' },
  { id: 'audit-2', timestamp: '2026-06-26T14:10:00Z', user: 'Maryam Yusuf', role: 'Sales Officer', action: 'Create Invoice', details: 'Created Invoice INV-2026-002 for Hajiya Amina Bello' },
  { id: 'audit-3', timestamp: '2026-06-26T16:45:00Z', user: 'Kabir Aliyu', role: 'Cashier', action: 'Receive Payment', details: 'Logged payment of ₦18,000 from Hajiya Amina Bello' }
];

// Database core
export const db = {
  // Init
  init() {
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
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
      case 'Administrator': return 'Adamu Ibrahim (Admin)';
      case 'Factory Manager': return 'Garba Shehu (Manager)';
      case 'Production Officer': return 'Shehu Garba (Production)';
      case 'Sales Officer': return 'Maryam Yusuf (Sales)';
      case 'Store Keeper': return 'Abubakar Sani (Store)';
      case 'Cashier': return 'Kabir Aliyu (Cashier)';
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
  }
};
