// Question detail page with full CRUD operations

const state = {
  questionId: null,
  question: null,
  currentUser: null,
};

// Get question ID from URL
function getQuestionIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
// Check authentication
async function checkAuthentication() {
  try {
    const response = await fetch("/api/check-auth", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.authenticated) {
      state.currentUser = data.user;
      updateUIForLoggedInUser(data.user);
      document.getElementById("answerFormSection").style.display = "block";
      document.getElementById("loginPrompt").style.display = "none";
    } else {
      updateUIForLoggedOutUser();
      document.getElementById("answerFormSection").style.display = "none";
      document.getElementById("loginPrompt").style.display = "block";
    }
  } catch (error) {
    console.error("Auth check error:", error);
    updateUIForLoggedOutUser();
    document.getElementById("answerFormSection").style.display = "none";
    document.getElementById("loginPrompt").style.display = "block";
  }
}

// Fetch question details
async function fetchQuestion() {
  const questionId = state.questionId;

  if (!questionId) {
    showNotification("Invalid question ID", "error light", "Error");
    setTimeout(() => {
      window.location.href = "questions.html";
    }, 2000);
    return;
  }

  try {
    const response = await fetch(`/api/questions/${questionId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }

    const data = await response.json();
    state.question = data.question;
    renderQuestion();
  } catch (error) {
    console.error("Error fetching question:", error);
    showNotification("Failed to load question", "error light", "Error");
    // setTimeout(() => {
    //   window.location.href = "questions.html";
    // }, 2000);
  }
}

// Render question
function renderQuestion() {
  const q = state.question;

  document.getElementById("loadingState").style.display = "none";
  document.getElementById("questionContent").style.display = "block";

  // Question body
  document.getElementById("questionTitle").textContent = q.title;
  document.getElementById("questionVotes").textContent = formatNumber(
    q.votes || 0,
  );
  document.getElementById("questionBody").textContent = q.body;
  document.getElementById("questionViews").textContent = formatNumber(
    q.views || 0,
  );
  // Tags
  const tagsHtml = (q.tags || [])
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  document.getElementById("questionTags").innerHTML = tagsHtml;

  // Author info

  const author = q.author;
  // Check if user is logged in before accessing user ID
  const votebyUser = state.currentUser ? state.currentUser._id : null;
  const userVote =
    votebyUser && q.votedBy
      ? q.votedBy.find((v) => v.user.toString() === votebyUser)
      : null;
  if (userVote) {
    document.getElementById("questionVoteUp").classList.remove("voted-up");
    document.getElementById("questionVoteDown").classList.remove("voted-down");
    if (userVote.voteType === "up") {
      document.getElementById("questionVoteUp").classList.add("voted-up");
    } else if (userVote.voteType === "down") {
      document.getElementById("questionVoteDown").classList.add("voted-down");
    }
  }

  document.getElementById("authorAvatar").innerHTML =
    `<img src="${author.profilePicture}" alt="User Avatar">`;
  document.getElementById("authorName").textContent =
    author.username || "Anonymous";
  document.getElementById("authorTime").textContent =
    `asked ${getTimeAgo(new Date(q.createdAt))}`;

  // Show delete button if user is author
  if (state.currentUser && q.author && state.currentUser._id === q.author._id) {
    document.getElementById("deleteBtn").style.display = "inline-flex";
  }

  // Answers
  const answers = q.answers || [];
  document.getElementById("answerCount").textContent = answers.length;
  document.getElementById("answerCount2").textContent = answers.length;

  if (answers.length === 0) {
    document.getElementById("answersList").innerHTML =
      '<p style="color: #999; text-align: center; padding: 2rem 0;">No answers yet. Be the first to answer!</p>';
  } else {
    document.getElementById("answersList").innerHTML = answers
      .map((answer) => renderAnswer(answer))
      .join("");
  }
}

// Render single answer
function renderAnswer(answer) {
  console.log("Rendering answer:", answer);
  const author = answer.author;
  // Check if user is logged in before accessing user ID
  const votebyUser = state.currentUser ? state.currentUser._id : null;
  const userVote =
    votebyUser && answer.votedBy
      ? answer.votedBy.find((v) => v.user.toString() === votebyUser)
      : null;
  let voteClass = "";
  if (userVote) {
    if (userVote.voteType === "up") {
      voteClass = "voted-up";
    } else if (userVote.voteType === "down") {
      voteClass = "voted-down";
    }
  }
  console.log("Answer author:", author);
  const timeAgo = getTimeAgo(new Date(answer.createdAt));

  return `
    <div class="answer-card">
      <div class="answer-content">
        <div class="answer-text">${answer.body}</div>
        <div class="vote-info">
          ${answer.votes || 0} votes
        </div>
        <div class="actions-row" style="position:static;">
          <span onclick="voteAnswer('${answer._id}', 'up')" class="${voteClass === "voted-up" ? "voted-up" : ""}"><i class="fa-regular fa-thumbs-up"></i> Upvote</span>
          <span onclick="voteAnswer('${answer._id}', 'down')" class="${voteClass === "voted-down" ? "voted-down" : ""}"><i class="fa-regular fa-thumbs-down"></i> Downvote</span>
        </div>
        <div class="answer-footer">    
        <div class="user">
          <div class="avatar"><img src="${author.profilePicture}" alt="User Avatar"></div>
          <div>
            <div class="name">${author.username}</div>
            <div class="time">answered ${timeAgo}</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  `;
}

// Submit answer
async function submitAnswer() {
  const body = document.getElementById("answerInput").value.trim();

  if (!body) {
    showNotification(
      "Please write an answer",
      "warning light",
      "Missing Answer",
    );
    return;
  }

  if (body.length < 20) {
    showNotification(
      "Answer must be at least 20 characters",
      "warning light",
      "Answer Too Short",
    );
    return;
  }

  try {
    const response = await fetch(`/api/questions/${state.questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ body }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(
        "Answer posted successfully!",
        "success light",
        "Success",
      );
      document.getElementById("answerInput").value = "";
      await fetchQuestion();
    } else {
      if (response.status === 401) {
        showNotification(
          "Please login to answer",
          "warning light",
          "Not Logged In",
        );
        setTimeout(() => {
          window.location.href = "../auth/login.html";
        }, 1500);
      } else {
        showNotification(
          data.error || "Failed to post answer",
          "error light",
          "Error",
        );
      }
    }
  } catch (error) {
    console.error("Error posting answer:", error);
    showNotification("Failed to post answer", "error light", "Error");
  }
}

