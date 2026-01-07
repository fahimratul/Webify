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
    img.src = userData.avatar;
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

  // Search input handler
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    console.log(`Searching for: ${query}`);
    // Here you can add search filtering logic
    handleSearch(query);
  });

  // Filter button handler
  const filterButton = document.querySelector(".filter-button");
  filterButton.addEventListener("click", () => {
    console.log("Opening filters...");
    // Here you can add filter modal logic
    alert("Filter options coming soon!");
  });
}

// Handle tab switching
function handleTabSwitch(tab) {
  // This function can be expanded to show/hide different content
  // based on the selected tab
  if (tab === "design") {
    console.log("Showing user designs");
    // Show user's projects
  } else if (tab === "template") {
    console.log("Showing templates");
    // Show template marketplace
  }
}

// Handle navigation between sections
function handleNavigation(section) {
  console.log("handleNavigation called with section:", section);

  // Handle Create button - redirect to builder
  if (section === "create") {
    console.log("Opening website builder...");
    location.href = "../demo/builder.html";
    return;
  }

  const container = document.querySelector(".container");
  const notificationsSection = document.getElementById("notificationsSection");

  console.log("container:", container);
  console.log("notificationsSection:", notificationsSection);

  if (section === "notification") {
    container.style.display = "none";
    notificationsSection.style.display = "block";
    console.log("Rendering notifications...");
    renderNotifications();
  } else {
    container.style.display = "block";
    notificationsSection.style.display = "none";
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
const userNotifications = {
  "tamim@webify.com": [
    {
      id: 1,
      userName: "Fahim Rahman",
      userAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      message: "reviewed your code and left feedback",
      time: "15 min ago",
    },
    {
      id: 2,
      userName: "Abdullah Khan",
      userAvatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      message: "starred your repository",
      time: "1 hour ago",
    },
    {
      id: 3,
      userName: "Erin Mitchell",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      message: "used your template in a new project",
      time: "2 hours ago",
    },
  ],
  "fahim@webify.com": [
    {
      id: 1,
      userName: "Tamim Ahmed",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      message: "liked your new UI design",
      time: "20 min ago",
    },
    {
      id: 2,
      userName: "Erin Mitchell",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      message: "commented on your portfolio template",
      time: "45 min ago",
    },
    {
      id: 3,
      userName: "Abdullah Khan",
      userAvatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      message: "requested collaboration on a project",
      time: "3 hours ago",
    },
  ],
  "abdullah@webify.com": [
    {
      id: 1,
      userName: "Tamim Ahmed",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      message: "asked a question about your API design",
      time: "30 min ago",
    },
    {
      id: 2,
      userName: "Fahim Rahman",
      userAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      message: "wants to use your backend template",
      time: "2 hours ago",
    },
    {
      id: 3,
      userName: "Erin Mitchell",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      message: "mentioned you in a discussion",
      time: "5 hours ago",
    },
  ],
  "erin@webify.com": [
    {
      id: 1,
      userName: "Fahim Rahman",
      userAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      message: "loved your responsive design approach",
      time: "10 min ago",
    },
    {
      id: 2,
      userName: "Tamim Ahmed",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      message: "cloned your landing page template",
      time: "1 hour ago",
    },
    {
      id: 3,
      userName: "Abdullah Khan",
      userAvatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      message: "shared your component library",
      time: "4 hours ago",
    },
  ],
};

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

// Default notifications for users not in the system
const defaultNotifications = [
  {
    id: 1,
    userName: "Abul",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    message: "has answered your question",
    time: "30 min ago",
  },
  {
    id: 2,
    userName: "Kuddus",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    message: "has liked your template",
    time: "30 min ago",
  },
  {
    id: 3,
    userName: "Jakaria",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    message: "has posted new component",
    time: "30 min ago",
  },
  {
    id: 4,
    userName: "Sarah Mitchell",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    message: "commented on your project",
    time: "1 hour ago",
  },
  {
    id: 5,
    userName: "David Chen",
    userAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    message: "shared your template",
    time: "2 hours ago",
  },
  {
    id: 6,
    userName: "Emma Wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    message: "started following you",
    time: "3 hours ago",
  },
  {
    id: 7,
    userName: "Michael Brown",
    userAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    message: "mentioned you in a comment",
    time: "5 hours ago",
  },
  {
    id: 8,
    userName: "Olivia Taylor",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    message: "rated your component 5 stars",
    time: "6 hours ago",
  },
  {
    id: 9,
    userName: "James Anderson",
    userAvatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
    message: "forked your project",
    time: "8 hours ago",
  },
  {
    id: 10,
    userName: "Sophia Garcia",
    userAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    message: "requested help on your template",
    time: "1 day ago",
  },
  {
    id: 11,
    userName: "Daniel Martinez",
    userAvatar:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop",
    message: "added your component to favorites",
    time: "1 day ago",
  },
  {
    id: 12,
    userName: "Isabella Lopez",
    userAvatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    message: "purchased your premium template",
    time: "2 days ago",
  },
];

// Render notifications based on current user
function renderNotifications() {
  console.log("renderNotifications called");
  const notificationsList = document.getElementById("notificationsList");

  // Get current user's email
  const currentUser = localStorage.getItem("currentUser");
  let userEmail = null;
  let notifications = defaultNotifications;

  if (currentUser) {
    const userData = JSON.parse(currentUser);
    userEmail = userData.email;

    // Get user-specific notifications or use default
    notifications = userNotifications[userEmail] || defaultNotifications;
  }

  console.log("notificationsList element:", notificationsList);
  console.log("User email:", userEmail);
  console.log("notifications data:", notifications);

  notificationsList.innerHTML = notifications
    .map(
      (notif) => `
    <div class="notification-item">
      <img src="${notif.userAvatar}" alt="${notif.userName}" class="notification-avatar">
      <div class="notification-content">
        <p class="notification-text"><strong>${notif.userName}</strong> ${notif.message}</p>
        <p class="notification-time">${notif.time}</p>
      </div>
    </div>
  `
    )
    .join("");

  console.log(
    "Notifications rendered. HTML length:",
    notificationsList.innerHTML.length
  );
}

// Handle search
function handleSearch(query) {
  // This function can be expanded to filter projects/templates
  // based on the search query
  if (query.trim() === "") {
    console.log("Search cleared, showing all items");
  } else {
    console.log(`Filtering items by: ${query}`);
  }
}

// Project card actions
function openProject(projectId) {
  console.log(`Opening project: ${projectId}`);
  alert(`Opening project: ${projectId}`);
  // Here you can add logic to open the project editor
}

function createNewProject() {
  console.log("Creating new project...");
  showNotification("Creating a new project. Wait to be redirected...", "success", "New Project");
  setTimeout(() => {
    location.href = "../demo/builder.html";
  }, 1500); 
}

function uploadFiles() {
  console.log("Upload files dialog");
  // Create a file input element
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = ".html,.css,.js,image/*";

  input.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    console.log(
      "Files selected:",
      files.map((f) => f.name)
    );
    alert(
      `Selected ${files.length} file(s): ${files.map((f) => f.name).join(", ")}`
    );
    // Here you can add logic to handle file uploads
  });

  input.click();
}

