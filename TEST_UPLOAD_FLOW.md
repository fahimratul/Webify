# 🧪 COMPLETE UPLOAD TESTING GUIDE

## ✅ What I Fixed

1. **Builder Upload Button** - Added detailed console logging
2. **Upload Form** - Added step-by-step debugging
3. **Marketplace Page** - Added cache-busting and detailed logs
4. **Profile Page** - Now fetches YOUR uploaded templates from marketplace API

---

## 🎯 COMPLETE TEST FLOW

### **Test 1: Upload from Builder**

1. **Open Builder:**

   ```
   http://localhost:3000/builder
   ```

2. **Open Console** (F12 → Console tab)

3. **Add Content:**
   - Drag any component to canvas (or use existing "Tamim"/"Tamim Hossain" text)
   - Content must exist or upload will fail

4. **Click "Upload" Button** (top-right with ⬆️ icon)

5. **Expected Console Output:**

   ```
   🚀 Upload button clicked!
   ✅ Editor instance found
   📄 HTML length: XXX
   🎨 CSS length: XXX
   📝 HTML preview: <body>...
   💾 Saving to localStorage...
   ✅ Verified localStorage: Data saved successfully
   🔄 Redirecting to upload page...
   ```

6. **You should be redirected to upload form**

---

### **Test 2: Fill Upload Form**

1. **On Upload Page**, console should show:

   ```
   ✅ Found: <body>...
   ```

2. **Fill the form:**
   - Title: "Test Portfolio"
   - Description: "My test template"
   - Category: Portfolio
   - Pricing: Free

3. **Click "Publish to Marketplace"**

4. **Expected Console Output:**

   ```
   🚀 UPLOAD FORM SUBMITTED!
   ✅ Builder data found: {html: "...", css: "..."}
   📦 Form Data: {title: "Test Portfolio", ...}
   📝 HTML length: XXX
   🎨 CSS length: XXX
   🌐 Sending POST request to /api/marketplace/templates...
   📡 Response status: 201 Created
   📥 Response body: {success: true, template: {...}}
   ✅ Upload successful!
   🎉 Template created: {...}
   🔄 Redirecting to marketplace...
   ```

5. **Alert should say:** ✅ Published to marketplace successfully!

6. **You'll be redirected to marketplace**

---

### **Test 3: Check Marketplace**

1. **On Marketplace Page**, console should show:

   ```
   🔄 Fetching templates from API...
   📡 Request URL: /api/marketplace/templates?_t=...
   📥 Response status: 200
   📦 Received data: {...}
   📊 Total templates: 7  ← (6 seeded + 1 yours)
   ✅ Loaded 7 templates from API:
      ["Modern Dashboard UI Kit", ..., "Test Portfolio"]
   ```

2. **Your "Test Portfolio" should appear at the TOP** of the page

3. **Hard refresh if needed:** `Ctrl + Shift + R`

---

### **Test 4: Check Profile Page**

1. **Go to your profile:**

   ```
   http://localhost:3000/profile/profile.html
   ```

2. **Click "Template" Tab**

3. **Console should show:**

   ```
   📋 Loading your uploaded marketplace templates...
   🔄 Fetching your uploaded templates from marketplace...
   📡 My-templates response status: 200
   📦 My templates data: {...}
   ✅ Loaded 1 of your uploaded templates
   ```

4. **Your "Test Portfolio" should appear:**
   - At the TOP of template list
   - With a cyan badge: **"YOUR UPLOAD"**
   - Shows other sample components below it

---

## 🔍 DEBUGGING COMMANDS

### Check if logged in:

```bash
curl -s http://localhost:3000/api/check-auth --cookie-jar cookies.txt
```

Expected: `{"authenticated":true,"user":{...}}`

### Check total templates in database:

```bash
curl -s "http://localhost:3000/api/marketplace/templates?limit=50" | grep -o '"title":"[^"]*"'
```

Expected to see 7+ titles including yours

### Check YOUR templates only:

```bash
curl -s "http://localhost:3000/api/marketplace/my-templates" -b cookies.txt | grep -o '"title":"[^"]*"'
```

Expected to see only YOUR uploaded templates

---

## ❓ Troubleshooting

### Issue: "Cannot upload: No design data found"

**Fix:** Make sure you added content to the canvas before clicking Upload

### Issue: Still seeing only 6 templates

**Fix:**

1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Check console for error messages

### Issue: Upload form immediately redirects to login

**Fix:** You're not logged in! Go to `/auth/login.html` first

### Issue: Profile template tab shows only samples

**Fix:**

1. Check console for error messages
2. Make sure you've uploaded at least one template
3. Verify API returns templates: `curl http://localhost:3000/api/marketplace/my-templates -b cookies.txt`

---

## 🎉 SUCCESS INDICATORS

✅ **Builder:** Console shows HTML/CSS saved to localStorage  
✅ **Upload Form:** Console shows 201 response with template data  
✅ **Marketplace:** Shows 7+ templates including yours at top  
✅ **Profile:** Template tab shows YOUR uploads with "YOUR UPLOAD" badge

---

## 📊 Expected Results

| Location                   | What You Should See                          |
| -------------------------- | -------------------------------------------- |
| **Builder**                | Upload button works, saves data, redirects   |
| **Upload Form**            | Form pre-filled with code, successful submit |
| **Marketplace**            | Your template appears (newest first)         |
| **Profile → Template Tab** | Your uploads at top with badge               |
| **Database**               | 7 templates (6 seeded + 1 yours)             |

---

## 🚀 Try It Now!

1. **Open:** `http://localhost:3000/builder`
2. **Open Console (F12)**
3. **Click Upload button**
4. **Watch the console logs**
5. **Follow the flow**
6. **Report what you see!**

If you see any errors, copy the console messages and send them to me! 🔍
