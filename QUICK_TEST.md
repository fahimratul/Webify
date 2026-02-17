# Community Features - Quick Test Guide

## ✅ Files Created Successfully

1. ✅ `backend/models/Question.js` - Question schema
2. ✅ `backend/models/Answer.js` - Answer schema
3. ✅ `backend/middleware/auth.js` - Authentication middleware
4. ✅ `backend/routes/questions.js` - Question endpoints (8 routes)
5. ✅ `backend/routes/answers.js` - Answer endpoints (6 routes)
6. ✅ `backend/server.js` - Updated with new routes

## 🧪 Quick Test Steps

### 1. Start the Server

```bash
cd c:/Users/tam1m/Desktop/sdp/Webify
npm start
```

You should see:

```
MongoDB connected: cluster0.wfq5n4k.mongodb.net
Server running on: http://localhost:3000
```

### 2. Test with Postman/Thunder Client

**A. Login First (to get session)**

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "yourpassword"
}
```

**B. Create a Question**

```http
POST http://localhost:3000/api/questions
Content-Type: application/json

{
  "title": "How to center a div in CSS?",
  "content": "I've tried using margin: auto but it doesn't work",
  "tags": ["CSS", "Flexbox"]
}
```

**C. Get All Questions (no login needed)**

```http
GET http://localhost:3000/api/questions
```

**D. Upvote the Question**

```http
POST http://localhost:3000/api/questions/QUESTION_ID_HERE/vote
Content-Type: application/json

{
  "voteType": "up"
}
```

**E. Post an Answer**

```http
POST http://localhost:3000/api/answers
Content-Type: application/json

{
  "questionId": "QUESTION_ID_HERE",
  "content": "You need to use display: flex on the parent"
}
```

### 3. Check MongoDB Compass

Open MongoDB Compass and you should see:

- `questions` collection (new!)
- `answers` collection (new!)

## 📋 All 14 Endpoints Created

### Questions (8 endpoints):

1. GET `/api/questions` - List questions
2. GET `/api/questions/:id` - Get single question
3. POST `/api/questions` - Create question
4. PUT `/api/questions/:id` - Update question
5. DELETE `/api/questions/:id` - Delete question
6. POST `/api/questions/:id/vote` - Vote on question
7. POST `/api/questions/:id/follow` - Follow question
8. GET `/api/questions/tags/all` - Get all tags

### Answers (6 endpoints):

1. GET `/api/answers/question/:questionId` - Get answers
2. POST `/api/answers` - Post answer
3. PUT `/api/answers/:id` - Update answer
4. DELETE `/api/answers/:id` - Delete answer
5. POST `/api/answers/:id/vote` - Vote on answer
6. POST `/api/answers/:id/accept` - Accept answer

## 🎯 For Tomorrow's Demo

Say this:

1. "I implemented the complete Community Q&A backend"
2. "14 API endpoints covering questions, answers, voting, and tags"
3. "Everything is saved to MongoDB with proper authentication"
4. "Users can ask questions, post answers, vote, and search"
5. "Only question authors can accept answers"
6. "The API is ready for frontend integration"

Show:

- The file structure
- A Postman test creating a question
- MongoDB Compass with the new collections
- The voting system working

Done! 🚀
