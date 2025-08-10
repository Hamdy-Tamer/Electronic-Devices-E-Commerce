// DOM Elements
const ProductName = document.getElementById("ProductName");
const ProductQty = document.getElementById("ProductQty");
const ProductCate = document.getElementById("ProductCate");
const ProductDesc = document.getElementById("ProductDesc");
const ProductPayment = document.getElementById("ProductPayment");
const mainBtn = document.getElementById("mainBtn");
const searchInput = document.getElementById("Search");

// Product Data
let ProductList = [];
let UpdateIndex;
let inCase = 'create';

// Payment Method Colors
const paymentColors = {
    'Visa': 'bg-success',
    'Mastercard': 'bg-primary',
    'American Express': 'bg-info text-dark',
    'Discover': 'bg-warning text-dark',
    'default': 'bg-light text-dark'
};

// Initialize the application
function init() {
    loadProducts();
    setupEventListeners();
}

// Load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        ProductList = JSON.parse(storedProducts);
        displayProduct();
    }
}

// Set up event listeners
function setupEventListeners() {
    mainBtn.addEventListener('click', addProduct);
    searchInput.addEventListener('input', () => searchProduct(searchInput.value));
    window.addEventListener('resize', displayProduct);
    
    // Form validation on input
    ProductName.addEventListener('input', validationProductName);
}

// Add or Update Product
function addProduct() {
    if (!validateForm()) return;

    const product = createProductObject();
    
    if (isDuplicateProduct(product.name)) {
        showAlert("This product already exists!", 'warning');
        return;
    }

    if (inCase === 'create') {
        ProductList.push(product);
    } else {
        ProductList[UpdateIndex] = product;
        resetFormState();
    }

    updateUI();
}

// Validate entire form
function validateForm() {
    return validationProductName();
}

// Create product object from form data
function createProductObject() {
    return {
        name: ProductName.value.trim(),
        qty: ProductQty.value,        
        cate: ProductCate.value,
        desc: ProductDesc.value,
        payment: ProductPayment.value
    };
}

// Check for duplicate product
function isDuplicateProduct(name) {
    return inCase === 'create' && 
           ProductList.some(p => p.name.toLowerCase() === name.toLowerCase());
}

// Update UI after changes
function updateUI() {
    clearProduct();
    displayProduct();
    saveToLocalStorage();
}

// Save products to localStorage
function saveToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(ProductList));
}

// Display Products
function displayProduct() {
    renderTableView();
    renderMobileView();
}

