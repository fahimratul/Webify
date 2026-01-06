// Sample data for questions
const questions = [
  {
    id: 1,
    title:
      "CSS is not warping long words. How to fix it?",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Flexbox"],
    votes: 10,
    answers: 2,
    views: 310,
    author: "Rahim",
    askedAgo: "3 min ago",
    createdAt: Date.now() - 3 * 60 * 1000,
    avatar: "https://example.com/avatar1.png",
  },
  {
    id: 2,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Alignment"],
    votes: 25,
    answers: 0,
    views: 860,
    author: "Fahim",
    askedAgo: "18 min ago",
    createdAt: Date.now() - 18 * 60 * 1000,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title:
      "How to center a child element horizontally using grid?",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["CSS"],
    votes: 7,
    answers: 1,
    views: 210,
    author: "Abdullah",
    askedAgo: "1 hr ago",
    createdAt: Date.now() - 60 * 60 * 1000,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Alignment"],
    votes: 11,
    answers: 3,
    views: 540,
    author: "Jakaria",
    askedAgo: "Yesterday",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const state = {
  tab: "newest",
  tag: "",
  sort: "newest",
  query: "",
};


const countEl = document.getElementById("questionCount");
const listEl = document.getElementById("questionList");

function formatNumber(n) {
  return Intl.NumberFormat().format(n);
}

function questionCard(q) {
  const tags = q.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  return `
    <article class="question-card">
      <div class="stats">
        <div class="stat"><div class="value">${formatNumber(q.votes)}</div><div class="label">votes</div></div>
        <div class="stat"><div class="value">${formatNumber(q.answers)}</div><div class="label">answers</div></div>
        <div class="stat"><div class="value">${formatNumber(q.views)}</div><div class="label">views</div></div>
      </div>
      <div class="content">
        <a href="#" class="title">${q.title}</a>
        <p class="excerpt">${q.excerpt}</p>
        <div class="tags">${tags}</div>
        <div class="actions-row">
          <span><i class="fa-regular fa-thumbs-up" id="vote-up-${q.id}" onclick="voteQuestion(${q.id}, 'up')"></i> Vote</span>
          <span><i class="fa-regular fa-thumbs-down" id="vote-down-${q.id}" onclick="voteQuestion(${q.id}, 'down')"></i> Dislike</span>
          <span><i class="fa-regular fa-comment" onclick="openAnswerModal(${q.id})"></i> Answer</span>
        </div>
      </div>
      <div class="user">
        <div class="avatar"><img src="${q.avatar}" alt="${q.author}'s avatar" /></div>
        <div>
          <div class="name">${q.author}</div>
          <div class="time">asked ${q.askedAgo}</div>
        </div>
      </div>
    </article>
  `;
}

function voteQuestion(id, type) {
  const question = questions.find((q) => q.id === id);
  if (question) {
    if (type === "up") {
      question.votes += 1;
      render();
      voteUpEl = document.getElementById(`vote-up-${id}`);
      voteUpEl.classList.add("voted");
      voteUpEl.setAttribute("disabled", "true");
      voteUpEl.style.color = "green";
    } else if (type === "down") {
      question.votes -= 1;
      render();
      voteDownEl = document.getElementById(`vote-down-${id}`);
      voteDownEl.classList.add("voted");
      voteDownEl.setAttribute("disabled", "true");
      voteDownEl.style.color = "red";
    }
    showNotification(
      `You have ${type === "up" ? "upvoted" : "downvoted"} the question: "${question.title}"`,
      "success light",
      "Vote Recorded"
    );
  }
}

function openAnswerModal(id) {
  const question = questions.find((q) => q.id === id);
  if (question) {
    activeQuestionId = question.id;
    answerTitleEl.textContent = question.title;
    answerInputEl.value = "";
    answerModal.removeAttribute("hidden");
  } 
}


function applyFilters(data) {
  let rows = [...data];

  // Search query
  if (state.query) {
    const q = state.query.toLowerCase();
    rows = rows.filter(
      (r) => r.title.toLowerCase().includes(q)
    );
  }

  // Tab filters
  if (state.tab === "unanswered") rows = rows.filter((r) => r.answers === 0);
  if (state.tab === "lastyear") {
    const yearMs = 365 * 24 * 60 * 60 * 1000;
    rows = rows.filter((r) => Date.now() - r.createdAt > yearMs);
  }
  if (state.tag) rows = rows.filter((r) => r.tags.includes(state.tag));

  // Sort
  switch (state.sort) {
    case "votes":
      rows.sort((a, b) => b.votes - a.votes);
      break;
    case "views":
      rows.sort((a, b) => b.views - a.views);
      break;
    default:
      rows.sort((a, b) => b.createdAt - a.createdAt);
  }

  return rows;
}

function render() {
  const rows = applyFilters(questions);
  countEl.textContent = formatNumber(rows.length);
  listEl.innerHTML = rows.map(questionCard).join("");
}


const tabs = document.querySelectorAll(".tab");

tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.tab = btn.dataset.tab;
    render();
  })
);

