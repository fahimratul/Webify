/**
 * Password Recovery - Notification System
 * Enhanced toast notifications for password recovery flow
 * @param {string} message - Recovery status message
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

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Forgot Password Form Submission
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgot-email").value;
  const submitBtn = document.querySelector(".submit-btn");

  let hasError = false;

  if (!email) {
    showError("forgot-email", "Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    showError("forgot-email", "Please enter a valid email address");
    hasError = true;
  }

  if (!hasError) {
    // Add loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Sending...</span>
      <svg class="arrow-icon spinning" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    `;

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          data.message || "Password reset link has been sent to your email. Please check your inbox.",
          "success",
          "Email Sent! ✉️"
        );
        
        // Clear form
        document.getElementById("forgot-email").value = '';
        
        // Optionally redirect after a delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
      } else {
        showNotification(
          data.error || "Failed to send password reset email. Please try again.",
          "error",
          "Error"
        );
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      showNotification(
        "Network error. Please check your connection and try again.",
        "error",
        "Network Error"
      );
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Reset Link</span>
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
    }
  }
});

// Add loading animation to submit button
document.querySelector(".submit-btn").addEventListener("click", function () {
  if (this.querySelector(".arrow-icon")) {
    const arrow = this.querySelector(".arrow-icon");
    arrow.style.animation = "none";
    setTimeout(() => {
      arrow.style.animation = "pulse 0.5s ease-in-out";
    }, 10);
  }
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
`;
document.head.appendChild(style);

// Password Recovery System - Developed by Tamim
console.log("WEBIFY Forgot Password page loaded successfully! 🔒");
console.log("Password recovery system ready! 📧");
