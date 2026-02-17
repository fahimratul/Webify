# Complete Testing & Integration Guide

## 🚀 STEP 1: Start the Backend Server

### Open a terminal in VS Code and run:

```bash
cd Webify
npm start
```

### You should see:

```
MongoDB connected: cluster0.wfq5n4k.mongodb.net
Server running on: http://localhost:3000
```

**If npm command not found:**

- Make sure Node.js is installed
- Restart VS Code terminal
- Or use the integrated terminal in VS Code

---

## 🧪 STEP 2: Test with Postman/Thunder Client

### Install Thunder Client (VS Code Extension)

1. Click Extensions in VS Code (or Ctrl+Shift+X)
2. Search "Thunder Client"
3. Install it
4. Click the Thunder Client icon in sidebar

### Or use Postman

Download from: https://www.postman.com/downloads/

---

## 📝 TEST SEQUENCE

### Test 1: Login First (Required for authenticated endpoints)

**Create a user account first:**

```http
POST http://localhost:3000/api/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Then login:**

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

✅ Save the session cookie automatically (Thunder Client/Postman does this)

---

### Test 2: Create a Question

```http
POST http://localhost:3000/api/questions
Content-Type: application/json

{
  "title": "How to center a div in CSS?",
  "content": "I've tried using margin: auto but it doesn't work. What's the best way?",
  "tags": ["CSS", "Flexbox", "Alignment"]
}
```

**Expected Response:**

```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "65abc123...",
    "title": "How to center a div in CSS?",
    "content": "I've tried using margin...",
    "author": {
      "_id": "65user123",
      "username": "testuser",
      "email": "test@example.com"
    },
    "tags": ["CSS", "Flexbox", "Alignment"],
    "votes": 0,
    "views": 0,
    "answerCount": 0,
    "status": "open",
    "createdAt": "2026-01-28T...",
    "updatedAt": "2026-01-28T..."
  }
}
```

📋 **Copy the `_id` from the response - you'll need it!**

---

### Test 3: Get All Questions (No login needed)

```http
GET http://localhost:3000/api/questions
```

**Try with filters:**

```http
GET http://localhost:3000/api/questions?sort=-votes&tag=CSS&limit=10
```

**Expected Response:**

```json
{
  "questions": [
    {
      "_id": "65abc123...",
      "title": "How to center a div in CSS?",
      "author": {...},
      "votes": 0,
      "views": 0,
      "answerCount": 0
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### Test 4: Upvote the Question

```http
POST http://localhost:3000/api/questions/PASTE_QUESTION_ID_HERE/vote
Content-Type: application/json

{
  "voteType": "up"
}
```

**Expected Response:**

```json
{
  "message": "Vote recorded",
  "votes": 1,
  "userVote": "up"
}
```

**Test downvote:**

```json
{ "voteType": "down" }
```

**Test toggle (click upvote again):**

- Same request removes your vote
- `votes` goes back to 0

---

### Test 5: Post an Answer

````http
POST http://localhost:3000/api/answers
Content-Type: application/json

{
  "questionId": "PASTE_QUESTION_ID_HERE",
  "content": "To center a div, you can use Flexbox:\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```"
}
````

**Expected Response:**

```json
{
  "message": "Answer created successfully",
  "answer": {
    "_id": "65answer123...",
    "content": "To center a div...",
    "question": "65abc123...",
    "author": {...},
    "votes": 0,
    "isAccepted": false,
    "createdAt": "2026-01-28T..."
  }
}
```

📋 **Copy the answer `_id`**

---

### Test 6: Get Answers for the Question

```http
GET http://localhost:3000/api/answers/question/PASTE_QUESTION_ID_HERE
```

**Expected Response:**

```json
{
  "count": 1,
  "answers": [
    {
      "_id": "65answer123...",
      "content": "To center a div...",
      "author": {...},
      "votes": 0,
      "isAccepted": false
    }
  ]
}
```

---

### Test 7: Vote on Answer

```http
POST http://localhost:3000/api/answers/PASTE_ANSWER_ID_HERE/vote
Content-Type: application/json

{
  "voteType": "up"
}
```

---

### Test 8: Accept the Answer (Question Author Only)

```http
POST http://localhost:3000/api/answers/PASTE_ANSWER_ID_HERE/accept
```

**Expected Response:**

```json
{
  "message": "Answer accepted",
  "isAccepted": true
}
```

✅ Check MongoDB Compass - the answer should have `isAccepted: true`

---

### Test 9: Follow a Question

```http
POST http://localhost:3000/api/questions/PASTE_QUESTION_ID_HERE/follow
```

**Toggle by calling again** to unfollow

---

### Test 10: Get All Tags

```http
GET http://localhost:3000/api/questions/tags/all
```

**Expected Response:**

```json
{
  "tags": [
    { "_id": "CSS", "count": 5 },
    { "_id": "Flexbox", "count": 3 },
    { "_id": "Alignment", "count": 2 }
  ]
}
```

---

### Test 11: Search Questions

```http
GET http://localhost:3000/api/questions?search=center&sort=-votes
```

---

## ✅ What to Verify

After all tests:

### 1. Check MongoDB Compass:

- Open `questions` collection → See your questions
- Open `answers` collection → See your answers
- Check vote counts updated
- Check `isAccepted` flag on answer

### 2. Test Error Cases:

- Try posting without login → Should get 401
- Try editing someone else's question → Should get 403
- Try invalid vote type → Should get 400

---

## 🎨 STEP 3: Integrate with Frontend

Now let's update the frontend to use the real API instead of static data.

### File: `frontend/community/questions.js`

Replace the static questions array and add these functions:

```javascript
// API Base URL
const API_URL = "http://localhost:3000/api";

// Check if user is logged in
let currentUser = null;

async function checkAuth() {
  try {
    const response = await fetch(`${API_URL}/check-auth`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      updateUIForLoggedInUser();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

// Load questions from backend
async function loadQuestions() {
  try {
    const { tab, tag, sort, query } = state;

    let url = `${API_URL}/questions?sort=${sort}`;
    if (tag) url += `&tag=${tag}`;
    if (query) url += `&search=${query}`;

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to load questions");

    const data = await response.json();
    renderQuestions(data.questions);
    updateQuestionCount(data.pagination.total);
  } catch (error) {
    console.error("Error loading questions:", error);
    showNotification("Failed to load questions", "error");
  }
}

// Submit new question
async function submitAnswer() {
  if (!currentUser) {
    showNotification("Please login to ask a question", "warning");
    window.location.href = "../auth/login.html";
    return;
  }

  const title = document.getElementById("questionTitleInput").value.trim();
  const content = document.getElementById("questionInput").value.trim();
  const tagInput = document.getElementById("tagInput").value.trim();

  if (!title || !content) {
    showNotification("Title and content are required", "error");
    return;
  }

  const tags = tagInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);

  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, tags }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to post question");
    }

    const data = await response.json();
    showNotification("Question posted successfully!", "success");
    closeAnswerModal();
    loadQuestions(); // Refresh the list

    // Clear form
    document.getElementById("questionTitleInput").value = "";
    document.getElementById("questionInput").value = "";
    document.getElementById("tagInput").value = "";
  } catch (error) {
    console.error("Error posting question:", error);
    showNotification(error.message, "error");
  }
}

// Vote on question
async function voteQuestion(questionId, voteType) {
  if (!currentUser) {
    showNotification("Please login to vote", "warning");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/questions/${questionId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ voteType }),
    });

    if (!response.ok) throw new Error("Failed to vote");

    const data = await response.json();
    updateVoteDisplay(questionId, data.votes, data.userVote);
    showNotification("Vote recorded", "success");
  } catch (error) {
    console.error("Error voting:", error);
    showNotification("Failed to vote", "error");
  }
}

// Helper to update vote display
function updateVoteDisplay(questionId, votes, userVote) {
  const card = document.querySelector(`[data-question-id="${questionId}"]`);
  if (card) {
    const voteElement = card.querySelector(".vote-count");
    if (voteElement) {
      voteElement.textContent = votes;
    }

    // Update button states
    const upvoteBtn = card.querySelector(".upvote-btn");
    const downvoteBtn = card.querySelector(".downvote-btn");

    upvoteBtn?.classList.toggle("active", userVote === "up");
    downvoteBtn?.classList.toggle("active", userVote === "down");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadQuestions();

  // Setup tab listeners
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.tab = tab.dataset.tab;
      updateSortFromTab(state.tab);
      loadQuestions();
    });
  });

  // Setup search
  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener(
    "input",
    debounce((e) => {
      state.query = e.target.value;
      loadQuestions();
    }, 500),
  );

  // Setup ask button
  const askBtn = document.getElementById("askBtn");
  askBtn?.addEventListener("click", () => {
    if (!currentUser) {
      window.location.href = "../auth/login.html";
    } else {
      openAnswerModal();
    }
  });
});

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Update sort based on tab
function updateSortFromTab(tab) {
  switch (tab) {
    case "newest":
      state.sort = "-createdAt";
      break;
    case "unanswered":
      state.sort = "-createdAt";
      // Add filter for answerCount = 0
      break;
    case "trending":
      state.sort = "-views";
      break;
    default:
      state.sort = "-createdAt";
  }
}

// Render questions
function renderQuestions(questions) {
  const listEl = document.getElementById("questionList");

  if (questions.length === 0) {
    listEl.innerHTML =
      '<p class="no-questions">No questions found. Be the first to ask!</p>';
    return;
  }

  listEl.innerHTML = questions.map((q) => questionCard(q)).join("");

  // Add event listeners to vote buttons
  questions.forEach((q) => {
    const card = document.querySelector(`[data-question-id="${q._id}"]`);

    card?.querySelector(".upvote-btn")?.addEventListener("click", () => {
      voteQuestion(q._id, "up");
    });

    card?.querySelector(".downvote-btn")?.addEventListener("click", () => {
      voteQuestion(q._id, "down");
    });
  });
}

// Update question card HTML to include data attribute
function questionCard(q) {
  const author = q.author?.username || "Anonymous";
  const timeAgo = formatTimeAgo(new Date(q.createdAt));
  const tags = q.tags.map((t) => `<span class="tag">${t}</span>`).join("");

  return `
        <article class="question-card" data-question-id="${q._id}">
            <div class="stats">
                <div class="stat">
                    <div class="value">${formatNumber(q.votes)}</div>
                    <div class="label">votes</div>
                </div>
                <div class="stat">
                    <div class="value">${formatNumber(q.answerCount)}</div>
                    <div class="label">answers</div>
                </div>
                <div class="stat">
                    <div class="value">${formatNumber(q.views)}</div>
                    <div class="label">views</div>
                </div>
            </div>
            <div class="content">
                <a href="question-detail.html?id=${q._id}" class="title">${escapeHtml(q.title)}</a>
                <p class="excerpt">${escapeHtml(q.content.substring(0, 200))}${q.content.length > 200 ? "..." : ""}</p>
                <div class="tags">${tags}</div>
                <div class="actions-row">
                    <button class="upvote-btn" title="Upvote">
                        <i class="fa-regular fa-thumbs-up"></i> Vote
                    </button>
                    <button class="downvote-btn" title="Downvote">
                        <i class="fa-regular fa-thumbs-down"></i> Dislike
                    </button>
                    <span><i class="fa-regular fa-comment"></i> Answer</span>
                </div>
            </div>
            <div class="user">
                <div class="avatar">${author[0].toUpperCase()}</div>
                <div>
                    <div class="name">${escapeHtml(author)}</div>
                    <div class="time">${timeAgo}</div>
                </div>
            </div>
        </article>
    `;
}

// Helper functions
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
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateQuestionCount(count) {
  const countEl = document.getElementById("questionCount");
  if (countEl) {
    countEl.textContent = count;
  }
}

function updateUIForLoggedInUser() {
  const loginLink = document.getElementById("loginLink");
  const userName = document.getElementById("userName");

  if (currentUser && userName && loginLink) {
    loginLink.style.display = "none";
    userName.style.display = "block";
    userName.textContent = currentUser.username;
  }
}
```

---

## 🎨 Update the HTML (questions.html)

Add data attributes and IDs:

```html
<!-- In the question card template, add data-question-id -->
<article class="question-card" data-question-id="">
  <!-- ... -->
  <button class="upvote-btn">Upvote</button>
  <button class="downvote-btn">Downvote</button>
</article>
```

---

## 📊 Create Question Detail Page (Optional)

Create `frontend/community/question-detail.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Question Detail - WEBIFY</title>
    <link rel="stylesheet" href="questions.css" />
  </head>
  <body>
    <div id="question-detail"></div>
    <div id="answers-list"></div>

    <form id="answer-form">
      <textarea id="answer-content" placeholder="Your answer..."></textarea>
      <button type="submit">Post Answer</button>
    </form>

    <script src="question-detail.js"></script>
  </body>
</html>
```

And `question-detail.js`:

```javascript
const API_URL = "http://localhost:3000/api";
const questionId = new URLSearchParams(window.location.search).get("id");

async function loadQuestion() {
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    credentials: "include",
  });
  const { question } = await response.json();
  renderQuestion(question);
}

async function loadAnswers() {
  const response = await fetch(`${API_URL}/answers/question/${questionId}`, {
    credentials: "include",
  });
  const { answers } = await response.json();
  renderAnswers(answers);
}

async function postAnswer(content) {
  const response = await fetch(`${API_URL}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ questionId, content }),
  });

  if (response.ok) {
    loadAnswers();
    document.getElementById("answer-content").value = "";
  }
}

document.getElementById("answer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const content = document.getElementById("answer-content").value;
  postAnswer(content);
});

loadQuestion();
loadAnswers();
```

---

## ✅ Testing Checklist

- [ ] Server starts successfully
- [ ] Can signup new user
- [ ] Can login
- [ ] Can post question (logged in)
- [ ] Can view questions (not logged in)
- [ ] Can vote on question
- [ ] Can post answer
- [ ] Can accept answer
- [ ] Search works
- [ ] Tag filtering works
- [ ] MongoDB shows all data

---

## 🎯 Demo Script for Tomorrow

1. **Show Postman/Thunder Client**
   - "I tested all 14 endpoints"
   - Show creating question
   - Show voting system
2. **Show MongoDB Compass**
   - "Data is persisted in questions and answers collections"
   - Show a question document with votes
3. **Show Frontend Integration**
   - "I connected the frontend to use real data"
   - Questions load from database
   - Can post new questions
   - Voting updates in real-time

4. **Explain Architecture**
   - "Frontend sends HTTP requests"
   - "Backend validates and saves to MongoDB"
   - "Authentication protects certain actions"

Good luck! 🚀
