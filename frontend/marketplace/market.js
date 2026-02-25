// Fetch products from MongoDB via API
let products = [];

async function loadProductsFromDB() {
  try {
    console.log("🔄 Fetching products from /api/marketplace/items...");
    const response = await fetch("/api/marketplace/items");

    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ API Error Response:", errorData);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📦 API Response:", data);

    products = data.items || [];
    console.log("✅ Loaded", products.length, "products from MongoDB");

    // Initialize the page after products are loaded
    renderProducts();
  } catch (error) {
    console.error("❌ Error loading products:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      type: error.type,
    });

    // Fallback to showing error message
    const grid = document.getElementById("productsGrid");
    if (grid) {
      grid.innerHTML =
        '<div class="no-results">' +
        '<svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
        "</svg>" +
        "<h3>Unable to Load Products</h3>" +
        "<p>Error: " +
        error.message +
        "</p>" +
        "<p>Please check the console for details</p>" +
        "</div>";
    }
  }
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", loadProductsFromDB);

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" ? true : false;
const currentUser = localStorage.getItem("currentUser");
const userData = currentUser ? JSON.parse(currentUser) : null;
console.log("isLoggedIn:", currentUser);

function isUserLoggedIn() {
  const userName = userData ? userData.name : "";
  if (isLoggedIn) {
    document.getElementById("loginLink").style.display = "none";
    const userNameDiv = document.getElementById("userName");
    userNameDiv.style.display = "flex";
    userNameDiv.innerHTML = `<img src="${userData.profilePicture}" alt="User Avatar" /> ${userName}`;
    return true;
  } else {
    return false;
  }
}

isUserLoggedIn();

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
document.querySelectorAll(".filter-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    this.classList.add("active");
    currentCategory = this.dataset.category;
    renderProducts();
  });
});

// Type filter event listeners
document.querySelectorAll(".type-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".type-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    this.classList.add("active");
    currentType = this.dataset.type;
    renderProducts();
  });
});

// Search functionality
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    searchQuery = e.target.value.trim();
    renderProducts();

    const grid = document.getElementById("productsGrid");
    if (searchQuery && grid.children.length === 0) {
      grid.innerHTML =
        '<div class="no-results">' +
        '<svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>' +
        "</svg>" +
        "<h3>No products found</h3>" +
        "<p>Try searching with different keywords or browse our categories</p>" +
        '<button class="btn-primary" onclick="clearSearch()">Clear Search</button>' +
        "</div>";
    }
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      clearSearch();
    }
  });
}

function clearSearch() {
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.value = "";
    searchQuery = "";
    renderProducts();
  }
}

// Preview Modal Functions
let currentPreviewProduct = null;

