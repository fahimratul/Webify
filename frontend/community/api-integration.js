// ==================================================
// BACKEND API INTEGRATION FOR QUESTIONS
// Add this code to frontend/community/questions.js
// ==================================================

// API Configuration
const API_BASE_URL = "http://localhost:3000/api";
let currentUser = null;

// Check authentication status on page load
async function checkAuthentication() {
  try {
    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      updateUIForAuthenticatedUser();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

// Update UI based on authentication
function updateUIForAuthenticatedUser() {
  const loginLink = document.getElementById("loginLink");
  const userName = document.getElementById("userName");

  if (currentUser && loginLink && userName) {
    loginLink.style.display = "none";
    userName.style.display = "flex";
    userName.innerHTML = `
            <div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
            <span>${currentUser.username}</span>
        `;
  }
}

// Load questions from backend
async function loadQuestionsFromAPI() {
  try {
    const { tag, sort, query } = state;

    let url = `${API_BASE_URL}/questions?`;
    const params = [];

    if (sort) params.push(`sort=${sort}`);
    if (tag) params.push(`tag=${tag}`);
    if (query) params.push(`search=${query}`);

    url += params.join("&");

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load questions");
    }

    const data = await response.json();

    // Convert API response to match existing format
    const formattedQuestions = data.questions.map((q) => ({
      id: q._id,
      title: q.title,
      excerpt: q.content.substring(0, 200) + "...",
      tags: q.tags,
      votes: q.votes,
      answers: q.answerCount,
      views: q.views,
      author: q.author?.username || "Anonymous",
      askedAgo: formatTimeAgo(new Date(q.createdAt)),
      createdAt: new Date(q.createdAt).getTime(),
    }));

    return formattedQuestions;
  } catch (error) {
    console.error("Error loading questions:", error);
    showNotification(
      "Failed to load questions from server. Showing cached data.",
      "warning",
    );
    return questions; // Fallback to static data
  }
}

// Submit new question
async function submitQuestionToAPI() {
  if (!currentUser) {
    showNotification("Please login to ask a question", "warning");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return false;
  }

  const title = document.getElementById("questionTitleInput").value.trim();
  const content = document.getElementById("questionInput").value.trim();
  const tagInput = document.getElementById("tagInput").value.trim();

  if (!title || !content) {
    showNotification("Please fill in title and content", "error");
    return false;
  }

  const tags = tagInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        content,
        tags,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to post question");
    }

    const data = await response.json();
    showNotification("Question posted successfully!", "success");

    // Clear form
    document.getElementById("questionTitleInput").value = "";
    document.getElementById("questionInput").value = "";
    document.getElementById("tagInput").value = "";

    // Reload questions
    await refreshQuestions();

    return true;
  } catch (error) {
    console.error("Error posting question:", error);
    showNotification(error.message, "error");
    return false;
  }
}

// Vote on a question
async function voteOnQuestion(questionId, voteType) {
  if (!currentUser) {
    showNotification("Please login to vote", "warning");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/questions/${questionId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ voteType }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to vote");
    }

    const data = await response.json();

    // Update the vote count in the UI
    const questionCard = document.querySelector(
      `[data-question-id="${questionId}"]`,
    );
    if (questionCard) {
      const voteElement = questionCard.querySelector(".stat .value");
      if (voteElement) {
        voteElement.textContent = formatNumber(data.votes);
      }
    }

    showNotification(data.message, "success");
  } catch (error) {
    console.error("Error voting:", error);
    showNotification("Failed to record vote", "error");
  }
}

// Format time ago helper
function formatTimeAgo(date) {
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
      return `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

// Refresh questions list
async function refreshQuestions() {
  const questionsFromAPI = await loadQuestionsFromAPI();
  const filteredQuestions = filterQuestions(questionsFromAPI);
  renderQuestions(filteredQuestions);
}

// ==================================================
// MODIFY EXISTING FUNCTIONS
// ==================================================

// Update the existing submitAnswer function
function submitAnswer() {
  // Call the API version
  submitQuestionToAPI().then((success) => {
    if (success) {
      closeAnswerModal();
    }
  });
}

// Update existing initialization
const originalInit = () => {
  // Existing initialization code...

  // Add API integration
  checkAuthentication();
  refreshQuestions();
};

// Add vote button listeners after questions are rendered
function addVoteListeners() {
  document.querySelectorAll("[data-question-id]").forEach((card) => {
    const questionId = card.dataset.questionId;

    // Find vote buttons (you'll need to add these to your HTML)
    const upvoteBtn = card.querySelector(".upvote-btn");
    const downvoteBtn = card.querySelector(".downvote-btn");

    if (upvoteBtn) {
      upvoteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        voteOnQuestion(questionId, "up");
      });
    }

    if (downvoteBtn) {
      downvoteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        voteOnQuestion(questionId, "down");
      });
    }
  });
}

// ==================================================
// HTML MODIFICATIONS NEEDED
// ==================================================

/*
In questions.html, update the question card to include data-question-id:

<article class="question-card" data-question-id="">
  <div class="stats">
    <div class="stat">
      <div class="value">10</div>
      <div class="label">votes</div>
    </div>
    ...
  </div>
  <div class="actions-row">
    <button class="upvote-btn">
      <i class="fa-regular fa-thumbs-up"></i> Vote
    </button>
    <button class="downvote-btn">
      <i class="fa-regular fa-thumbs-down"></i> Dislike
    </button>
  </div>
</article>

Make sure your questionCard() function includes the data-question-id attribute!
*/

// ==================================================
// USAGE
// ==================================================

// Call this when page loads:
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();
  refreshQuestions();

  // Add to existing tab click handlers
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // ... existing code ...
      refreshQuestions(); // Add this
    });
  });

  // Add to existing filter handlers
  const tagSelect = document.getElementById("tagSelect");
  if (tagSelect) {
    tagSelect.addEventListener("change", () => {
      state.tag = tagSelect.value;
      refreshQuestions(); // Add this
    });
  }
});

// ==================================================
// CONSOLE TESTING
// ==================================================

// Test in browser console:
// await loadQuestionsFromAPI()
// await submitQuestionToAPI()
// await voteOnQuestion('QUESTION_ID', 'up')
