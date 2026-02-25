let userType = null;
let currentView = 'builder';
let components = [];
let portfolio = {
    title: 'My Portfolio',
    selectedComponents: []
};
let droppedComponents = [];
let currentEditingComponent = null;
let zIndexCounter = 1;
let isDragging = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let layoutMode = 'free'; // 'flow' or 'free'
let canvasDimensions = {
    width: 1200,
    height: 800,
    autoHeight: false
};

function openSettings(){
    // Set current canvas dimensions
    document.getElementById('canvasWidth').value = canvasDimensions.width;
    document.getElementById('canvasHeight').value = canvasDimensions.height;
    
    // Set active layout mode button
    updateLayoutModeButtons();
    
    document.getElementById('settingsModal').classList.remove('hidden');
}

function publishfile() {
    document.getElementById('publishModal').classList.remove('hidden');
}

function closePublishModal() {
    document.getElementById('publishModal').classList.add('hidden');
}


function closeSettings(){
    document.getElementById('settingsModal').classList.add('hidden');
}

function applyCanvasSettings() {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    
    canvasDimensions.width = width;
    canvasDimensions.height = height;
    
    const canvas = document.getElementById('canvas');
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    closeSettings();
}

function setLayoutMode(mode) {
    layoutMode = mode;
    updateLayoutModeButtons();
    
    const canvas = document.getElementById('canvas');
    if (mode === 'flow') {
        canvas.style.display = 'flex';
        canvas.style.flexDirection = 'column';
        canvas.style.gap = '1rem';
    } else {
        canvas.style.display = 'block';
        canvas.style.position = 'relative';
    }
}

function updateLayoutModeButtons() {
    const flowBtn = document.getElementById('flowModeBtn');
    const freeBtn = document.getElementById('freeModeBtn');
    
    if (layoutMode === 'flow') {
        flowBtn.classList.add('active');
        freeBtn.classList.remove('active');
    } else {
        flowBtn.classList.remove('active');
        freeBtn.classList.add('active');
    }
}

function openDeviceSelector() {
    document.getElementById('deviceSelectorModal').classList.remove('hidden');
    // Reinitialize icons in the modal
    setTimeout(() => lucide.createIcons(), 10);
}

function closeDeviceSelector() {
    document.getElementById('deviceSelectorModal').classList.add('hidden');
}

function setCanvasDevice(device) {
    const canvas = document.getElementById('canvas');
    const deviceDimensions = {
        desktop: { width: 1920, height: 1080 },
        laptop: { width: 1366, height: 768 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 375, height: 667 }
    };
    
    const dimensions = deviceDimensions[device];
    canvasDimensions.width = dimensions.width;
    canvasDimensions.height = dimensions.height;
    
    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';
    
    // Update active state on device buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-device="${device}"]`).classList.add('active');
    
    closeDeviceSelector();
}

// Basic Components (User can edit)
const basicComponents = [
    {
        id: 'basic-1',
        name: 'Text Paragraph',
        category: 'basic',
        description: 'Simple text paragraph',
        html: '<p>Click edit to change this text</p>',
        css: 'p { line-height: 1.6; }',
        editable: true
    },
    {
        id: 'basic-2',
        name: 'Heading',
        category: 'basic',
        description: 'Heading text',
        html: '<h2>Your Heading Here</h2>',
        css: 'h2 { font-weight: bold; margin-bottom: 0.5rem; }',
        editable: true
    },
    {
        id: 'basic-3',
        name: 'Button',
        category: 'basic',
        description: 'Clickable button',
        html: '<button>Click Me</button>',
        css: 'button { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true
    },
    {
        id: 'basic-4',
        name: 'Image',
        category: 'basic',
        description: 'Image placeholder',
        html: '<div class="img-placeholder">🖼️ Image</div>',
        css: '.img-placeholder { display: flex; align-items: center; justify-content: center; background: #e2e8f0; padding: 2rem; border-radius: 8px; }',
        editable: true
    },
    {
        id: 'basic-5',
        name: 'Table',
        category: 'basic',
        description: 'Simple table',
        html: '<table><tr><th>Column 1</th><th>Column 2</th></tr><tr><td>Data 1</td><td>Data 2</td></tr></table>',
        css: 'table { width: 100%; border-collapse: collapse; } th, td { padding: 0.5rem; border: 1px solid #ddd; text-align: left; } th { background: #f7fafc; font-weight: 600; }',
        editable: true
    },
    {
        id: 'basic-6',
        name: 'Div Container',
        category: 'basic',
        description: 'Empty container',
        html: '<div class="container">Container Content</div>',
        css: '.container { padding: 1rem; background: #f7fafc; border-radius: 8px; }',
        editable: true
    }
];

