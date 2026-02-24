import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./db.js";
import "./config/passport.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { mailSender } from "./sendMail.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

console.log('🚀 Starting Webify server...');
console.log('📁 __dirname:', __dirname);
console.log('🔑 SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('🗄️ MONGODB_URI exists:', !!process.env.MONGODB_URI);

// 1. Connect to MongoDB Atlas
connectDB();

// 2. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// 3. Session Configuration (The "Database for Cookies")
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
    },
  }),
);

// 4. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --- STATIC FILES & ROUTING ---

// Serve Builder App
const builderDist = path.join(
  __dirname,
  "../frontend/builder2/SaaticBuilder2/dist",
);
app.use("/builder", express.static(builderDist));

// API Routes (Login/Logout/Signup)

// Import User model for signup
import User from "./models/User.js";

// Import Community Routes
import communityRoutes from "./routes/community.js";

// Authentication middleware for profile routes
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in to perform this action" });
};

// Marketplace routes - GET is public, POST requires auth
import MarketplaceItem from "./models/MarketPlaceItem.js";

// Public GET endpoint for viewing all marketplace items
app.get("/api/marketplace/items", async (req, res) => {
  console.log('📍 GET /api/marketplace/items endpoint called');
  try {
    console.log('🔍 Searching for published marketplace items...');
    const items = await MarketplaceItem.find({ published: true })
      .populate('owner', 'username profilePicture')
      .sort({ createdAt: -1 });

    console.log('✅ Found', items.length, 'items');

    const formattedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      author: item.owner?.username || 'Unknown',
      ownerId: item.owner?._id ? item.owner._id.toString() : null,
      rating: item.rating || 0,
      ratingCount: item.ratingCount || 0,
      downloads: item.downloads || 0,
      likes: item.likes || 0,
      likedBy: item.likedBy || [],
      tags: item.tags || [],
      price: item.isPremium ? item.price.toString() : '0',
      type: item.isPremium ? 'paid' : 'free',
      category: item.category || 'webpage',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      html: item.html || '',
      css: item.css || '',
      description: item.description || '',
      updatedAt: item.updatedAt
    }));

    res.json({ success: true, items: formattedItems });
  } catch (err) {
    console.error('❌ Marketplace fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Protected POST endpoint for uploading items
app.post("/api/marketplace/items", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const { title, description, category, isPremium, price, html, css, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const item = new MarketplaceItem({
      title,
      description,
      category,
      isPremium: !!isPremium,
      price: Number(price) || 0,
      html,
      css,
      tags: Array.isArray(tags) ? tags : [],
      owner: user._id,
      published: true
    });

    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    console.error('Marketplace upload error:', err);
    res.status(500).json({ error: 'Failed to save item' });
  }
});

// PUT /api/marketplace/items/:id/like - Toggle like on an item
app.put("/api/marketplace/items/:id/like", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await MarketplaceItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Check if user already liked this item
    const alreadyLiked = item.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike: remove user from likedBy array
      item.likedBy = item.likedBy.filter(id => !id.equals(userId));
      item.likes = Math.max(0, item.likes - 1);
    } else {
      // Like: add user to likedBy array
      item.likedBy.push(userId);
      item.likes += 1;
    }

    await item.save();
    res.json({
      success: true,
      liked: !alreadyLiked,
      likes: item.likes,
      likedBy: item.likedBy.map(id => id.toString()),
      message: alreadyLiked ? 'Removed like' : 'Added like'
    });
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// PUT /api/marketplace/items/:id/download - Increment download count
app.put("/api/marketplace/items/:id/download", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MarketplaceItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.downloads = (item.downloads || 0) + 1;
    await item.save();

    res.json({
      success: true,
      downloads: item.downloads,
      message: 'Download count updated'
    });
  } catch (err) {
    console.error('Download count error:', err);
    res.status(500).json({ error: 'Failed to update download count' });
  }
});

