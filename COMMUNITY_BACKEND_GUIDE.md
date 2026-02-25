# Community Backend Implementation - Complete Guide

## 📚 **What We Built**

We built a complete Q&A system (like Stack Overflow) for your Webify community page. Here's what it includes:

### **Components Created:**

1. **Question Model** (`backend/models/Question.js`)
2. **Community Routes** (`backend/routes/community.js`)
3. **Frontend Integration** (`frontend/community/questions-backend.js`)

---

## 🏗️ **Architecture Overview**

```
Frontend (questions.html)
    ↓
questions-backend.js (Client-side JavaScript)
    ↓ HTTP Requests
Backend API (server.js)
    ↓ Routes
community.js (Route Handlers)
    ↓ Database Operations
Question Model (Mongoose)
    ↓
MongoDB Atlas
```

---

## 📦 **1. Question Model (Database Schema)**

**File:** `backend/models/Question.js`

### **What is it?**

A Mongoose schema that defines the structure of questions in MongoDB.

### **Key Concepts:**

#### **Schema = Blueprint**

```javascript
const QuestionSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: ObjectId,  // Reference to User
    votes: Number,
    answers: [...]  // Embedded subdocuments
})
```

Think of it as a class definition for your database documents.

#### **Field Types:**

- `String` - Text data
- `Number` - Numbers (integers or decimals)
- `Date` - Timestamps
- `Boolean` - true/false
- `ObjectId` - Reference to another document
- `Array` - List of items

#### **Validation:**

```javascript
title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [10, 'Too short'],
    maxlength: [200, 'Too long']
}
```

Mongoose automatically checks these rules before saving.

#### **References (Relationships):**

```javascript
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Links to User collection
}
```

This is like a foreign key in SQL. We can later "populate" it to get full user details.

#### **Embedded Documents (Nested Data):**

```javascript
answers: [
  {
    body: String,
    author: ObjectId,
    votes: Number,
  },
];
```

Answers are stored inside the question document (denormalization in MongoDB).

#### **Indexes (Performance):**

```javascript
QuestionSchema.index({ title: "text", body: "text" });
QuestionSchema.index({ tags: 1 });
```

Indexes make queries faster, like an index in a book.

---

## 🛣️ **2. Community Routes (API Endpoints)**

**File:** `backend/routes/community.js`

### **What is Express Router?**

Express Router lets you organize routes in separate files:

```javascript
import express from "express";
const router = express.Router();

router.get("/questions", handler);
router.post("/questions", handler);

export default router;
```

Then in `server.js`:

```javascript
import communityRoutes from "./routes/community.js";
app.use("/api", communityRoutes);
```

This makes `/api/questions` call the handler in `community.js`.

---

### **Middleware Explained:**

#### **isAuthenticated Middleware:**

```javascript
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Continue to route
  }
  res.status(401).json({ error: "Not logged in" });
};
```

- **Middleware** = Function that runs BEFORE your route handler
- `req.isAuthenticated()` = Passport.js method (checks session)
- `next()` = Continue to next middleware/handler
- If not authenticated, send error and stop

**Usage:**

```javascript
router.post("/questions", isAuthenticated, async (req, res) => {
  // This only runs if user is authenticated
});
```

---

### **API Endpoints Explained:**

#### **GET /api/questions**

```javascript
router.get("/questions", async (req, res) => {
  const { tab, tag, sort, search } = req.query;

  // Build filter object
  let filter = {};
  if (tab === "unanswered") {
    filter.isAnswered = false;
  }

  // Query database
  const questions = await Question.find(filter)
    .sort({ createdAt: -1 })
    .populate("author", "username email");

  res.json({ questions });
});
```

**Key Concepts:**

- `req.query` = URL parameters (?tab=newest&tag=css)
- `Question.find(filter)` = MongoDB query
- `.sort()` = Order results (-1 = descending)
- `.populate()` = Replace ObjectId with actual user data
- `.lean()` = Convert Mongoose document to plain object (faster)

---

#### **POST /api/questions**

```javascript
router.post("/questions", isAuthenticated, async (req, res) => {
  const { title, body, tags } = req.body;

  const newQuestion = new Question({
    title,
    body,
    author: req.user._id, // From Passport session
    tags,
  });

  await newQuestion.save();
  res.status(201).json({ question: newQuestion });
});
```

**Key Concepts:**

- `req.body` = Data sent from frontend (JSON)
- `new Question()` = Create instance
- `.save()` = Save to MongoDB
- `req.user` = Set by Passport (authenticated user)
- `201` status = Created successfully

