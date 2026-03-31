# 7. Error Handling and Messages

This document lists only the errors and messages that are implemented in the current Webify project code.

## 7.1 Authentication Errors

### Error: "Incorrect username or email."

Common causes:

- Username/email is wrong
- Typing mistake in login input

How to fix:

1. Re-enter username/email carefully.
2. Check spelling and extra spaces.
3. Try again using the same email used at signup.

---

### Error: "Incorrect password."

Common causes:

- Wrong password entered
- Caps Lock is on

How to fix:

1. Re-type password carefully.
2. Turn off Caps Lock.
3. Use the Forgot Password page if needed.

---

### Error: "Invalid password" (criteria mismatch)

Meaning:
In this project, password validation currently requires a minimum length only.

Implemented criteria in code:

- Minimum 6 characters
- No leading/trailing whitespace

How to fix:

1. Use at least 6 characters.
2. Remove spaces at the beginning or end.
3. Submit again.

Example:
"Invalid password" means the password does not meet the criteria (for this project: too short or has leading/trailing spaces).

---

### Error: "Please verify your email address before logging in."

Common causes:

- Account is created but email is not verified yet

How to fix:

1. Open verification email from Webify.
2. Click the verification link.
3. If needed, use resend verification in login flow.
4. Log in again.

---

### Error: "Email is required" / "Please enter a valid email address"

Common causes:

- Email field is empty
- Email format is invalid

How to fix:

1. Enter your email address.
2. Use a valid format (example: name@example.com).
3. Submit again.

---

## 7.2 Account and Access Errors

### Error: "You must be logged in to perform this action"

Common causes:

- User is not logged in
- Session cookie is missing/expired on protected API request

How to fix:

1. Log in first.
2. Retry the action.
3. If still failing, log out and log in again.

---

### Error: "Please login to ask a question" / "Please login to vote"

Common causes:

- Attempted community action without authentication

How to fix:

1. Log in from the auth page.
2. Return to Community and retry.

---

## 7.3 Store (Marketplace) Errors

### Error: "Unable to Load Products"

Common causes:

- Marketplace API request failed
- Backend server is not reachable

How to fix:

1. Refresh the page.
2. Confirm backend server is running.
3. Retry after checking internet connection.

---

### Error: "Please log in to proceed with the purchase."

Common causes:

- User clicked Buy Now without login

How to fix:

1. Log in first.
2. Return to marketplace and continue checkout.

---

### Error: Payment form validation messages

Implemented validation messages include:

- "Please enter your full name"
- "Please enter a valid email address"
- "Please enter a valid 16-digit card number"
- "Please enter a valid expiry date in MM/YY format"
- "Please enter a valid CVV"
- "Please enter cardholder name"
- "Please fill in all billing address fields"
- "Please agree to the terms and conditions"

How to fix:

1. Correct the highlighted/invalid field.
2. Ensure all required fields are filled.
3. Submit payment again.

---

### Error: "Failed to submit rating"

Common causes:

- Rating API request failed
- User is not authenticated for rating endpoint

How to fix:

1. Ensure you are logged in.
2. Check connection and retry rating.

---

## 7.4 Community Errors

### Error: "Question title is required"

Common causes:

- Title field is empty in question submission

How to fix:

1. Enter a title.
2. Submit again.

---

### Error: "Question body is required"

Common causes:

- Body field is empty in question submission

How to fix:

1. Enter question details in the body.
2. Submit again.

---

### Error: "Title must be at least 10 characters"

Common causes:

- Question title is too short

How to fix:

1. Expand the title to at least 10 characters.
2. Submit again.

---

### Error: "Question must be at least 20 characters"

Common causes:

- Question description/body is too short

How to fix:

1. Add more details to the question body.
2. Submit again.

---

### Error: "Answer body is required"

Common causes:

- Attempted to post an empty answer

How to fix:

1. Write an answer in the body field.
2. Submit again.

---

## 7.5 General API Errors

### Error: "Item not found" / "Question not found" / "Answer not found" / "User not found"

Common causes:

- Requested resource does not exist
- Invalid ID in request URL

How to fix:

1. Return to list page and open item again.
2. Avoid stale/old links.

---

### Error: "Failed to fetch ..." / "Failed to save ..." / "Failed to update ..." / "Failed to vote"

Common causes:

- Backend request failed
- Temporary server issue

How to fix:

1. Retry the action.
2. Refresh the page.
3. Try again after a short wait.

---

## 7.6 Quick Troubleshooting Checklist

1. Confirm internet connection is stable.
2. Verify you are logged in for protected actions.
3. Re-check form input rules (password length, question title/body length, payment fields).
4. Refresh page and retry.
5. If still failing, copy exact error text and report it.

---

## 7.7 Support Contact Format

When reporting an error, include:

- Exact error message text
- Action you were performing
- Time of occurrence
- Browser and device
- Screenshot (if possible)

This helps support resolve issues faster.
