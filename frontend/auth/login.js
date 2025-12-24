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

// Tab Switching
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  loginTab.classList.remove("signup");
  signupTab.classList.remove("active");
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active", "signup");
  loginTab.classList.remove("active");
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

// Password Toggle Function
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    button.innerHTML = `
            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
  } else {
    input.type = "password";
    button.innerHTML = `
            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
  }
}

// Password Strength Checker
const signupPasswordInput = document.getElementById("signup-password");
const passwordStrengthDiv = document.getElementById("password-strength");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");

if (signupPasswordInput) {
  signupPasswordInput.addEventListener("input", (e) => {
    const password = e.target.value;

    if (password.length === 0) {
      passwordStrengthDiv.style.display = "none";
      return;
    }

    passwordStrengthDiv.style.display = "block";

    let strength = 0;
    let label = "";
    let color = "";

    if (password.length < 6) {
      strength = 33;
      label = "Weak";
      color = "#ef4444";
    } else if (password.length < 10) {
      strength = 66;
      label = "Good";
      color = "#eab308";
    } else {
      strength = 100;
      label = "Strong";
      color = "#22c55e";
    }

    strengthFill.style.width = strength + "%";
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = label;
    strengthText.className = "strength-text " + label.toLowerCase();
  });
}

// Form Validation
function showError(inputId, message) {
  const errorElement = document.getElementById(inputId + "-error");
  errorElement.textContent = "⚠ " + message;
  errorElement.classList.add("show");

  setTimeout(() => {
    errorElement.classList.remove("show");
  }, 3000);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Login Form Submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  let hasError = false;

  if (!email) {
    showError("login-email", "Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    showError("login-email", "Email is invalid");
    hasError = true;
  }

  if (!password) {
    showError("login-password", "Password is required");
    hasError = true;
  } else if (password.length < 6) {
    showError("login-password", "Password must be at least 6 characters");
    hasError = true;
  }

  if (!hasError) {
    showNotification(
      "Welcome back! You have successfully signed in.",
      "success"
    );
    // Redirect to profile page after short delay
    setTimeout(() => {
      window.location.href = "../profile/profile.html";
    }, 1500);
    console.log("Login with:", { email, password });
  }
});

// Signup Form Submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;
  const agreeToTerms = document.getElementById("terms-agree").checked;

  let hasError = false;

  if (!name) {
    showError("signup-name", "Name is required");
    hasError = true;
  }

  if (!email) {
    showError("signup-email", "Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    showError("signup-email", "Email is invalid");
    hasError = true;
  }

  if (!password) {
    showError("signup-password", "Password is required");
    hasError = true;
  } else if (password.length < 6) {
    showError("signup-password", "Password must be at least 6 characters");
    hasError = true;
  }

  if (!confirmPassword) {
    showError("signup-confirm-password", "Please confirm your password");
    hasError = true;
  } else if (password !== confirmPassword) {
    showError("signup-confirm-password", "Passwords do not match");
    hasError = true;
  }

  if (!agreeToTerms) {
    showNotification(
      "Please agree to the Terms and Conditions",
      "warning",
      "Action Required"
    );
    hasError = true;
  }

  if (!hasError) {
    showNotification(
      "A new journey begins! Welcome to the community.",
      "success",
      "Welcome! 🎉"
    );
    // Redirect to profile page after short delay
    setTimeout(() => {
      window.location.href = "../profile/profile.html";
    }, 1500);
    console.log("Signup with:", { name, email, password });
  }
});

// Terms Checkbox Fix - Make the checkbox clickable
const termsCheckbox = document.getElementById("terms-agree");
const checkboxBox = document.querySelector(".checkbox-box");
const termsLabel = document.querySelector(".terms-label");

if (termsCheckbox && checkboxBox) {
  // Click on checkbox box
  checkboxBox.addEventListener("click", function (e) {
    e.preventDefault();
    termsCheckbox.checked = !termsCheckbox.checked;

    if (termsCheckbox.checked) {
      checkboxBox.style.transform = "scale(1.1)";
      setTimeout(() => {
        checkboxBox.style.transform = "scale(1)";
      }, 200);
    }
  });

  // Click on label (except links)
  if (termsLabel) {
    termsLabel.addEventListener("click", function (e) {
      // Don't toggle if clicking on links
      if (e.target.tagName !== "A") {
        e.preventDefault();
        termsCheckbox.checked = !termsCheckbox.checked;

        if (termsCheckbox.checked) {
          checkboxBox.style.transform = "scale(1.1)";
          setTimeout(() => {
            checkboxBox.style.transform = "scale(1)";
          }, 200);
        }
      }
    });
  }
}

// Forgot Password Link
const forgotLink = document.querySelector(".forgot-link");
if (forgotLink) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "forgot-password.html";
  });
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Add loading animation to submit buttons
document.querySelectorAll(".submit-btn").forEach((button) => {
  button.addEventListener("click", function () {
    if (this.querySelector(".arrow-icon")) {
      const arrow = this.querySelector(".arrow-icon");
      arrow.style.animation = "none";
      setTimeout(() => {
        arrow.style.animation = "pulse 0.5s ease-in-out";
      }, 10);
    }
  });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

// Add focus styles for keyboard navigation
const style = document.createElement("style");
style.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid #22d3ee !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

console.log("WEBIFY Login/Signup page loaded successfully! 🚀");