// Render table view for desktop
function renderTableView() {
    const tableHTML = `
        ${ProductList.map((product, index) => `
        <tr>
            <td class="fw-bold bg-info">${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.qty}</td>
            <td>${product.cate}</td>
            <td><span class="badge ${getPaymentBadgeClass(product.payment)}">${product.payment || '-'}</span></td>
            <td class="text-truncate" title="${product.desc || ''}">${product.desc || '-'}</td>
            <td><button onclick="UpdateProduct(${index})" class="btn btn-sm btn-outline-warning"><i class="fas fa-edit"></i></button></td>
            <td><button onclick="deleteProduct(${index})" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('')}`;
    
    document.getElementById("Tbody").innerHTML = tableHTML;
}

// Render mobile cards view
function renderMobileView() {
    const mobileHTML = ProductList.map((product, index) => `
        <div class="col">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title mb-1">${product.name}</h5>
                    </div>
                    <div class="d-flex flex-wrap gap-1 my-2">
                        <span class="badge bg-secondary">${product.cate}</span>
                        <span class="badge bg-info">Qty: ${product.qty}</span>
                        <span class="badge ${getPaymentBadgeClass(product.payment)}">
                            ${product.payment || 'Not specified'}
                        </span>
                    </div>
                    <p class="card-text small" title="${product.desc || ''}">${product.desc || 'No description'}</p>
                    <div class="d-flex gap-2 mt-3">
                        <button onclick="UpdateProduct(${index})" class="btn btn-sm btn-outline-primary flex-grow-1">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button onclick="deleteProduct(${index})" class="btn btn-sm btn-outline-danger flex-grow-1">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>`).join('');
    
    document.getElementById("mobile-products-view").innerHTML = mobileHTML;
}

// Get badge class for payment method
function getPaymentBadgeClass(paymentMethod) {
    if (!paymentMethod) return paymentColors.default;
    return paymentColors[paymentMethod] || paymentColors.default;
}

// Clear Form
function clearProduct() {
    [ProductName, ProductDesc].forEach(field => field.value = "");
    ProductCate.value = "";
    ProductPayment.value = "";
    ProductQty.value = 1;
}

// Delete Product
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        ProductList.splice(index, 1);
        updateUI();
    }
}

// Prepare Update
function UpdateProduct(index) {
    const product = ProductList[index];
    ProductName.value = product.name;
    ProductQty.value = product.qty;
    ProductCate.value = product.cate;
    ProductDesc.value = product.desc;
    ProductPayment.value = product.payment;
    
    mainBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Product';
    UpdateIndex = index;
    inCase = 'update';
}

// Reset form to create mode
function resetFormState() {
    mainBtn.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add Product';
    inCase = 'create';
}

function searchProduct(searchTerm) {
    searchTerm = searchTerm.trim().toLowerCase();

    // Clear previous results/messages
    clearSearchResults();

    const tableElement = document.querySelector("#Tbody").closest("table");
    const mobileViewElement = document.getElementById("mobile-products-view"); // mobile cards container

    if (!searchTerm) {
        // Restore full product list
        tableElement.classList.remove("d-none");
        mobileViewElement.classList.remove("d-none");
        displayProduct();
        return;
    }

    const matchingProducts = ProductList.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    if (matchingProducts.length > 0) {
        // Show table and mobile cards, display only matching rows/cards
        tableElement.classList.remove("d-none");
        mobileViewElement.classList.remove("d-none");
        displaySearchResults(matchingProducts, searchTerm);
    } else {
        // Hide table and mobile cards, show message only
        tableElement.classList.add("d-none");
        mobileViewElement.classList.add("d-none");
        showNoResultsMessage(searchTerm);
    }
}

// Clear previous search results
function clearSearchResults() {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) existingMessage.remove();
}

// Display search results
function displaySearchResults(products, searchTerm) {
    // Highlight matching text in both views
    const highlight = text => text.replace(
        new RegExp(searchTerm, 'gi'), 
        match => `<span class="text-danger fw-bolder">${match}</span>`
    );

    // Update table view
    document.getElementById("Tbody").innerHTML = products.map((product, index) => `
        <tr>
            <td class="fw-bold bg-info">${index + 1}</td>
            <td>${highlight(product.name)}</td>
            <td>${product.qty}</td>
            <td>${product.cate}</td>
            <td><span class="badge ${getPaymentBadgeClass(product.payment)}">${product.payment || '-'}</span></td>
            <td class="text-truncate">${product.desc || '-'}</td>
            <td><button onclick="UpdateProduct(${ProductList.indexOf(product)})" class="btn btn-sm btn-outline-warning"><i class="fas fa-edit"></i></button></td>
            <td><button onclick="deleteProduct(${ProductList.indexOf(product)})" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('');

    // Update mobile view
    document.getElementById("mobile-products-view").innerHTML = products.map(product => `
        <div class="col">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title mb-1">${highlight(product.name)}</h5>
                    </div>
                    <div class="d-flex flex-wrap gap-1 my-2">
                        <span class="badge bg-secondary">${product.cate}</span>
                        <span class="badge bg-info">Qty: ${product.qty}</span>
                        <span class="badge ${getPaymentBadgeClass(product.payment)}">
                            ${product.payment || 'Not specified'}
                        </span>
                    </div>
                    <p class="card-text small text-truncate">${product.desc || 'No description'}</p>
                    <div class="d-flex gap-2 mt-3">
                        <button onclick="UpdateProduct(${ProductList.indexOf(product)})" class="btn btn-sm btn-outline-primary flex-grow-1">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button onclick="deleteProduct(${ProductList.indexOf(product)})" class="btn btn-sm btn-outline-danger flex-grow-1">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>`).join('');
}

// Show no results message
function showNoResultsMessage(searchTerm) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-results-message alert alert-warning text-center py-3';
    messageDiv.innerHTML = `No products found for '<strong>${searchTerm}</strong>'`;
    document.querySelector('#management .container').appendChild(messageDiv);
}

// Show alert message
function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('#management .container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
}

// Validation Name
function validationProductName() {
    const regex = /^(?=.{2,30}$)([A-Z][a-zA-Z0-9]*)(\s[A-Z][a-zA-Z0-9]*)*$/;
    const isValid = regex.test(ProductName.value);
    document.getElementById('nameError').classList.toggle('d-none', isValid);
    return isValid;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);