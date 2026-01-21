// Code Editor State
let editorState = JSON.parse(localStorage.getItem('previewComponent')) || {
    html: '<h1>Welcome to WEBIFY Code Editor!</h1>\n<p>Start editing your HTML code here.</p>\n<button class="btn">Click Me</button>',
    css: `h1 {
  color: #667eea;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  color: #666;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.btn {
  display: block;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}`,
    isExpanded: false
};


let defaultEditorState = { ...editorState };

// Initialize CodeMirror Editors
let htmlEditor, cssEditor;

document.addEventListener('DOMContentLoaded', () => {
    initializeEditors();
    setupTabHandlers();
    setupSyntaxHighlighting();
    loadSavedCode();
    updatePreview();
});

function initializeEditors() {
    // HTML Editor
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
        mode: 'htmlmixed',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 2,
        tabSize: 2,
        indentWithTabs: false,
        autofocus: true,
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Tab': (cm) => {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    cm.replaceSelection('  ');
                }
            }
        }
    });

    // CSS Editor
    cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
        mode: 'css',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 2,
        tabSize: 2,
        indentWithTabs: false,
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Tab': (cm) => {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    cm.replaceSelection('  ');
                }
            }
        }
    });

    // Set initial values
    htmlEditor.setValue(editorState.html);
    cssEditor.setValue(editorState.css);

    // Live preview on change
    htmlEditor.on('change', debounce(() => {
        editorState.html = htmlEditor.getValue();
        updatePreview();
    }, 300));

    cssEditor.on('change', debounce(() => {
        editorState.css = cssEditor.getValue();
        updatePreview();
    }, 300));
}

function setupTabHandlers() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const editorPanes = document.querySelectorAll('.editor-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            editorPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.querySelector(`.editor-pane[data-tab="${tabName}"]`).classList.add('active');

            // Refresh CodeMirror to adjust height
            if (tabName === 'html') {
                setTimeout(() => htmlEditor.refresh(), 0);
            } else if (tabName === 'css') {
                setTimeout(() => cssEditor.refresh(), 0);
            }
        });
    });
}

function setupSyntaxHighlighting() {
    // Syntax highlighting is already handled by CodeMirror
}

function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    
    const previewFrame = document.getElementById('previewFrame');
    const previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 1rem; }
                ${css}
            </style>
        </head>
        <body>${html}</body>
        </html>
    `;
    
    previewFrame.srcdoc = previewHTML;
}

function refreshPreview() {
    updatePreview();
    showNotification('Preview refreshed!', 'success');
}

function saveCode() {
    editorState.html = htmlEditor.getValue();
    editorState.css = cssEditor.getValue();

    // Save to localStorage
    const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Templete</title>
            <style>
                ${editorState.css}
            </style>
        </head>
        <body>
            ${editorState.html}
        </body>
        </html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.html';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showNotification('Code saved to browser storage!', 'success');
}

function loadSavedCode() {
    const savedCode = localStorage.getItem('webifyEditorCode');
    if (savedCode) {
        try {
            const parsed = JSON.parse(savedCode);
            editorState = { ...editorState, ...parsed };
        } catch (e) {
            console.error('Failed to parse saved code:', e);
        }
    }
}

function resetCode() {
    if (confirm('Are you sure you want to reset all code? This cannot be undone.')) {
        editorState = { ...defaultEditorState };
        htmlEditor.setValue(editorState.html);
        cssEditor.setValue(editorState.css);
        updatePreview();
        showNotification('Code reset to defaults!', 'warning');
    }
}

function toggleInfo() {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.classList.toggle('active');

    if (infoPanel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'hidden';
    }
}

function expandPane(paneName) {
    const pane = document.querySelector(`.editor-pane[data-tab="${paneName}"]`);
    const container = document.querySelector('.editor-container');

    if (editorState.isExpanded && editorState.expandedPane === paneName) {
        // Exit fullscreen
        editorState.isExpanded = false;
        container.style.gridTemplateColumns = '1fr 1fr';
        document.querySelector('.preview-section').style.display = 'flex';
        showNotification('Exited fullscreen', 'success');
    } else {
        // Enter fullscreen
        editorState.isExpanded = true;
        editorState.expandedPane = paneName;
        container.style.gridTemplateColumns = '1fr';
        document.querySelector('.preview-section').style.display = 'none';
        
        if (paneName === 'html') {
            setTimeout(() => htmlEditor.refresh(), 0);
        } else if (paneName === 'css') {
            setTimeout(() => cssEditor.refresh(), 0);
        }
        showNotification('Fullscreen mode enabled', 'success');
    }
}

function showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.className = `notification-toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Save Component
function handleSaveComponent() {
    const name = document.getElementById('componentName').value.trim();
    const category = document.getElementById('componentCategory').value;
    const description = document.getElementById('componentDescription').value.trim();
    const html = htmlEditor.getValue().trim();
    const css = cssEditor.getValue().trim();
    
    if (!name || !html) {
        alert('Please provide component name and HTML code');
        return;
    }
    
    const newComponent = {
        id: Date.now(),
        name,
        category,
        description,
        html,
        css
    };
    
    if (typeof components === 'undefined') {
        window.components = [];
    }
    components.push(newComponent);
    
    // Clear form
    document.getElementById('componentName').value = '';
    document.getElementById('componentDescription').value = '';
    htmlEditor.setValue('');
    cssEditor.setValue('');
    updatePreview();
    
    showNotification('Component saved successfully!', 'success');
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S: Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCode();
    }

    // Escape: Close Info Panel
    if (e.key === 'Escape') {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel.classList.contains('active')) {
            toggleInfo();
        }
    }
});

// Save code periodically
setInterval(() => {
    editorState.html = htmlEditor.getValue();
    editorState.css = cssEditor.getValue();
    localStorage.setItem('webifyEditorCode', JSON.stringify(editorState));
}, 30000); // Auto-save every 30 seconds
