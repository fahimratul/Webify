// ============================================================================
// WEBIFY COMMUNITY - QUESTIONS PAGE
// ============================================================================
// This file handles the community questions page functionality including:
// - User authentication check
// - Fetching and displaying questions from the backend API
// - Voting on questions (upvote/downvote)
// - Posting new questions with tags
// - Tab navigation and filtering
// - Real-time search functionality
// ============================================================================

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
// Global state object to track the current UI state
const state = {
  tab: "newest",        // Current active tab (newest, unanswered, trending, lastyear)
  tag: "",              // Selected tag filter
  sort: "newest",       // Sort order (newest, votes, views)
  query: "",            // Search query string
  questions: [],        // Array of question objects from API
  currentUser: null,    // Current logged-in user object (null if not logged in)
};

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================
// Cache frequently accessed DOM elements for better performance
const countEl = document.getElementById("questionCount");
const listEl = document.getElementById("questionList");
const answerModal = document.getElementById("answerModal");
const questionTitleInput = document.getElementById("questionTitleInput");
const questionInput = document.getElementById("questionInput");
const tagInput = document.getElementById("tagInput");

// Array to store tags entered by user when creating a question
let tags = [];

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Check if user is authenticated by calling the backend API
 * Updates UI based on authentication status
 * @returns {Promise<boolean>} - True if authenticated, false otherwise
 */
async function checkAuthentication() {
  try {
    const response = await fetch("/api/check-auth", {
      credentials: "include", // Include cookies for session management
    });
    const data = await response.json();

    if (data.authenticated) {
      // User is logged in - store user data and update UI
      state.currentUser = data.user;
      updateUIForLoggedInUser(data.user);
      return true;
    } else {
      // User is not logged in - show login button
      updateUIForLoggedOutUser();
      return false;
    }
  } catch (error) {
    console.error("Auth check error:", error);
    updateUIForLoggedOutUser();
    return false;
  }
}

// ============================================================================
// API - FETCH QUESTIONS
// ============================================================================

/**
 * Fetch questions from backend API based on current state filters
 * Handles pagination, sorting, filtering by tags, and search
 */
