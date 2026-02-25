lucide.createIcons();

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveProfile();
});

function changeProfilePic() {
    document.getElementById('picInput').click(); // Trigger file input click
}

document.getElementById('picInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result;
            showToast('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file); // Convert file to base64 string
    }
});

function saveProfile() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        phone: document.getElementById('phone').value // Add phone number to form data

    };

    setTimeout(() => {
        showToast('Profile updated successfully!', 'success');
        document.querySelector('.sidebar-avatar img').src = document.getElementById('profilePic').src;
    }, 1000);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.className = `notification-toast show ${type}`;
    setTimeout(() => {
        toast.className = 'notification-toast';
    }, 3000);
}