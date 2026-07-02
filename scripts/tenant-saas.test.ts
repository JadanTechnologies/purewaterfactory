import { db } from '../src/db';

class MemoryStorage {
  private store = new Map<string, string>();
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
}

const storage = new MemoryStorage();
(globalThis as any).localStorage = storage;

const tenant = db.createTenant({
  name: 'Acme Water Ltd',
  slug: 'acme-water',
  ownerName: 'Aisha Bello',
  ownerEmail: 'aisha@acme.com',
  plan: 'One-Time Purchase',
  status: 'active'
});

if (!tenant?.id) throw new Error('tenant should be created');

db.switchTenant(tenant.id);
db.saveSettings({
  factoryName: 'Acme Water Ltd',
  address: 'Kano',
  phone: '08000000000',
  email: 'info@acme.com',
  currency: '₦',
  nylonConversionRate: 100,
  taxRate: 7.5,
  lowStockThresholdNylon: 50,
  lowStockThresholdWater: 500,
  language: 'en'
});

const scopedSettings = db.getSettings();
if (scopedSettings.factoryName !== 'Acme Water Ltd') {
  throw new Error('tenant data was not isolated correctly');
}

console.log('tenant test passed');
