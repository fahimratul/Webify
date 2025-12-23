# WEBIFY Dashboard - Pure HTML/CSS/JS Version

This is a pure HTML, CSS, and JavaScript implementation of the WEBIFY dashboard/user profile page. No frameworks or build tools required!

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - Interactive functionality and event handlers

## 🚀 How to Run

Simply open `index.html` in your web browser:

1. **Double-click** `index.html`, or
2. **Right-click** → Open with → Your preferred browser, or
3. Use a local server (recommended):
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   # Then open http://localhost:8000
   
   # Or use VS Code Live Server extension
   ```

## ✨ Features

### Sidebar Navigation
- Create, Market, Notification, Template, and Project sections
- Active state highlighting
- Hover effects
- User avatar at the bottom

### Main Dashboard
- **Header** with gradient title "Discover your favorite design"
- **Tab switching** between "Your Design" and "Template"
- **Search bar** with filter button
- **Last Saved section** displaying:
  - Recent projects
  - Create new project button
  - File upload with drag & drop support
- **Discover Webify section** with template cards

### Interactive Features
- Click navigation items to switch sections
- Switch between tabs
- Search functionality (ready for filtering logic)
- Drag and drop file upload
- Click cards to open projects/templates
- Hover effects on all interactive elements
- Fully responsive design

## 🎨 Styling

- Purple and pink gradient theme matching WEBIFY branding
- Clean, modern card-based UI
- Smooth transitions and hover effects
- Responsive layout for mobile, tablet, and desktop
- Uses system fonts for fast loading

## 🔧 Customization

### Colors
Edit the gradient colors in `styles.css`:
```css
/* Main gradient background */
background: linear-gradient(135deg, #f3e7ff 0%, #fce7f3 50%, #dbeafe 100%);

/* Title gradient */
background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #3b82f6 100%);
```

### Icons
Icons are loaded from Lucide CDN. To change icons, edit the `data-lucide` attributes in `index.html`:
```html
<i data-lucide="icon-name"></i>
```

Browse available icons at: https://lucide.dev/icons

## 🔌 Integration Points

The code includes placeholder functions ready for integration:

### LocalStorage/IndexedDB
```javascript
function loadProjects() {
    // Connect to IndexedDB here
    return mockProjects;
}
```

### Project Editor
```javascript
function createNewProject() {
    // Redirect to website builder/editor
}

function openProject(projectId) {
    // Load project in editor
}
```

### Template Marketplace
```javascript
function loadTemplates() {
    // Connect to template API/database
    return mockTemplates;
}
```

### File Upload
```javascript
// Drag and drop handler is already implemented
// Add backend upload logic in the drop event handler
```

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with sidebar
- **Tablet** (< 768px): Condensed sidebar, adjusted spacing
- **Mobile** (< 480px): Stacked tabs, single column grid

## 🌐 Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## 🚧 Next Steps

To convert this into your full WEBIFY builder:

1. **Connect to IndexedDB** for local project storage
2. **Add project editor** functionality
3. **Implement template system** with pre-built layouts
4. **Add export functionality** to generate static HTML/CSS/JS
5. **Integrate LLM assistant** for writing help
6. **Build component library** (drag-and-drop elements)

## 📝 Notes

- All interactions currently show console logs and alerts
- Mock data is provided for demonstration
- Drag and drop is fully functional
- Search filtering logic is ready to be implemented
- Icons load from CDN (no local dependencies needed)

## 🎯 WEBIFY Project Goals

This dashboard serves as the entry point for:
- Creating new websites
- Managing existing projects
- Discovering and using templates
- Accessing the community marketplace
- Viewing notifications and updates

Perfect for students, freelancers, and creators who want a simple, privacy-first website builder!