---

#### **PUT /api/questions/:id/vote**

```javascript
router.put("/questions/:id/vote", isAuthenticated, async (req, res) => {
  const { id } = req.params; // From URL
  const { voteType } = req.body; // 'up' or 'down'

  const question = await Question.findById(id);

  // Check if user already voted
  const existingVote = question.votedBy.find(
    (vote) => vote.user.toString() === req.user._id.toString(),
  );

  if (existingVote) {
    // Toggle or change vote
    if (existingVote.voteType === voteType) {
      // Remove vote
      question.votedBy = question.votedBy.filter(
        (v) => v.user.toString() !== req.user._id.toString(),
      );
      question.votes += voteType === "up" ? -1 : 1;
    } else {
      // Change vote
      existingVote.voteType = voteType;
      question.votes += voteType === "up" ? 2 : -2;
    }
  } else {
    // New vote
    question.votedBy.push({
      user: req.user._id,
      voteType,
    });
    question.votes += voteType === "up" ? 1 : -1;
  }

  await question.save();
  res.json({ votes: question.votes });
});
```

**Key Concepts:**

- `req.params` = URL path variables (/questions/:id)
- `.find()` = Array method (not MongoDB)
- `.filter()` = Remove items from array
- Vote logic prevents duplicate votes
- Upvote = +1, Downvote = -1

---

#### **POST /api/questions/:id/answers**

```javascript
router.post("/questions/:id/answers", isAuthenticated, async (req, res) => {
  const question = await Question.findById(req.params.id);

  // Add answer to embedded array
  question.answers.push({
    body: req.body.body,
    author: req.user._id,
  });

  // Mark as answered
  if (question.answers.length === 1) {
    question.isAnswered = true;
  }

  await question.save();
  res.json({ question });
});
```

**Key Concepts:**

- Embedded documents: answers stored inside question
- `.push()` = Add to array
- Automatically creates answer with ID

---

## 🌐 **3. Frontend Integration**

**File:** `frontend/community/questions-backend.js`

### **Async/Await Explained:**

```javascript
async function fetchQuestions() {
  const response = await fetch("/api/questions");
  const data = await response.json();
  return data;
}
```

- `async` = Function that returns a Promise
- `await` = Wait for Promise to resolve (pause execution)
- Makes asynchronous code look synchronous

**Without async/await:**

```javascript
fetch("/api/questions")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

### **Fetch API (Making HTTP Requests):**

#### **GET Request:**

```javascript
const response = await fetch("/api/questions?tab=newest", {
  credentials: "include", // Send cookies (session)
});
const data = await response.json();
```

#### **POST Request:**

```javascript
const response = await fetch("/api/questions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    title: "My Question",
    body: "Question text",
    tags: ["css", "html"],
  }),
});
```

#### **PUT Request (Voting):**

```javascript
await fetch(`/api/questions/${id}/vote`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ voteType: "up" }),
});
```

---

### **State Management:**

```javascript
const state = {
  tab: "newest",
  tag: "",
  sort: "newest",
  query: "",
  questions: [],
  currentUser: null,
};
```

- Central place to store app data
- Changes to state trigger re-renders
- Single source of truth

---

### **Authentication Flow:**

```javascript
async function checkAuthentication() {
  const response = await fetch("/api/check-auth", {
    credentials: "include",
  });
  const data = await response.json();

  if (data.authenticated) {
    state.currentUser = data.user;
    updateUIForLoggedInUser(data.user);
  } else {
    updateUIForLoggedOutUser();
  }
}
```

1. Call `/api/check-auth`
2. Server checks session cookie
3. Returns user data if logged in
4. Update UI based on auth status

---

## 🔐 **Authentication & Sessions**

### **How Sessions Work:**

```
1. User logs in → POST /api/login
2. Passport verifies credentials
3. Server creates session, stores in MongoDB
4. Server sends session ID cookie to browser
5. Browser includes cookie in all future requests
6. Server looks up session, knows who you are
```

### **Session Cookie:**

```
Set-Cookie: connect.sid=s%3Aj123abc...; Path=/; HttpOnly
```

- `HttpOnly` = JavaScript cannot read it (security)
- Automatically sent with every request
- `credentials: 'include'` in fetch ensures this

---

## 📊 **MongoDB Operations**

### **Create (INSERT):**

```javascript
const question = new Question({ title, body });
await question.save();
```

### **Read (SELECT):**

```javascript
// Find all
const questions = await Question.find();

// Find by ID
const question = await Question.findById(id);

