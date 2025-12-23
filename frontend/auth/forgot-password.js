// Notification Toast Function
function showNotification(message, type = 'success', title = '') {
    const toast = document.getElementById('notification-toast');
    
    // Set default titles based on type
    if (!title) {
        if (type === 'success') title = 'Success!';
        else if (type === 'error') title = 'Error';
        else if (type === 'warning') title = 'Warning';
    }
    
    // Icon based on type
    let icon = '';
    if (type === 'success') {
        icon = `<svg fill="none" stroke="#22d3ee" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    } else if (type === 'error') {
        icon = `<svg fill="none" stroke="#ec4899" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    } else if (type === 'warning') {
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
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const toast = document.getElementById('notification-toast');
    toast.classList.remove('show');
}

// Form Validation
function showError(inputId, message) {
    const errorElement = document.getElementById(inputId + '-error');
    errorElement.textContent = '⚠ ' + message;
    errorElement.classList.add('show');
    
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Forgot Password Form Submission
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    let hasError = false;
    
    if (!email) {
        showError('forgot-email', 'Email is required');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('forgot-email', 'Please enter a valid email address');
        hasError = true;
    }
    
    if (!hasError) {
        showNotification('Password reset link has been sent to your email. Please check your inbox.', 'success', 'Email Sent! ✉️');
        // Here you would typically send the data to your server
        console.log('Password reset requested for:', email);
        
        // Optionally redirect after a delay
        setTimeout(() => {
            // window.location.href = 'index.html';
        }, 3000);
    }
});

// Add loading animation to submit button
document.querySelector('.submit-btn').addEventListener('click', function() {
    if (this.querySelector('.arrow-icon')) {
        const arrow = this.querySelector('.arrow-icon');
        arrow.style.animation = 'none';
        setTimeout(() => {
            arrow.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid #22d3ee !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

console.log('WEBIFY Forgot Password page loaded successfully! 🔒');
