// Product data with HTML/CSS templates
const products = [
    {
        id: 1,
        title: 'Modern Dashboard UI Kit',
        author: 'Sarah Design',
        rating: 4.8,
        downloads: 1234,
        likes: 523,
        price: '41',
        type: 'paid',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        html: `
            <div class="dashboard">
                <header class="dashboard-header">
                    <h1>Dashboard</h1>
                    <div class="user-info">
                        <span>Welcome, User</span>
                    </div>
                </header>
                <div class="dashboard-content">
                    <aside class="sidebar">
                        <nav class="nav-menu">
                            <a href="#" class="nav-item active">Home</a>
                            <a href="#" class="nav-item">Analytics</a>
                            <a href="#" class="nav-item">Reports</a>
                            <a href="#" class="nav-item">Settings</a>
                        </nav>
                    </aside>
                    <main class="main-content">
                        <div class="cards-grid">
                            <div class="card">
                                <h3>Total Users</h3>
                                <p class="stat-number">1,234</p>
                            </div>
                            <div class="card">
                                <h3>Revenue</h3>
                                <p class="stat-number">$45,678</p>
                            </div>
                            <div class="card">
                                <h3>Growth</h3>
                                <p class="stat-number">+23%</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; }
            .dashboard { height: 100vh; display: flex; flex-direction: column; }
            .dashboard-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .dashboard-header h1 { font-size: 1.75rem; }
            .dashboard-content { display: flex; flex: 1; }
            .sidebar { width: 250px; background: white; border-right: 1px solid #e0e0e0; padding: 1.5rem 0; }
            .nav-menu { display: flex; flex-direction: column; }
            .nav-item { padding: 0.75rem 1.5rem; color: #666; text-decoration: none; transition: all 0.3s; border-left: 3px solid transparent; }
            .nav-item:hover { background: #f0f0f0; color: #667eea; }
            .nav-item.active { color: #667eea; border-left-color: #667eea; background: #f8f9ff; }
            .main-content { flex: 1; padding: 2rem; }
            .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
            .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .card h3 { color: #666; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem; }
            .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }
        `
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
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
        html: `
            <div class="landing-page">
                <header class="header">
                    <nav class="navbar">
                        <div class="logo">MyWebsite</div>
                        <ul class="nav-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </header>
                <section class="hero">
                    <h1>Welcome to Our Website</h1>
                    <p>Create amazing web experiences</p>
                    <button class="cta-button">Get Started</button>
                </section>
                <section class="features" id="about">
                    <h2>Our Features</h2>
                    <div class="feature-cards">
                        <div class="feature">
                            <h3>Fast</h3>
                            <p>Lightning quick performance</p>
                        </div>
                        <div class="feature">
                            <h3>Responsive</h3>
                            <p>Works on all devices</p>
                        </div>
                        <div class="feature">
                            <h3>Modern</h3>
                            <p>Latest design trends</p>
                        </div>
                    </div>
                </section>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .header { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; max-width: 1200px; margin: 0 auto; }
            .logo { font-size: 1.5rem; font-weight: bold; color: #667eea; }
            .nav-links { display: flex; list-style: none; gap: 2rem; }
            .nav-links a { text-decoration: none; color: #333; transition: color 0.3s; }
            .nav-links a:hover { color: #667eea; }
            .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 5rem 1rem; }
            .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
            .hero p { font-size: 1.25rem; margin-bottom: 2rem; }
            .cta-button { background: white; color: #667eea; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-size: 1rem; font-weight: bold; cursor: pointer; }
            .features { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
            .features h2 { text-align: center; font-size: 2rem; margin-bottom: 2rem; }
            .feature-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
            .feature { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; text-align: center; }
            .feature h3 { color: #667eea; margin-bottom: 0.5rem; }
        `
    },
    {
        id: 3,
        title: 'Mobile App Interface',
        author: 'AppCraft Studio',
        rating: 4.7,
        downloads: 2103,
        likes: 651,
        price: '79',
        type: 'paid',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        html: `
            <div class="mobile-interface">
                <div class="phone-frame">
                    <div class="phone-header">
                        <span class="time">9:41</span>
                    </div>
                    <div class="phone-content">
                        <h2>Messages</h2>
                        <div class="message-list">
                            <div class="message-item">
                                <div class="avatar">A</div>
                                <div class="message-preview">
                                    <h4>Alice</h4>
                                    <p>Hey! How are you?</p>
                                </div>
                            </div>
                            <div class="message-item">
                                <div class="avatar">B</div>
                                <div class="message-preview">
                                    <h4>Bob</h4>
                                    <p>Let's meet tomorrow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .mobile-interface { padding: 2rem; }
            .phone-frame { width: 375px; height: 812px; background: white; border-radius: 40px; border: 10px solid #333; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; }
            .phone-header { background: #f5f5f5; padding: 0.5rem; text-align: center; font-weight: bold; }
            .phone-content { flex: 1; padding: 1rem; overflow-y: auto; }
            .phone-content h2 { margin-bottom: 1rem; }
            .message-list { display: flex; flex-direction: column; gap: 1rem; }
            .message-item { display: flex; gap: 1rem; align-items: center; padding: 0.75rem; background: #f9f9f9; border-radius: 8px; }
            .avatar { width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
            .message-preview h4 { margin-bottom: 0.25rem; }
            .message-preview p { color: #999; font-size: 0.9rem; }
        `
    },
    {
        id: 4,
        title: 'E-commerce Platform Kit',
        author: 'DesignHub Pro',
        rating: 4.6,
        downloads: 1876,
        likes: 445,
        price: '59',
        type: 'paid',
        category: 'portfolio',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab684c3c7?w=400&h=300&fit=crop',
        html: `
            <div class="ecommerce">
                <div class="product-showcase">
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" alt="Product">
                    </div>
                    <div class="product-details">
                        <h2>Premium Headphones</h2>
                        <div class="rating">★★★★★ (245 reviews)</div>
                        <div class="price-section">
                            <span class="price">$199.99</span>
                            <span class="original">$249.99</span>
                        </div>
                        <p class="description">High-quality audio with noise cancellation.</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: white; }
            .ecommerce { padding: 2rem; max-width: 1000px; margin: 0 auto; }
            .product-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
            .product-image { background: #f0f0f0; padding: 2rem; border-radius: 8px; }
            .product-image img { width: 100%; border-radius: 8px; }
            .product-details h2 { font-size: 2rem; margin-bottom: 1rem; }
            .rating { color: #ffc107; margin-bottom: 1rem; }
            .price-section { margin-bottom: 1rem; }
            .price { font-size: 2rem; font-weight: bold; color: #667eea; margin-right: 1rem; }
            .original { text-decoration: line-through; color: #999; }
            .description { color: #666; margin-bottom: 1.5rem; line-height: 1.6; }
            .add-to-cart { background: #667eea; color: white; border: none; padding: 0.75rem 2rem; border-radius: 4px; font-size: 1rem; cursor: pointer; }
            .add-to-cart:hover { background: #764ba2; }
        `
    },
    {
        id: 5,
        title: 'Icon Library Collection',
        author: 'Icon Masters',
        rating: 4.9,
        downloads: 5234,
        likes: 1203,
        type: 'free',
        category: 'dashboard',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        html: `
            <div class="icon-library">
                <h1>Icon Library</h1>
                <div class="icons-grid">
                    <div class="icon-item">
                        <div class="icon">📱</div>
                        <p>Mobile</p>
                    </div>
                    <div class="icon-item">
                        <div class="icon">💻</div>
                        <p>Desktop</p>
                    </div>
                    <div class="icon-item">
                        <div class="icon">🔧</div>
                        <p>Tools</p>
                    </div>
                    <div class="icon-item">
                        <div class="icon">🎨</div>
                        <p>Design</p>
                    </div>
                </div>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; }
            .icon-library { padding: 2rem; text-align: center; }
            .icon-library h1 { margin-bottom: 2rem; color: #333; }
            .icons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; }
            .icon-item { padding: 1.5rem; }
            .icon { font-size: 3rem; margin-bottom: 1rem; }
            .icon-item p { color: #666; margin-top: 0.5rem; }
        `
    },
    {
        id: 6,
        title: 'Analytics Dashboard Pro',
        author: 'DataViz Studio',
        rating: 4.8,
        downloads: 2567,
        likes: 734,
        price: '89',
        type: 'paid',
        category: 'portfolio',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        html: `
            <div class="analytics-dashboard">
                <div class="header">
                    <h1>Analytics Dashboard</h1>
                    <div class="date-range">
                        <select><option>Last 30 days</option></select>
                    </div>
                </div>
                <div class="metrics">
                    <div class="metric-card">
                        <div class="metric-label">Page Views</div>
                        <div class="metric-value">124,523</div>
                        <div class="metric-change">+12.5%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Unique Users</div>
                        <div class="metric-value">45,231</div>
                        <div class="metric-change">+8.2%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Conversion Rate</div>
                        <div class="metric-value">3.24%</div>
                        <div class="metric-change">+1.5%</div>
                    </div>
                </div>
            </div>
        `,
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; }
            .analytics-dashboard { padding: 2rem; max-width: 1200px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .header h1 { color: #333; }
            .date-range select { padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
            .metric-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .metric-label { color: #999; font-size: 0.9rem; margin-bottom: 0.5rem; }
            .metric-value { font-size: 2rem; font-weight: bold; color: #333; }
            .metric-change { color: #4caf50; margin-top: 0.5rem; font-size: 0.9rem; }
        `
    }
];

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" ? true : false;
  const currentUser = localStorage.getItem("currentUser");
  const userData = JSON.parse(currentUser);

function isUserLoggedIn() {
const userName = userData ? userData.name : ""; // Replace with actual user name

  if (isLoggedIn) {
    document.getElementById('loginLink').style.display = 'none';
    const userNameDiv = document.getElementById('userName');
    userNameDiv.style.display = 'flex';
    userNameDiv.innerHTML = `<img src="${userData.avatar}" alt="User Avatar" /> ${userName}`;
    return true;  
    }
  else {
    return false;
  } 
}

isUserLoggedIn();
// State
let currentCategory = 'all';
let currentType = 'all';
let searchQuery = '';

// Render products function
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    const filteredProducts = products.filter(function(product) {
        const categoryMatch = currentCategory === 'all' || 
            (currentCategory === 'free' && product.type === 'free') ||
            (currentCategory === 'premium' && product.type === 'paid');
        
        const typeMatch = currentType === 'all' || product.category === currentType;
        
        // Search filter - search in title, author, and category
        const searchMatch = !searchQuery || 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        return categoryMatch && typeMatch && searchMatch;
    });

    grid.innerHTML = filteredProducts.map(function(product) {
        return '<div class="product-card">' +
            '<div class="product-image">' +
                '<img src="' + product.image + '" alt="' + product.title + '">' +
                '<div class="product-tag ' + product.type + '">' +
                    (product.type === 'free' ? 'Free' : 'Tk ' + product.price) +
                '</div>' +
                '<div class="product-overlay">' +
                    '<button class="overlay-btn preview" onclick="openPreviewModal(' + product.id + ')">' +
                        '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' +
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>' +
                        '</svg>' +
                        'Preview' +
                    '</button>' +
                    (product.type === 'paid' ? '<button class="overlay-btn buy" onclick="openPaymentModal(products.find(p => p.id === ' + product.id + '))">Buy</button>' : '') +
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

    // Add event listeners to heart buttons
    document.querySelectorAll('.heart-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.classList.toggle('liked');
        });
    });
}

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

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.trim();
        renderProducts();
        
        // Show notification if no results found
        const grid = document.getElementById('productsGrid');
        if (searchQuery && grid.children.length === 0) {
            grid.innerHTML = '<div class="no-results">' +
                '<svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>' +
                '</svg>' +
                '<h3>No products found</h3>' +
                '<p>Try searching with different keywords or browse our categories</p>' +
                '<button class="btn-primary" onclick="clearSearch()">Clear Search</button>' +
            '</div>';
        }
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
}

function clearSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        renderProducts();
    }
}

// Initial render
renderProducts();

// Preview Modal Functions
let currentPreviewProduct = null;

function openPreviewModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentPreviewProduct = product;
    
    // Set modal title
    document.getElementById('previewTitle').textContent = product.title + ' - Preview';
    
    if (product.type === 'free') {
        document.getElementById('modal-footer').innerHTML = `
            <button class="btn-secondary" onclick="closePreviewModal()">Close</button>
            <button class="btn-primary" onclick="downloadPreview()">Download</button>
        `;
    } else  {
    document.getElementById('modal-footer').innerHTML = `
        <button class="btn-secondary" onclick="closePreviewModal()">Close</button>
        <button class="btn-primary" onclick="buyNow()">Buy Now</button>
    `;
    }
    // Create HTML content with CSS
    const iframeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${product.title}</title>
            <style>
                ${product.css}
            </style>
        </head>
        <body>
            ${product.html}
        </body>
        </html>
    `;
    
    // Inject content into iframe
    const iframe = document.getElementById('previewFrame');
    iframe.srcdoc = iframeContent;
    // Show modal
    document.getElementById('previewModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

}

function closePreviewModal() {
    document.getElementById('previewModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentPreviewProduct = null;
}

function downloadPreview() {
    if (!currentPreviewProduct) return;
    
    const product = currentPreviewProduct;
    
    // Create a blob with the combined HTML and CSS
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title}</title>
    <style>
        ${product.css}
    </style>
</head>
<body>
    ${product.html}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = product.title.replace(/\s+/g, '-').toLowerCase() + '.html';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function buyNow() {
    if (!currentPreviewProduct) return;
    if(!isLoggedIn) {
        showNotification('Please log in to proceed with the purchase.', 'error');
        location.href ='../login2/index.html';
        return;
    }
    const product = currentPreviewProduct;
    closePreviewModal();
    openPaymentModal(product);
}

// Payment Gateway Functions
let currentPaymentProduct = null;

function openPaymentModal(product) {
    currentPaymentProduct = product;
    
    // Update order summary
    document.getElementById('itemName').textContent = product.title;
    document.getElementById('itemPrice').textContent = 'Tk ' + product.price;
    document.getElementById('totalAmount').textContent = 'Tk ' + product.price;
    
    // Populate user info if logged in
    if (isLoggedIn && userData) {
        document.getElementById('fullName').value = userData.name || '';
        document.getElementById('email').value = userData.email || '';
    }
    
    // Show payment modal
    document.getElementById('paymentModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('paymentForm').reset();
}

function validatePaymentForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholderName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    const country = document.getElementById('country').value.trim();
    const termsCheck = document.getElementById('termsCheck').checked;

    // Validation checks
    if (!fullName) {
        showNotification('Please enter your full name', 'error');   
        return false;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        showNotification('Please enter a valid 16-digit card number', 'error');
        return false;
    }
    
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showNotification('Please enter a valid expiry date in MM/YY format', 'error');
        return false;
    }
    
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
        showNotification('Please enter a valid CVV', 'error');
        return false;
    }
    
    if (!cardholderName) {
        showNotification('Please enter cardholder name', 'error');
        return false;
    }
    
    if (!address || !city || !zipCode || !country) {
        showNotification('Please fill in all billing address fields', 'error');
        return false;
    }
    
    if (!termsCheck) {
        showNotification('Please agree to the terms and conditions', 'error');
        return false;
    }
    
    return true;
}

function processPayment() {
    if (!validatePaymentForm()) {
        return;
    }
    
    // Show processing state
    const payBtn = event.target;
    const originalText = payBtn.textContent;
    payBtn.textContent = 'Processing...';
    payBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(function() {
        // Generate transaction ID
        const transactionId = 'TXN-' + Date.now();
        const currentDate = new Date();
        
        // Show success modal
        document.getElementById('transactionId').textContent = transactionId;
        document.getElementById('receiptAmount').textContent = '$' + currentPaymentProduct.price;
        document.getElementById('transactionDate').textContent = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        document.getElementById('successMessage').textContent = 
            'Your purchase of "' + currentPaymentProduct.title + '" has been completed successfully.';
        
        // Store order in localStorage
        const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
        orders.push({
            id: transactionId,
            product: currentPaymentProduct.title,
            price: currentPaymentProduct.price,
            date: currentDate.toISOString(),
            productData: currentPaymentProduct
        });
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        // Close payment modal and show success
        closePaymentModal();
        document.getElementById('successModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Reset button
        payBtn.textContent = originalText;
        payBtn.disabled = false;
    }, 2000);
}

function completeCheckout() {
    document.getElementById('successModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Download the purchased template
    if (currentPaymentProduct) {
        downloadPreview();
    }
    
    currentPaymentProduct = null;
}

// Format card number input
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        let value = e.target.value.replace(/\s/g, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
        
        // Detect card type
        const firstDigit = value[0];
        const cardTypeEl = document.getElementById('cardType');
        if (firstDigit === '4') {
            cardTypeEl.textContent = 'Visa';
        } else if (firstDigit === '5') {
            cardTypeEl.textContent = 'Mastercard';
        } else if (firstDigit === '3') {
            cardTypeEl.textContent = 'Amex';
        } else {
            cardTypeEl.textContent = 'Card';
        }
    }
    
    if (e.target.id === 'expiryDate') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    }
    
    if (e.target.id === 'cvv') {
        e.target.value = e.target.value.replace(/\D/g, '');
    }
});

    closePreviewModal();
document.addEventListener('click', function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreviewModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePreviewModal();
    }
});

function openprofile() {
    window.location.href = "../profile/profile.html";
}


// Notification Toast Function
function showNotification(message, type = "success", title = "") {
  const toast = document.getElementById("notification-toast");

  // Set default titles based on type
  if (!title) {
    if (type === "success") title = "Success!";
    else if (type === "error") title = "Error";
    else if (type === "warning") title = "Warning";
  }

  // Icon based on type
  let icon = "";
  if (type === "success light") {
    icon = `<svg fill="none" stroke="#ffffffff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "error") {
    icon = `<svg fill="none" stroke="#2b0116ff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "warning light") {
    icon = `<svg fill="none" stroke="#ff0000ff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`;
  }

  toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="hideNotification()">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    `;

  toast.className = `notification-toast ${type}`;

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  const toast = document.getElementById("notification-toast");
  toast.classList.remove("show");
}