/**
 * Email Verification - Notification System
 * Enhanced toast notifications for email verification flow
 * @param {string} message - Verification status message
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

// Get verification token from URL
function getVerificationToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

// Update verification status display
function updateVerificationStatus(type, title, message, showResendSection = false) {
  const statusContainer = document.getElementById('verification-status');
  const resendSection = document.getElementById('resend-section');
  
  let icon = "";
  let statusClass = "";
  
  if (type === "success") {
    icon = `<svg width="64" height="64" fill="none" stroke="#22d3ee" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    statusClass = "success";
  } else if (type === "error") {
    icon = `<svg width="64" height="64" fill="none" stroke="#ec4899" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    statusClass = "error";
  }
  
  statusContainer.innerHTML = `
    <div class="verification-result ${statusClass}">
      <div class="result-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
  
  if (showResendSection) {
    resendSection.style.display = 'block';
  }
}

// Email verification process
async function verifyEmail(token) {
  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      updateVerificationStatus(
        "success",
        "Email Verified! ✅",
        data.message || "Your email has been verified successfully! You can now login to your account."
      );
      
      showNotification(
        "Email verified successfully! Redirecting to login...",
        "success",
        "Verification Complete!"
      );
      
      // Redirect to login after success
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    } else {
      updateVerificationStatus(
        "error",
        "Verification Failed ❌",
        data.error || "The verification link is invalid or has expired.",
        true
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    updateVerificationStatus(
      "error",
      "Verification Failed ❌",
      "Network error. Please check your connection and try again.",
      true
    );
  }
}

// Resend verification form
const resendVerificationForm = document.getElementById("resendVerificationForm");

if (resendVerificationForm) {
  resendVerificationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("resend-email").value;
    const submitBtn = document.querySelector(".submit-btn");

    let hasError = false;

    if (!email) {
      showError("resend-email", "Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      showError("resend-email", "Please enter a valid email address");
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
        const response = await fetch('/api/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          showNotification(
            data.message || "If your email exists and is unverified, a new verification link has been sent.",
            "success",
            "Link Sent! 📧"
          );
          
          // Clear form
          document.getElementById("resend-email").value = '';
        } else {
          showNotification(
            data.error || "Failed to resend verification email. Please try again.",
            "error",
            "Error"
          );
        }
      } catch (error) {
        console.error("Resend verification error:", error);
        showNotification(
          "Network error. Please check your connection and try again.",
          "error",
          "Network Error"
        );
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Resend Verification Link</span>
          <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    }
  });
}

// Initialize verification process
const verificationToken = getVerificationToken();

if (!verificationToken) {
  updateVerificationStatus(
    "error",
    "Invalid Link ❌",
    "No verification token found. Please check your email for the correct verification link.",
    true
  );
} else {
  // Start verification process
  verifyEmail(verificationToken);
}

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
    .verification-status {
        text-align: center;
        padding: 2rem 0;
    }
    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #22d3ee;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    .verification-result {
        padding: 2rem;
    }
    .verification-result.success {
        color: #22d3ee;
    }
    .verification-result.error {
        color: #ec4899;
    }
    .result-icon {
        margin-bottom: 1rem;
    }
    .result-icon svg {
        margin: 0 auto;
        display: block;
    }
    .resend-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
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

// Email Verification System - Developed for Webify
console.log("WEBIFY Email Verification page loaded successfully! 📧");
console.log("Token present:", !!verificationToken);