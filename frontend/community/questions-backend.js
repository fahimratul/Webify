// Community questions page with backend API integration
const state = {
  tab: "newest",
  tag: "",
  sort: "newest",
  query: "",
  questions: [],
  currentUser: null,
};

const countEl = document.getElementById("questionCount");
const listEl = document.getElementById("questionList");
const answerModal = document.getElementById("answerModal");
const questionTitleInput = document.getElementById("questionTitleInput");
const questionInput = document.getElementById("questionInput");
const tagInput = document.getElementById("tagInput");

let tags = [];

// Check authentication status
async function checkAuthentication() {
  try {
    const response = await fetch("/api/check-auth", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.authenticated) {
      state.currentUser = data.user;
      updateUIForLoggedInUser(data.user);
      return true;
    } else {
      updateUIForLoggedOutUser();
      return false;
    }
  } catch (error) {
    console.error("Auth check error:", error);
    updateUIForLoggedOutUser();
    return false;
  }
}

// Fetch questions from API
async function fetchQuestions() {
  try {
    const params = new URLSearchParams({
      tab: state.tab,
      sort: state.sort,
    });

    if (state.tag) params.append("tag", state.tag);
    if (state.query) params.append("search", state.query);

    const response = await fetch(`/api/questions?${params}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    state.questions = data.questions || [];
    render();
  } catch (error) {
    console.error("Error fetching questions:", error);
    showNotification("Failed to load questions", "error light", "Error");
    state.questions = [];
    render();
  }
}

// Render questions list
function render() {
  countEl.textContent = formatNumber(state.questions.length);

  if (state.questions.length === 0) {
    listEl.innerHTML =
      '<p style="text-align:center; padding:2rem; color:#666;">No questions found. Be the first to ask!</p>';
    return;
  }

  listEl.innerHTML = state.questions.map(questionCard).join("");
}

/**
 * Format a question card HTML
 */
function questionCard(q) {
  const tags = (q.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const timeAgo = getTimeAgo(new Date(q.createdAt));
  const author = q.author ;
  const answerCount = q.answers ? q.answers.length : 0;
  
  // Check if user is logged in before accessing user ID
  const votebyUser = state.currentUser ? state.currentUser._id : null;
  const userVote = votebyUser && q.votedBy ? q.votedBy.find((v) => v.user.toString() === votebyUser) : null;
  let voteClass = "";
  if (userVote) {
    if (userVote.voteType === "up") {
      voteClass = "voted-up";
    } else if (userVote.voteType === "down") {
      voteClass = "voted-down";
    }
  }
      
  console.log("User vote on this question:", userVote);
  console.log("User vote on this question:", votebyUser);
  console.log("Question data:", q);
  console.log("Author data:", author);

  return `
    <article class="question-card" data-id="${q._id}">
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
      <div class="content">
        <a href="#" class="title" onclick="viewQuestion('${q._id}'); return false;">${q.title}</a>
        <p class="excerpt">${q.body.substring(0, 200)}${q.body.length > 200 ? "..." : ""}</p>
        <div class="tags">${tags}</div>
        <div class="actions-row">
          <span onclick="voteQuestion('${q._id}', 'up')" class="${voteClass === 'voted-up' ? 'voted-up' : ''}"><i class="fa-regular fa-thumbs-up"></i> Upvote</span>
          <span onclick="voteQuestion('${q._id}', 'down')" class="${voteClass === 'voted-down' ? 'voted-down' : ''}"><i class="fa-regular fa-thumbs-down"></i> Downvote</span>
          <span onclick="viewQuestion('${q._id}')"><i class="fa-regular fa-comment"></i> Answer</span>
        </div>
      </div>
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

// Submit new question
async function submitAnswer() {
  const title = questionTitleInput.value.trim();
  const body = questionInput.value.trim();

  if (!title || !body) {
    showNotification(
      "Please fill in both title and question body",
      "warning light",
      "Missing Information",
    );
    return;
  }

  if (title.length < 10) {
    showNotification(
      "Title must be at least 10 characters",
      "warning light",
      "Title Too Short",
    );
    return;
  }

  if (body.length < 20) {
    showNotification(
      "Question must be at least 20 characters",
      "warning light",
      "Question Too Short",
    );
    return;
  }

  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        body,
        tags,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(
        "Your question has been posted successfully!",
        "success light",
        "Success",
      );
      closeAnswerModal();
      await fetchQuestions();
    } else {
      if (response.status === 401) {
        showNotification(
          "Please login to ask a question",
          "warning light",
          "Not Logged In",
        );
        setTimeout(() => {
          window.location.href = "../auth/login.html";
        }, 1500);
      } else {
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

// Vote on question
async function voteQuestion(questionId, voteType) {
  if (!state.currentUser) {
    showNotification("Please login to vote", "warning light", "Not Logged In");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return;
  }

  try {
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

// View question details
function viewQuestion(questionId) {
  window.location.href = `question-detail.html?id=${questionId}`;
}

// Tab switching
const tabs = document.querySelectorAll(".tab");
tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.tab = btn.dataset.tab;
    fetchQuestions();
  }),
);

// Filter toggle
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
filterToggle.addEventListener("click", () => {
  const isHidden = filterPanel.hasAttribute("hidden");
  if (isHidden) filterPanel.removeAttribute("hidden");
  else filterPanel.setAttribute("hidden", "");
});

// Filter selects
document.getElementById("tagSelect").addEventListener("change", (e) => {
  state.tag = e.target.value;
  fetchQuestions();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  fetchQuestions();
});

// Search input
document.getElementById("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    fetchQuestions();
  }, 500);
});

// Ask question button
const askBtn = document.getElementById("askBtn");
askBtn.addEventListener("click", () => {
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
  answerModal.removeAttribute("hidden");
});

// Modal close
function closeAnswerModal() {
  answerModal.setAttribute("hidden", "");
  questionTitleInput.value = "";
  questionInput.value = "";
  tags = [];
  renderTags();
}

// Tag input handling
const tagContainer = document.getElementById("tagContainer");

tagInput.addEventListener("input", function (e) {
  const value = this.value;
  if (value.includes(",")) {
    const parts = value.split(",");
    for (let i = 0; i < parts.length - 1; i++) {
      const tagText = parts[i].trim();
      if (tagText) {
        addTag(tagText);
      }
    }
    this.value = "";
  }
});

tagInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const tagText = this.value.trim();
    if (tagText) {
      addTag(tagText);
      this.value = "";
    }
  }
  if (e.key === "Backspace" && this.value === "" && tags.length > 0) {
    removeTag(tags.length - 1);
  }
});

