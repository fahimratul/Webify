 // Initialize Lucide icons
        lucide.createIcons();

        // Form submission handler
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });

        // Change profile picture
        function changeProfilePic() {
            document.getElementById('picInput').click();
        }

        document.getElementById('picInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profilePic').src = e.target.result;
                    showToast('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Save profile data
        function saveProfile() {
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                bio: document.getElementById('bio').value,
                phone: document.getElementById('phone').value
            };

            // Simulate API call
            setTimeout(() => {
                showToast('Profile updated successfully!', 'success');
                // Update sidebar avatar if needed
                document.querySelector('.sidebar-avatar img').src = document.getElementById('profilePic').src;
            }, 1000);
        }

        // Notification toast
        function showToast(message, type = 'info') {
            const toast = document.getElementById('notification-toast');
            toast.textContent = message;
            toast.className = `notification-toast show ${type}`;
            setTimeout(() => {
                toast.className = 'notification-toast';
            }, 3000);
        }

        // Placeholder functions
        function openCommunity() { showToast('Community opened'); }
        function openHelp() { showToast('Help opened'); }
        function editProfile() { /* Already on edit page */ }
        function logout() { window.location.href = 'login.html'; }