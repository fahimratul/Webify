import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "backend/.env") });

// Fix DNS for Windows
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import Template from "./backend/models/Template.js";
import User from "./backend/models/User.js";

const defaultTemplates = [
  {
    title: "Modern Dashboard UI Kit",
    description:
      "A sleek and modern dashboard UI kit with sidebar navigation, stat cards, and responsive layout.",
    type: "paid",
    price: 41,
    category: "dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    tags: ["dashboard", "ui-kit", "admin"],
    html: `<div class="dashboard"><header class="dashboard-header"><h1>Dashboard</h1><div class="user-info"><span>Welcome, User</span></div></header><div class="dashboard-content"><aside class="sidebar"><nav class="nav-menu"><a href="#" class="nav-item active">Home</a><a href="#" class="nav-item">Analytics</a><a href="#" class="nav-item">Reports</a><a href="#" class="nav-item">Settings</a></nav></aside><main class="main-content"><div class="cards-grid"><div class="card"><h3>Total Users</h3><p class="stat-number">1,234</p></div><div class="card"><h3>Revenue</h3><p class="stat-number">$45,678</p></div><div class="card"><h3>Growth</h3><p class="stat-number">+23%</p></div></div></main></div></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; } .dashboard { height: 100vh; display: flex; flex-direction: column; } .dashboard-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; } .dashboard-header h1 { font-size: 1.75rem; } .dashboard-content { display: flex; flex: 1; } .sidebar { width: 250px; background: white; border-right: 1px solid #e0e0e0; padding: 1.5rem 0; } .nav-menu { display: flex; flex-direction: column; } .nav-item { padding: 0.75rem 1.5rem; color: #666; text-decoration: none; transition: all 0.3s; border-left: 3px solid transparent; } .nav-item:hover { background: #f0f0f0; color: #667eea; } .nav-item.active { color: #667eea; border-left-color: #667eea; background: #f8f9ff; } .main-content { flex: 1; padding: 2rem; } .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; } .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } .card h3 { color: #666; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem; } .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }`,
    rating: 4.8,
    downloads: 1234,
    likes: 523,
  },
  {
    title: "Website Template Pack",
    description:
      "A complete website landing page template with hero section, navigation, and feature cards.",
    type: "free",
    price: 0,
    category: "webpage",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop",
    tags: ["website", "landing-page", "template"],
    html: `<div class="landing-page"><header class="header"><nav class="navbar"><div class="logo">MyWebsite</div><ul class="nav-links"><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#services">Services</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><section class="hero"><h1>Welcome to Our Website</h1><p>Create amazing web experiences</p><button class="cta-button">Get Started</button></section><section class="features" id="about"><h2>Our Features</h2><div class="feature-cards"><div class="feature"><h3>Fast</h3><p>Lightning quick performance</p></div><div class="feature"><h3>Responsive</h3><p>Works on all devices</p></div><div class="feature"><h3>Modern</h3><p>Latest design trends</p></div></div></section></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; } .header { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); } .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; max-width: 1200px; margin: 0 auto; } .logo { font-size: 1.5rem; font-weight: bold; color: #667eea; } .nav-links { display: flex; list-style: none; gap: 2rem; } .nav-links a { text-decoration: none; color: #333; transition: color 0.3s; } .nav-links a:hover { color: #667eea; } .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 5rem 1rem; } .hero h1 { font-size: 3rem; margin-bottom: 1rem; } .hero p { font-size: 1.25rem; margin-bottom: 2rem; } .cta-button { background: white; color: #667eea; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-size: 1rem; font-weight: bold; cursor: pointer; } .features { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; } .features h2 { text-align: center; font-size: 2rem; margin-bottom: 2rem; } .feature-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; } .feature { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; text-align: center; } .feature h3 { color: #667eea; margin-bottom: 0.5rem; }`,
    rating: 4.9,
    downloads: 3421,
    likes: 892,
  },
  {
    title: "Mobile App Interface",
    description:
      "A mobile messaging app UI mockup with phone frame, message list, and clean design.",
    type: "paid",
    price: 79,
    category: "dashboard",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    tags: ["mobile", "app", "interface", "messaging"],
    html: `<div class="mobile-interface"><div class="phone-frame"><div class="phone-header"><span class="time">9:41</span></div><div class="phone-content"><h2>Messages</h2><div class="message-list"><div class="message-item"><div class="avatar">A</div><div class="message-preview"><h4>Alice</h4><p>Hey! How are you?</p></div></div><div class="message-item"><div class="avatar">B</div><div class="message-preview"><h4>Bob</h4><p>Let's meet tomorrow</p></div></div></div></div></div></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; } .mobile-interface { padding: 2rem; } .phone-frame { width: 375px; height: 812px; background: white; border-radius: 40px; border: 10px solid #333; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; } .phone-header { background: #f5f5f5; padding: 0.5rem; text-align: center; font-weight: bold; } .phone-content { flex: 1; padding: 1rem; overflow-y: auto; } .phone-content h2 { margin-bottom: 1rem; } .message-list { display: flex; flex-direction: column; gap: 1rem; } .message-item { display: flex; gap: 1rem; align-items: center; padding: 0.75rem; background: #f9f9f9; border-radius: 8px; } .avatar { width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; } .message-preview h4 { margin-bottom: 0.25rem; } .message-preview p { color: #999; font-size: 0.9rem; }`,
    rating: 4.7,
    downloads: 2103,
    likes: 651,
  },
  {
    title: "E-commerce Platform Kit",
    description:
      "A product showcase page with image gallery, pricing, reviews, and add-to-cart functionality.",
    type: "paid",
    price: 59,
    category: "portfolio",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab684c3c7?w=400&h=300&fit=crop",
    tags: ["ecommerce", "shop", "product"],
    html: `<div class="ecommerce"><div class="product-showcase"><div class="product-image"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" alt="Product"></div><div class="product-details"><h2>Premium Headphones</h2><div class="rating">★★★★★ (245 reviews)</div><div class="price-section"><span class="price">$199.99</span><span class="original">$249.99</span></div><p class="description">High-quality audio with noise cancellation.</p><button class="add-to-cart">Add to Cart</button></div></div></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', sans-serif; background: white; } .ecommerce { padding: 2rem; max-width: 1000px; margin: 0 auto; } .product-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; } .product-image { background: #f0f0f0; padding: 2rem; border-radius: 8px; } .product-image img { width: 100%; border-radius: 8px; } .product-details h2 { font-size: 2rem; margin-bottom: 1rem; } .rating { color: #ffc107; margin-bottom: 1rem; } .price-section { margin-bottom: 1rem; } .price { font-size: 2rem; font-weight: bold; color: #667eea; margin-right: 1rem; } .original { text-decoration: line-through; color: #999; } .description { color: #666; margin-bottom: 1.5rem; line-height: 1.6; } .add-to-cart { background: #667eea; color: white; border: none; padding: 0.75rem 2rem; border-radius: 4px; font-size: 1rem; cursor: pointer; } .add-to-cart:hover { background: #764ba2; }`,
    rating: 4.6,
    downloads: 1876,
    likes: 445,
  },
  {
    title: "Icon Library Collection",
    description:
      "A minimalist icon library grid layout with emoji icons and label text.",
    type: "free",
    price: 0,
    category: "dashboard",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    tags: ["icons", "library", "collection", "free"],
    html: `<div class="icon-library"><h1>Icon Library</h1><div class="icons-grid"><div class="icon-item"><div class="icon">📱</div><p>Mobile</p></div><div class="icon-item"><div class="icon">💻</div><p>Desktop</p></div><div class="icon-item"><div class="icon">🔧</div><p>Tools</p></div><div class="icon-item"><div class="icon">🎨</div><p>Design</p></div></div></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Arial, sans-serif; background: white; } .icon-library { padding: 2rem; text-align: center; } .icon-library h1 { margin-bottom: 2rem; color: #333; } .icons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; } .icon-item { padding: 1.5rem; } .icon { font-size: 3rem; margin-bottom: 1rem; } .icon-item p { color: #666; margin-top: 0.5rem; }`,
    rating: 4.9,
    downloads: 5234,
    likes: 1203,
  },
  {
    title: "Analytics Dashboard Pro",
    description:
      "Professional analytics dashboard with metric cards, date range selector, and growth indicators.",
    type: "paid",
    price: 89,
    category: "portfolio",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    tags: ["analytics", "dashboard", "metrics", "pro"],
    html: `<div class="analytics-dashboard"><div class="header"><h1>Analytics Dashboard</h1><div class="date-range"><select><option>Last 30 days</option></select></div></div><div class="metrics"><div class="metric-card"><div class="metric-label">Page Views</div><div class="metric-value">124,523</div><div class="metric-change">+12.5%</div></div><div class="metric-card"><div class="metric-label">Unique Users</div><div class="metric-value">45,231</div><div class="metric-change">+8.2%</div></div><div class="metric-card"><div class="metric-label">Conversion Rate</div><div class="metric-value">3.24%</div><div class="metric-change">+1.5%</div></div></div></div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; } .analytics-dashboard { padding: 2rem; max-width: 1200px; margin: 0 auto; } .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; } .header h1 { color: #333; } .date-range select { padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; } .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; } .metric-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); } .metric-label { color: #999; font-size: 0.9rem; margin-bottom: 0.5rem; } .metric-value { font-size: 2rem; font-weight: bold; color: #333; } .metric-change { color: #4caf50; margin-top: 0.5rem; font-size: 0.9rem; }`,
    rating: 4.8,
    downloads: 2567,
    likes: 734,
  },
];

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB");

    // Find or create a system user for default templates
    let systemUser = await User.findOne({ username: "Webify" });
    if (!systemUser) {
      systemUser = new User({
        username: "Webify",
        email: "webify@webify.com",
        password: "webify-system-account",
        emailVerified: true,
        bio: "Official Webify marketplace templates",
      });
      await systemUser.save();
      console.log("✅ Created system user: Webify");
    }

    // Check if templates already exist
    const existingCount = await Template.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  ${existingCount} templates already exist. Skipping seed.`,
      );
      console.log("   To re-seed, delete existing templates first.");
    } else {
      // Add author to each template
      const templatesWithAuthor = defaultTemplates.map((t) => ({
        ...t,
        author: systemUser._id,
      }));

      await Template.insertMany(templatesWithAuthor);
      console.log(
        `✅ Seeded ${templatesWithAuthor.length} marketplace templates`,
      );
    }

    await mongoose.disconnect();
    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedTemplates();
