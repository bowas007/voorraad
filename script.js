// Product data - easily editable JSON structure
const defaultProducts = [
    { id: 1, name: "Cola bottles", category: "Soft Drinks", count: null, target: 0 },
    { id: 2, name: "Iced Tea bottles", category: "Soft Drinks", count: null, target: 0 },
    { id: 3, name: "Beer bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 4, name: "Wine bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 5, name: "Fries", category: "Food", count: null, target: 0 },
    { id: 6, name: "Cheese sticks", category: "Food", count: null, target: 0 },
    { id: 7, name: "Chips", category: "Snacks", count: null, target: 0 },
    { id: 8, name: "Nuts", category: "Snacks", count: null, target: 0 },
    { id: 9, name: "Beer kegs", category: "Alcoholic", count: null, target: 0 },
    { id: 10, name: "Cola crates", category: "Soft Drinks", count: null, target: 0 },
    { id: 11, name: "Iced Tea crates", category: "Soft Drinks", count: null, target: 0 },
    { id: 12, name: "Water bottles", category: "Soft Drinks", count: null, target: 0 },
    { id: 13, name: "Lemonade bottles", category: "Soft Drinks", count: null, target: 0 },
    { id: 14, name: "Whiskey bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 15, name: "Vodka bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 16, name: "Gin bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 17, name: "Rum bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 18, name: "Tequila bottles", category: "Alcoholic", count: null, target: 0 },
    { id: 19, name: "Burgers", category: "Food", count: null, target: 0 },
    { id: 20, name: "Pizza slices", category: "Food", count: null, target: 0 },
    { id: 21, name: "Nachos", category: "Food", count: null, target: 0 },
    { id: 22, name: "Popcorn", category: "Snacks", count: null, target: 0 },
    { id: 23, name: "Pretzels", category: "Snacks", count: null, target: 0 },
    { id: 24, name: "Ice cream", category: "Desserts", count: null, target: 0 },
    { id: 25, name: "Cake slices", category: "Desserts", count: null, target: 0 }
];

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

class StockCounter {
    constructor() {
        console.log('StockCounter constructor called');
        this.products = this.loadProducts();
        this.selectedCategories = this.loadSelectedCategories();
        this.searchTerm = '';
        this.currentPage = 1;
        this.productsPerPage = 10;
        console.log('StockCounter constructor completed, calling init...');
        this.init();
    }

    // Load products from localStorage or use defaults
    loadProducts() {
        const saved = localStorage.getItem('barStockProducts');
        if (saved) {
            try {
                const products = JSON.parse(saved);
                // Ensure all products have a target field with default value 0 and count null if not set
                return products.map(product => ({
                    ...product,
                    target: product.target !== undefined ? product.target : 0,
                    count: product.count !== undefined ? product.count : null
                }));
            } catch (e) {
                console.warn('Failed to load saved products, using defaults');
                return [...defaultProducts];
            }
        }
        return [...defaultProducts];
    }

