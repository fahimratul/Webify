// Fetch top 3 users from the API
async function loadTopThreeUsers() {
  try {
    const response = await fetch('/api/users/top-three');
    const data = await response.json();

    if (data.success && data.users) {
      console.log("Top 3 users loaded:", data.users);
      return data.users;
    } else {
      console.error("Error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching top 3 users:", error);
    return null;
  }
}

// Initialize and load users when page is ready
(async () => {
  const users = await loadTopThreeUsers();
  if (users) {
    // Update the DOM with the top 3 users
    users.forEach((user, index) => {
      const imgElement = document.getElementById(`img${index + 1}`);
      const usernameElement = document.getElementById(`username${index + 1}`);
      const bioElement = document.getElementById(`bio${index + 1}`);
      const contributionsElement = document.getElementById(`contributions${index + 1}`);

      if (imgElement) {
          imgElement.src = user.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
          imgElement.alt = user.username;
      }
      if (usernameElement) {
          usernameElement.textContent = user.username;
      }
      if (bioElement) {
          bioElement.textContent = user.bio || "No bio available";
      }
      if (contributionsElement) {
          contributionsElement.textContent = `${user.contributions} Contributions`;
      }
    }); 
  } else {
      console.error("Failed to load top 3 users.");
  }
})();