// Sample Components Data
const sampleComponents = [
    {
        id: 1,
        name: 'Modern Navbar',
        category: 'navbar',
        description: 'Clean navigation bar with logo',
        html: '<nav class="navbar">\n  <div class="logo">MyBrand</div>\n  <ul class="nav-links">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#projects">Projects</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>',
        css: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\n.logo {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.nav-links {\n  display: flex;\n  gap: 2rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.nav-links a {\n  color: white;\n  text-decoration: none;\n  transition: opacity 0.3s;\n}\n\n.nav-links a:hover {\n  opacity: 0.8;\n}'
    },
    {
        id: 2,
        name: 'Hero Section',
        category: 'hero',
        description: 'Eye-catching hero with CTA',
        html: '<section class="hero">\n  <h1>Welcome to My Portfolio</h1>\n  <p>I create amazing web experiences</p>\n  <button class="cta-btn">View My Work</button>\n</section>',
        css: '.hero {\n  text-align: center;\n  padding: 6rem 2rem;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\n.hero h1 {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  animation: fadeInUp 1s;\n}\n\n.hero p {\n  font-size: 1.5rem;\n  margin-bottom: 2rem;\n  opacity: 0.9;\n}\n\n.cta-btn {\n  padding: 1rem 2rem;\n  font-size: 1.1rem;\n  background: white;\n  color: #667eea;\n  border: none;\n  border-radius: 50px;\n  cursor: pointer;\n  transition: transform 0.3s;\n}\n\n.cta-btn:hover {\n  transform: scale(1.05);\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}'
    },
    {
        id: 3,
        name: 'About Me Card',
        category: 'about',
        description: 'Profile card with bio',
        html: '<section class="about">\n  <div class="about-card">\n    <div class="avatar">JD</div>\n    <h2>About Me</h2>\n    <p>Hi! I\'m a passionate developer who loves creating beautiful and functional websites. With expertise in modern web technologies, I turn ideas into reality.</p>\n  </div>\n</section>',
        css: '.about {\n  padding: 4rem 2rem;\n  background: #f7fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.about-card {\n  max-width: 600px;\n  background: white;\n  padding: 3rem;\n  border-radius: 15px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n  text-align: center;\n}\n\n.avatar {\n  width: 100px;\n  height: 100px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  font-weight: bold;\n  margin: 0 auto 2rem;\n}\n\n.about-card h2 {\n  margin-bottom: 1rem;\n  color: #2d3748;\n}\n\n.about-card p {\n  color: #4a5568;\n  line-height: 1.6;\n}'
    },
    {
        id: 4,
        name: 'Project Grid',
        category: 'projects',
        description: 'Grid layout for projects',
        html: '<section class="projects">\n  <h2>My Projects</h2>\n  <div class="project-grid">\n    <div class="project-card">\n      <div class="project-img">🎨</div>\n      <h3>Project 1</h3>\n      <p>Amazing web application</p>\n    </div>\n    <div class="project-card">\n      <div class="project-img">🚀</div>\n      <h3>Project 2</h3>\n      <p>Mobile-first design</p>\n    </div>\n    <div class="project-card">\n      <div class="project-img">💡</div>\n      <h3>Project 3</h3>\n      <p>Innovative solution</p>\n    </div>\n  </div>\n</section>',
        css: '.projects {\n  padding: 4rem 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.projects h2 {\n  text-align: center;\n  margin-bottom: 3rem;\n  font-size: 2.5rem;\n  color: #2d3748;\n}\n\n.project-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 2rem;\n}\n\n.project-card {\n  background: white;\n  padding: 2rem;\n  border-radius: 15px;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.1);\n  transition: transform 0.3s;\n  text-align: center;\n}\n\n.project-card:hover {\n  transform: translateY(-10px);\n}\n\n.project-img {\n  font-size: 4rem;\n  margin-bottom: 1rem;\n}\n\n.project-card h3 {\n  margin-bottom: 0.5rem;\n  color: #2d3748;\n}\n\n.project-card p {\n  color: #718096;\n}'
    },
    {
        id: 5,
        name: 'Contact Footer',
        category: 'footer',
        description: 'Footer with contact info',
        html: '<footer class="footer">\n  <div class="footer-content">\n    <h3>Get In Touch</h3>\n    <p>email@example.com</p>\n    <div class="social-links">\n      <a href="#">LinkedIn</a>\n      <a href="#">GitHub</a>\n      <a href="#">Twitter</a>\n    </div>\n    <p class="copyright">© 2024 My Portfolio. All rights reserved.</p>\n  </div>\n</footer>',
        css: '.footer {\n  background: #2d3748;\n  color: white;\n  padding: 3rem 2rem;\n  text-align: center;\n}\n\n.footer-content {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.footer h3 {\n  margin-bottom: 1rem;\n  font-size: 1.8rem;\n}\n\n.footer p {\n  margin-bottom: 1rem;\n  opacity: 0.9;\n}\n\n.social-links {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n  margin: 2rem 0;\n}\n\n.social-links a {\n  color: white;\n  text-decoration: none;\n  padding: 0.5rem 1rem;\n  border: 2px solid white;\n  border-radius: 5px;\n  transition: all 0.3s;\n}\n\n.social-links a:hover {\n  background: white;\n  color: #2d3748;\n}\n\n.copyright {\n  margin-top: 2rem;\n  font-size: 0.9rem;\n  opacity: 0.7;\n}'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
     lucide.createIcons();
    components = [...sampleComponents];

    const fontSizeSlider = document.getElementById('customFontSize');
    const borderRadiusSlider = document.getElementById('customBorderRadius');
    const opacitySlider = document.getElementById('customOpacity');
    
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
        });
    }
    
    if (borderRadiusSlider) {
        borderRadiusSlider.addEventListener('input', (e) => {
            document.getElementById('borderRadiusValue').textContent = e.target.value + 'px';
        });
    }
    
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            document.getElementById('opacityValue').textContent = e.target.value + '%';
        });
    }
    switchView('builder')
});