    // Load selected categories from localStorage or use all categories
    loadSelectedCategories() {
        const saved = localStorage.getItem('barStockSelectedCategories');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load selected categories, using all');
            }
        }
        
        // Get all available categories from products and saved categories
        const productCategories = [...new Set(this.products.map(p => p.category))];
        const savedCategories = this.loadSavedCategories();
        const allCategories = [...new Set([...productCategories, ...savedCategories])];
        
        // Check if there are uncategorized products
        const hasUncategorizedProducts = this.products.some(p => !p.category || p.category === '');
        
        // Default to all categories if available, otherwise use defaults
        if (allCategories.length > 0) {
            // Add "No Category" if there are uncategorized products
            if (hasUncategorizedProducts && !allCategories.includes('No Category')) {
                allCategories.push('No Category');
            }
            return allCategories;
        }
        
        // If no categories found, check if we should include "No Category"
        if (hasUncategorizedProducts) {
            return ['No Category'];
        }
        
        return ['Soft Drinks', 'Alcoholic', 'Food', 'Snacks', 'Desserts', 'Other'];
    }

    // Load saved categories from localStorage
    loadSavedCategories() {
        const saved = localStorage.getItem('barStockCategories');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load saved categories');
            }
        }
        return [];
    }

    // Save products to localStorage
    saveProducts() {
        localStorage.setItem('barStockProducts', JSON.stringify(this.products));
    }

    // Save selected categories to localStorage
    saveSelectedCategories() {
        localStorage.setItem('barStockSelectedCategories', JSON.stringify(this.selectedCategories));
    }

    // Initialize the app
    init() {
        console.log('Init method called');
        this.renderProducts();
        this.setupEventListeners();
        this.updateSummary();
        this.populateCategoryFilters();
        console.log('About to call setupOrderAdvice...');
        this.setupOrderAdvice();
        console.log('Init method completed');
    }

    // Set up all event listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Reset all button
        const resetAllBtn = document.getElementById('resetAll');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all counters to 0?')) {
                    this.resetAllCounters();
                }
            });
        } else {
            console.warn('Reset All button not found');
        }

        // Sound toggle button
        const soundToggleBtn = document.getElementById('soundToggle');
        if (soundToggleBtn) {
            // Load sound preference from localStorage
            this.soundEnabled = localStorage.getItem('barStockSoundEnabled') !== 'false';
            this.updateSoundToggleButton();
            
            soundToggleBtn.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem('barStockSoundEnabled', this.soundEnabled);
                this.updateSoundToggleButton();
            });
        } else {
            console.warn('Sound toggle button not found');
        }

        // Export button (removed since it doesn't exist in HTML)
        // const exportDataBtn = document.getElementById('exportData');
        // if (exportDataBtn) {
        //     exportDataBtn.addEventListener('click', () => {
        //         this.exportData();
        //     });
        // }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.currentPage = 1; // Reset to first page when searching
                this.renderProducts();
            });
        } else {
            console.warn('Search input not found');
        }

        // Select all categories button
        const selectAllBtn = document.getElementById('selectAll');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAllCategories();
            });
        } else {
            console.warn('Select All button not found');
        }

        // Clear all categories button
        const clearAllBtn = document.getElementById('clearAll');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.clearAllCategories();
            });
        } else {
            console.warn('Clear All button not found');
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.currentPage = 1; // Reset to first page when clearing search
                    this.renderProducts();
                }
            }
        });
        
        console.log('Event listeners setup completed');
    }

    // Update selected categories based on checkbox states
    updateSelectedCategories() {
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
        this.selectedCategories = [];
        
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.selectedCategories.push(checkbox.value);
            }
        });

        this.saveSelectedCategories();
        this.currentPage = 1; // Reset to first page when filters change
        this.renderProducts();
    }

    // Select all categories
    selectAllCategories() {
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        this.updateSelectedCategories();
    }

    // Clear all categories
    clearAllCategories() {
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateSelectedCategories();
    }

    // Populate category filters based on available products
    populateCategoryFilters() {
        const categoryCheckboxes = document.querySelector('.category-checkboxes');
        
        if (!categoryCheckboxes) {
            console.warn('Category checkboxes container not found');
            return;
        }
        
        // Get all available categories from products and saved categories
        const productCategories = [...new Set(this.products.map(p => p.category))];
        const savedCategories = this.loadSavedCategories();
        const availableCategories = [...new Set([...productCategories, ...savedCategories])];
        
        // Clear existing checkboxes
        categoryCheckboxes.innerHTML = '';
        
        if (availableCategories.length === 0) {
            categoryCheckboxes.innerHTML = '<p style="color: #718096; text-align: center; padding: 10px;">No categories available. Add categories in Manage Products.</p>';
            return;
        }
        
        // Add checkbox for "No Category" if there are products without category
        const hasUncategorizedProducts = this.products.some(p => !p.category || p.category === '');
        if (hasUncategorizedProducts) {
            const label = document.createElement('label');
            label.className = 'category-checkbox';
            label.innerHTML = `
                <input type="checkbox" value="No Category" ${this.selectedCategories.includes('No Category') ? 'checked' : ''}>
                <span class="checkbox-label">No Category</span>
            `;
            categoryCheckboxes.appendChild(label);
        }
        
        // Create checkboxes for each available category
        availableCategories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'category-checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${category}" ${this.selectedCategories.includes(category) ? 'checked' : ''}>
                <span class="checkbox-label">${category}</span>
            `;
            categoryCheckboxes.appendChild(label);
        });
        
        // Re-attach event listeners
        const checkboxes = categoryCheckboxes.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectedCategories();
            });
        });
    }

    // Render all products
    renderProducts() {
        const productList = document.getElementById('productList');
        
        if (!productList) {
            console.warn('Product list element not found');
            return;
        }
        
        productList.innerHTML = '';

        // Filter products based on search and categories
        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                (product.category || '').toLowerCase().includes(this.searchTerm.toLowerCase());
            const categorySelected = this.selectedCategories.includes(product.category || 'No Category');
            return matchesSearch && categorySelected;
        });

        if (!filteredProducts.length) {
            productList.innerHTML = `<p style="text-align: center; color: #718096; padding: 40px;">No products found matching your filters.</p>`;
            this.renderPagination(filteredProducts.length);
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(filteredProducts.length / this.productsPerPage);
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            const productElement = this.createProductElement(product);
            productList.appendChild(productElement);
        });

        this.renderPagination(filteredProducts.length);
    }

    // Create a single product element
    createProductElement(product) {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.dataset.productId = product.id;
        div.dataset.category = product.category;

        // Display "No Category" for products without a category
        const categoryDisplay = product.category || 'No Category';
        // Display unit information
        const unitDisplay = product.unit ? ` (${product.unit})` : '';

        // Show '-' if not counted yet
        const displayCount = product.count === null ? '-' : product.count;

        // Add checked class if counted
        if (product.count !== null) {
            div.classList.add('checked');
        }

        div.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}${unitDisplay}</div>
                <div class="product-category">${categoryDisplay}</div>
            </div>
            <div class="counter-controls">
                <button class="counter-btn btn-minus" data-action="decrease" data-product-id="${product.id}">
                    <i class="fas fa-minus"></i>
                </button>
                <div class="counter-display" data-product-id="${product.id}">${displayCount}</div>
                <button class="counter-btn btn-plus" data-action="increase" data-product-id="${product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;

        // Add event listeners for counter buttons
        const minusBtn = div.querySelector('.btn-minus');
        const plusBtn = div.querySelector('.btn-plus');

        minusBtn.addEventListener('click', () => this.updateCounter(product.id, -1));
        plusBtn.addEventListener('click', () => this.updateCounter(product.id, 1));

        return div;
    }

    // Play click sound
    playClickSound() {
        // Only play sound if enabled
        if (!this.soundEnabled) {
            return;
        }
        
        try {
            const audio = document.getElementById('clickSound');
            if (audio) {
                // Reset audio to beginning
                audio.currentTime = 0;
                
                // Play the sound and handle any errors
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn('Could not play click sound:', error);
                        // This is normal on some browsers that require user interaction first
                    });
                }
            }
        } catch (error) {
            console.warn('Error playing click sound:', error);
        }
    }

    // Update counter for a specific product
    updateCounter(productId, change) {
        this.playClickSound();
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const wasNotCounted = product.count === null;

        if (product.count === null) {
            if (change > 0) {
                product.count = 1;
            } else {
                product.count = 0;
            }
        } else {
            const newCount = Math.max(0, product.count + change);
            product.count = newCount;
        }

        // Update display
        const counterDisplay = document.querySelector(`[data-product-id="${productId}"].counter-display`);
        if (counterDisplay) {
            counterDisplay.textContent = product.count === null ? '-' : product.count;
            counterDisplay.classList.add('changed');
            setTimeout(() => counterDisplay.classList.remove('changed'), 300);
        }

        // Update product-item checked/animated class
        const productItem = document.querySelector(`.product-item[data-product-id="${productId}"]`);
        if (productItem) {
            if (product.count !== null) {
                productItem.classList.add('checked');
                if (wasNotCounted) {
                    productItem.classList.add('animated');
                    setTimeout(() => productItem.classList.remove('animated'), 500);
                }
            } else {
                productItem.classList.remove('checked');
            }
        }

        // Update minus button state
        const minusBtn = document.querySelector(`[data-product-id="${productId}"].btn-minus`);
        if (minusBtn) {
            minusBtn.disabled = product.count === null ? false : product.count === 0;
        }

        // Save to localStorage
        this.saveProducts();
        this.updateSummary();
    }

    // Reset all counters to 0
    resetAllCounters() {
        this.products.forEach(product => {
            product.count = null;
        });
        this.renderProducts();
        this.saveProducts();
        this.updateSummary();
    }

    // Update summary information
    updateSummary() {
        const totalItemsElement = document.getElementById('totalItems');
        const productsCountedElement = document.getElementById('productsCounted');
        
        if (!totalItemsElement || !productsCountedElement) {
            console.warn('Summary elements not found');
            return;
        }
        
        // Only count products that have been counted (count !== null)
        const totalItems = this.products.reduce((sum, product) => sum + (product.count !== null ? product.count : 0), 0);
        const productsCounted = this.products.filter(product => product.count !== null).length;

        totalItemsElement.textContent = totalItems;
        productsCountedElement.textContent = productsCounted;
    }

    // Export data as CSV (only visible products)
    exportData() {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const visibleProducts = Array.from(document.querySelectorAll('.product-item:not(.hidden)'));
        
        const visibleProductData = visibleProducts.map(item => {
            const productId = parseInt(item.dataset.productId);
            return this.products.find(p => p.id === productId);
        }).filter(Boolean);

        const csvContent = [
            'Product Name,Category,Unit,Count',
            ...visibleProductData.map(p => `"${p.name}","${p.category || ''}","${p.unit || ''}",${p.count}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bar-stock-${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Method to add a new product (for future admin functionality)
    addProduct(name, category, unit) {
        const newId = Math.max(...this.products.map(p => p.id)) + 1;
        const newProduct = {
            id: newId,
            name: name,
            category: category,
            unit: unit || '',
            count: null,
            target: 0
        };
        this.products.push(newProduct);
        this.renderProducts();
        this.saveProducts();
    }

    // Method to remove a product (for future admin functionality)
    removeProduct(productId) {
        this.products = this.products.filter(p => p.id !== productId);
        this.renderProducts();
        this.saveProducts();
        this.updateSummary();
    }

    // Render pagination controls
    renderPagination(totalFilteredProducts) {
        // Remove existing pagination if any
        const existingPagination = document.querySelectorAll('.pagination');
        existingPagination.forEach(pagination => pagination.remove());

        if (!totalFilteredProducts) {
            return;
        }

        const totalPages = Math.ceil(totalFilteredProducts / this.productsPerPage);
        if (totalPages <= 1) {
            return;
        }

        // Helper to generate compact page numbers with ellipsis
        function getPageList(current, total) {
            const pages = [];
            if (total <= 7) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                if (current > 3) pages.push(1);
                if (current > 4) pages.push('...');
                for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                    pages.push(i);
                }
                if (current < total - 3) pages.push('...');
                if (current < total - 2) pages.push(total);
            }
            return pages;
        }

        const createPagination = (position) => {
            const pagination = document.createElement('div');
            pagination.className = `pagination ${position}-pagination`;
            pagination.innerHTML = `
                <button class="pagination-btn" id="prevPage${position}" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="page-numbers" id="pageNumbers${position}"></div>
                <button class="pagination-btn" id="nextPage${position}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            `;

            // Generate page numbers (compact)
            const pageNumbers = pagination.querySelector(`#pageNumbers${position}`);
            const pageList = getPageList(this.currentPage, totalPages);
            pageList.forEach(page => {
                if (page === '...') {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'page-ellipsis';
                    ellipsis.textContent = '...';
                    pageNumbers.appendChild(ellipsis);
                } else {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-number ${page === this.currentPage ? 'active' : ''}`;
                    pageBtn.textContent = page;
                    pageBtn.addEventListener('click', () => {
                        this.currentPage = page;
                        this.renderProducts();
                    });
                    pageNumbers.appendChild(pageBtn);
                }
            });

            // Add event listeners for previous/next buttons
            pagination.querySelector(`#prevPage${position}`).addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProducts();
                }
            });

            pagination.querySelector(`#nextPage${position}`).addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProducts();
                }
            });

            return pagination;
        };

        // Add top pagination before product list
        const productList = document.getElementById('productList');
        if (!productList) {
            console.warn('Product list element not found for pagination');
            return;
        }
        
        const topPagination = createPagination('Top');
        productList.parentNode.insertBefore(topPagination, productList);

        // Add bottom pagination after product list
        const bottomPagination = createPagination('Bottom');
        productList.parentNode.insertBefore(bottomPagination, productList.nextSibling);
    }

    setupOrderAdvice() {
        console.log('Setting up order advice...');
        
        const orderAdviceBtn = document.getElementById('orderAdviceBtn');
        const orderAdviceModal = document.getElementById('orderAdviceModal');
        const closeOrderAdvice = document.getElementById('closeOrderAdvice');
        const orderAdviceList = document.getElementById('orderAdviceList');
        const exportOrderAdvice = document.getElementById('exportOrderAdvice');

        console.log('DOM elements found:', {
            orderAdviceBtn: !!orderAdviceBtn,
            orderAdviceModal: !!orderAdviceModal,
            closeOrderAdvice: !!closeOrderAdvice,
            orderAdviceList: !!orderAdviceList,
            exportOrderAdvice: !!exportOrderAdvice
        });

        if (!orderAdviceBtn) {
            console.error('Order advice button not found!');
            return;
        }

        if (!orderAdviceModal) {
            console.error('Order advice modal not found!');
            return;
        }

        if (!closeOrderAdvice) {
            console.error('Close order advice button not found!');
            return;
        }

        if (!orderAdviceList) {
            console.error('Order advice list not found!');
            return;
        }

        if (!exportOrderAdvice) {
            console.error('Export order advice button not found!');
            return;
        }

        console.log('Adding event listeners...');

        orderAdviceBtn.addEventListener('click', () => {
            console.log('Order advice button clicked!');
            this.renderOrderAdvice();
            orderAdviceModal.style.display = 'block';
        });

        closeOrderAdvice.addEventListener('click', () => {
            console.log('Close order advice clicked!');
            orderAdviceModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === orderAdviceModal) {
                console.log('Modal background clicked!');
                orderAdviceModal.style.display = 'none';
            }
        });

        exportOrderAdvice.addEventListener('click', () => {
            console.log('Export order advice clicked!');
            this.exportOrderAdviceCSV();
        });

        console.log('Order advice setup complete!');
    }

    renderOrderAdvice() {
        console.log('Rendering order advice...');
        console.log('Current products:', this.products);
        
        const orderAdviceList = document.getElementById('orderAdviceList');
        if (!orderAdviceList) {
            console.error('Order advice list element not found!');
            return;
        }
        
        orderAdviceList.innerHTML = '';
        
        // Only show products with a target and where count < target
        const toOrder = this.products.filter(p => {
            const hasTarget = typeof p.target === 'number';
            const needsOrdering = p.target > (p.count || 0);
            console.log(`Product ${p.name}: target=${p.target}, count=${p.count}, hasTarget=${hasTarget}, needsOrdering=${needsOrdering}`);
            return hasTarget && needsOrdering;
        });
        
        console.log('Products to order:', toOrder);
        
        if (toOrder.length === 0) {
            console.log('No products need ordering, showing "Alles is op voorraad!"');
            orderAdviceList.innerHTML = '<p style="color: #38a169; text-align: center;">Alles is op voorraad!</p>';
            return;
        }
        
        console.log('Creating order advice table...');
        
        // Header row
        const header = document.createElement('div');
        header.className = 'order-advice-row';
        header.innerHTML = `
            <div class="order-advice-product">Product</div>
            <div class="order-advice-unit">Unit</div>
            <div class="order-advice-target">Target</div>
            <div class="order-advice-actual">Actual</div>
            <div class="order-advice-order">Order</div>
        `;
        orderAdviceList.appendChild(header);
        
        toOrder.forEach(p => {
            const row = document.createElement('div');
            row.className = 'order-advice-row';
            row.innerHTML = `
                <div class="order-advice-product">${p.name}</div>
                <div class="order-advice-unit">${p.unit || ''}</div>
                <div class="order-advice-target">${p.target}</div>
                <div class="order-advice-actual">${p.count || 0}</div>
                <div class="order-advice-order">${p.target - (p.count || 0)}</div>
            `;
            orderAdviceList.appendChild(row);
        });
        
        console.log('Order advice rendered successfully!');
    }

    exportOrderAdviceCSV() {
        // Only export products that need to be ordered
        const toOrder = this.products.filter(p => typeof p.target === 'number' && p.target > (p.count || 0));
        if (toOrder.length === 0) {
            alert('Alles is op voorraad!');
            return;
        }
        const csvContent = [
            'Product,Unit,Target,Actual,Order',
            ...toOrder.map(p => `"${p.name}","${p.unit || ''}",${p.target},${p.count || 0},${p.target - (p.count || 0)}`)
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bestellijst-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    updateSoundToggleButton() {
        const soundToggleBtn = document.getElementById('soundToggle');
        if (soundToggleBtn) {
            if (this.soundEnabled) {
                soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
            } else {
                soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('Creating new StockCounter instance...');
    new StockCounter();
    console.log('StockCounter instance created');
});

// Add some helpful console messages
console.log('🍺 Bar Stock Counter loaded!');
console.log('💡 Tips:');
console.log('   - Use the category filters to focus on specific areas');
console.log('   - Use the search box to find products quickly');
console.log('   - Press ESC to clear search');
console.log('   - Data is automatically saved to your browser');
console.log('   - Use the Export button to download your counts as CSV');
console.log('   - Go to "Manage Products" to add/edit categories and products'); 