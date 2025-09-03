// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Subject tabs functionality
const subjectTabs = document.querySelectorAll('.subject-tab');
subjectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        subjectTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter cards based on selected subject
        const selectedSubject = tab.textContent.toLowerCase();
        const cards = document.querySelectorAll('.subject-card');
        cards.forEach(card => {
            const cardSubject = card.querySelector('.subject-tag').textContent.toLowerCase();
            if (selectedSubject === 'physics' || selectedSubject === 'chemistry' || selectedSubject === 'biology') {
                if (cardSubject === selectedSubject) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'block';
            }
        });
        
        // If "General Studies", "Mathematics" or "English" is selected, show all cards
        if (!['physics', 'chemistry', 'biology'].includes(selectedSubject)) {
            cards.forEach(card => card.style.display = 'block');
        }
    });
});

// Video overlay functionality
function createVideoOverlay() {
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

// Video testimonial play buttons with enhanced interactions
const videoContainers = document.querySelectorAll('.video-container');
let videoOverlayElements;

// Initialize overlay when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    videoOverlayElements = createVideoOverlay();
});

// If DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        videoOverlayElements = createVideoOverlay();
    });
} else {
    videoOverlayElements = createVideoOverlay();
}

videoContainers.forEach((container, index) => {
    const video = container.querySelector('video');
    
    // Add hover pause effect
    container.addEventListener('mouseenter', () => {
        container.style.animationPlayState = 'paused';
        container.style.transform = 'scale(1.05) rotate(0deg)';
        container.style.zIndex = '10';
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.animationPlayState = 'running';
        container.style.transform = '';
        container.style.zIndex = '';
    });
    
    // Click interaction for overlay video
    container.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Video container clicked', video); // Debug log
        
        if (video && videoOverlayElements) {
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
            
            console.log('Creating overlay video', overlayVideo); // Debug log
            
            // Clear previous video and add new one
            const existingVideo = videoOverlayElements.videoWrapper.querySelector('video');
            if (existingVideo) {
                existingVideo.remove();
            }
            
            videoOverlayElements.videoWrapper.appendChild(overlayVideo);
            videoOverlayElements.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            
            // Pause all other videos and hide background content
            document.querySelectorAll('video').forEach(v => {
                if (v !== overlayVideo) {
                    v.pause();
                }
            });
            
            // Hide videos behind overlay
            videoContainers.forEach(vc => {
                if (vc !== container) {
                    vc.style.visibility = 'hidden';
                }
            });
            
            // Close overlay function
            function closeOverlay() {
                console.log('Closing overlay'); // Debug log
                videoOverlayElements.overlay.style.display = 'none';
                overlayVideo.pause();
                document.body.style.overflow = ''; // Restore scroll
                
                // Restore visibility of all videos
                videoContainers.forEach(vc => {
                    vc.style.visibility = 'visible';
                });
            }
            
            // Handle video end
            overlayVideo.addEventListener('ended', closeOverlay);
            
            // Close button event
            videoOverlayElements.closeButton.onclick = closeOverlay;
            
            // Click overlay background to close
            videoOverlayElements.overlay.onclick = (e) => {
                if (e.target === videoOverlayElements.overlay) {
                    closeOverlay();
                }
            };
            
            // ESC key to close
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    closeOverlay();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
        } else {
            console.log('Video or overlay elements not found', {video, videoOverlayElements}); // Debug log
        }
    });
    
    // Add subtle floating effect
    const floatDelay = index * 1000; // Stagger the floating
    setTimeout(() => {
        container.style.animation += `, float${index + 1} 3s ease-in-out infinite`;
    }, floatDelay);
});

// Add custom floating animations
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes float1 {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    
    @keyframes float2 {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(5px); }
    }
    
    .video-container:hover {
        box-shadow: 0 25px 60px rgba(124, 58, 237, 0.4) !important;
        transition: all 0.3s ease !important;
    }
`;
document.head.appendChild(floatingStyle);

// Subject card interactions
const subjectCards = document.querySelectorAll('.subject-card');
subjectCards.forEach(card => {
    card.addEventListener('click', () => {
        const subject = card.querySelector('.subject-tag').textContent;
        const question = card.querySelector('.subject-question').textContent;
        alert(`Opening detailed solution for ${subject} question: "${question.substring(0, 50)}..."`);
    });
});

// Premium sidebar interactions - removed to allow natural link behavior

// Download buttons - removed event listeners to allow natural link behavior

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance cards hover effect
const performanceCards = document.querySelectorAll('.performance-card');
performanceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add entrance animations to cards
setTimeout(() => {
    document.querySelectorAll('.subject-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease forwards';
    });
}, 500);