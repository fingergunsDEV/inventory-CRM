/**
 * state.js
 * Manages the application's data (inventory, suppliers).
 * Interacts with the API module to fetch/save data.
 * Will eventually use API.js; for now, uses dummy data.
 */

import * as API from './api.js';

let inventory = [];
let suppliers = [];

// --- Dummy Data ---
const dummyInventory = [
    { id: 'SKU001', name: 'Organic Avocados', category: 'Produce', stock: 15, cost: 1.50, reorderLevel: 20 },
    { id: 'SKU002', name: 'Sourdough Loaf', category: 'Bakery', stock: 30, cost: 2.75 },
    { id: 'SKU003', name: 'Cold Brew Cans', category: 'Drinks', stock: 100, cost: 2.10 },
    { id: 'SKU004', name: 'LA Map T-Shirt', category: 'Apparel', stock: 75, cost: 8.00 },
    { id: 'SKU005', name: 'Artisan Cheese', category: 'Dairy', stock: 8, cost: 5.50, reorderLevel: 10 },
];

const dummySuppliers = [
    { id: 'SUP01', name: 'California Farms Co.', email: 'orders@cafarms.com', phone: '213-555-1234' },
    { id: 'SUP02', name: 'LA Bread Bakers', email: 'hello@labread.com', phone: '310-555-5678' },
    { id: 'SUP03', name: 'Local Threads Inc.', email: 'sales@localthreads.co', phone: '818-555-9012' },
];

// --- Data Accessors ---
export const getInventory = () => inventory;
export const getSuppliers = () => suppliers;

// --- Data Loading ---
export async function loadInitialData() {
    try {
        // *** FUTURE: Replace with API calls ***
        // inventory = await API.fetchInventory();
        // suppliers = await API.fetchSuppliers();
        inventory = [...dummyInventory]; // Use copies to avoid direct mutation
        suppliers = [...dummySuppliers];
        console.log("Initial data loaded (dummy).");
    } catch (error) {
        console.error("Failed to load initial data:", error);
        // Maybe show an error message to the user here
        inventory = [];
        suppliers = [];
    }
}

// --- Data Modification ---

export async function saveInventoryItem(itemData, id = null) {
    // *** FUTURE: Replace with API.saveInventoryItem(itemData, id); ***
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            if (id) {
                inventory = inventory.map(item => item.id === id ? { ...item, ...itemData } : item);
            } else {
                inventory.push({ ...itemData });
            }
            console.log("Inventory saved (dummy):", inventory);
            resolve({ success: true, data: itemData });
        }, 300);
    });
}

export async function saveSupplier(supplierData, id = null) {
    // *** FUTURE: Replace with API.saveSupplier(supplierData, id); ***
     return new Promise((resolve) => {
        setTimeout(() => {
            if (id) {
                suppliers = suppliers.map(sup => sup.id === id ? { ...sup, ...supplierData } : sup);
            } else {
                suppliers.push({ ...supplierData });
            }
            console.log("Suppliers saved (dummy):", suppliers);
            resolve({ success: true, data: supplierData });
        }, 300);
     });
}

export async function deleteInventoryItem(id) {
    // *** FUTURE: Replace with API.deleteInventoryItem(id); ***
     return new Promise((resolve) => {
        setTimeout(() => {
            inventory = inventory.filter(item => item.id !== id);
            console.log("Inventory deleted (dummy):", id);
            resolve({ success: true });
        }, 300);
     });
}

export async function deleteSupplier(id) {
    // *** FUTURE: Replace with API.deleteSupplier(id); ***
     return new Promise((resolve) => {
        setTimeout(() => {
            suppliers = suppliers.filter(sup => sup.id !== id);
            console.log("Supplier deleted (dummy):", id);
            resolve({ success: true });
        }, 300);
     });
}
