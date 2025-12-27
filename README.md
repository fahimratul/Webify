### Probable Architecture
```
/Webify
/backend
├── /middleware
│   └── auth.js         <-- The "Bouncer" (checks if user is logged in)
├── /routes
│   ├── projects.js     <-- API for Saving/Loading layouts
│   └── users.js        <-- API for Login/Signup
├── /models
│   └── Project.js      <-- The "Blueprint" for MongoDB (what a site looks like)
├── .env                <-- Our MongoDB Connection String (KEEP THIS SECRET)
└── server.js           <-- The "Main Brain" (Bun/Express)
│
├── /frontend-static      <-- Regular HTML/CSS/JS
│   ├── /assets           <-- Images/Logos
│   ├── /css              <-- Global styles (Tailwind)
│   ├── index.html        <-- Homepage
│   ├── marketplace.html  <-- The "Showcase" page
│   └── script.js         <-- Simple logic for their pages
│
├── /frontend-builder     <-- The SolidJS App
│   ├── /src              <-- Our Drag & Drop components
│   ├── index.jsx         <-- Entry point for Solid
│   └── package.json      <-- SolidJS dependencies
│
└── package.json          <-- Root settings to glue it all together
```

### Storage Optimization Plan
- Store images, videos somewhere else, not in mongo. Otherwise we will hit storage limit soon.
- Maybe we will store images and videos in Cloudinary and store the links in mongo.