function showComponentSidebar() {
    document.getElementById('componentSidebar').classList.remove('hidden');
    document.getElementById('ShowComponentSidebarIcon').classList.add('hidden');
    document.getElementById('HideComponentSidebarIcon').classList.remove('hidden');
}

function hideComponentSidebar() {
    document.getElementById('componentSidebar').classList.add('hidden');
    document.getElementById('ShowComponentSidebarIcon').classList.remove('hidden');
    document.getElementById('HideComponentSidebarIcon').classList.add('hidden');
}
// Switch View
function switchView(view) {
    currentView = view;
    showView(view);

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active', 'active-user');
        if (btn.textContent.includes(getViewName(view))) {
            btn.classList.add(userType === 'developer' ? 'active' : 'active-user');
        }
    });
   if (view === 'builder') {
        renderBuilder();
    } else if (view === 'preview') {
        renderPortfolioPreview();
    }
}

function getViewName(view) {
    const names = {
        'builder': 'Builder',
        'preview': 'Preview'
    };
    return names[view] || '';
}

// Show View
function showView(view) {
    if (view === 'builder') {
            document.getElementById('builderView').classList.remove('hidden');
            document.getElementById('previewView').classList.add('hidden');
    } else if (view === 'preview') {
            document.getElementById('previewView').classList.remove('hidden');
            document.getElementById('builderView').classList.add('hidden');
    }
}

function renderBuilder() {
    const componentList = document.getElementById('componentList');
    if (!componentList) return;
    
    componentList.innerHTML = '';
    
    // Add Basic Components Section
    const basicSection = document.createElement('div');
    basicSection.className = 'component-section';
    basicSection.innerHTML = '<h4 class="section-title">📦 Basic Components</h4>';
    componentList.appendChild(basicSection);
    
    basicComponents.forEach(component => {
        const item = createDraggableComponent(component);
        componentList.appendChild(item);
    });
    
    // Add Developer Components Section
    if (components.length > 0) {
        const devSection = document.createElement('div');
        devSection.className = 'component-section';
        devSection.innerHTML = '<h4 class="section-title">💻 Developer Components</h4>';
        componentList.appendChild(devSection);
        
        components.forEach(component => {
            const item = createDraggableComponent(component);
            componentList.appendChild(item);
        });
    }
    
    // Setup canvas
    setupCanvas();
    applyCanvasDimensions();
    renderCanvasComponents();
}

