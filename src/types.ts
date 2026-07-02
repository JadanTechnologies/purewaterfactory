/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Administrator' 
  | 'Tenant Admin'
  | 'Factory Manager' 
  | 'Production Officer' 
  | 'Sales Officer' 
  | 'Store Keeper' 
  | 'Cashier'
  | 'Sales & Cashier Officer';

export type Permission =
  | 'view_dashboard'
  | 'manage_production'
  | 'manage_inventory'
  | 'manage_sales'
  | 'manage_customers'
  | 'manage_returns'
  | 'manage_leakages'
  | 'manage_expenses'
  | 'manage_staff'
  | 'manage_deliveries'
  | 'view_financials'
  | 'view_reports'
  | 'manage_settings'
  | 'manage_roles'
  | 'manage_tenants'
  | 'manage_platform';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface LockdownState {
  lockdownEndDate: string | null;
  isLocked: boolean;
  unlockToken: string | null;
}

export interface FactorySettings {
  factoryName: string;
  address: string;
  phone: string;
  email: string;
  currency: string; // e.g. "₦"
  nylonConversionRate: number; // 1 kg of Nylon = X Bags
  taxRate: number; // percentage
  lowStockThresholdNylon: number; // kg
  lowStockThresholdWater: number; // bags
  language: 'en' | 'ha'; // English or Hausa
  logoUrl?: string; // URL for factory logo
  lockdownState?: LockdownState;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  date: string;
  shift: 'Morning' | 'Night';
  nylonType: string;
  nylonUsedKg: number;
  bagsProduced: number;
  productionLine: string;
  operator: string;
  startTime: string;
  endTime: string;
  remarks: string;
  tenantId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Raw Materials' | 'Finished Goods';
  type: 'Nylon' | 'Chemical' | 'Packaging' | 'Pure Water Bag';
  quantity: number; // in kg or bags
  unit: string; // 'kg', 'bags', 'liters', 'pieces'
  costPrice: number;
  sellingPrice?: number;
  tenantId?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  date: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Transfer';
  quantity: number;
  reason: string;
  operator: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  salesOfficer: string;
  quantityBags: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Transfer' | 'POS' | 'Credit';
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'On Hold';
  amountPaid: number;
  remarks?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  businessName: string;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: string;
  tenantId?: string;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMethod: 'Cash' | 'Transfer' | 'POS';
  reference: string;
  tenantId?: string;
}

export interface ReturnedWater {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  quantityBags: number;
  reason: 'Unsold' | 'Leaked' | 'Damaged' | 'Expired' | 'Wrong Delivery';
  date: string;
  receivedBy: string;
  tenantId?: string;
}

export interface LeakDamage {
  id: string;
  batchId?: string;
  batchNumber: string;
  quantityBags: number;
  reason: 'Machine Fault' | 'Packaging Fault' | 'Transportation' | 'Handling';
  date: string;
  employeeResponsible: string;
  lossValue: number; // quantityBags * costPrice
  tenantId?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Fuel' | 'Salary' | 'Transport' | 'Repairs' | 'Electricity' | 'Generator Fuel' | 'Maintenance' | 'Other';
  amount: number;
  description: string;
  recordedBy: string;
  tenantId?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  salary: number;
  joinedDate: string;
  performanceRating: number; // 1-5 stars
  tenantId?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  status: 'Present' | 'Absent' | 'Late';
  tenantId?: string;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  date: string;
  driverName: string;
  vehicleNumber: string;
  customerId: string;
  customerName: string;
  destination: string;
  quantityBags: number;
  status: 'Delivered' | 'Pending' | 'Returned';
  tenantId?: string;
}

export interface CustomRole {
  id: string;
  name: string;
  allowedModules: string[]; // List of module names, e.g. ['dashboard', 'sales']
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  companyCode: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'One-Time Purchase' | 'Free Trial' | 'Standard' | 'Premium';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  accessToken: string;
  registrationNumber?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  country?: string;
  state?: string;
  city?: string;
  logoUrl?: string;
  subscriptionPlan?: string;
  expiryDate?: string;
  tenantAdminUsername?: string;
  tenantAdminEmail?: string;
  tenantAdminPassword?: string;
}

export interface TenantCreationPayload {
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  registrationNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  logoUrl?: string;
  plan?: Tenant['plan'];
  expiryDate?: string;
  tenantAdminUsername?: string;
  tenantAdminEmail?: string;
  tenantAdminPassword?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  role: string; // can be standard or custom role name
  password?: string;
  passwordHashed?: boolean;
  status?: 'active' | 'locked';
  failedLoginAttempts?: number;
  tenantId?: string;
  isSuperAdmin?: boolean;
  isTenantAdmin?: boolean;
}

export interface LoginHistoryItem {
  id: string;
  userId?: string;
  userEmail: string;
  username?: string;
  tenantId?: string;
  timestamp: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  message?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId?: string;
  tenantId?: string;
  role: UserRole;
  action: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'stock' | 'debt' | 'production' | 'sales' | 'system';
  title: string;
  message: string;
  read: boolean;
}

export interface EndOfDayReport {
  id: string;
  date: string;
  closedAt: string;
  totalSales: number;
  totalExpenses: number;
  totalProductionBags: number;
  totalNylonUsed: number;
  closingStock: number;
  cashAtHand: number;
  generatedBy: string;
}