const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
filterToggle.addEventListener("click", () => {
  const isHidden = filterPanel.hasAttribute("hidden");
  if (isHidden) filterPanel.removeAttribute("hidden");
  else filterPanel.setAttribute("hidden", "");
});

document.getElementById("tagSelect").addEventListener("change", (e) => {
  state.tag = e.target.value;
  render();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});



const answerModal = document.getElementById("answerModal");
const answerTitleEl = document.getElementById("answerQuestionTitle");
const answerInputEl = document.getElementById("answerInput");
const submitQuestionBtn = document.getElementById("submitQuestion");

let activeQuestionId = null;

const askBtn = document.getElementById("askBtn");
askBtn.addEventListener("click", () => {
  answerModal.removeAttribute("hidden");
});


function openAnswerModal(question) {
  activeQuestionId = question.id;
  answerTitleEl.textContent = question.title;
  answerInputEl.value = "";
  answerModal.removeAttribute("hidden");
}

function closeQuestionModal() {
  answerModal.setAttribute("hidden", "");
  activeQuestionId = null;
  showNotification("Answer submission cancelled.", "warning light", "Cancelled");
}


const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" ? true : false;
  const currentUser = localStorage.getItem("currentUser");
  const userData = JSON.parse(currentUser);

function submitQuestion() {
  if (isLoggedIn) {
    closeQuestionModal();
    const questiontitile = document.getElementById("questionTitleInput").value;
    const questiondetails = document.getElementById("questionInput").value;
    const questiontags = tags;
    if (!questiontitile || !questiondetails) {
      showNotification("Please fill in all required fields.", "error light", "Submission Failed");
      return;
    }
    questions.push({
      id: questions.length + 1,
      title: questiontitile,
      excerpt: questiondetails.substring(0, 100) + "...",
      tags: questiontags,
      votes: 0,
      answers: 0,
      views: 0,
      author: userData ? userData.name : "Anonymous",
      askedAgo: "just now",
      createdAt: Date.now() - 3 * 60 * 1000,
      avatar: userData ? userData.avatar : "https://example.com/default-avatar.png",
    });
    showNotification("Your question has been submitted successfully!", "success light", "Question Submitted");
    render();
  } else {
    window.location.href = '../auth/login.html';
  }
}


function isUserLoggedIn() {
const userName = userData ? userData.name : ""; // Replace with actual user name

  if (isLoggedIn) {
    document.getElementById('loginLink').style.display = 'none';
    const userNameDiv = document.getElementById('userName');
    userNameDiv.style.display = 'flex';
    userNameDiv.innerHTML = `<img src="${userData.avatar}" alt="User Avatar" /> ${userName}`;
    return true;  
    }
  else {
    return false;
  } 
}

function openprofile() {
  window.location.href = "../profile/profile.html";
}
isUserLoggedIn();
const tagContainer = document.getElementById('tagContainer');
const tagInput = document.getElementById('tagInput');
const tagsOutput = document.getElementById('tagsOutput');
let tags = [];
  tagInput.addEventListener('input', function(e) {
  const value = this.value;
    if (value.includes(',')) {
    const parts = value.split(',');
      for (let i = 0; i < parts.length - 1; i++) {
        const tagText = parts[i].trim();
        if (tagText) {
          addTag(tagText);
          }
      }
      this.value= '';
    }
});
tagInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
  e.preventDefault();
  const tagText = this.value.trim();
    if (tagText) {
      addTag(tagText);
      this.value = '';
      }
}
  if (e.key === 'Backspace' && this.value === '' && tags.length > 0)  {
    removeTag(tags.length - 1);
  }
});
tagContainer.addEventListener('click', function() {
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
  const existingTags = tagContainer.querySelectorAll('.tag');
  existingTags.forEach(tag => tag.remove());
  tags.forEach((tag, index) => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.innerHTML = `
          ${tag}
          <span class="remove" data-index="${index}">×</span>
      `;
      tagElement.querySelector('.remove').addEventListener('click', function(e) {
          e.stopPropagation();
          removeTag(parseInt(this.dataset.index));
      });
      
      tagContainer.insertBefore(tagElement, tagInput);
});

}

render();

// Notification Toast Function
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