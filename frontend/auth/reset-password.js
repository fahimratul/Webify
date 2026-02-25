/**
 * Password Reset - Notification System
 * Enhanced toast notifications for password reset flow
 * @param {string} message - Reset status message
 * @param {string} type - Notification type
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

// Form Validation
function showError(inputId, message) {
  const errorElement = document.getElementById(inputId + "-error");
  errorElement.textContent = "⚠ " + message;
  errorElement.classList.add("show");

  setTimeout(() => {
    errorElement.classList.remove("show");
  }, 3000);
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.parentElement.querySelector('.password-toggle');
  const eyeIcon = toggle.querySelector('.eye-icon');
  
  if (input.type === 'password') {
    input.type = 'text';
    eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6.06 6.06"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.21-6.21"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    input.type = 'password';
    eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

// Get reset token from URL
function getResetToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

// Reset Password Form Submission
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetToken = getResetToken();

// Check if token exists
if (!resetToken) {
  showNotification(
    "Invalid or missing reset token. Please request a new password reset link.",
    "error",
    "Invalid Link"
  );
  setTimeout(() => {
    window.location.href = 'forgot-password.html';
  }, 3000);
}

resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const submitBtn = document.querySelector(".submit-btn");

  let hasError = false;

  if (!newPassword) {
    showError("new-password", "Password is required");
    hasError = true;
  } else if (newPassword.length < 6) {
    showError("new-password", "Password must be at least 6 characters long");
    hasError = true;
  }

  if (!confirmPassword) {
    showError("confirm-password", "Please confirm your password");
    hasError = true;
  } else if (newPassword !== confirmPassword) {
    showError("confirm-password", "Passwords do not match");
    hasError = true;
  }

  if (!hasError && resetToken) {
    // Add loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Resetting...</span>
      <svg class="arrow-icon spinning" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    `;

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: resetToken, 
          password: newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          data.message || "Your password has been reset successfully! Redirecting to login...",
          "success",
          "Password Reset! 🔒"
        );
        
        // Clear form
        document.getElementById("new-password").value = '';
        document.getElementById("confirm-password").value = '';
        
        // Redirect to login after success
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
      } else {
        showNotification(
          data.error || "Failed to reset password. Please try again.",
          "error",
          "Reset Failed"
        );
      }
    } catch (error) {
      console.error("Password reset error:", error);
      showNotification(
        "Network error. Please check your connection and try again.",
        "error",
        "Network Error"
      );
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Reset Password</span>
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
    }
  }
});

// Add loading animation styles
const style = document.createElement("style");
style.textContent = `
    .spinning {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    .keyboard-nav *:focus {
        outline: 2px solid #22d3ee !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

// Password Reset System - Developed by Tamim for Webify
console.log("WEBIFY Password Reset page loaded successfully! 🔒");
console.log("Token present:", !!resetToken);