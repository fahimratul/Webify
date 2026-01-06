// Product data
const products = [
    {
        id: 1,
        title: 'Modern Dashboard UI Kit',
        author: 'Sarah Design',
        rating: 4.8,
        downloads: 1234,
        likes: 523,
        price: '$41',
        type: 'paid',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        title: 'Website Template Pack',
        author: 'UX Masters',
        rating: 4.9,
        downloads: 3421,
        likes: 892,
        type: 'free',
        category: 'webpage',
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        title: 'Mobile App Interface',
        author: 'AppCraft Studio',
        rating: 4.7,
        downloads: 2103,
        likes: 651,
        price: '$79',
        type: 'paid',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
    },
    // ADDED: More products for better search testing
    {
        id: 4,
        title: 'E-commerce Dashboard',
        author: 'Design Pro',
        rating: 4.6,
        downloads: 1890,
        likes: 432,
        price: '$55',
        type: 'paid',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
        id: 5,
        title: 'Portfolio Template',
        author: 'Creative Minds',
        rating: 4.9,
        downloads: 2567,
        likes: 789,
        type: 'free',
        category: 'portfolio',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
    },
    {
        id: 6,
        title: 'Landing Page Kit',
        author: 'Web Wizards',
        rating: 4.8,
        downloads: 3210,
        likes: 921,
        type: 'free',
        category: 'webpage',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
    }
];

// State
let currentCategory = 'all';
let currentType = 'all';
let searchQuery = ''; // ADDED: New state variable for search

// Render products function
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    const filteredProducts = products.filter(function(product) {
        const categoryMatch = currentCategory === 'all' || 
            (currentCategory === 'free' && product.type === 'free') ||
            (currentCategory === 'premium' && product.type === 'paid');
        
        const typeMatch = currentType === 'all' || product.category === currentType;
        
        // ADDED: Search filter logic
        const searchMatch = searchQuery === '' || 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        return categoryMatch && typeMatch && searchMatch; // CHANGED: Added searchMatch
    });

    // ADDED: Show "no results" message if nothing found
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6b7280; font-size: 1.25rem;">No products found matching your criteria</div>';
        return;
    }

    grid.innerHTML = filteredProducts.map(function(product) {
        return '<div class="product-card">' +
            '<div class="product-image">' +
                '<img src="' + product.image + '" alt="' + product.title + '">' +
                '<div class="product-tag ' + product.type + '">' +
                    (product.type === 'free' ? 'Free' : product.price) +
                '</div>' +
                '<div class="product-overlay">' +
                    '<button class="overlay-btn preview">' +
                        '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>' +
                        '</svg>' +
                        'Preview' +
                    '</button>' +
                    (product.type === 'paid' ? '<button class="overlay-btn buy">Buy</button>' : '') +
                '</div>' +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-header">' +
                    '<div>' +
                        '<div class="product-title">' + product.title + '</div>' +
                        '<div class="product-author">by ' + product.author + '</div>' +
                    '</div>' +
                    '<button class="heart-btn">' +
                        '<svg class="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
                '<div class="product-stats">' +
                    '<div class="stat">' +
                        '<svg class="icon star-icon" fill="currentColor" viewBox="0 0 20 20">' +
                            '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>' +
                        '</svg>' +
                        '<span>' + product.rating + '</span>' +
                    '</div>' +
                    '<div class="stat">' +
                        '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>' +
                        '</svg>' +
                        '<span>' + product.downloads.toLocaleString() + '</span>' +
                    '</div>' +
                    '<div class="stat">' +
                        '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>' +
                        '</svg>' +
                        '<span>' + product.likes + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ADDED: Search functionality - listens for input in search bar
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', function(e) {
    searchQuery = e.target.value;
    renderProducts();
});

// Category filter event listeners
document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        currentCategory = this.dataset.category;
        renderProducts();
    });
});

// Type filter event listeners
document.querySelectorAll('.type-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        currentType = this.dataset.type;
        renderProducts();
    });
});

// Initial render
renderProducts();