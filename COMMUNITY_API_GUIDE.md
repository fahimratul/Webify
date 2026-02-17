# Community Features Backend - Complete Implementation Guide

## 🎯 What I Built

A complete Stack Overflow-style Q&A system with:

- Questions (ask, edit, delete, search, filter)
- Answers (post, edit, delete, accept)
- Voting system (upvote/downvote for questions and answers)
- Tags system (categorization)
- Following system (get notified about questions)
- View tracking
- Authentication & authorization

---

## 📁 Files Created

### 1. **Models** (Database Schemas)

#### `backend/models/Question.js`

Defines the structure for questions in MongoDB:

```javascript
{
  title: String,           // Question title (max 300 chars)
  content: String,         // Question body
  author: ObjectId,        // Reference to User who asked
  tags: [String],          // Array of tags like ['CSS', 'Flexbox']
  votes: Number,           // Net vote count (upvotes - downvotes)
  upvotedBy: [ObjectId],   // Users who upvoted
  downvotedBy: [ObjectId], // Users who downvoted
  views: Number,           // View count
  answerCount: Number,     // Number of answers
  status: String,          // 'open', 'answered', or 'closed'
  followers: [ObjectId],   // Users following this question
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Key Features:**

- Text search indexing on title, content, and tags
- Methods: `incrementViews()`, `updateAnswerCount()`

#### `backend/models/Answer.js`

Defines the structure for answers:

```javascript
{
  content: String,         // Answer text
  question: ObjectId,      // Which question this answers
  author: ObjectId,        // Who wrote the answer
  votes: Number,           // Net vote count
  upvotedBy: [ObjectId],   // Users who upvoted
  downvotedBy: [ObjectId], // Users who downvoted
  isAccepted: Boolean,     // Is this the accepted answer?
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2. **Middleware** (Authentication Guards)

#### `backend/middleware/auth.js`

**`requireAuth`** - Protects routes that need login:

```javascript
// Only logged-in users can access
if (not logged in) → return 401 error
else → continue
```

**`optionalAuth`** - Allows both guests and logged-in users:

```javascript
// Anyone can access (used for viewing questions)
continue regardless of login status
```

---

### 3. **Routes** (API Endpoints)

#### `backend/routes/questions.js`

All question-related operations:

| Method | Endpoint                    | Auth     | Purpose             |
| ------ | --------------------------- | -------- | ------------------- |
| GET    | `/api/questions`            | Optional | List all questions  |
| GET    | `/api/questions/:id`        | Optional | Get single question |
| POST   | `/api/questions`            | Required | Create new question |
| PUT    | `/api/questions/:id`        | Required | Update question     |
| DELETE | `/api/questions/:id`        | Required | Delete question     |
| POST   | `/api/questions/:id/vote`   | Required | Vote on question    |
| POST   | `/api/questions/:id/follow` | Required | Follow/unfollow     |
| GET    | `/api/questions/tags/all`   | None     | Get all tags        |

#### `backend/routes/answers.js`

All answer-related operations:

| Method | Endpoint                            | Auth     | Purpose                              |
| ------ | ----------------------------------- | -------- | ------------------------------------ |
| GET    | `/api/answers/question/:questionId` | Optional | Get all answers for a question       |
| POST   | `/api/answers`                      | Required | Post an answer                       |
| PUT    | `/api/answers/:id`                  | Required | Update answer                        |
| DELETE | `/api/answers/:id`                  | Required | Delete answer                        |
| POST   | `/api/answers/:id/vote`             | Required | Vote on answer                       |
| POST   | `/api/answers/:id/accept`           | Required | Accept answer (question author only) |

---

### 4. **Server Integration**

#### `backend/server.js`

Added these lines:

```javascript
// Import routes
import questionRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";

// Mount routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
```

---

## 🔧 How It Works

### Example 1: Asking a Question

**Frontend Request:**

```javascript
const askQuestion = async () => {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Send session cookie
    body: JSON.stringify({
      title: "How to center a div?",
      content: "I tried using flexbox but it is not working...",
      tags: ["CSS", "Flexbox", "Alignment"],
    }),
  });

  const data = await response.json();
  console.log("Question ID:", data.question._id);
};
```

**What Happens:**

1. ✅ Check if user is logged in (middleware)
2. ✅ Validate title and content exist
3. ✅ Create new Question document in MongoDB
4. ✅ Link to current user as author
5. ✅ Return question with ID

---

### Example 2: Viewing Questions (No Login Required)

**Frontend Request:**

```javascript
const loadQuestions = async () => {
  const response = await fetch("/api/questions?sort=-votes&tag=CSS&page=1");
  const data = await response.json();

  data.questions.forEach((q) => {
    console.log(q.title, "|", q.votes, "votes");
  });
};
```

**Query Parameters:**

- `sort`: `-votes` (most votes), `-createdAt` (newest), `title` (alphabetical)
- `tag`: Filter by tag (e.g., `CSS`, `JavaScript`)
- `search`: Full-text search in title/content
- `status`: `open`, `answered`, or `closed`
- `page` & `limit`: Pagination

---

### Example 3: Voting System

**Frontend Request:**

```javascript
const upvoteQuestion = async (questionId) => {
  const response = await fetch(`/api/questions/${questionId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ voteType: "up" }),
  });

  const data = await response.json();
  console.log("New vote count:", data.votes);
  console.log("Your vote:", data.userVote); // 'up', 'down', or null
};
```

**How Voting Works:**

1. User clicks upvote
2. Check if already upvoted:
   - Yes → Remove upvote (toggle off)
   - No → Add upvote, remove downvote if exists
3. Update vote count
4. Return new total and user's current vote state

Same logic for downvotes and answers!

---

### Example 4: Posting an Answer

**Frontend Request:**

```javascript
const postAnswer = async (questionId) => {
  const response = await fetch("/api/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      content: "You need to set display: flex on the parent container...",
      questionId: questionId,
    }),
  });

  const data = await response.json();
  console.log("Answer posted:", data.answer._id);
};
```

**What Happens:**

1. ✅ Check login
2. ✅ Verify question exists
3. ✅ Create answer document
4. ✅ Update question's answer count
5. ✅ Return answer with author info

---

### Example 5: Accepting an Answer (Question Author Only)

**Frontend Request:**

```javascript
const acceptAnswer = async (answerId) => {
  const response = await fetch(`/api/answers/${answerId}/accept`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  console.log(data.message); // "Answer accepted"
};
```

**Authorization:**

- Only the question author can accept answers
- Accepting one answer unaccepts all others
- Updates question status to "answered"

---

## 🗄️ Database Structure

After using the API, MongoDB will have:

### Collections:

1. **users** - User accounts
2. **sessions** - Active sessions
3. **questions** ⭐ NEW - All questions
4. **answers** ⭐ NEW - All answers

### Example Question Document:

```json
{
  "_id": "65abc123...",
  "title": "How to center a div?",
  "content": "I tried flexbox...",
  "author": "65abc456...", // User ID
  "tags": ["CSS", "Flexbox"],
  "votes": 15,
  "upvotedBy": ["65abc789...", "65abc012..."],
  "downvotedBy": [],
  "views": 245,
  "answerCount": 3,
  "status": "answered",
  "followers": ["65abc345..."],
  "createdAt": "2026-01-27T10:00:00.000Z",
  "updatedAt": "2026-01-28T14:30:00.000Z"
}
```

---

## 🔒 Security Features

1. **Authentication Required:**
   - Posting questions/answers
   - Voting
   - Editing/deleting

2. **Ownership Checks:**
   - Only author can edit/delete their questions
   - Only author can edit/delete their answers
   - Only question author can accept answers

3. **Public Access:**
   - Anyone can view questions/answers
   - View counts work for guests
   - Search/filter available to all

---

## 🧪 Testing the API

### Using Postman or Thunder Client:

**1. Create a Question:**

```http
POST http://localhost:3000/api/questions
Content-Type: application/json
Cookie: connect.sid=<your-session>

{
  "title": "CSS Grid vs Flexbox?",
  "content": "When should I use Grid instead of Flexbox?",
  "tags": ["CSS", "Grid", "Flexbox"]
}
```

**2. Get All Questions:**

```http
GET http://localhost:3000/api/questions?sort=-votes&limit=10
```

**3. Upvote a Question:**

```http
POST http://localhost:3000/api/questions/QUESTION_ID/vote
Content-Type: application/json
Cookie: connect.sid=<your-session>

{
  "voteType": "up"
}
```

**4. Post an Answer:**

```http
POST http://localhost:3000/api/answers
Content-Type: application/json
Cookie: connect.sid=<your-session>

{
  "questionId": "QUESTION_ID",
  "content": "Grid is better for 2D layouts..."
}
```

**5. Get Answers for a Question:**

```http
GET http://localhost:3000/api/answers/question/QUESTION_ID
```

---

## 🎨 Frontend Integration

### Update `frontend/community/questions.js`:

Replace the static `questions` array with API calls:

```javascript
// Load questions from backend
const loadQuestions = async () => {
  const response = await fetch("/api/questions?sort=-createdAt", {
    credentials: "include",
  });
  const data = await response.json();

  // Render questions
  renderQuestions(data.questions);
};

// Post new question
const submitQuestion = async () => {
  const title = document.getElementById("questionTitleInput").value;
  const content = document.getElementById("questionInput").value;
  const tagsInput = document.getElementById("tagInput").value;
  const tags = tagsInput.split(",").map((t) => t.trim());

  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, content, tags }),
  });

  if (response.ok) {
    showNotification("Question posted successfully!", "success");
    loadQuestions(); // Refresh list
    closeModal();
  }
};

