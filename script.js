/**
 * Main application script (script.js)
 * Uses ES6 Modules for structure.
 * Handles App Initialization and Event Delegation.
 */

import * as UI from './ui.js';
import * as State from './state.js';
import * as API from './api.js'; // Will handle Google Apps Script calls

// --- Global Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Loaded - Initializing App...");

    // Setup Navigation
    UI.setupNavigation();
    UI.showSection('dashboard-section'); // Start on dashboard

    // Fetch initial data (using dummy data for now)
    await State.loadInitialData();

    // Render initial views
    UI.renderAll();

    // --- Specific Event Listeners ---

    // Navigation (Handled by setupNavigation)

    // Search & Filter
    document.getElementById('inventory-search').addEventListener('input', (e) => UI.filterTable('inventory-table', e.target.value));
    document.getElementById('suppliers-search').addEventListener('input', (e) => UI.filterTable('suppliers-table', e.target.value));
    document.getElementById('inventory-filter').addEventListener('change', (e) => UI.filterTable('inventory-table', document.getElementById('inventory-search').value, e.target.value));

    // Add Buttons
    document.getElementById('add-inventory-btn').addEventListener('click', () => UI.showForm('inventory'));
    document.getElementById('add-supplier-btn').addEventListener('click', () => UI.showForm('supplier'));

    // Modal Close
    document.querySelector('.close-btn').addEventListener('click', UI.hideModal);
    window.addEventListener('click', (event) => {
        if (event.target == document.getElementById('form-modal')) {
            UI.hideModal();
        }
    });

    // Form Submission
    document.getElementById('data-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!UI.validateForm()) {
             UI.showNotification('Please fix the errors before saving.', 'error');
             return;
        }

        const formData = new FormData(document.getElementById('data-form'));
        const data = Object.fromEntries(formData.entries());
        const id = data['edit-id'];
        delete data['edit-id']; // Remove hidden field from data object
        const type = data['form-type'];
        delete data['form-type'];

        // Convert numbers where appropriate
        if (data.stock) data.stock = parseFloat(data.stock);
        if (data.cost) data.cost = parseFloat(data.cost);

        console.log("Submitting:", type, id, data);

        try {
            if (type === 'inventory') {
                await State.saveInventoryItem(data, id);
                UI.showNotification(`Inventory item ${id ? 'updated' : 'added'}!`, 'success');
            } else {
                await State.saveSupplier(data, id);
                UI.showNotification(`Supplier ${id ? 'updated' : 'added'}!`, 'success');
            }
            UI.hideModal();
            UI.renderAll(); // Re-render everything to show changes
        } catch (error) {
            console.error("Save Error:", error);
            UI.showNotification(`Failed to save: ${error.message}`, 'error');
        }
    });

    // Table Clicks (for Edit/Delete/Sort) - Event Delegation
    document.querySelector('main').addEventListener('click', async (e) => {
        // Edit Button
        if (e.target.closest('.action-btn.edit')) {
            const button = e.target.closest('.action-btn.edit');
            const id = button.dataset.id;
            const type = button.dataset.type;
            const dataToEdit = (type === 'inventory')
                ? State.getInventory().find(item => item.id === id)
                : State.getSuppliers().find(sup => sup.id === id);
            if (dataToEdit) {
                UI.showForm(type, dataToEdit);
            }
        }
        // Delete Button
        else if (e.target.closest('.action-btn.delete')) {
             const button = e.target.closest('.action-btn.delete');
             const id = button.dataset.id;
             const type = button.dataset.type;

             if (confirm(`Are you sure you want to delete ${type} ${id}? This cannot be undone.`)) {
                try {
                    if (type === 'inventory') {
                       await State.deleteInventoryItem(id);
                       UI.showNotification(`Inventory item ${id} deleted.`, 'info');
                    } else {
                       await State.deleteSupplier(id);
                       UI.showNotification(`Supplier ${id} deleted.`, 'info');
                    }
                    UI.renderAll();
                } catch(error) {
                    console.error("Delete Error:", error);
                    UI.showNotification(`Failed to delete: ${error.message}`, 'error');
                }
             }
        }
        // Sort Header
        else if (e.target.closest('th[data-sort]')) {
             const th = e.target.closest('th[data-sort]');
             const tableId = th.closest('table').id;
             const key = th.dataset.sort;
             UI.sortTable(tableId, key);
        }
    });

    console.log("App Initialized.");
});