function openPreviewModal(idx) {
  console.log("🔍 openPreviewModal called with index:", idx);
  console.log(
    "📊 currentFilteredProducts length:",
    currentFilteredProducts.length,
  );

  const product = currentFilteredProducts[idx];
  if (!product) {
    console.error("❌ Product not found at index", idx);
    showNotification("Product not found. Please try again.", "error");
    return;
  }

  console.log("✅ Preview product found:", product.title);
  currentPreviewProduct = product;

  document.getElementById("previewTitle").textContent =
    product.title + " - Preview";

  if (product.type === "free") {
    document.getElementById("modal-footer").innerHTML = `
            <button class="btn-secondary" onclick="closePreviewModal()">Close</button>
            <button class="btn-primary" onclick="downloadPreview()">Download</button>
        `;
  } else {
    document.getElementById("modal-footer").innerHTML = `
            <button class="btn-secondary" onclick="closePreviewModal()">Close</button>
            <button class="btn-primary" onclick="buyNow()">Buy Now</button>
        `;
  }

  const iframeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${product.title}</title>
            <style>${product.css}</style>
        </head>
        <body>${product.html}</body>
        </html>
    `;

  const iframe = document.getElementById("previewFrame");
  iframe.srcdoc = iframeContent;
  document.getElementById("previewModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePreviewModal() {
  document.getElementById("previewModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  currentPreviewProduct = null;
}

// ─── DOWNLOAD FIX ───────────────────────────────────────────────
// Accepts an optional product argument so completeCheckout can pass
// the purchased product even after currentPreviewProduct is cleared.
async function downloadPreview(productToDownload) {
  const product = productToDownload || currentPreviewProduct;
  if (!product) return;

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

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = product.title.replace(/\s+/g, "-").toLowerCase() + ".html";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  // Increment download count in database
  try {
    const response = await fetch(
      "/api/marketplace/items/" + product.id + "/download",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Download count updated:", data.downloads);

      // Update local product data
      const productIndex = products.findIndex((p) => p.id === product.id);
      if (productIndex !== -1) {
        products[productIndex].downloads = data.downloads;
      }

      const filteredIndex = currentFilteredProducts.findIndex(
        (p) => p.id === product.id,
      );
      if (filteredIndex !== -1) {
        currentFilteredProducts[filteredIndex].downloads = data.downloads;
      }

      // Update the displayed download count in the product card
      const productCard = document.querySelector(
        '.product-card[data-product-id="' + product.id + '"]',
      );
      if (productCard) {
        const downloadElements = productCard.querySelectorAll(".stat");
        if (downloadElements.length >= 2) {
          const downloadStat = downloadElements[1]; // Download count is the second stat
          const downloadSpan = downloadStat.querySelector("span");
          if (downloadSpan) {
            downloadSpan.textContent = data.downloads.toLocaleString();
          }
        }
      }
    } else {
      console.error("❌ Failed to update download count:", response.status);
      showNotification(
        "Download successful, but failed to update count",
        "warning",
      );
    }
  } catch (error) {
    console.error("❌ Error updating download count:", error);
    showNotification(
      "Download successful, but failed to update count",
      "warning",
    );
  }

  // Show rating modal after download
  openRatingModal(product);
}
// ────────────────────────────────────────────────────────────────

// Rating system
let currentRatingProduct = null;
let selectedRating = 0;

function openRatingModal(product) {
  currentRatingProduct = product;
  selectedRating = 0;

  document.getElementById("ratingProductName").textContent =
    `How do you rate "${product.title}"?`;
  document.getElementById("ratingText").textContent = "Please select a rating";
  document.getElementById("submitRatingBtn").disabled = true;

  // Clear all active stars
  document.querySelectorAll(".rating-star").forEach((star) => {
    star.classList.remove("active");
  });

  document.getElementById("ratingModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeRatingModal() {
  document.getElementById("ratingModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  currentRatingProduct = null;
  selectedRating = 0;
}

function setRating(rating) {
  selectedRating = rating;

  // Update star display
  document.querySelectorAll(".rating-star").forEach((star, idx) => {
    if (idx < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });

  // Update text and enable button
  const ratingTexts = {
    1: "😞 Poor",
    2: "😕 Not Great",
    3: "😐 Okay",
    4: "😊 Good",
    5: "😍 Excellent",
  };

  document.getElementById("ratingText").textContent = ratingTexts[rating];
  document.getElementById("submitRatingBtn").disabled = false;
}

async function submitRating() {
  if (!currentRatingProduct || selectedRating === 0) {
    showNotification("Please select a rating", "error");
    return;
  }

  try {
    const response = await fetch(
      "/api/marketplace/items/" + currentRatingProduct.id + "/rate",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating }),
      },
    );

    if (!response.ok) throw new Error("Failed to submit rating");

    const data = await response.json();
    showNotification("Thank you for your rating!", "success");

    // Update local product data in both products and currentFilteredProducts
    const productIndex = products.findIndex(
      (p) => p.id === currentRatingProduct.id,
    );
    if (productIndex !== -1) {
      products[productIndex].rating = parseFloat(data.rating);
      products[productIndex].ratingCount = data.ratingCount;
    }

    const filteredIndex = currentFilteredProducts.findIndex(
      (p) => p.id === currentRatingProduct.id,
    );
    if (filteredIndex !== -1) {
      currentFilteredProducts[filteredIndex].rating = parseFloat(data.rating);
      currentFilteredProducts[filteredIndex].ratingCount = data.ratingCount;
    }

    // Update the rating display in the DOM
    const productCard = document.querySelector(
      '.product-card[data-product-id="' + currentRatingProduct.id + '"]',
    );
    if (productCard) {
      const ratingElements = productCard.querySelectorAll(".star-icon");
      if (ratingElements.length > 0) {
        const ratingContainer = ratingElements[0].closest(".stat");
        if (ratingContainer) {
          const ratingSpan = ratingContainer.querySelector("span");
          if (ratingSpan) {
            ratingSpan.innerHTML =
              parseFloat(data.rating).toFixed(1) +
              " <small>(" +
              data.ratingCount +
              ")</small>";
          }
        }
      }
    }

    closeRatingModal();
  } catch (error) {
    console.error("❌ Error submitting rating:", error);
    showNotification("Failed to submit rating", "error");
  }
}

function buyNow() {
  if (!currentPreviewProduct) return;
  if (!isLoggedIn) {
    showNotification("Please log in to proceed with the purchase.", "error");
    location.href = "../login2/index.html";
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

  document.getElementById("itemName").textContent = product.title;
  document.getElementById("itemPrice").textContent = "Tk " + product.price;
  document.getElementById("totalAmount").textContent = "Tk " + product.price;

  if (isLoggedIn && userData) {
    document.getElementById("fullName").value = userData.name || "";
    document.getElementById("email").value = userData.email || "";
  }

  document.getElementById("paymentModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  document.getElementById("paymentForm").reset();
}

function validatePaymentForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const cardNumber = document
    .getElementById("cardNumber")
    .value.replace(/\s/g, "");
  const expiryDate = document.getElementById("expiryDate").value;
  const cvv = document.getElementById("cvv").value;
  const cardholderName = document.getElementById("cardholderName").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const zipCode = document.getElementById("zipCode").value.trim();
  const country = document.getElementById("country").value.trim();
  const termsCheck = document.getElementById("termsCheck").checked;

  if (!fullName) {
    showNotification("Please enter your full name", "error");
    return false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification("Please enter a valid email address", "error");
    return false;
  }
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    showNotification("Please enter a valid 16-digit card number", "error");
    return false;
  }
  if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
    showNotification(
      "Please enter a valid expiry date in MM/YY format",
      "error",
    );
    return false;
  }
  if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
    showNotification("Please enter a valid CVV", "error");
    return false;
  }
  if (!cardholderName) {
    showNotification("Please enter cardholder name", "error");
    return false;
  }
  if (!address || !city || !zipCode || !country) {
    showNotification("Please fill in all billing address fields", "error");
    return false;
  }
  if (!termsCheck) {
    showNotification("Please agree to the terms and conditions", "error");
    return false;
  }

  return true;
}

function processPayment() {
  if (!validatePaymentForm()) return;

  const payBtn = event.target;
  const originalText = payBtn.textContent;
  payBtn.textContent = "Processing...";
  payBtn.disabled = true;

  setTimeout(function () {
    const transactionId = "TXN-" + Date.now();
    const currentDate = new Date();

    document.getElementById("transactionId").textContent = transactionId;
    document.getElementById("receiptAmount").textContent =
      "Tk " + currentPaymentProduct.price;
    document.getElementById("transactionDate").textContent =
      currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    document.getElementById("successMessage").textContent =
      'Your purchase of "' +
      currentPaymentProduct.title +
      '" has been completed successfully.';

    const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
    orders.push({
      id: transactionId,
      product: currentPaymentProduct.title,
      price: currentPaymentProduct.price,
      date: currentDate.toISOString(),
      productData: currentPaymentProduct,
    });
    localStorage.setItem("userOrders", JSON.stringify(orders));

    closePaymentModal();
    document.getElementById("successModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";

    payBtn.textContent = originalText;
    payBtn.disabled = false;
  }, 2000);
}

function completeCheckout() {
  // ─── DOWNLOAD FIX ───────────────────────────────────────────
  // Save reference BEFORE nulling it, then pass directly to downloadPreview
  const productToDownload = currentPaymentProduct;
  // ────────────────────────────────────────────────────────────

  document.getElementById("successModal").classList.add("hidden");
  document.body.style.overflow = "auto";

  if (productToDownload) {
    downloadPreview(productToDownload);
  }

  currentPaymentProduct = null;
}

// Format card number input
document.addEventListener("input", function (e) {
  if (e.target.id === "cardNumber") {
    let value = e.target.value.replace(/\s/g, "");
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    e.target.value = formatted;

    const firstDigit = value[0];
    const cardTypeEl = document.getElementById("cardType");
    if (firstDigit === "4") cardTypeEl.textContent = "Visa";
    else if (firstDigit === "5") cardTypeEl.textContent = "Mastercard";
    else if (firstDigit === "3") cardTypeEl.textContent = "Amex";
    else cardTypeEl.textContent = "Card";
  }

  if (e.target.id === "expiryDate") {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    e.target.value = value;
  }

  if (e.target.id === "cvv") {
    e.target.value = e.target.value.replace(/\D/g, "");
  }
});

document.addEventListener("click", function (event) {
  const modal = document.getElementById("previewModal");
  if (event.target === modal) closePreviewModal();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closePreviewModal();
});

function openprofile() {
  window.location.href = "../profile/profile.html";
}

// Notification Toast Function
function showNotification(message, type = "success", title = "") {
  const toast = document.getElementById("notification-toast");

  if (!title) {
    if (type === "success") title = "Success!";
    else if (type === "error") title = "Error";
    else if (type === "warning") title = "Warning";
  }

  let icon = "";
  if (type === "success") {
    icon = `<svg fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "error") {
    icon = `<svg fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "warning") {
    icon = `<svg fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
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
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => hideNotification(), 5000);
}

function hideNotification() {
  const toast = document.getElementById("notification-toast");
  toast.classList.remove("show");
}