// Create Draggable Component
function createDraggableComponent(component) {
    const item = document.createElement('div');
    item.className = 'draggable-component';
    item.draggable = true;
    item.dataset.componentId = component.id;
    
    // Create mini preview
    const previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    transform: scale(0.3); 
                    transform-origin: top left; 
                    width: 333%; 
                    height: 333%;
                }
                ${component.css}
            </style>
        </head>
        <body>${component.html}</body>
        </html>
    `;
    
    item.innerHTML = `
        <div class="component-mini-preview">
            <iframe srcdoc="${previewHTML.replace(/"/g, '&quot;')}" sandbox="allow-same-origin"></iframe>
        </div>
        <div class="component-mini-info">
            <h4>${component.name}</h4>
            <p>${component.category}</p>
        </div>
    `;
    
    // Drag events
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('componentId', component.id);
        e.dataTransfer.setData('componentType', component.category === 'basic' ? 'basic' : 'developer');
    });
    
    return item;
}

// Setup Canvas
function setupCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        
        const componentId = e.dataTransfer.getData('componentId');
        const componentType = e.dataTransfer.getData('componentType');
        
        let component;
        if (componentType === 'basic') {
            component = basicComponents.find(c => c.id === componentId);
        } else {
            component = components.find(c => c.id == componentId);
        }
        
        if (component) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            addComponentToCanvas(component, x, y);
        }
    });
}

// Add Component to Canvas
function addComponentToCanvas(component, x, y) {
    const canvas = document.getElementById('canvas');
    const emptyState = canvas.querySelector('.canvas-empty-state');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const droppedComponent = {
        id: 'dropped-' + Date.now(),
        sourceId: component.id,
        name: component.name,
        html: component.html,
        css: component.css,
        editable: component.editable || false,
        category: component.category,
        order: droppedComponents.length,
        // Free mode properties
        x: layoutMode === 'free' ? Math.max(0, x - 150) : 0,
        y: layoutMode === 'free' ? Math.max(0, y - 100) : 0,
        width: 300,
        height: 200,
        zIndex: zIndexCounter++,
        styles: {
            backgroundColor: 'transparent',
            color: '#000000',
            fontSize: 16,
            borderRadius: 0,
            opacity: 1
        }
    };
    
    droppedComponents.push(droppedComponent);
    renderCanvasComponents();
}

// Render Canvas Components
function renderCanvasComponents() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    // Remove all component elements except empty state
    const existingComponents = canvas.querySelectorAll('.dropped-component');
    existingComponents.forEach(comp => comp.remove());
    
    // Sort by order for flow mode, by zIndex for free mode
    const sortedComponents = layoutMode === 'flow' 
        ? [...droppedComponents].sort((a, b) => a.order - b.order)
        : [...droppedComponents].sort((a, b) => a.zIndex - b.zIndex);
    
    sortedComponents.forEach((component, index) => {
        const componentDiv = document.createElement('div');
        componentDiv.className = layoutMode === 'flow' ? 'dropped-component flow-mode' : 'dropped-component free-mode';
        componentDiv.dataset.id = component.id;
        componentDiv.dataset.order = component.order;
        
        // Set positioning for free mode
        if (layoutMode === 'free') {
            componentDiv.style.left = component.x + 'px';
            componentDiv.style.top = component.y + 'px';
            componentDiv.style.width = component.width + 'px';
            componentDiv.style.height = component.height + 'px';
            componentDiv.style.zIndex = component.zIndex;
        }
        
        // Create preview iframe
        const previewHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background-color: ${component.styles.backgroundColor};
                        color: ${component.styles.color};
                        font-size: ${component.styles.fontSize}px;
                        opacity: ${component.styles.opacity};
                    }
                    ${component.css}
                </style>
            </head>
            <body>${component.html}</body>
            </html>
        `;
        
        componentDiv.innerHTML = `
            <div class="component-controls-overlay">
                <div class="component-controls-bar">
                    <span class="component-name-badge">${component.name}</span>
                    <div class="component-controls-buttons">
                        ${layoutMode === 'flow' ? `
                            <button class="btn-move-up" onclick="moveComponentUp('${component.id}')" title="Move Up">↑</button>
                            <button class="btn-move-down" onclick="moveComponentDown('${component.id}')" title="Move Down">↓</button>
                        ` : ''}
                        ${component.editable ? '<button class="btn-control-edit" onclick="editComponent(\'' + component.id + '\')">✏️</button>' : ''}
                        <button class="btn-control-customize" onclick="customizeComponent('${component.id}')">⚙️</button>
                        <button class="btn-control-delete" onclick="deleteComponent('${component.id}')">🗑️</button>
                    </div>
                </div>
            </div>
            <div class="component-preview-content">
                <iframe srcdoc="${previewHTML.replace(/"/g, '&quot;')}" sandbox="allow-same-origin"></iframe>
            </div>
            ${layoutMode === 'free' ? '<div class="component-resize-handle"></div>' : ''}
        `;
        
        canvas.appendChild(componentDiv);
        
        // Add interaction handlers for free mode
        if (layoutMode === 'free') {
            makeDraggable(componentDiv, component);
            makeResizable(componentDiv, component);
        }
    });
    
    // Update canvas class
    canvas.className = layoutMode === 'flow' ? 'white-canvas flow-mode' : 'white-canvas free-mode';
}

