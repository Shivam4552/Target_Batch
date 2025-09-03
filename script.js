// Optimized JavaScript for better performance

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimized navigation scroll effect with throttling
const navbar = document.getElementById('navbar');
const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// Optimized video overlay functionality
let videoOverlayElements = null;

function createVideoOverlay() {
    if (videoOverlayElements) return videoOverlayElements;
    
    const overlay = document.createElement('div');
    overlay.id = 'video-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: none;
        justify-content: center;
        align-items: center;
    `;
    
    const videoWrapper = document.createElement('div');
    videoWrapper.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        border-radius: 15px;
        overflow: hidden;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 30px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10000;
    `;
    
    videoWrapper.appendChild(closeButton);
    overlay.appendChild(videoWrapper);
    document.body.appendChild(overlay);
    
    return { overlay, videoWrapper, closeButton };
}

// Optimized video interactions with event delegation
document.addEventListener('click', (e) => {
    const videoContainer = e.target.closest('.video-container');
    if (!videoContainer) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const video = videoContainer.querySelector('video');
    if (!video) return;
    
    if (!videoOverlayElements) {
        videoOverlayElements = createVideoOverlay();
    }
    
    // Clone the video for overlay
    const overlayVideo = video.cloneNode(true);
    overlayVideo.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    `;
    overlayVideo.controls = true;
    overlayVideo.autoplay = true;
    overlayVideo.muted = false;
    
    // Clear previous video and add new one
    const existingVideo = videoOverlayElements.videoWrapper.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    videoOverlayElements.videoWrapper.appendChild(overlayVideo);
    videoOverlayElements.overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Pause all other videos
    document.querySelectorAll('video').forEach(v => {
        if (v !== overlayVideo) {
            v.pause();
        }
    });
    
    // Close overlay function
    function closeOverlay() {
        videoOverlayElements.overlay.style.display = 'none';
        overlayVideo.pause();
        document.body.style.overflow = '';
    }
    
    // Event listeners for closing
    overlayVideo.addEventListener('ended', closeOverlay);
    videoOverlayElements.closeButton.onclick = closeOverlay;
    videoOverlayElements.overlay.onclick = (e) => {
        if (e.target === videoOverlayElements.overlay) {
            closeOverlay();
        }
    };
    
    // ESC key to close
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeOverlay();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
});

// Optimized hover effects with CSS instead of JS where possible
const videoContainers = document.querySelectorAll('.video-container');
videoContainers.forEach((container) => {
    container.addEventListener('mouseenter', () => {
        container.style.transform = 'scale(1.05)';
        container.style.zIndex = '10';
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.transform = '';
        container.style.zIndex = '';
    });
});

// Smooth scrolling for navigation links
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Add minimal CSS animations
const style = document.createElement('style');
style.textContent = `
    .video-container {
        transition: transform 0.3s ease, z-index 0.3s ease;
    }
    
    .video-container:hover {
        box-shadow: 0 25px 60px rgba(124, 58, 237, 0.4);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);