// Add this script to any protected page (e.g., profile, builder, etc.)
// to ensure only logged-in users can access it

async function checkAuthentication() {
    try {
        const response = await fetch('/api/check-auth', {
            credentials: 'include' // Important: send cookies with request
        });
        const data = await response.json();

        if (!data.authenticated) {
            // User is not logged in, redirect to login page
            window.location.href = '../auth/login.html';
            return false;
        }

        // User is authenticated, you can use data.user for user info
        return data.user;
    } catch (error) {
        console.error('Auth check error:', error);
        // On error, redirect to login to be safe
        window.location.href = '../auth/login.html';
        return false;
    }
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuthentication();
    if (user) {
        console.log('Logged in as:', user.username);
        // You can update UI with user info here
    }
});