// Set Layout Mode
function setLayoutMode(mode) {
    layoutMode = mode;
    
    // Update button states
    document.getElementById('flowModeBtn').classList.toggle('active', mode === 'flow');
    document.getElementById('freeModeBtn').classList.toggle('active', mode === 'free');
    
    // Re-render components
    renderCanvasComponents();
}

// Make Draggable (Free Mode)
function makeDraggable(element, component) {
    const header = element.querySelector('.component-controls-bar');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    const handleMouseDown = (e) => {
        if (e.target.closest('.component-controls-buttons')) return; // Don't drag when clicking buttons
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = component.x;
        initialY = component.y;
        
        element.style.cursor = 'grabbing';
        e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        component.x = initialX + deltaX;
        component.y = initialY + deltaY;
        
        element.style.left = component.x + 'px';
        element.style.top = component.y + 'px';
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = '';
        }
    };
    
    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

// Make Resizable (Free Mode)
function makeResizable(element, component) {
    const handle = element.querySelector('.component-resize-handle');
    if (!handle) return;
    
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    const handleMouseDown = (e) => {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = component.width;
        startHeight = component.height;
        e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        component.width = Math.max(100, startWidth + deltaX);
        component.height = Math.max(50, startHeight + deltaY);
        
        element.style.width = component.width + 'px';
        element.style.height = component.height + 'px';
    };
    
    const handleMouseUp = () => {
        isResizing = false;
    };
    
    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

// Customize Component
function customizeComponent(id) {
    const component = droppedComponents.find(c => c.id === id);
    if (component) {
        currentEditingComponent = component;
        showCustomizationModal(component);
    }
}

// Show Customization Modal
function showCustomizationModal(component) {
    const modal = document.getElementById('customizationModal');
    modal.classList.remove('hidden');
    
    // Show/hide HTML editor based on editable property
    const htmlSection = document.getElementById('htmlEditorSection');
    const htmlTextarea = document.getElementById('customHtml');
    if (component.editable) {
        htmlSection.classList.remove('hidden');
        htmlTextarea.value = component.html;
    } else {
        htmlSection.classList.add('hidden');
    }
    
    // Set current values
    document.getElementById('customBgColor').value = component.styles.backgroundColor === 'transparent' ? '#ffffff' : component.styles.backgroundColor;
    document.getElementById('customTextColor').value = component.styles.color;
    document.getElementById('customFontSize').value = component.styles.fontSize;
    document.getElementById('fontSizeValue').textContent = component.styles.fontSize + 'px';
    document.getElementById('customBorderRadius').value = component.styles.borderRadius;
    document.getElementById('borderRadiusValue').textContent = component.styles.borderRadius + 'px';
    document.getElementById('customOpacity').value = component.styles.opacity * 100;
    document.getElementById('opacityValue').textContent = (component.styles.opacity * 100) + '%';
    
    // Show/hide width and height controls based on layout mode
    const widthControl = document.getElementById('customWidth').closest('.customization-section');
    const heightControl = document.getElementById('customHeight').closest('.customization-section');
    
    if (layoutMode === 'free') {
        widthControl.style.display = 'block';
        heightControl.style.display = 'block';
        document.getElementById('customWidth').value = component.width;
        document.getElementById('customHeight').value = component.height;
    } else {
        widthControl.style.display = 'none';
        heightControl.style.display = 'none';
    }
}

// Close Customization Modal
function closeCustomizationModal() {
    const modal = document.getElementById('customizationModal');
    modal.classList.add('hidden');
    currentEditingComponent = null;
}

// Apply Customization
function applyCustomization() {
    if (!currentEditingComponent) return;
    
    // Update HTML if editable
    if (currentEditingComponent.editable) {
        const htmlValue = document.getElementById('customHtml').value;
        currentEditingComponent.html = htmlValue;
    }
    
    // Update styles
    currentEditingComponent.styles.backgroundColor = document.getElementById('customBgColor').value;
    currentEditingComponent.styles.color = document.getElementById('customTextColor').value;
    currentEditingComponent.styles.fontSize = parseInt(document.getElementById('customFontSize').value);
    currentEditingComponent.styles.borderRadius = parseInt(document.getElementById('customBorderRadius').value);
    currentEditingComponent.styles.opacity = parseInt(document.getElementById('customOpacity').value) / 100;
    
    // Update width/height only in free mode
    if (layoutMode === 'free') {
        currentEditingComponent.width = parseInt(document.getElementById('customWidth').value);
        currentEditingComponent.height = parseInt(document.getElementById('customHeight').value);
    }
    
    renderCanvasComponents();
    closeCustomizationModal();
}

// Edit Component
function editComponent(id) {
    const component = droppedComponents.find(c => c.id === id);
    if (component) {
        currentEditingComponent = component;
        showCustomizationModal(component);
    }
}

// Delete Component
function deleteComponent(id) {
    const index = droppedComponents.findIndex(c => c.id === id);
    if (index !== -1) {
        droppedComponents.splice(index, 1);
        // Reorder remaining components
        droppedComponents.forEach((comp, idx) => {
            comp.order = idx;
        });
        renderCanvasComponents();
        
        // Show empty state if no components
        if (droppedComponents.length === 0) {
            const canvas = document.getElementById('canvas');
            const emptyState = canvas.querySelector('.canvas-empty-state');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }
}

// Move Component Up
function moveComponentUp(id) {
    const index = droppedComponents.findIndex(c => c.id === id);
    if (index > 0) {
        // Swap with previous component
        [droppedComponents[index - 1], droppedComponents[index]] = 
        [droppedComponents[index], droppedComponents[index - 1]];
        
        // Update orders
        droppedComponents.forEach((comp, idx) => {
            comp.order = idx;
        });
        
        renderCanvasComponents();
    }
}

// Move Component Down
function moveComponentDown(id) {
    const index = droppedComponents.findIndex(c => c.id === id);
    if (index < droppedComponents.length - 1) {
        // Swap with next component
        [droppedComponents[index], droppedComponents[index + 1]] = 
        [droppedComponents[index + 1], droppedComponents[index]];
        
        // Update orders
        droppedComponents.forEach((comp, idx) => {
            comp.order = idx;
        });
        
        renderCanvasComponents();
    }
}

// Clear Canvas
function clearCanvas() {
    if (confirm('Are you sure you want to clear the canvas?')) {
        droppedComponents = [];
        renderCanvasComponents();
        
        const canvas = document.getElementById('canvas');
        const emptyState = canvas.querySelector('.canvas-empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }
}

// Render Portfolio Preview
function renderPortfolioPreview() {
    const previewFrame = document.getElementById('portfolioPreviewFrame');
    
    if (droppedComponents.length === 0) {
        previewFrame.srcdoc = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#999;font-size:1.5rem;">No components to preview</div>';
        return;
    }
    
    let html, css;
    const portfolioTitle = document.getElementById('portfolioTitle')?.value || 'My Portfolio';
    
    if (layoutMode === 'flow') {
        // Flow mode - natural stacking
        const sortedComponents = [...droppedComponents].sort((a, b) => a.order - b.order);
        html = sortedComponents.map(c => c.html).join('\n\n');
        css = sortedComponents.map(c => c.css).join('\n\n');
    } else {
        // Free mode - absolute positioning
        const sortedComponents = [...droppedComponents].sort((a, b) => a.zIndex - b.zIndex);
        html = sortedComponents.map(c => `
            <div style="
                position: absolute;
                left: ${c.x}px;
                top: ${c.y}px;
                width: ${c.width}px;
                height: ${c.height}px;
                background-color: ${c.styles.backgroundColor};
                color: ${c.styles.color};
                border-radius: ${c.styles.borderRadius}px;
                opacity: ${c.styles.opacity};
                font-size: ${c.styles.fontSize}px;
                overflow: hidden;
            ">
                ${c.html}
            </div>
        `).join('\n\n');
        css = droppedComponents.map(c => c.css).join('\n\n');
    }
    
    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${portfolioTitle}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    ${layoutMode === 'free' ? 'position: relative; min-height: 100vh;' : ''}
                }
                ${css}
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;
    
    previewFrame.srcdoc = fullHTML;
}

// Canvas Settings Functions
function openCanvasSettings() {
    const modal = document.getElementById('canvasSettingsModal');
    modal.classList.remove('hidden');
    
    document.getElementById('canvasWidth').value = canvasDimensions.width;
    document.getElementById('canvasHeight').value = canvasDimensions.height;
    document.getElementById('autoHeight').checked = canvasDimensions.autoHeight;
    
    toggleAutoHeight();
}

function closeCanvasSettings() {
    const modal = document.getElementById('canvasSettingsModal');
    modal.classList.add('hidden');
}

function toggleAutoHeight() {
    const autoHeight = document.getElementById('autoHeight').checked;
    const heightInput = document.getElementById('canvasHeight');
    heightInput.disabled = autoHeight;
}

function applyCanvasSettings() {
    canvasDimensions.width = parseInt(document.getElementById('canvasWidth').value) || 1200;
    canvasDimensions.autoHeight = document.getElementById('autoHeight').checked;
    
    if (!canvasDimensions.autoHeight) {
        canvasDimensions.height = parseInt(document.getElementById('canvasHeight').value) || 800;
    }
    
    applyCanvasDimensions();
    closeCanvasSettings();
}

function applyCanvasDimensions() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    canvas.style.width = canvasDimensions.width + 'px';
    
    if (canvasDimensions.autoHeight) {
        canvas.style.height = 'auto';
        canvas.style.minHeight = '800px';
    } else {
        canvas.style.height = canvasDimensions.height + 'px';
        canvas.style.minHeight = 'unset';
    }
}

// Download Portfolio
function downloadPortfolio() {
    if (droppedComponents.length === 0) {
        alert('Please add components to the canvas first!');
        return;
    }
    
    let html, css;
    const portfolioTitle = document.getElementById('portfolioTitle')?.value || 'My Portfolio';
    
    if (layoutMode === 'flow') {
        // Flow mode - natural stacking
        const sortedComponents = [...droppedComponents].sort((a, b) => a.order - b.order);
        html = sortedComponents.map(c => c.html).join('\n\n');
        css = sortedComponents.map(c => c.css).join('\n\n');
    } else {
        // Free mode - absolute positioning
        const sortedComponents = [...droppedComponents].sort((a, b) => a.zIndex - b.zIndex);
        html = sortedComponents.map(c => `
            <div style="
                position: absolute;
                left: ${c.x}px;
                top: ${c.y}px;
                width: ${c.width}px;
                height: ${c.height}px;
                background-color: ${c.styles.backgroundColor};
                color: ${c.styles.color};
                border-radius: ${c.styles.borderRadius}px;
                opacity: ${c.styles.opacity};
                font-size: ${c.styles.fontSize}px;
                overflow: hidden;
            ">
                ${c.html}
            </div>
        `).join('\n\n');
        css = droppedComponents.map(c => c.css).join('\n\n');
    }
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ${layoutMode === 'free' ? 'position: relative; min-height: 100vh;' : ''}
        }
        ${css}
    </style>
</head>
<body>
${html}
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}