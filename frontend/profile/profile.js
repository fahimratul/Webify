// Show toast notifications with icons - disappears after 5 seconds
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
  if (type === "success") {
    icon = `<svg fill="none" stroke="#22d3ee" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "error") {
    icon = `<svg fill="none" stroke="#ec4899" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "warning") {
    icon = `<svg fill="none" stroke="#eab308" stroke-width="2" viewBox="0 0 24 24">
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

// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadUserData();
  loadUserProjects();
  initializeApp();

  // Check if there's a section parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get("section");
  if (section) {
    handleNavigation(section);

    // Update active nav item
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    const activeNav = document.querySelector(
      `.nav-item[data-nav="${section}"]`
    );
    if (activeNav) {
      activeNav.classList.add("active");
    }
  }
});

// Load user data and update UI - redirects to login if not logged in
function loadUserData() {
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect to login if not logged in
  if (!isLoggedIn || !currentUser) {
    window.location.href = "../auth/login.html";
    return;
  }

  const userData = JSON.parse(currentUser);

  // Update avatar images
  const avatarImages = document.querySelectorAll(
    ".sidebar-avatar img, .dropdown-user-info img"
  );
  avatarImages.forEach((img) => {
    img.src = userData.profilePicture;
    img.alt = userData.name;
  });

  // Update user details in dropdown
  const userDetailsDiv = document.getElementById("userdetails");
  if (userDetailsDiv) {
    userDetailsDiv.innerHTML = `
      <h4>${userData.name}</h4>
      <p>${userData.email}</p>
    `;
  }

  // Update page title with user name
  const mainTitle = document.querySelector(".main-title");
  if (mainTitle) {
    mainTitle.textContent = `Welcome back, ${userData.name.split(" ")[0]}!`;
  }

  console.log("User data loaded:", userData);
  hideLoadingScreen();
}

// Hide loading screen with fade out effect
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
  }
}

// Load user's projects from backend
async function loadUserProjects() {
  try {
    console.log('🔄 Fetching marketplace items...');
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const userData = JSON.parse(currentUser);
    if (!userData._id) return;

    const response = await fetch('/api/marketplace/items');

    if (!response.ok) {
      console.error('❌ Failed to fetch marketplace items');
      return;
    }

    const data = await response.json();
    const userItems = (data.items || []).filter(item => item.ownerId === userData._id);
    console.log('✅ User items loaded:', userItems);

    displayUserProjects(userItems);
  } catch (error) {
    console.error('❌ Error loading projects:', error);
  }
}

// Cache user projects for quick lookup
let userProjectsById = {};

// Display user projects as cards
function displayUserProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  
  if (!projects || projects.length === 0) {
    console.log('📭 No projects found');
    return;
  }
  
  // Cache projects for openProject
  userProjectsById = projects.reduce((acc, project) => {
    acc[project.id] = project;
    return acc;
  }, {});

  // Add project cards after the create card
  const projectCardsHTML = projects.map((project, idx) => `
    <div class="project-card" onclick="openProject('${project.id}')" data-project-id="${project.id}">
      <div class="card-thumbnail">
        <iframe id="project-iframe-${idx}" class="project-preview-iframe" frameborder="0" scrolling="no"></iframe>
        <button class="more-button" onclick="event.stopPropagation(); showProjectMenu('${project.id}')">
          <i data-lucide="more-vertical"></i>
        </button>
      </div>
      <div class="card-content">
        <h3>${project.title}</h3>
        <p class="project-date">${project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ''}</p>
      </div>
    </div>
  `).join('');
  
  // Append projects after the create card
  grid.innerHTML += projectCardsHTML;
  
  // Populate iframe previews
  projects.forEach((project, idx) => {
    const iframe = document.getElementById('project-iframe-' + idx);
    if (!iframe) return;

    const iframeContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project.title}</title>
        <style>
          ${project.css || ''}
          body { margin: 0; padding: 0; overflow: hidden; }
        </style>
      </head>
      <body>${project.html || ''}</body>
      </html>
    `;

    iframe.srcdoc = iframeContent;
  });
  
  // Re-initialize Lucide icons for the new elements
  lucide.createIcons();
}