// Vote on question
const voteQuestion = async (questionId, voteType) => {
  const response = await fetch(`/api/questions/${questionId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ voteType }),
  });

  const data = await response.json();
  updateVoteDisplay(questionId, data.votes, data.userVote);
};
```

---

## 📊 What You Can Demo Tomorrow

### **1. Show the API Endpoints:**

- Open Postman/Thunder Client
- Demonstrate creating a question
- Show voting works
- Display questions list with sorting/filtering

### **2. Show MongoDB:**

- Open MongoDB Compass
- Show `questions` collection with documents
- Show `answers` collection
- Explain the relationships (author → user, question → answers)

### **3. Explain the Architecture:**

```
Frontend (questions.html)
    ↓ fetch('/api/questions')
Backend Routes (questions.js)
    ↓ Question.find()
MongoDB (questions collection)
```

### **4. Highlight Key Features:**

- ✅ Full CRUD for questions and answers
- ✅ Voting system (like Stack Overflow)
- ✅ Tag filtering and search
- ✅ Answer acceptance by question author
- ✅ Follow questions
- ✅ View tracking
- ✅ Proper authentication & authorization

---

## 🚀 Next Steps

1. **Test the endpoints** with Postman
2. **Check MongoDB** - see questions/answers appear
3. **Integrate frontend** - replace static data with API calls
4. **Add features:**
   - Comment system
   - User reputation/points
   - Email notifications for followers
   - Markdown support for content

---

## Summary

**What I Built:**

- 2 Database Models (Question, Answer)
- 2 Route Files (questions, answers)
- 1 Middleware File (auth guards)
- 14 Total API Endpoints

**What It Does:**

- Complete Q&A platform backend
- Users can ask, answer, vote, and search
- Everything saved to MongoDB
- Secure with proper authentication

**Ready For:**

- Frontend integration
- Testing and demo
- Your team update tomorrow

Good luck! 🎉