function viewTemplate(templateId) {
  console.log(`Viewing template: ${templateId}`);
  alert(`Opening template preview: Template ${templateId}`);
  // Here you can add logic to show template preview
  // or open it in the editor
}
function openBuilder() {
  location.href = "../demo/builder.html";
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
function openNotification() {
  console.log("Opening notifications...");
  const container = document.querySelector(".container");
  const notificationsSection = document.getElementById("notificationsSection");
  container.style.display = "none";
  notificationsSection.style.display = "block";
  renderNotifications();
}

function logout() {
  console.log("Logging out...");

  // Show beautiful logout message
  showNotification(
    "See you soon! You have been logged out successfully.",
    "success",
    "Goodbye! 👋"
  );

  // Clear user data from localStorage
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to home page after showing notification
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

// Add drag and drop functionality for file upload
const uploadCard = document.querySelector(".upload-card");

if (uploadCard) {
  uploadCard.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadCard.style.borderColor = "#7c3aed";
    uploadCard.style.backgroundColor = "#f5f3ff";
  });

  uploadCard.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadCard.style.borderColor = "#d1d5db";
    uploadCard.style.backgroundColor = "white";
  });

  uploadCard.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadCard.style.borderColor = "#d1d5db";
    uploadCard.style.backgroundColor = "white";

    const files = Array.from(e.dataTransfer.files);
    console.log(
      "Files dropped:",
      files.map((f) => f.name)
    );
    alert(
      `Dropped ${files.length} file(s): ${files.map((f) => f.name).join(", ")}`
    );
    // Here you can add logic to handle dropped files
  });
}

// Mock data for projects and templates
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
  // This would connect to IndexedDB in a real implementation
  return mockProjects;
}

// Function to dynamically load templates
function loadTemplates() {
  // This would connect to an API or local storage in a real implementation
  return mockTemplates;
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
    // Use the email to display user info, load profile data, etc.
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