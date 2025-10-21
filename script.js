class Desktop {
    constructor() {
        // State
        this.isLoaded = false;
        this.isLoading = false;
        this.openWindows = [];
        this.currentWindow = null;

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
        this.startBootSequence();
    }

    cacheDOMelements() {
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
        this.desktopIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.handleIconClick(e.currentTarget);
            });
        });

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
        this.createHoverEffect(icons);
    }

    deselectAllIcons(){
        const icons = document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    createHoverEffect(icon){

    }

    openFile(file) {
        const fileType = file.dataset.file;
        console.log(`Opening file: ${fileType}`);
        this.openWindow(fileType);
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

    getAboutMeData(){
        return `
        <div class="about-me-content">
        <h1>
        `
    }

}
// Initialize desktop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new Desktop();
    console.log('Desktop initialized');
});