// PUT /api/marketplace/items/:id/rate - Add or update rating
app.put("/api/marketplace/items/:id/rate", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const item = await MarketplaceItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Check if user has already rated this item
    const existingRatingIndex = item.ratedBy.findIndex(
      r => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
      // User has already rated - update their rating
      const oldRating = item.ratedBy[existingRatingIndex].rating;
      item.ratedBy[existingRatingIndex].rating = rating;

      // Recalculate average rating
      const totalRating = item.ratedBy.reduce((sum, r) => sum + r.rating, 0);
      item.rating = totalRating / item.ratedBy.length;
    } else {
      // New rating from this user
      item.ratedBy.push({ userId, rating });
      item.ratingCount = item.ratedBy.length;

      // Recalculate average rating
      const totalRating = item.ratedBy.reduce((sum, r) => sum + r.rating, 0);
      item.rating = totalRating / item.ratedBy.length;
    }

    await item.save();
    res.json({
      success: true,
      rating: item.rating.toFixed(1),
      ratingCount: item.ratingCount,
      message: existingRatingIndex !== -1 ? 'Rating updated successfully' : 'Rating added successfully'
    });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// Use Community Routes
app.use("/api", communityRoutes);

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Validate username: trim and check length
    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) {
      return res.status(400).json({ error: "Username cannot be empty or whitespace only" });
    }
    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }
    if (trimmedUsername.length > 30) {
      return res.status(400).json({ error: "Username must not exceed 30 characters" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Validate password: check for leading/trailing whitespace
    if (password !== password.trim()) {
      return res.status(400).json({ error: "Password cannot have leading or trailing spaces" });
    }
    if (password.trim().length === 0) {
      return res.status(400).json({ error: "Password cannot be empty or whitespace only" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists (username or email)
    const existingUser = await User.findOne({
      $or: [{ username: trimmedUsername }, { email: email.toLowerCase() }]
    });
    if (existingUser) {
      if (existingUser.username === trimmedUsername) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    // Create new user with email verification required
    const userData = {
      username: trimmedUsername,
      email: email.toLowerCase(),
      password,
      emailVerified: false
    };

    const newUser = new User(userData);

    // Generate email verification token
    const verificationToken = newUser.generateEmailVerificationToken();
    await newUser.save();

    // Send verification email
    const verificationURL = `https://webify-kudm.onrender.com/auth/verify-email.html?token=${verificationToken}`;

    const transporter = createEmailTransporter();

    const mailOptions = {
      to: newUser.email,
      from: process.env.EMAIL_USER || 'noreply@webify.com',
      subject: 'Verify Your Email - Welcome to Webify!',
      text: `Welcome to Webify!\n\nPlease verify your email address by clicking the following link:\n\n${verificationURL}\n\nThis verification link will expire in 24 hours.\n\nIf you didn't create an account on Webify, please ignore this email.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Webify!</h2>
          <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationURL}" style="background-color: #22d3ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationURL}</p>
          <p style="color: #888;">This verification link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">If you didn't create an account on Webify, please ignore this email.</p>
        </div>`
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log("📧 Email verification email sent successfully:", result.messageId);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      console.error("Error code:", emailError.code);
      console.error("Error message:", emailError.message);
    }

    // Return success without auto-login
    res.json({
      success: true,
      message: "Account created successfully! Please check your email and click the verification link before logging in.",
      user: {
        username: newUser.username,
        email: newUser.email,
        emailVerified: false
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Login Route
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Server error during login" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        error: "Please verify your email address before logging in. Check your inbox for the verification link.",
        emailVerificationRequired: true
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error creating session" });
      }
      return res.json({ message: "Logged in!", user: req.user });
    });
  })(req, res, next);
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Protected Route Example
app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Email transporter configuration
const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const config = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      // requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    };

    console.log('🔧 Email transporter configured for Gmail');
    console.log('📧 Email user:', process.env.EMAIL_USER);

    return nodemailer.createTransport(config);
  }

  // Fallback to console logging if email not configured
  console.warn('⚠️ Email not configured! EMAIL_SERVICE, EMAIL_USER, or EMAIL_PASS is missing.');
  return {
    sendMail: (options) => {
      console.log("📧 Email would be sent with the following details:");
      console.log("To:", options.to);
      console.log("Subject:", options.subject);
      console.log("Text:", options.text);
      console.log("HTML:", options.html);
      return Promise.resolve({ messageId: 'console-log-id' });
    }
  };
};

// Password Reset Routes

// POST /api/forgot-password - Request password reset
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetURL = `https://webify-kudm.onrender.com/auth/reset-password.html?token=${resetToken}`;

    const transporter = createEmailTransporter();

    // Email content
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER || 'noreply@webify.com',
      subject: 'Password Reset Request - Webify',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process within 10 minutes:\n\n` +
        `${resetURL}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You are receiving this because you requested the reset of your Webify account password.</p>
          <p>Please click the following button to complete the process within 10 minutes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #22d3ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetURL}</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"> 
          <p style="color: #888; font-size: 12px;">This is an automated message from Webify.</p>
        </div>`
    };

    try {
      // const result = await transporter.sendMail(mailOptions);
      // console.log("📧 Password reset email sent successfully:", result.messageId);
      await mailSender(mailOptions);
    } catch (emailError) {
      console.error("❌ Password reset email failed:", emailError);
      console.error("Error code:", emailError.code);
      console.error("Error message:", emailError.message);
      throw emailError;
    }

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    // Provide more specific error messages for debugging
    if (error.code === 'EAUTH') {
      console.error("❌ Gmail authentication failed. Check EMAIL_USER and EMAIL_PASS in .env file");
    } else if (error.code === 'ESOCKET') {
      console.error("❌ Network error. Check internet connection");
    } else {
      console.error("❌ Unexpected error:", error.message);
    }

    res.status(500).json({ error: "Failed to send password reset email" });
  }
});

// POST /api/reset-password - Reset password with token
app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Find user by valid reset token
    const user = await User.findByPasswordResetToken(token);

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired" });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Your password has been reset successfully! You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Email Verification Routes

// POST /api/verify-email - Verify email with token
app.post("/api/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    // Find user by valid verification token
    const user = await User.findByEmailVerificationToken(token);

    if (!user) {
      return res.status(400).json({ error: "Email verification token is invalid or has expired" });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Your email has been verified successfully! You can now login to your account."
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

// POST /api/resend-verification - Resend verification email
app.post("/api/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account with that email exists and is unverified, a new verification email has been sent."
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const verificationURL = `https://webify-kudm.onrender.com/auth/verify-email.html?token=${verificationToken}`;

    const transporter = createEmailTransporter();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER || 'noreply@webify.com',
      subject: 'Verify Your Email - Webify',
      text: `Please verify your email address by clicking the following link:\n\n${verificationURL}\n\nThis verification link will expire in 24 hours.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Please verify your email address to complete your Webify account setup.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationURL}" style="background-color: #22d3ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationURL}</p>
          <p style="color: #888;">This verification link will expire in 24 hours.</p>
        </div>`
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log("📧 Email verification resent successfully:", result.messageId);
    } catch (emailError) {
      console.error("❌ Verification email resend failed:", emailError);
      console.error("Error code:", emailError.code);
      console.error("Error message:", emailError.message);
      throw emailError;
    }

    res.json({
      success: true,
      message: "If an account with that email exists and is unverified, a new verification email has been sent."
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
});

// Update user profile route
app.put("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const { fullName, email, bio, phone, profilePicture } = req.body;
    const userId = req.user._id;

    // Prepare update data
    const updateData = {};
    if (fullName !== undefined) updateData.username = fullName;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phoneNumber = phone;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error during profile update" });
  }
});

// Get current user profile
app.get("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

// Test route to verify server is running updated code
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is running updated code!",
    timestamp: new Date().toISOString(),
    version: "v2.0"
  });
});

// Builder SPA Routing
app.get(/^\/builder(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(builderDist, "index.html"));
});

// Main Landing Page
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log('🌐 Ready to accept connections!');
});
