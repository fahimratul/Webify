/**
 * Dashboard Notification System
 * Manages all dashboard notifications and alerts
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'warning'
 * @param {string} title - Notification title
 */
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
  initializeApp();
});

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

// Sample notifications data
const notifications = [
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

// Render notifications
function renderNotifications() {
  console.log("renderNotifications called");
  const notificationsList = document.getElementById("notificationsList");
  console.log("notificationsList element:", notificationsList);
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
  alert("Creating a new project! This will open the website builder.");
  // Here you can add logic to create a new project
  // and redirect to the editor
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

function logout() {
  console.log("Logging out...");

  // Show beautiful logout message
  showNotification(
    "See you soon! You have been logged out successfully.",
    "success",
    "Goodbye! 👋"
  );

  // Clear any session data (localStorage, sessionStorage)
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

const mockTemplates = [
  {
    id: 1,
    name: "Scrolling Effect",
    description: "getAnimations() demo",
    category: "Animation",
  },
  {
    id: 2,
    name: "Scrolling Effect",
    description: "getAnimations() demo",
    category: "Animation",
  },
  {
    id: 3,
    name: "Scrolling Effect",
    description: "getAnimations() demo",
    category: "Animation",
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