// Show project menu (edit, delete, etc.)
function showProjectMenu(projectId) {
  console.log('📋 Project menu for:', projectId);
  // TODO: Implement project menu with edit and delete options
  showNotification('Project menu coming soon', 'info');
}
function initializeApp() {
  // Profile dropdown toggle
  const userAvatar = document.getElementById("userAvatar");
  const profileDropdown = document.getElementById("profileDropdown");

  userAvatar.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("active");
    // Re-initialize icons after dropdown is shown
    setTimeout(() => lucide.createIcons(), 10);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!profileDropdown.contains(e.target) && !userAvatar.contains(e.target)) {
      profileDropdown.classList.remove("active");
    }
  });

  // Prevent dropdown from closing when clicking inside it
  profileDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Navigation items click handler
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"));
      // Add active class to clicked item
      item.classList.add("active");

      const section = item.getAttribute("data-nav");
      console.log(`Navigating to: ${section}`);
      handleNavigation(section);
    });
  });

  // Tab buttons click handler
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((tab) => tab.classList.remove("active"));
      // Add active class to clicked tab
      button.classList.add("active");

      const tab = button.getAttribute("data-tab");
      console.log(`Switched to tab: ${tab}`);
      // Here you can add logic to show/hide different content
      handleTabSwitch(tab);
    });
  });
}

// Handle tab switching
function handleTabSwitch(tab) {
  if (tab === "design") {
    console.log("Showing user designs");
  } else if (tab === "template") {
    console.log("Showing templates");
  }
}

// Handle navigation between sections
function handleNavigation(section) {
  console.log("handleNavigation called with section:", section);

  // Handle Create button - redirect to builder
  if (section === "create") {
    console.log("Opening website builder...");
    location.href = "https://webify-kudm.onrender.com/builder/";
    return;
  }
}

