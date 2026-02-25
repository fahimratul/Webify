// Initialize Lucide icons and load user data
lucide.createIcons();
loadUserData();

// Load user data from server
async function loadUserData() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    window.location.href = "../auth/login.html";
    return;
  }

  try {
    // Fetch current user data from server
    const response = await fetch('/api/profile', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    if (data.success) {
      const userData = data.user;
      console.log("Loaded user data:", userData);
      
      // Update localStorage with fresh data
      localStorage.setItem("currentUser", JSON.stringify({
        name: userData.username,
        email: userData.email,
        profilePicture: userData.profilePicture,
        bio: userData.bio,
        phone: userData.phoneNumber
      }));

      // Update all avatar images
      document
        .querySelectorAll(
          ".sidebar-avatar img, .dropdown-user-info img, #profilePic"
        )
        .forEach((img) => {
          img.src = userData.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
          img.alt = userData.username;
        });

      // Update user details in dropdown
      const userDetailsDiv = document.getElementById("userdetails");
      if (userDetailsDiv) {
        userDetailsDiv.innerHTML = `
                        <h4>${userData.username}</h4>
                        <p>${userData.email}</p>
                    `;
      }

      // Populate form fields
      document.getElementById("fullName").value = userData.username || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("bio").value = userData.bio || "";
      document.getElementById("phone").value = userData.phoneNumber || "";
      
      // Hide loading screen after data is loaded
      hideLoadingScreen();
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    // If server request fails, try localStorage as fallback
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      document.getElementById("fullName").value = userData.name || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("bio").value = userData.bio || "";
      document.getElementById("phone").value = userData.phone || "";
      
      // Hide loading screen even on fallback
      hideLoadingScreen();
    } else {
      window.location.href = "../auth/login.html";
    }
  }
}

// Function to hide loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
  }
}

function initializeApp() {
  // Profile dropdown toggle
  const userAvatar = document.getElementById("userAvatar");
  const profileDropdown = document.getElementById("profileDropdown");

  userAvatar.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.add("active");
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

}




// Form submission handler
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  saveProfile();
});

// Change profile picture
function changeProfilePic() {
  document.getElementById("changePictureModal").style.display = "flex";
}
// Save profile data to MongoDB
async function saveProfile() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    showToast("Please log in to update your profile", "error");
    return;
  }

  // Get form data
  const profileData = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    bio: document.getElementById("bio").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    profilePicture: document.getElementById("profilePic").src
  };

  // Validate required fields
  if (!profileData.fullName || !profileData.email) {
    showToast("Full name and email are required", "error");
    return;
  }

  try {
    showToast("Updating profile...", "info");
    
    // Send data to server
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Update localStorage with the updated data from server
      const updatedUser = result.user;
      localStorage.setItem("currentUser", JSON.stringify({
        name: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        phone: updatedUser.phoneNumber
      }));

      showToast("Profile updated successfully!", "success");

      // Update all displayed user info
      document
        .querySelectorAll(".sidebar-avatar img, .dropdown-user-info img")
        .forEach((img) => {
          img.src = updatedUser.profilePicture;
        });

      const userDetailsDiv = document.getElementById("userdetails");
      if (userDetailsDiv) {
        userDetailsDiv.innerHTML = `
          <h4>${updatedUser.username}</h4>
          <p>${updatedUser.email}</p>
      `;
      }
    } else {
      showToast(result.error || "Failed to update profile", "error");
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    showToast("Network error. Please try again.", "error");
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
        window.location.href = "https://webify-kudm.onrender.com/builder/"; // Placeholder demo builder
        return;
      }

      // Navigate to profile page with specific section
      if (
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
  initializeApp();
});


function showtemplate(){
  window.location.href ="../profile/profile.html?section=template"
}

function openMarketplace() {
  window.location.href = "../marketplace/market.html";
}

function openBuilder() {
  window.location.href = "https://webify-kudm.onrender.com/builder/";
}

  // Dropdown menu functions
function openCommunity() {
  console.log("Opening community...");
  window.location.href = "../community/questions.html";
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
  sessionStorage.clear();

  showToast("Logged out successfully!", "success");

  // Redirect to login page
  setTimeout(() => {
    window.location.href = "../auth/login.html";
  }, 1500);
}


