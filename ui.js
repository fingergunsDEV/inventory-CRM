/**
 * ui.js
 * Handles all DOM manipulation, form building, table rendering,
 * notifications, and UI event setup.
 */

import * as State from './state.js';

// --- DOM Elements Cache ---
const elements = {
    main: document.querySelector('main'),
    navButtons: document.querySelectorAll('nav button'),
    modal: document.getElementById('form-modal'),
    dataForm: document.getElementById('data-form'),
    formFields: document.getElementById('form-fields'),
    formTitle: document.getElementById('form-title'),
    inventoryTableBody: document.getElementById('inventory-table').querySelector('tbody'),
    suppliersTableBody: document.getElementById('suppliers-table').querySelector('tbody'),
    inventoryFilter: document.getElementById('inventory-filter'),
    notificationArea: document.getElementById('notification-area'),
    widgetTotalItems: document.getElementById('widget-total-items'),
    widgetLowStock: document.getElementById('widget-low-stock'),
    widgetLowStockList: document.getElementById('widget-low-stock-list'),
    widgetTotalSuppliers: document.getElementById('widget-total-suppliers'),
};

let currentSort = { inventory: {}, suppliers: {} };

// --- Navigation ---
export function setupNavigation() {
    elements.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.id.replace('nav-', '') + '-section';
            showSection(sectionId);
        });
    });
}

export function showSection(sectionIdToShow) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active-section'));
    elements.navButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(sectionIdToShow).classList.add('active-section');
    document.getElementById(`nav-${sectionIdToShow.replace('-section', '')}`).classList.add('active');
}

// --- Modal ---
export function showModal() { elements.modal.style.display = 'block'; }
export function hideModal() { elements.modal.style.display = 'none'; elements.dataForm.reset(); elements.formFields.innerHTML = ''; }

// --- Notifications ---
export function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.notificationArea.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

// --- Form Building & Validation ---
export function showForm(type, data = {}) {
    elements.formFields.innerHTML = ''; // Clear previous form
    const id = data.id || '';
    let fields = [];

    if (type === 'inventory') {
        elements.formTitle.textContent = id ? `Edit Item: ${id}` : 'Add New Item';
        fields = [
            { label: 'Item ID', name: 'id', type: 'text', value: data.id, required: true, readonly: !!id },
            { label: 'Name', name: 'name', type: 'text', value: data.name, required: true },
            { label: 'Category', name: 'category', type: 'text', value: data.category },
            { label: 'Stock Level', name: 'stock', type: 'number', value: data.stock, required: true },
            { label: 'Unit Cost ($)', name: 'cost', type: 'number', value: data.cost, required: true, step: '0.01' }
        ];
    } else if (type === 'supplier') {
        elements.formTitle.textContent = id ? `Edit Supplier: ${id}` : 'Add New Supplier';
        fields = [
            { label: 'Supplier ID', name: 'id', type: 'text', value: data.id, required: true, readonly: !!id },
            { label: 'Name', name: 'name', type: 'text', value: data.name, required: true },
            { label: 'Contact Email', name: 'email', type: 'email', value: data.email },
            { label: 'Phone', name: 'phone', type: 'tel', value: data.phone }
        ];
    }

    fields.forEach(field => buildFormField(field));

    // Add hidden fields
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'edit-id';
    input.value = id;
    elements.formFields.appendChild(input);
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'form-type';
    input.value = type;
    elements.formFields.appendChild(input);

    showModal();
}

function buildFormField(field) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.textContent = field.label + (field.required ? ' *' : '');

    const input = document.createElement('input');
    input.type = field.type;
    input.id = field.name;
    input.name = field.name;
    input.value = field.value || '';
    if (field.required) input.required = true;
    if (field.readonly) input.readOnly = true;
    if (field.step) input.step = field.step;
    if (field.type === 'email') input.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"; // Basic email pattern

    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.textContent = `Please enter a valid ${field.label.toLowerCase()}.`;

    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(errorSpan);
    elements.formFields.appendChild(group);
}

export function validateForm() {
    let isValid = true;
    elements.dataForm.querySelectorAll('input[required], input[pattern]').forEach(input => {
        input.classList.remove('error');
        if (!input.checkValidity()) {
            input.classList.add('error');
            isValid = false;
        }
    });
    return isValid;
}


