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
}

loadUserData();

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
}

initializeApp();

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


