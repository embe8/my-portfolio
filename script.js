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
        this.desktopIcons = document.querySelector('.desktop-icons');
        this.audioPlayer = document.querySelector('.audio-player');
        this.taskbar = document.querySelector('.taskbar');
        this.startButton = document.querySelector('.start-button');
        this.audio = document.getElementById('background-music');

    }
}