

/**
 * Login Button Handler
 * Redirects users to the main authentication page with login tab active
 */
document.querySelector(".login-btn").addEventListener("click", function () {
  console.log("Login button clicked");
  // Redirect to auth page with login tab active
  window.location.href = "../auth/login.html";
});

/**
 * Join Now Button Handler
 * Redirects users to the authentication page with signup tab active
 * Enables new user registration flow
 */
document.querySelector(".join-btn").addEventListener("click", function () {
  console.log("Join Now button clicked");
  // Redirect to auth page with signup tab active
  window.location.href = "../auth/login.html?tab=signup";
});

/**
 * Page Initialization
 * Handles initial page load and setup
 * Can be extended with additional interactive features
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Login Page 2 loaded successfully - Ready for authentication");

  // You can add more interactive features here
  // For example: form validation, API calls, analytics, etc.
});