async function fetchQuestions() {
  try {
    // Build query parameters from current state
    const params = new URLSearchParams({
      tab: state.tab,
      sort: state.sort,
    });

    // Add optional filters if set
    if (state.tag) params.append("tag", state.tag);
    if (state.query) params.append("search", state.query);

    // Make API request with credentials for authentication
    const response = await fetch(`/api/questions?${params}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    state.questions = data.questions || [];
    render(); // Re-render the questions list
  } catch (error) {
    console.error("Error fetching questions:", error);
    showNotification("Failed to load questions", "error light", "Error");
    state.questions = [];
    render();
  }
}

// ============================================================================
// RENDERING
// ============================================================================

/**
 * Main render function - updates the question list UI
 * Called whenever state changes (new data, filters, etc.)
 */
function render() {
  // Update question count display
  countEl.textContent = formatNumber(state.questions.length);

  // Show empty state if no questions
  if (state.questions.length === 0) {
    listEl.innerHTML =
      '<p style="text-align:center; padding:2rem; color:#666;">No questions found. Be the first to ask!</p>';
    return;
  }

  // Render each question as a card
  listEl.innerHTML = state.questions.map(questionCard).join("");
}

/**
 * Generate HTML for a single question card
 * @param {Object} q - Question object from API
 * @returns {string} - HTML string for the question card
 */
function questionCard(q) {
  // Generate tags HTML
  const tags = (q.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  // Calculate time ago string
  const timeAgo = getTimeAgo(new Date(q.createdAt));
  const author = q.author;
  const answerCount = q.answers ? q.answers.length : 0;
  
  // Check if current user has voted on this question
  const votebyUser = state.currentUser._id;
  const userVote = q.votedBy ? q.votedBy.find((v) => v.user.toString() === votebyUser) : null;
  
  // Set vote class for highlighting user's vote
  let voteClass = "";
  if (userVote) {
    if (userVote.voteType === "up") {
      voteClass = "voted-up";
    } else if (userVote.voteType === "down") {
      voteClass = "voted-down";
    }
  }
      
  // Debug logging for vote state
  console.log("User vote on this question:", userVote);
  console.log("User vote on this question:", votebyUser);
  console.log("Question data:", q);
  console.log("Author data:", author);

  // Return complete question card HTML
  return `
    <article class="question-card" data-id="${q._id}">
      <!-- Stats section: votes, answers, views -->
      <div class="stats">
        <div class="stat">
          <div class="value">${formatNumber(q.votes || 0)}</div>
          <div class="label">votes</div>
        </div>
        <div class="stat">
          <div class="value">${formatNumber(answerCount)}</div>
          <div class="label">answers</div>
        </div>
        <div class="stat">
          <div class="value">${formatNumber(q.views || 0)}</div>
          <div class="label">views</div>
        </div>
      </div>
      
      <!-- Main content section -->
      <div class="content">
        <a href="#" class="title" onclick="viewQuestion('${q._id}'); return false;">${q.title}</a>
        <p class="excerpt">${q.body.substring(0, 200)}${q.body.length > 200 ? "..." : ""}</p>
        <div class="tags">${tags}</div>
        
        <!-- Action buttons: upvote, downvote, answer -->
        <div class="actions-row">
          <span onclick="voteQuestion('${q._id}', 'up')" class="${voteClass === 'voted-up' ? 'voted-up' : ''}">
            <i class="fa-regular fa-thumbs-up"></i> Upvote
          </span>
          <span onclick="voteQuestion('${q._id}', 'down')" class="${voteClass === 'voted-down' ? 'voted-down' : ''}">
            <i class="fa-regular fa-thumbs-down"></i> Downvote
          </span>
          <span onclick="viewQuestion('${q._id}')">
            <i class="fa-regular fa-comment"></i> Answer
          </span>
        </div>
      </div>
      
      <!-- Author info section -->
      <div class="user">
        <div class="avatar"><img src="${author.profilePicture}" alt="User Avatar"></div>
        <div>
          <div class="name">${author.username}</div>
          <div class="time">asked ${timeAgo}</div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
// API - POST NEW QUESTION
// ============================================================================

/**
 * Submit a new question to the backend API
 * Validates input before sending
 */
async function submitAnswer() {
  // Get and trim input values
  const title = questionTitleInput.value.trim();
  const body = questionInput.value.trim();

  // Validation: Check if both fields are filled
  if (!title || !body) {
    showNotification(
      "Please fill in both title and question body",
      "warning light",
      "Missing Information",
    );
    return;
  }

  // Validation: Title must be at least 10 characters
  if (title.length < 10) {
    showNotification(
      "Title must be at least 10 characters",
      "warning light",
      "Title Too Short",
    );
    return;
  }

  // Validation: Question body must be at least 20 characters
  if (body.length < 20) {
    showNotification(
      "Question must be at least 20 characters",
      "warning light",
      "Question Too Short",
    );
    return;
  }

  try {
    // Send POST request to create question
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include session cookies
      body: JSON.stringify({
        title,
        body,
        tags, // Tags array from global state
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success - show notification and refresh questions
      showNotification(
        "Your question has been posted successfully!",
        "success light",
        "Success",
      );
      closeAnswerModal();
      await fetchQuestions();
    } else {
      // Handle errors
      if (response.status === 401) {
        // User not authenticated - redirect to login
        showNotification(
          "Please login to ask a question",
          "warning light",
          "Not Logged In",
        );
        setTimeout(() => {
          window.location.href = "../auth/login.html";
        }, 1500);
      } else {
        // Other errors
        showNotification(
          data.error || "Failed to post question",
          "error light",
          "Error",
        );
      }
    }
  } catch (error) {
    console.error("Error posting question:", error);
    showNotification(
      "Failed to post question. Please try again.",
      "error light",
      "Error",
    );
  }
}

// ============================================================================
// API - VOTE ON QUESTION
// ============================================================================

/**
 * Vote on a question (upvote or downvote)
 * @param {string} questionId - ID of the question to vote on
 * @param {string} voteType - 'up' or 'down'
 */
async function voteQuestion(questionId, voteType) {
  // Check if user is logged in
  if (!state.currentUser) {
    showNotification("Please login to vote", "warning light", "Not Logged In");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return;
  }

  try {
    // Send vote request to API
    const response = await fetch(`/api/questions/${questionId}/vote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ voteType }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success - refresh questions to show updated vote count
      showNotification("Vote recorded!", "success light", "Success");
      await fetchQuestions();
    } else {
      showNotification(data.error || "Failed to vote", "error light", "Error");
    }
  } catch (error) {
    console.error("Error voting:", error);
    showNotification(
      "Failed to vote. Please try again.",
      "error light",
      "Error",
    );
  }
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Navigate to question detail page
 * @param {string} questionId - ID of the question to view
 */
function viewQuestion(questionId) {
  window.location.href = `question-detail.html?id=${questionId}`;
}

// ============================================================================
// EVENT LISTENERS - TABS
// ============================================================================

// Tab switching functionality
const tabs = document.querySelectorAll(".tab");
tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked tab
    btn.classList.add("active");
    // Update state and fetch new data
    state.tab = btn.dataset.tab;
    fetchQuestions();
  }),
);

// ============================================================================
// EVENT LISTENERS - FILTERS
// ============================================================================

// Filter panel toggle
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
filterToggle.addEventListener("click", () => {
  const isHidden = filterPanel.hasAttribute("hidden");
  if (isHidden) filterPanel.removeAttribute("hidden");
  else filterPanel.setAttribute("hidden", "");
});

// Tag filter dropdown
document.getElementById("tagSelect").addEventListener("change", (e) => {
  state.tag = e.target.value;
  fetchQuestions();
});

// Sort dropdown
document.getElementById("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  fetchQuestions();
});

// ============================================================================
// EVENT LISTENERS - SEARCH
// ============================================================================

// Search input with debounce (500ms delay)
document.getElementById("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  // Clear existing timeout
  clearTimeout(window.searchTimeout);
  // Set new timeout to avoid too many API calls
  window.searchTimeout = setTimeout(() => {
    fetchQuestions();
  }, 500);
});

// ============================================================================
// EVENT LISTENERS - ASK QUESTION MODAL
// ============================================================================

// Ask question button - opens modal
const askBtn = document.getElementById("askBtn");
askBtn.addEventListener("click", () => {
  // Check if user is logged in
  if (!state.currentUser) {
    showNotification(
      "Please login to ask a question",
      "warning light",
      "Not Logged In",
    );
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return;
  }
  // Show modal
  answerModal.removeAttribute("hidden");
});

/**
 * Close the ask question modal and reset form
 */
function closeAnswerModal() {
  answerModal.setAttribute("hidden", "");
  questionTitleInput.value = "";
  questionInput.value = "";
  tags = [];
  renderTags();
}

// ============================================================================
// TAG INPUT HANDLING
// ============================================================================

const tagContainer = document.getElementById("tagContainer");

// Handle comma-separated tag input
tagInput.addEventListener("input", function (e) {
  const value = this.value;
  // Check if user entered a comma
  if (value.includes(",")) {
    const parts = value.split(",");
    // Add all tags except the last part (after last comma)
    for (let i = 0; i < parts.length - 1; i++) {
      const tagText = parts[i].trim();
      if (tagText) {
        addTag(tagText);
      }
    }
    this.value = "";
  }
});

// Handle Enter key to add tag
tagInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const tagText = this.value.trim();
    if (tagText) {
      addTag(tagText);
      this.value = "";
    }
  }
  // Handle Backspace to remove last tag when input is empty
  if (e.key === "Backspace" && this.value === "" && tags.length > 0) {
    removeTag(tags.length - 1);
  }
});

// Focus tag input when container is clicked
tagContainer.addEventListener("click", function () {
  tagInput.focus();
});

/**
 * Add a new tag to the tags array
 * @param {string} text - Tag text to add
 */
function addTag(text) {
  // Avoid duplicates
  if (!tags.includes(text)) {
    tags.push(text);
    renderTags();
  }
}

/**
 * Remove a tag from the tags array by index
 * @param {number} index - Index of tag to remove
 */
function removeTag(index) {
  tags.splice(index, 1);
  renderTags();
}

/**
 * Render all tags in the tag container
 */
function renderTags() {
  // Remove existing tag elements
  const existingTags = tagContainer.querySelectorAll(".tag");
  existingTags.forEach((tag) => tag.remove());

  // Create new tag elements
  tags.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.innerHTML = `
      ${tag}
      <span class="remove" data-index="${index}">×</span>
    `;
    // Add click handler for remove button
    tagElement.querySelector(".remove").addEventListener("click", function (e) {
      e.stopPropagation();
      removeTag(parseInt(this.dataset.index));
    });

    // Insert before the input field
    tagContainer.insertBefore(tagElement, tagInput);
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format number with locale-specific thousand separators
 * @param {number} n - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(n) {
  return Intl.NumberFormat().format(n);
}

/**
 * Calculate relative time string (e.g., "2 hours ago")
 * @param {Date} date - Date to calculate from
 * @returns {string} - Relative time string
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

/**
 * Update UI elements for logged-in user
 * @param {Object} user - User object from API
 */
function updateUIForLoggedInUser(user) {
  document.getElementById("loginLink").style.display = "none";
  const userNameDiv = document.getElementById("userName");
  userNameDiv.style.display = "flex";
  userNameDiv.innerHTML = `<img src="${user.profilePicture}" alt="User Avatar" class="user-avatar"> ${user.username}`;
}

/**
 * Update UI elements for logged-out user
 */
function updateUIForLoggedOutUser() {
  document.getElementById("loginLink").style.display = "block";
  document.getElementById("userName").style.display = "none";
}

/**
 * Navigate to user profile page
 */
function openprofile() {
  window.location.href = "../profile/profile.html";
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

/**
 * Display a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success light, error light, warning light)
 * @param {string} title - Optional title for notification
 */
function showNotification(message, type = "success", title = "") {
  const toast = document.getElementById("notification-toast");

  // Set default title based on type
  if (!title) {
    if (type === "success light") title = "Success!";
    else if (type === "error light") title = "Error";
    else if (type === "warning light") title = "Warning";
  }

  // Choose icon based on type
  let icon = "";
  if (type === "success light") {
    icon = `<svg fill="none" stroke="#ffffffff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "error light") {
    icon = `<svg fill="none" stroke="#2b0116ff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
  } else if (type === "warning light") {
    icon = `<svg fill="none" stroke="#ff0000ff" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`;
  }

  // Build toast HTML
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

  // Show toast with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

/**
 * Hide the notification toast
 */
function hideNotification() {
  const toast = document.getElementById("notification-toast");
  toast.classList.remove("show");
}

// ============================================================================
// INITIALIZE
// ============================================================================

/**
 * Initialize the page on DOM load
 * - Check authentication status
 * - Fetch initial questions data
 */
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuthentication();
  await fetchQuestions();
});