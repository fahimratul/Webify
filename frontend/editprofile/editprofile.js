// Initialize Lucide icons and load user data
lucide.createIcons();
loadUserData();

// Load user data from localStorage
function loadUserData() {
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect to login if not logged in
  if (!isLoggedIn || !currentUser) {
    window.location.href = "../auth/login.html";
    return;
  }

  const userData = JSON.parse(currentUser);

  // Update all avatar images
  document
    .querySelectorAll(
      ".sidebar-avatar img, .dropdown-user-info img, #profilePic"
    )
    .forEach((img) => {
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

  // Populate form fields
  document.getElementById("fullName").value = userData.name || "";
  document.getElementById("email").value = userData.email || "";
  document.getElementById("bio").value = userData.bio || "";
  document.getElementById("phone").value = userData.phone || "";
}

// Form submission handler
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  saveProfile();
});

// Change profile picture
function changeProfilePic() {
  document.getElementById("picInput").click();
}

document.getElementById("picInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profilePic").src = e.target.result;
      showToast("Profile picture updated!", "success");
    };
    reader.readAsDataURL(file);
  }
});

// Save profile data
function saveProfile() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const userData = JSON.parse(currentUser);

  // Update user data
  userData.name = document.getElementById("fullName").value;
  userData.email = document.getElementById("email").value;
  userData.bio = document.getElementById("bio").value;
  userData.phone = document.getElementById("phone").value || userData.phone;

  // Save back to localStorage
  localStorage.setItem("currentUser", JSON.stringify(userData));

  showToast("Profile updated successfully!", "success");

  // Update all displayed user info
  document
    .querySelectorAll(".sidebar-avatar img, .dropdown-user-info img")
    .forEach((img) => {
      img.src = document.getElementById("profilePic").src;
    });

  const userDetailsDiv = document.getElementById("userdetails");
  if (userDetailsDiv) {
    userDetailsDiv.innerHTML = `
                    <h4>${userData.name}</h4>
                    <p>${userData.email}</p>
                `;
  }
}

// Notification toast
function showToast(message, type = "info") {
  const toast = document.getElementById("notification-toast");
  toast.textContent = message;
  toast.className = `notification-toast show ${type}`;
  setTimeout(() => {
    toast.className = "notification-toast";
  }, 3000);
}

// Navigation handlers
document.addEventListener("DOMContentLoaded", () => {
  // Navigation items click handler
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const section = item.getAttribute("data-nav");
      console.log(`Navigating to: ${section}`);

      // Handle Create button - redirect to builder
      if (section === "create") {
        console.log("Opening website builder...");
        // TODO: Update this URL when builder is ready
        window.location.href = "../demo/builder.html";
        return;
      }

      // Navigate to profile page with specific section
      if (
        section === "notification" ||
        section === "market" ||
        section === "template" ||
        section === "project"
      ) {
        window.location.href = `../profile/profile.html?section=${section}`;
      }
    });
  });

  // Profile dropdown toggle
  const userAvatar = document.getElementById("userAvatar");
  const profileDropdown = document.getElementById("profileDropdown");

  if (userAvatar && profileDropdown) {
    userAvatar.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("active");
      setTimeout(() => lucide.createIcons(), 10);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !profileDropdown.contains(e.target) &&
        !userAvatar.contains(e.target)
      ) {
        profileDropdown.classList.remove("active");
      }
    });

    // Prevent dropdown from closing when clicking inside it
    profileDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});

// Dropdown menu functions
function openCommunity() {
  console.log("Opening community...");
  alert(
    "Opening WEBIFY Community! Share your templates and connect with other creators."
  );
}

function openHelp() {
  window.location.href = "../help/help.html";
}

function editProfile() {
  // Already on edit profile page
  console.log("Already on edit profile page");
}

function logout() {
  console.log("Logging out...");

  // Clear user data from localStorage
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  localStorage.clear();
  sessionStorage.clear();

  showToast("Logged out successfully!", "success");

  // Redirect to login page
  setTimeout(() => {
    window.location.href = "../auth/login.html";
  }, 1500);
}