tagContainer.addEventListener("click", function () {
  tagInput.focus();
});

function addTag(text) {
  if (!tags.includes(text)) {
    tags.push(text);
    renderTags();
  }
}

function removeTag(index) {
  tags.splice(index, 1);
  renderTags();
}

function renderTags() {
  const existingTags = tagContainer.querySelectorAll(".tag");
  existingTags.forEach((tag) => tag.remove());

  tags.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.innerHTML = `
      ${tag}
      <span class="remove" data-index="${index}">×</span>
    `;
    tagElement.querySelector(".remove").addEventListener("click", function (e) {
      e.stopPropagation();
      removeTag(parseInt(this.dataset.index));
    });

    tagContainer.insertBefore(tagElement, tagInput);
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(n) {
  return Intl.NumberFormat().format(n);
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function updateUIForLoggedInUser(user) {
  document.getElementById("loginLink").style.display = "none";
  const userNameDiv = document.getElementById("userName");
  userNameDiv.style.display = "flex";
  userNameDiv.innerHTML = `<img src="${user.profilePicture}" alt="User Avatar" class="user-avatar"> ${user.username}`;
}

function updateUIForLoggedOutUser() {
  document.getElementById("loginLink").style.display = "block";
  document.getElementById("userName").style.display = "none";
}

function openprofile() {
  window.location.href = "../profile/profile.html";
}

// Notification Toast
function showNotification(message, type = "success", title = "") {
  const toast = document.getElementById("notification-toast");

  if (!title) {
    if (type === "success light") title = "Success!";
    else if (type === "error light") title = "Error";
    else if (type === "warning light") title = "Warning";
  }

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

// ============================================================================
// INITIALIZE
// ============================================================================

// Load data when page loads
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuthentication();
  await fetchQuestions();
});