// Find with conditions
const questions = await Question.find({ tags: "css" });

// With sorting and limit
const questions = await Question.find().sort({ createdAt: -1 }).limit(10);
```

### **Update:**

```javascript
// Method 1: Find and modify
const question = await Question.findById(id);
question.votes += 1;
await question.save();

// Method 2: Direct update
await Question.findByIdAndUpdate(id, { $inc: { votes: 1 } });
```

### **Delete:**

```javascript
await Question.findByIdAndDelete(id);
```

---

## 🔍 **Advanced MongoDB Features**

### **Population (JOIN):**

```javascript
const question = await Question.findById(id)
  .populate("author", "username email")
  .populate("answers.author", "username");
```

Replaces ObjectId with actual user documents:

**Before:**

```javascript
{
  author: ObjectId("507f1f77bcf86cd799439011");
}
```

**After:**

```javascript
{
    author: {
        _id: "507f1f77bcf86cd799439011",
        username: "john_doe",
        email: "john@example.com"
    }
}
```

---

### **Aggregation (Complex Queries):**

```javascript
const trending = await Question.aggregate([
  { $match: { createdAt: { $gte: threeDaysAgo } } },
  { $sort: { votes: -1, views: -1 } },
  { $limit: 10 },
]);
```

- `$match` = Filter
- `$sort` = Order
- `$limit` = Limit results

---

### **Text Search:**

```javascript
// Create index first
QuestionSchema.index({ title: "text", body: "text" });

// Search
const questions = await Question.find({
  $text: { $search: "flexbox centering" },
});
```

Full-text search across multiple fields.

---

## 🎨 **Frontend-Backend Flow Example**

### **Scenario: User asks a question**

**1. User fills form and clicks submit:**

```javascript
// questions-backend.js
async function submitAnswer() {
  const title = questionTitleInput.value;
  const body = questionInput.value;

  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, body, tags }),
  });
}
```

**2. Request hits server:**

```javascript
// server.js
app.use("/api", communityRoutes);
```

**3. Router handles request:**

```javascript
// community.js
router.post("/questions", isAuthenticated, async (req, res) => {
  // isAuthenticated middleware runs first
  // If passes, this handler runs

  const newQuestion = new Question({
    title: req.body.title,
    body: req.body.body,
    author: req.user._id,
    tags: req.body.tags,
  });

  await newQuestion.save();
  res.json({ success: true, question: newQuestion });
});
```

**4. Response sent back:**

```javascript
// questions-backend.js
const data = await response.json();

if (response.ok) {
  showNotification("Question posted!");
  await fetchQuestions(); // Refresh list
}
```

---

## 🐛 **Error Handling Best Practices**

```javascript
try {
  const response = await fetch("/api/questions");

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const data = await response.json();
  // Success logic
} catch (error) {
  console.error("Error:", error);
  showNotification("Failed to load questions", "error");
}
```

Always:

1. Wrap async code in try/catch
2. Check `response.ok` before parsing JSON
3. Log errors for debugging
4. Show user-friendly error messages

---

## 🚀 **Testing the API**

### **Using Browser Console:**

```javascript
// Test authentication
fetch("/api/check-auth", { credentials: "include" })
  .then((r) => r.json())
  .then(console.log);

// Test fetching questions
fetch("/api/questions")
  .then((r) => r.json())
  .then(console.log);

// Test posting question (must be logged in)
fetch("/api/questions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    title: "Test Question",
    body: "This is a test question body",
    tags: ["test"],
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📈 **Next Steps**

To complete the community feature, you should add:

1. **Question Detail Page** - View full question and all answers
2. **Answer Submission** - Add answers to questions
3. **Accept Answer** - Mark best answer
4. **Edit/Delete** - Edit your own questions/answers
5. **User Profiles** - View user's questions and reputation
6. **Search Improvements** - Better search with highlighting
7. **Notifications** - Notify when someone answers your question
8. **Pagination** - Load questions in chunks

---

## 🎓 **Key Takeaways**

1. **Models** define database structure (Schema)
2. **Routes** handle HTTP requests and responses
3. **Middleware** runs before route handlers (auth, validation)
4. **Async/Await** makes async code readable
5. **Fetch API** communicates with backend
6. **Sessions** maintain user state across requests
7. **ObjectId** links documents (relationships)
8. **Embedded docs** store related data together
9. **Population** retrieves referenced documents
10. **Error handling** prevents crashes and helps debugging

---

## 📚 **Resources**

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MongoDB University](https://university.mongodb.com/)
- [Passport.js](http://www.passportjs.org/)
