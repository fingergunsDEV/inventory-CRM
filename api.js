/**
 * api.js
 * Handles all communication with the Google Apps Script Web App.
 * Uses fetch() to make requests.
 */

// THIS IS THE URL YOU WILL GET WHEN YOU DEPLOY YOUR APPS SCRIPT AS A WEB APP
const APPS_SCRIPT_URL = 'YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_GOES_HERE';

// --- Helper for API Calls ---
async function callAppsScript(action, payload = {}) {
    // *** THIS IS WHERE THE REAL FETCH LOGIC WILL GO ***
    console.warn(`API Call (Simulated): Action=${action}, Payload=`, payload);

    // For now, we return errors because this isn't implemented.
    // In state.js we are currently bypassing this and using dummy data.
    // When you build the backend, you'll implement fetch here and
    // update state.js to use these functions.
    return Promise.reject(new Error("API Not Implemented Yet. Using Dummy Data."));

    /* --- EXAMPLE of what it MIGHT look like ---
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...payload }),
            mode: 'cors' // Make sure Apps Script allows CORS
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.status === 'error') {
            throw new Error(result.message || 'Unknown API error');
        }

        return result.data;

    } catch (error) {
        console.error(`API call failed for ${action}:`, error);
        throw error; // Re-throw to be handled by the caller
    }
    */
}

// --- Specific API Functions (Examples) ---

export async function fetchInventory() {
    return callAppsScript('getInventory');
}

export async function fetchSuppliers() {
    return callAppsScript('getSuppliers');
}

export async function saveInventoryItem(itemData, id) {
    return callAppsScript('saveInventoryItem', { id, itemData });
}

export async function saveSupplier(supplierData, id) {
    return callAppsScript('saveSupplier', { id, supplierData });
}

export async function deleteInventoryItem(id) {
    return callAppsScript('deleteInventoryItem', { id });
}

export async function deleteSupplier(id) {
    return callAppsScript('deleteSupplier', { id });
}
