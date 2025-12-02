/**
 * Floor Plans Interactive Script with URL Hash Support
 * SEO-friendly progressive enhancement approach
 * Works with static HTML elements for better SEO
 */

// Global variables
let currentPage = 1;
const itemsPerPage = 6;
let allFloorPlanElements = [];
let filteredElements = [];

// Debug: Log global variables
console.log('Global variables initialized:', { currentPage, itemsPerPage });

/**
 * Initialize the application when DOM is loaded
 */
function initializeApplication() {
    // Enable JavaScript functionality
    enableJavaScript();

    // Get all floor plan elements from static HTML
    initializeFloorPlanElements();

    // Initialize all components
    initializeTabs();
    initializeFilters();

    // Load state from URL hash
    loadStateFromURL();

    // Apply filters and show initial items (this will use the loaded state)
    applyFilters();
    showFloorPlans();
    renderPagination();

    // Test pagination logic
    testPaginationLogic();

    // Add keyboard navigation support
    initializeKeyboardNavigation();

    // Initialize analytics tracking (if needed)
    initializeAnalytics();
}

/**
 * Check if DOM is ready and initialize application
 */
function initWhenReady() {
    // Check if required elements are available
    const floorPlansGrid = document.getElementById('floor-plans-grid');
    const bedroomsFilter = document.getElementById('bedrooms');

    // If critical elements are not found, retry after a short delay
    if (!floorPlansGrid || !bedroomsFilter) {
        console.log('Waiting for DOM elements to be available...');
        setTimeout(initWhenReady, 100);
        return;
    }

    // All required elements are available, initialize
    initializeApplication();
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
    // DOM is already loaded, run immediately
    // Use setTimeout to ensure dynamically inserted content is available
    setTimeout(initWhenReady, 100);
}

/**
 * Enable JavaScript functionality and update DOM classes
 */
function enableJavaScript() {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
}

/**
 * Initialize floor plan elements from static HTML
 */
function initializeFloorPlanElements() {
    // Only select elements from the JS content section, not the SEO content
    const jsContentGrid = document.getElementById('floor-plans-grid');
    if (jsContentGrid) {
        allFloorPlanElements = Array.from(jsContentGrid.querySelectorAll('.floor-plan-card'));
    } else {
        allFloorPlanElements = [];
        console.error('floor-plans-grid element not found!');
    }
    filteredElements = [...allFloorPlanElements];

    // Debug: Log the number of elements found
    console.log(`=== initializeFloorPlanElements Debug ===`);
    console.log(`Found ${allFloorPlanElements.length} floor plan elements`);
    console.log(`Initial filtered elements: ${filteredElements.length}`);

    // List all elements found
    allFloorPlanElements.forEach((element, index) => {
        const title = element.querySelector('.floor-plan-title')?.textContent;
        console.log(`Element ${index}: ${title}`);

        if (!element.dataset.name || !element.dataset.description) {
            console.warn(`Floor plan element ${index} missing required data attributes:`, element);
        }
    });
    console.log(`=== End initializeFloorPlanElements Debug ===`);
}

/**
 * Initialize tab functionality with ARIA support
 */
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Update ARIA attributes
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Set active tab
            this.setAttribute('aria-selected', 'true');
            this.classList.add('active');
            document.getElementById(targetTab + '-panel').classList.add('active');

            // Update URL hash for tab
            updateURLHash({ tab: targetTab });

            // Track tab change for analytics
            trackEvent('tab_change', { tab: targetTab });
        });
    });
}

/**
 * Initialize filter functionality with debouncing
 */
function initializeFilters() {
    const bedroomsFilter = document.getElementById('bedrooms');
    const priceRangeFilter = document.getElementById('price-range');
    const movingDateFilter = document.getElementById('moving-date');
    const sortFilter = document.getElementById('sort-by');

    console.log('Initializing filters:', {
        bedrooms: !!bedroomsFilter,
        priceRange: !!priceRangeFilter,
        movingDate: !!movingDateFilter,
        sort: !!sortFilter
    });

    // Immediate filter for select elements
    [bedroomsFilter, priceRangeFilter, movingDateFilter, sortFilter].forEach((filter, index) => {
        if (filter) {
            const filterName = ['bedrooms', 'price-range', 'moving-date', 'sort-by'][index];
            filter.addEventListener('change', function () {
                console.log(`${filterName} filter changed:`, this.value);
                applyFilters();
                updateURLHash();
            });
        } else {
            console.warn(`Filter element not found: ${['bedrooms', 'price-range', 'moving-date', 'sort-by'][index]}`);
        }
    });
}

