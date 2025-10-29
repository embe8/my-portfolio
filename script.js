class Desktop {
    constructor() {
        // State
        this.openWindows = [];
        this.activeWindow = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.currentWindow = null;
        this.windowCounter = 0;
        this.windows = [];


        // DOM element references
        this.desktopElement = null;
        this.loadingScreen = null;
        this.dekstopIcons = null;
        this.audioPlayer = null;
        this.taskbar = null;
        this.startButton = null;

        // Audio properties
        this.audio = null;
        this.isAudioPlaying = false;

        this.init();
    }

    init() {
        this.cacheDOMelements();
        this.setupEventListeners();
        this.setupDesktopIconListeners(); 
        this.animateDesktopIcons();
    }

    cacheDOMelements() {
        this.windowsContainer = document.querySelector('.windows-container');
        this.desktopElement = document.querySelector('.desktop');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.audioPlayer = document.querySelector('.audio-player');
        this.taskbar = document.querySelector('.taskbar');
        this.startButton = document.querySelector('.start-button');
        this.audio = document.getElementById('background-music');
        this.playPauseButton = document.querySelector('.play-pause-button');
        this.desktopIcons = document.querySelectorAll('.desktop-icon'); // Multiple icons
    }

    setupEventListeners() {

         // Audio player controls
        const playButton = document.querySelector('.play-pause-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                this.toggleMusic();
            });
        }

        // Start button
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.handleStartButtonClick();
            });
        }

        // Close windows when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.window') && !e.target.closest('.desktop-icon')) {
                this.closeAllWindows();
            }
        });
    }
    

    handleIconClick(icon) {
        const fileType = icon.dataset.file;
        console.log(`Opening file: ${fileType}`);
        // Add visual feedback
        this.highlightIcon(icon);
        // Open corresponding window
        this.openWindow(fileType);
    }

    setupDesktopIconListeners() {
        const desktopIconsParent = document.querySelector('.desktop-icons');
        if (!desktopIconsParent) return;
        if (desktopIconsParent._delegated) return;
        
        desktopIconsParent.addEventListener('click', (e) => {
            const icon = e.target.closest('.desktop-icon');
            if (icon) {
                e.preventDefault();
                e.stopPropagation();
                this.selectIcon(icon);
                this.openFile(icon.dataset.file);
            }
        });
        desktopIconsParent._delegated = true;
    }

    animateDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
            icon.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            icon.style.pointerEvents = 'auto'; 
            icon.style.cursor = 'pointer'; 
            icon.style.zIndex = '300'; 
            
            setTimeout(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    selectIcon(icon){
        this.deselectAllIcons();
        icon.classList.add('selected');
        //this.createHoverEffect(icons);
    }

    deselectAllIcons(){
        const icons = document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    createHoverEffect(icon){

    }

    openFile(file) {
        console.log(`Opening file: ${file}`);
        this.openWindow(file);
    }

    closeAllWindows() {
        // Close all windows in the windows array
        this.windows.forEach(window => {
            if (window && window.parentNode) {
                window.parentNode.removeChild(window);
            }
        });
        
        // Clear the windows array
        this.windows = [];
        
        // Reset active window
        this.activeWindow = null;
        
        // Also clear the openWindows array if it exists
        if (this.openWindows) {
            this.openWindows = [];
        }
        if (this.currentWindow) {
            this.currentWindow = null;
        }
    }

    openWindow(file) {
        // close existing windows first
        //this.closeAllWindows();

        // get window data
        const windowData = this.getWindow(file);
        if (!windowData) return;

        // create window element
        const windowId = `window-${++this.windowCounter}`;
        const windowElement = this.createWindow(windowData, windowId);
        windowElement.id = windowId;

        // Set initial position (center of screen)
        const centerX = window.innerWidth / 2 - windowData.width / 2;
        const centerY = window.innerHeight / 2 - windowData.height / 2;
        windowElement.style.left = `${centerX}px`;
        windowElement.style.top = `${centerY}px`;

        // add to dom
        const windowsContainer = document.querySelector('.windows-container');
        windowsContainer.appendChild(windowElement);

        this.makeWindowDraggable(windowElement);
        this.makeWindowResizable(windowElement);

        // show window with animation
        setTimeout(() => {
            windowElement.classList.add('active');
        }, 10);

        // Add to open windows array

    this.windows.push({
        id: windowElement.id,
        element: windowElement,
        title: windowData.title,
        isMaximized: false
    });  
    
    console.log(windowElement.id);
console.log(this.windows.length)
    
    this.currentWindow = windowElement;
    this.activeWindow = windowElement;

        // center window
        //this.centerWindow(windowElement);

    }

    createWindowsContainer() {
        const container = document.createElement('div');
        container.id = 'windows-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.querySelector('.desktop').appendChild(container);
        return container;
    }
    
    createWindow(windowData, windowId) {
        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.fileType = windowData.title;
        window.style.width = windowData.width + 'px';
        window.style.height = windowData.height + 'px';
        
        window.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <span>📄</span>
                ${windowData.title}
            </div>
            <div class="window-controls">
                <div class="window-control minimize" data-action="minimize"></div>
                <div class="window-control maximize" data-action="maximize"></div>
                <div class="window-control close" data-action="close"></div>
            </div>
        </div>
        <div class="window-content">
            ${windowData.content}
        </div>
        </div>
    `;

        // Add event listeners for window controls
        this.addWindowEventListeners(window, windowId);
        
        return window;
    }
    

setActiveWindow(id) {
    this.deselectAllIcons();
    const window = this.windowsContainer.find(w => w.id === id);
    if (!window) return;
    window.element.classList.add('active');
    this.currentWindow = window;
    console.log(window.id);

}

addWindowEventListeners(window, windowId) {
    window.querySelectorAll('.window-control').forEach(control => {
        control.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = control.dataset.action;
            
            switch (action) {
                case 'close':
                    this.closeWindow(windowId);
                    break;
                case 'minimize':
                    this.minimizeWindow(windowId);
                    break;
                case 'maximize':
                    this.toggleMaximizeWindow(windowId);
                    break;
            }
        });
    });
    
    window.addEventListener('click', () => {
        this.setActiveWindow(windowId);
    });
}

makeWindowDraggable(window) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    const header = window.querySelector('.window-header');
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-control')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current position, defaulting to 0 if not set
        startLeft = parseInt(window.style.left, 10) || 0;
        startTop = parseInt(window.style.top, 10) || 0;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        e.preventDefault();
    });
    
    function onMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        window.style.left = `${startLeft + deltaX}px`;
        window.style.top = `${startTop + deltaY}px`;
    }
    
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

makeWindowResizable(window, windowId) {
    const resizeHandle = window.querySelector('.window-resize-handle');
    if (!resizeHandle) return;
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '18px';
    resizeHandle.style.height = '18px';
    resizeHandle.style.right = '2px';
    resizeHandle.style.bottom = '2px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.zIndex = '420';
    resizeHandle.style.background = 'rgba(102,126,234,0.15)';
    resizeHandle.style.borderRadius = '4px';
    resizeHandle.style.display = 'block';
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.style.width, 10);
        startHeight = parseInt(window.style.height, 10);
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    const onMouseMove = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        window.style.width = Math.max(400, startWidth + dx) + 'px';
        window.style.height = Math.max(300, startHeight + dy) + 'px';
    };
    const onMouseUp = () => {
        isResizing = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
}

setActiveWindow(windowId) {
    console.log(windowId);
    this.windows.forEach(win => {
        win.element.style.zIndex = this.windowZIndex;
        win.element.classList.remove('active-window');
    });
    
    const window = this.windows.find(win => win.id === windowId);
    if (window) {
        this.windowZIndex += 1;
        window.element.style.zIndex = this.windowZIndex;
        window.element.classList.add('active-window');
        this.activeWindow = windowId;
        
        const windowIndex = this.windows.findIndex(win => win.id === windowId);
        if (windowIndex > -1) {
            const [movedWindow] = this.windows.splice(windowIndex, 1);
            this.windows.push(movedWindow);
        }
        
        //this.updateTaskbar();
        this.addWindowFocusEffect(window.element);
    }
}

addWindowFocusEffect(windowElement) {
    windowElement.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    windowElement.style.boxShadow = `
        0 20px 60px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        0 0 20px rgba(102, 126, 234, 0.2)
    `;
    windowElement.style.transform = 'scale(1.01)';
    
    setTimeout(() => {
        windowElement.style.transform = 'scale(1)';
    }, 300);
}

closeWindow(windowId) {
    console.log(windowId);
    console.log(this.windows.length);
    const windowIndex = this.windows.findIndex(win => win.id === windowId);
    if (windowIndex !== -1) {
        const window = this.windows[windowIndex];
        
        //this.removeTaskbarItem(windowId);
        
        window.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        window.element.style.transform = 'scale(0)';
        window.element.style.opacity = '0';
        
        setTimeout(() => {
            window.element.remove();
        }, 300);
        
        this.windows.splice(windowIndex, 1);
        
        if (this.windows.length > 0) {
            this.setActiveWindow(this.windows[this.windows.length - 1].id);
        } else {
            this.activeWindow = null;
        }
        
    }
}



    getWindow(file) {
        const window = {
            about: {
                title: 'About Me.txt',
                content: this.getAboutMeData(),
                width: 400,
                height: 300
            },
            projects: {
                title: 'Projects.txt',
                content: this.getProjectsData(),
                width: 600,
                height: 400
            },
            resume: {
                title: 'Resume.docx',
                content: this.getResumeData(),
                width: 800,
                height: 600
            },
            contact: {
                title: 'Contact.txt',
                content: this.getContactData(),
                width: 400,
                height: 300
            },
            skills:{
                title: 'Skills.txt',
                content: this.getSkillsData(),
                width: 400,
                height: 300
            },
            experience: {
                title: 'Experience.txt',
                content: 'No experience yet',
                width: 400,
                height: 300
            }
        };
        return window[file] || null;

    }

    getAboutMeData() {
        return `
            <div class="about-me-content">
                <h1>About Me</h1>
                <p>Hello! I'm Erika, a passionate developer with a love for creating beautiful and functional web experiences.</p>
                <p>I specialize in frontend development and user interface design.</p>
            </div>
        `;
    }

    getProjectsData() {
        return '<div class="projects-content"><h1>My Projects</h1><p>Here are some of my recent projects...</p></div>';
    }
    
    getResumeData() {
        return '<div class="resume-content"><h1>Resume</h1><p>My professional experience and skills...</p></div>';
    }
    
    getContactData() {
        return '<div class="contact-content"><h1>Contact Me</h1><p>Get in touch with me...</p></div>';
    }
    
    getSkillsData() {
        return '<div class="skills-content"><h1>Skills</h1><p>My technical skills and expertise...</p></div>';
    }

}
// Initialize desktop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new Desktop();
    console.log('Desktop initialized');
});