// --- Table Rendering & Interactions ---
function renderInventoryTable(data) {
    elements.inventoryTableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>$${item.cost.toFixed(2)}</td>
            <td>
                <button class="action-btn edit" data-id="${item.id}" data-type="inventory" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${item.id}" data-type="inventory" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        elements.inventoryTableBody.appendChild(row);
    });
}

function renderSuppliersTable(data) {
    elements.suppliersTableBody.innerHTML = '';
    data.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.email || '--'}</td>
            <td>${supplier.phone || '--'}</td>
            <td>
                <button class="action-btn edit" data-id="${supplier.id}" data-type="supplier" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${supplier.id}" data-type="supplier" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        elements.suppliersTableBody.appendChild(row);
    });
}

function updateInventoryFilterOptions() {
    const categories = [...new Set(State.getInventory().map(item => item.category))].filter(Boolean);
    elements.inventoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.inventoryFilter.appendChild(option);
    });
}

export function filterTable(tableId, searchTerm, category = '') {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    const term = searchTerm.toLowerCase();

    Array.from(tableBody.rows).forEach(row => {
        const textMatch = Array.from(row.cells).some(cell =>
            cell.textContent.toLowerCase().includes(term)
        );
        let categoryMatch = true;
        if (tableId === 'inventory-table' && category) {
            const categoryCell = Array.from(row.cells).find(cell => cell.cellIndex === 2); // Assuming category is the 3rd cell
            categoryMatch = categoryCell && categoryCell.textContent === category;
        }
        row.style.display = textMatch && categoryMatch ? '' : 'none';
    });
}

export function sortTable(tableId, key) {
    const table = document.getElementById(tableId);
    const tableBody = table.querySelector('tbody');
    const isInventory = tableId === 'inventory-table';
    const data = isInventory ? State.getInventory() : State.getSuppliers();
    const headers = table.querySelectorAll('th[data-sort]');

    let direction = 'asc';
    if (currentSort[isInventory ? 'inventory' : 'suppliers'].key === key && currentSort[isInventory ? 'inventory' : 'suppliers'].direction === 'asc') {
        direction = 'desc';
    }
    currentSort[isInventory ? 'inventory' : 'suppliers'] = { key, direction };

    headers.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        th.querySelector('i').className = 'fas fa-sort';
    });

    const currentTh = table.querySelector(`th[data-sort="${key}"]`);
    currentTh.classList.add(`sort-${direction}`);
    currentTh.querySelector('i').className = `fas fa-sort-${direction === 'asc' ? 'up' : 'down'}`; // More specific icons if possible

    const sortedData = [...data].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Handle numeric sorting
        if (typeof valA === 'number' && typeof valB === 'number') {
            return direction === 'asc' ? valA - valB : valB - valA;
        }

        // Handle string sorting (case-insensitive)
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (isInventory) renderInventoryTable(sortedData);
    else renderSuppliersTable(sortedData);
}

// --- Dashboard Rendering ---
function renderDashboard() {
    const inventory = State.getInventory();
    const suppliers = State.getSuppliers();
    const lowStockItems = inventory.filter(item => item.stock < (item.reorderLevel || 20)); // Assume 20 if no reorder level

    elements.widgetTotalItems.textContent = inventory.length;
    elements.widgetTotalSuppliers.textContent = suppliers.length;
    elements.widgetLowStock.textContent = lowStockItems.length;

    elements.widgetLowStockList.innerHTML = '';
    lowStockItems.slice(0, 5).forEach(item => { // Show top 5
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.stock} left)`;
        elements.widgetLowStockList.appendChild(li);
    });
    if(lowStockItems.length > 5) {
        const li = document.createElement('li');
        li.textContent = `...and ${lowStockItems.length - 5} more.`;
        elements.widgetLowStockList.appendChild(li);
    }
}


// --- Main Render Function ---
export function renderAll() {
    const inventory = State.getInventory();
    const suppliers = State.getSuppliers();

    renderInventoryTable(inventory);
    renderSuppliersTable(suppliers);
    updateInventoryFilterOptions();
    renderDashboard();
}