/**
 * Reset all filters to show all items
 */
function resetFilters() {
    const bedroomsElement = document.getElementById('bedrooms');
    const priceRangeElement = document.getElementById('price-range');
    const movingDateElement = document.getElementById('moving-date');
    const sortElement = document.getElementById('sort-by');

    if (bedroomsElement) bedroomsElement.value = '';
    if (priceRangeElement) priceRangeElement.value = '';
    if (movingDateElement) movingDateElement.value = '';
    if (sortElement) sortElement.value = '';

    // Reset filtered elements to show all
    filteredElements = [...allFloorPlanElements];
    console.log('Filters reset, showing all elements:', filteredElements.length);
}

/**
 * Apply filters to floor plans elements
 */
function applyFilters() {
    const bedroomsElement = document.getElementById('bedrooms');
    const priceRangeElement = document.getElementById('price-range');
    const movingDateElement = document.getElementById('moving-date');
    const sortElement = document.getElementById('sort-by');

    // Add null checks for form elements
    if (!bedroomsElement || !priceRangeElement || !movingDateElement || !sortElement) {
        console.warn('Filter elements not found');
        return;
    }

    const bedrooms = bedroomsElement.value;
    const priceRange = priceRangeElement.value;
    const movingDate = movingDateElement.value;
    const sortBy = sortElement.value;

    console.log('=== Applying filters ===');
    console.log('Filter values:', { bedrooms, priceRange, movingDate, sortBy });
    console.log('Total elements to filter:', allFloorPlanElements.length);

    filteredElements = allFloorPlanElements.filter(element => {
        // Add null checks for data attributes
        if (!element.dataset) {
            console.warn('Element missing dataset:', element);
            return false;
        }

        const elementBedrooms = parseInt(element.dataset.bedrooms) || 0;
        const elementPrice = parseInt(element.dataset.price) || 0;
        const elementAvailability = element.dataset.availability;
        const elementName = (element.dataset.name || '').toLowerCase();

        // Bedrooms filter
        if (bedrooms && elementBedrooms !== parseInt(bedrooms)) {
            console.log(`Filtered out ${elementName} - bedrooms mismatch: ${elementBedrooms} vs ${bedrooms}`);
            return false;
        }

        // Price range filter
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => parseInt(p));
            if (max && (elementPrice < min || elementPrice > max)) {
                console.log(`Filtered out ${elementName} - price out of range: ${elementPrice} not in ${min}-${max}`);
                return false;
            } else if (!max && elementPrice < min) {
                console.log(`Filtered out ${elementName} - price too low: ${elementPrice} < ${min}`);
                return false;
            }
        }

        // Moving date filter - check if selected availability is contained in the element's availability string
        if (movingDate && !elementAvailability.includes(movingDate)) {
            console.log(`Filtered out ${elementName} - availability mismatch: ${elementAvailability} does not contain ${movingDate}`);
            return false;
        }

        console.log(`Element ${elementName} passed all filters`);
        return true;
    });

    console.log(`Filtered elements count: ${filteredElements.length}`);

    // Apply sorting if specified
    if (sortBy) {
        sortFloorPlans(filteredElements, sortBy);
    }

    currentPage = 1;
    showFloorPlans();
    renderPagination();

    // Update View links with current filter parameters
    updateViewLinks();

    // Track filter usage
    trackEvent('filter_applied', {
        bedrooms,
        priceRange,
        movingDate,
        sortBy,
        resultsCount: filteredElements.length
    });
}

/**
 * Sort floor plans based on price value
 */
function sortFloorPlans(elements, sortBy) {
    console.log(`=== Sorting floor plans by: ${sortBy} ===`);

    // Sort the elements array
    elements.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;

        if (sortBy === 'rent-low-high') {
            return priceA - priceB; // Low to High
        } else if (sortBy === 'rent-high-low') {
            return priceB - priceA; // High to Low
        }

        return 0; // Default (no sorting)
    });

    // Reorder the DOM elements to match the sorted array
    const floorPlansGrid = document.getElementById('floor-plans-grid');
    if (floorPlansGrid) {
        // Remove all elements from DOM
        elements.forEach(element => {
            floorPlansGrid.removeChild(element);
        });

        // Re-append elements in sorted order
        elements.forEach(element => {
            floorPlansGrid.appendChild(element);
        });
    }

    console.log(`Sorted ${elements.length} floor plans by ${sortBy}`);
    console.log('=== End sorting ===');
}

/**
 * Update View links with current filter parameters
 */