// Vote on question
async function voteQuestion(voteType) {
  if (!state.currentUser) {
    showNotification("Please login to vote", "warning light", "Not Logged In");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return;
  }

  try {
    const response = await fetch(`/api/questions/${state.questionId}/vote`, {
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
      await fetchQuestion();
    } else {
      showNotification(data.error || "Failed to vote", "error light", "Error");
    }
  } catch (error) {
    console.error("Error voting:", error);
    showNotification("Failed to vote", "error light", "Error");
  }
}

// Vote on answer
async function voteAnswer(answerId, voteType) {
  if (!state.currentUser) {
    showNotification("Please login to vote", "warning light", "Not Logged In");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1500);
    return;
  }

  try {
    const response = await fetch(
      `/api/questions/${state.questionId}/answers/${answerId}/vote`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ voteType }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      showNotification("Vote recorded!", "success light", "Success");
      await fetchQuestion();
    } else {
      showNotification(data.error || "Failed to vote", "error light", "Error");
    }
  } catch (error) {
    console.error("Error voting:", error);
    showNotification("Failed to vote", "error light", "Error");
  }
}

// Delete question
async function deleteQuestion() {
  if (
    !confirm(
      "Are you sure you want to delete this question? This action cannot be undone.",
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`/api/questions/${state.questionId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(
        "Question deleted successfully",
        "success light",
        "Success",
      );
      setTimeout(() => {
        window.location.href = "questions.html";
      }, 1500);
    } else {
      showNotification(
        data.error || "Failed to delete question",
        "error light",
        "Error",
      );
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    showNotification("Failed to delete question", "error light", "Error");
  }
}

// Utility functions
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

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  state.questionId = getQuestionIdFromURL();
  await checkAuthentication();
  await fetchQuestion();
});

function answerQuestion() {
  document
    .getElementById("answerFormSection")
    .scrollIntoView({ behavior: "smooth" });
}