const sampleComponents = [
    {
        id: 1,
        name: 'Modern Navbar',
        category: 'navbar',
        description: 'Clean navigation bar with logo',
        html: '<nav class="navbar">\n  <div class="logo">MyBrand</div>\n  <ul class="nav-links">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#projects">Projects</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>',
        css: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\n.logo {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.nav-links {\n  display: flex;\n  gap: 2rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.nav-links a {\n  color: white;\n  text-decoration: none;\n  transition: opacity 0.3s;\n}\n\n.nav-links a:hover {\n  opacity: 0.8;\n}'
    },
    {
        id: 2,
        name: 'Hero Section',
        category: 'hero',
        description: 'Eye-catching hero with CTA',
        html: '<section class="hero">\n  <h1>Welcome to My Portfolio</h1>\n  <p>I create amazing web experiences</p>\n  <button class="cta-btn">View My Work</button>\n</section>',
        css: '.hero {\n  text-align: center;\n  padding: 6rem 2rem;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\n.hero h1 {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  animation: fadeInUp 1s;\n}\n\n.hero p {\n  font-size: 1.5rem;\n  margin-bottom: 2rem;\n  opacity: 0.9;\n}\n\n.cta-btn {\n  padding: 1rem 2rem;\n  font-size: 1.1rem;\n  background: white;\n  color: #667eea;\n  border: none;\n  border-radius: 50px;\n  cursor: pointer;\n  transition: transform 0.3s;\n}\n\n.cta-btn:hover {\n  transform: scale(1.05);\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}'
    },
    {
        id: 3,
        name: 'About Me Card',
        category: 'about',
        description: 'Profile card with bio',
        html: '<section class="about">\n  <div class="about-card">\n    <div class="avatar">JD</div>\n    <h2>About Me</h2>\n    <p>Hi! I\'m a passionate developer who loves creating beautiful and functional websites. With expertise in modern web technologies, I turn ideas into reality.</p>\n  </div>\n</section>',
        css: '.about {\n  padding: 4rem 2rem;\n  background: #f7fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.about-card {\n  max-width: 600px;\n  background: white;\n  padding: 3rem;\n  border-radius: 15px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n  text-align: center;\n}\n\n.avatar {\n  width: 100px;\n  height: 100px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  font-weight: bold;\n  margin: 0 auto 2rem;\n}\n\n.about-card h2 {\n  margin-bottom: 1rem;\n  color: #2d3748;\n}\n\n.about-card p {\n  color: #4a5568;\n  line-height: 1.6;\n}'
    },
    {
        id: 4,
        name: 'Project Grid',
        category: 'projects',
        description: 'Grid layout for projects',
        html: '<section class="projects">\n  <h2>My Projects</h2>\n  <div class="project-grid">\n    <div class="project-card">\n      <div class="project-img">🎨</div>\n      <h3>Project 1</h3>\n      <p>Amazing web application</p>\n    </div>\n    <div class="project-card">\n      <div class="project-img">🚀</div>\n      <h3>Project 2</h3>\n      <p>Mobile-first design</p>\n    </div>\n    <div class="project-card">\n      <div class="project-img">💡</div>\n      <h3>Project 3</h3>\n      <p>Innovative solution</p>\n    </div>\n  </div>\n</section>',
        css: '.projects {\n  padding: 4rem 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.projects h2 {\n  text-align: center;\n  margin-bottom: 3rem;\n  font-size: 2.5rem;\n  color: #2d3748;\n}\n\n.project-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 2rem;\n}\n\n.project-card {\n  background: white;\n  padding: 2rem;\n  border-radius: 15px;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.1);\n  transition: transform 0.3s;\n  text-align: center;\n}\n\n.project-card:hover {\n  transform: translateY(-10px);\n}\n\n.project-img {\n  font-size: 4rem;\n  margin-bottom: 1rem;\n}\n\n.project-card h3 {\n  margin-bottom: 0.5rem;\n  color: #2d3748;\n}\n\n.project-card p {\n  color: #718096;\n}'
    },
    {
        id: 5,
        name: 'Contact Footer',
        category: 'footer',
        description: 'Footer with contact info',
        html: '<footer class="footer">\n  <div class="footer-content">\n    <h3>Get In Touch</h3>\n    <p>email@example.com</p>\n    <div class="social-links">\n      <a href="#">LinkedIn</a>\n      <a href="#">GitHub</a>\n      <a href="#">Twitter</a>\n    </div>\n    <p class="copyright">© 2024 My Portfolio. All rights reserved.</p>\n  </div>\n</footer>',
        css: '.footer {\n  background: #2d3748;\n  color: white;\n  padding: 3rem 2rem;\n  text-align: center;\n}\n\n.footer-content {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.footer h3 {\n  margin-bottom: 1rem;\n  font-size: 1.8rem;\n}\n\n.footer p {\n  margin-bottom: 1rem;\n  opacity: 0.9;\n}\n\n.social-links {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n  margin: 2rem 0;\n}\n\n.social-links a {\n  color: white;\n  text-decoration: none;\n  padding: 0.5rem 1rem;\n  border: 2px solid white;\n  border-radius: 5px;\n  transition: all 0.3s;\n}\n\n.social-links a:hover {\n  background: white;\n  color: #2d3748;\n}\n\n.copyright {\n  margin-top: 2rem;\n  font-size: 0.9rem;\n  opacity: 0.7;\n}'
    }
];

let components = sampleComponents; // Initialize with sample components

// User-specific notifications data

// Library state
let currentLibraryCategory = 'all';
let librarySearchQuery = '';

function renderLibrary() {
    const grid = document.getElementById('componentGrid');
    if (!grid) return;
    
    // Filter components
    const filteredComponents = components.filter(component => {
        const categoryMatch = currentLibraryCategory === 'all' || component.category === currentLibraryCategory;
        const searchMatch = !librarySearchQuery || 
            component.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
            component.description.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
            component.category.toLowerCase().includes(librarySearchQuery.toLowerCase());
        
        return categoryMatch && searchMatch;
    });
    
    // Clear grid
    grid.innerHTML = '';
    
    // Show no results message if needed
    if (filteredComponents.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <h3>No components found</h3>
                <p>Try searching with different keywords or browse our categories</p>
                <button class="btn-clear-library" onclick="clearLibrarySearch()">Clear Search</button>
            </div>
        `;
        return;
    }
    
    // Render filtered components
    filteredComponents.forEach(component => {
        const card = document.createElement('div');
        card.className = 'component-card';
        
        const previewHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                    ${component.css}
                </style>
            </head>
            <body>${component.html}</body>
            </html>
        `;
        
        card.innerHTML = `
            <div class="component-preview">
                <div class="preview-overlay">
                    <button class="preview-btn" onclick="previewComponent(${component.id})">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </button>
                </div>
                <iframe srcdoc="${previewHTML.replace(/"/g, '&quot;')}" sandbox="allow-same-origin"></iframe>
            </div>
            <div class="component-info">
                <div class="component-header">
                    <div class="component-name">${component.name}</div>
                    <span class="component-category">${component.category}</span>
                </div>
                <p class="component-description">${component.description}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function clearLibrarySearch() {
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
        searchInput.value = '';
        librarySearchQuery = '';
    }
    currentLibraryCategory = 'all';
    
    // Reset active filter button
    document.querySelectorAll('.library-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });
    
    renderLibrary();
}

function previewComponent(componentId) {
    const component = components.find(c => c.id === componentId);
    if (!component) return;
    
    showNotification(`Previewing: ${component.name}`, 'success', 'Component Preview');
    localStorage.setItem('previewComponent', JSON.stringify(component));
    location.href = '../demo/preview.html';
}


// Handle search
function handleSearch(query) {
  if (query.trim() === "") {
    console.log("Search cleared, showing all items");
  } else {
    console.log(`Filtering items by: ${query}`);
  }
}

// Project card actions
function openProject(projectId) {
  console.log(`Opening project: ${projectId}`);
  if (!projectId) return;

  const project = userProjectsById[projectId];
  if (project) {
    // Store selected item so the builder can load it if supported
    localStorage.setItem('selectedMarketplaceItem', JSON.stringify(project));
  }

  showNotification("Opening your project in builder...", "success");
  setTimeout(() => {
    location.href = "https://webify-kudm.onrender.com/builder/?itemId=" + projectId;
  }, 300);
}

function createNewProject() {
  console.log("Creating new project...");
  showNotification("Creating a new project. Wait to be redirected...", "success", "New Project");
  setTimeout(() => {
    location.href = "https://webify-kudm.onrender.com/builder/";
  }, 1500); 
}

function viewTemplate(templateId) {
  console.log(`Viewing template: ${templateId}`);
  alert(`Opening template preview: Template ${templateId}`);
}

// Profile dropdown menu actions
function openCommunity() {
  console.log("Opening community...");
  window.location.href = "../community/questions.html";
}

function openHelp() {
  window.location.href = "../help/help.html";
}

function editProfile() {
  window.location.href = "../editprofile/editprofile.html";
}

function openMarketplace() {
  window.location.href = "../marketplace/market.html";
}

function logout() {
  console.log("Logging out...");

  showNotification(
    "See you soon! You have been logged out successfully.",
    "success",
    "Goodbye! 👋"
  );

  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  localStorage.clear();
  sessionStorage.clear();

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

// Mock data for projects
const mockProjects = [
  {
    id: "untitled",
    name: "Untitled",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    lastModified: new Date(),
  },
];

// Function to dynamically load projects (can be connected to IndexedDB)
function loadProjects() {
  return mockProjects;
}

// Console welcome message
console.log(
  "%cWEBIFY Dashboard",
  "color: #7c3aed; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cOpen-source, no-code website builder",
  "color: #6b7280; font-size: 14px;"
);
console.log(
  "%cDashboard System v1.0 - Developed by Tamim",
  "color: #a855f7; font-size: 12px;"
);
console.log("Ready to build amazing websites! 🚀");

document.addEventListener("DOMContentLoaded", () => {
  const userEmail = sessionStorage.getItem("userEmail");
  renderLibrary();
  
  // Setup library search
  const librarySearchInput = document.getElementById('librarySearch');
  if (librarySearchInput) {
    librarySearchInput.addEventListener('input', (e) => {
      librarySearchQuery = e.target.value.trim();
      renderLibrary();
    });
    
    // Clear search on Escape key
    librarySearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearLibrarySearch();
      }
    });
  }
  
  // Setup library filter buttons
  document.querySelectorAll('.library-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.library-filter-btn').forEach(b => {
        b.classList.remove('active');
      });
      this.classList.add('active');
      currentLibraryCategory = this.dataset.category;
      renderLibrary();
    });
  });
  
  if (userEmail) {
    console.log("User is logged in with email:", userEmail);
  }
});

function userdetails() {
  const userEmail = sessionStorage.getItem("userEmail");
  const userDiv = document.getElementById("userdetails");
  if (userEmail) {
    userDiv.innerHTML = `<h4>Tanvir Jakaria</h4>
    <p>${userEmail}</p>`;
  }
}

userdetails();

function showtemplate(){
  const templateDiv = document.getElementById("template");
  templateDiv.style.display = "block";
  const lastSavedSection = document.getElementById("lastSavedSection");
  lastSavedSection.style.display = "none";
  const templateBtn = document.getElementById("templateTab");
  templateBtn.classList.add("active");
  const lastSavedBtn = document.getElementById("designTab");
  lastSavedBtn.classList.remove("active");
}

function showdesign(){
  const templateDiv = document.getElementById("template");
  templateDiv.style.display = "none";
  const lastSavedSection = document.getElementById("lastSavedSection");
  lastSavedSection.style.display = "block";
  const templateBtn = document.getElementById("templateTab");
  templateBtn.classList.remove("active");
  const lastSavedBtn = document.getElementById("designTab");
  lastSavedBtn.classList.add("active");
}