function updateViewLinks() {
    const bedroomsElement = document.getElementById('bedrooms');
    const priceRangeElement = document.getElementById('price-range');
    const movingDateElement = document.getElementById('moving-date');
    const sortElement = document.getElementById('sort-by');

    // Get current filter values
    const bedrooms = bedroomsElement ? bedroomsElement.value : '';
    const priceRange = priceRangeElement ? priceRangeElement.value : '';
    const movingDate = movingDateElement ? movingDateElement.value : '';
    const sortBy = sortElement ? sortElement.value : '';

    // Build URL parameters
    const params = new URLSearchParams();
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (priceRange) params.append('price', priceRange);
    if (movingDate) params.append('moving-date', movingDate);
    if (sortBy) params.append('sort', sortBy);

    const queryString = params.toString();

    console.log('=== Updating View links ===');
    console.log('Current filters:', { bedrooms, priceRange, movingDate, sortBy });
    console.log('Query string:', queryString);

    // Update all View links
    const viewLinks = document.querySelectorAll('.apartment-actions .btn');
    viewLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        if (currentHref && currentHref.includes('apartments?floorplan=')) {
            // Extract the floorplan parameter
            const floorPlanMatch = currentHref.match(/floorplan=(\d+)/);
            if (floorPlanMatch) {
                const floorPlanId = floorPlanMatch[1];
                const newHref = queryString ?
                    `apartments?floorplan=${floorPlanId}&${queryString}` :
                    `apartments?floorplan=${floorPlanId}`;

                link.setAttribute('href', newHref);
                console.log(`Updated link for floor plan ${floorPlanId}: ${newHref}`);
            }
        }
    });

    console.log('=== End updating View links ===');
}

/**
 * Show/hide floor plans based on current page and filters
 */
function showFloorPlans() {
    const noResults = document.getElementById('no-results');
    const loading = document.getElementById('loading');

    if (loading) loading.style.display = 'none';

    // Hide all floor plan elements first
    allFloorPlanElements.forEach(element => {
        element.style.display = 'none';
    });

    if (filteredElements.length === 0) {
        if (noResults) noResults.style.display = 'block';
        console.log('No filtered elements found, showing no results');
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Calculate which elements to show for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const elementsToShow = filteredElements.slice(startIndex, endIndex);

    // Debug logging
    console.log(`=== showFloorPlans Debug ===`);
    console.log(`currentPage: ${currentPage}`);
    console.log(`itemsPerPage: ${itemsPerPage}`);
    console.log(`filteredElements.length: ${filteredElements.length}`);
    console.log(`startIndex: ${startIndex}`);
    console.log(`endIndex: ${endIndex}`);
    console.log(`elementsToShow.length: ${elementsToShow.length}`);

    // Show the elements for current page
    elementsToShow.forEach((element, index) => {
        element.style.display = 'block';
        const title = element.querySelector('.floor-plan-title')?.textContent;
        console.log(`Showing element ${startIndex + index}: ${title}`);
    });

    console.log(`=== End showFloorPlans Debug ===`);
}

/**
 * Render pagination with accessibility support
 */
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredElements.length / itemsPerPage);

    console.log(`=== renderPagination Debug ===`);
    console.log(`filteredElements.length: ${filteredElements.length}`);
    console.log(`itemsPerPage: ${itemsPerPage}`);
    console.log(`totalPages: ${totalPages}`);
    console.log(`Math.ceil(${filteredElements.length} / ${itemsPerPage}) = ${totalPages}`);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        console.log('Only 1 page or less, hiding pagination');
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})"
                aria-label="Go to previous page">
            Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})"
                        aria-label="Go to page ${i}"
                        ${i === currentPage ? 'aria-current="page"' : ''}>
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span aria-hidden="true">...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})"
                aria-label="Go to next page">
            Next
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

/**
 * Change page with smooth scrolling and URL update
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredElements.length / itemsPerPage);
    console.log(`changePage called: page=${page}, currentPage=${currentPage}, totalPages=${totalPages}, filteredElements=${filteredElements.length}`);

    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        console.log(`Setting currentPage to: ${currentPage}`);
        showFloorPlans();
        renderPagination();

        // Update URL hash
        updateURLHash({ page: currentPage });

        // Smooth scroll to top of floor plans section
        const targetElement = document.getElementById('floor-plans-grid');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Track page change
        trackEvent('page_change', { page, totalPages });
    } else {
        console.warn(`Invalid page number: ${page}. Valid range: 1-${totalPages}`);
    }
}

/**
 * Update URL hash with current state
 */
function updateURLHash(params = {}) {
    const currentHash = getCurrentHashParams();

    // Merge current params with new params
    const newParams = { ...currentHash, ...params };

    // Remove empty values
    Object.keys(newParams).forEach(key => {
        if (!newParams[key] || newParams[key] === '') {
            delete newParams[key];
        }
    });

    // Build hash string
    const hashString = Object.keys(newParams)
        .map(key => `${key}=${encodeURIComponent(newParams[key])}`)
        .join('&');

    const newHash = hashString ? `#${hashString}` : '';

    // Update URL without triggering page reload
    if (window.history && window.history.replaceState) {
        const newURL = window.location.pathname + window.location.search + newHash;
        window.history.replaceState(null, null, newURL);
        console.log('URL hash updated:', newHash);
    }
}

/**
 * Get current hash parameters as object
 */
function getCurrentHashParams() {
    const hash = window.location.hash.substring(1);
    const params = {};

    if (hash) {
        hash.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }

    return params;
}

/**
 * Load state from URL hash on page load
 */
function loadStateFromURL() {
    // const params = getCurrentHashParams();
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries()); // Convert to object

    console.log('=== Loading state from URL ===');
    console.log('URL params:', params);

    // Set tab if specified
    if (params.tab) {
        const tabButton = document.querySelector(`[data-tab="${params.tab}"]`);
        if (tabButton) {
            console.log('Setting tab to:', params.tab);
            tabButton.click();
        }
    }

    // Set filters
    if (params.bedrooms) {
        const bedroomsElement = document.getElementById('bedrooms');
        if (bedroomsElement) {
            bedroomsElement.value = params.bedrooms;
            console.log('Set bedrooms filter to:', params.bedrooms);
        }
    }


    if (params.price) {
        const priceElement = document.getElementById('price-range');
        if (priceElement) {
            priceElement.value = params.price;
            console.log('Set price filter to:', params.price);
        }
    }

    if (params['moving-date']) {
        const movingDateElement = document.getElementById('moving-date');
        if (movingDateElement) {
            movingDateElement.value = params['moving-date'];
            console.log('Set moving date filter to:', params['moving-date']);
        }
    }

    if (params.sort) {
        const sortElement = document.getElementById('sort-by');
        if (sortElement) {
            sortElement.value = params.sort;
            console.log('Set sort filter to:', params.sort);
        }
    }


    // Set page
    if (params.page) {
        const page = parseInt(params.page);
        if (page > 0) {
            currentPage = page;
            console.log('Set current page to:', currentPage);
        }
    }

    console.log('State loaded from URL:', {
        tab: params.tab,
        bedrooms: params.bedrooms,
        price: params.price,
        'moving-date': params['moving-date'],
        sort: params.sort,
        page: params.page
    });
    console.log('=== End loading state from URL ===');
}


/**
 * Test pagination logic to verify it's working correctly
 */
function testPaginationLogic() {
    console.log('=== Testing Pagination Logic ===');
    console.log(`Total elements: ${filteredElements.length}`);
    console.log(`Items per page: ${itemsPerPage}`);
    console.log(`Total pages: ${Math.ceil(filteredElements.length / itemsPerPage)}`);

    // Test each page
    const totalPages = Math.ceil(filteredElements.length / itemsPerPage);
    for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const elementsForPage = filteredElements.slice(startIndex, endIndex);
        console.log(`Page ${page}: elements ${startIndex} to ${endIndex - 1} (${elementsForPage.length} items)`);
    }
    console.log('=== End Pagination Test ===');
}

/**
 * Initialize keyboard navigation support
 */
function initializeKeyboardNavigation() {
    // Add keyboard support for tabs
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            // Ensure focus is visible
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Initialize analytics tracking (placeholder)
 */
function initializeAnalytics() {
    // This would integrate with your analytics service
    // Example: Google Analytics, Adobe Analytics, etc.
    console.log('Analytics initialized');
}

/**
 * Track events for analytics
 */
function trackEvent(eventName, eventData = {}) {
    // This would send data to your analytics service
    console.log('Event tracked:', eventName, eventData);

    // Example Google Analytics 4 implementation:
    // gtag('event', eventName, eventData);
}

/**
 * Utility function to format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Error handling for failed operations
 */
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);

    // Track error for monitoring
    trackEvent('error', {
        context,
        error: error.message,
        timestamp: new Date().toISOString()
    });

    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Something went wrong. Please try again.';
    errorMessage.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
        border: 1px solid #f5c6cb;
    `;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorMessage, container.firstChild);

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        }, 5000);
    }
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyFilters,
        changePage,
        viewFloorPlan,
        scheduleTour,
        formatCurrency,
        debounce,
        updateURLHash,
        getCurrentHashParams,
        loadStateFromURL
    };
}