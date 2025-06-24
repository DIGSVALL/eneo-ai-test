// Timeline Page JavaScript - Enhanced interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    initializeTimelineAnimations();
    initializeScrollAnimations();
    initializeTimelineInteractions();
});

// Initialize timeline entrance animations
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Reset animation state
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
    });
    
    // Trigger animations with staggered delays
    setTimeout(() => {
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    item.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                    }, 150);
                }, 400);
                
            }, index * 200);
        });
    }, 500);
}

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animation for learning items
                if (entry.target.classList.contains('learning-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const elementsToAnimate = document.querySelectorAll('.learning-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// Initialize interactive timeline features
function initializeTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineTrack = document.querySelector('.timeline-track');
    
    // Add hover effects and click interactions
    timelineItems.forEach((item, index) => {
        const marker = item.querySelector('.timeline-marker');
        const content = item.querySelector('.timeline-content');
        const icon = item.querySelector('.timeline-icon');
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', () => {
            // Highlight the timeline track section
            highlightTimelineSection(index);
            
            // Add glow effect to icon
            icon.style.boxShadow = '0 0 30px rgba(0, 82, 147, 0.4), 0 12px 32px rgba(0, 82, 147, 0.3)';
            
            // Subtle content enhancement
            content.style.borderColor = 'var(--primary)';
            content.style.boxShadow = '0 20px 40px rgba(0, 82, 147, 0.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset timeline track
            resetTimelineHighlight();
            
            // Reset icon glow
            icon.style.boxShadow = '0 8px 24px rgba(0, 82, 147, 0.2)';
            
            // Reset content
            content.style.borderColor = 'var(--border)';
            content.style.boxShadow = 'var(--shadow-md)';
        });
        
        // Click to expand/focus (optional future feature)
        item.addEventListener('click', () => {
            focusTimelineItem(item, index);
        });
        
        // Add keyboard navigation
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                focusTimelineItem(item, index);
            }
        });
    });
    
    // Progress tracking on scroll
    initializeProgressTracking();
}

// Highlight specific section of timeline track
function highlightTimelineSection(index) {
    const timelineTrack = document.querySelector('.timeline-track');
    if (!timelineTrack) return;
    
    // Skip highlighting on mobile to avoid visual conflicts
    if (window.innerWidth <= 767) return;
    
    // Create a temporary highlight element
    const highlight = document.createElement('div');
    highlight.className = 'timeline-highlight';
    highlight.style.cssText = `
        position: absolute;
        left: -2px;
        width: 8px;
        background: linear-gradient(to bottom, var(--primary-light), var(--primary));
        border-radius: 4px;
        transition: all 0.3s ease;
        top: ${index * 25}%;
        height: 25%;
        box-shadow: 0 0 20px rgba(0, 82, 147, 0.5);
    `;
    
    // Remove existing highlights
    const existingHighlight = timelineTrack.querySelector('.timeline-highlight');
    if (existingHighlight) {
        existingHighlight.remove();
    }
    
    timelineTrack.appendChild(highlight);
}

// Reset timeline track highlight
function resetTimelineHighlight() {
    const highlight = document.querySelector('.timeline-highlight');
    if (highlight) {
        highlight.style.opacity = '0';
        setTimeout(() => {
            if (highlight.parentNode) {
                highlight.remove();
            }
        }, 300);
    }
}

// Focus on specific timeline item
function focusTimelineItem(item, index) {
    // Remove focus from other items
    document.querySelectorAll('.timeline-item').forEach(otherItem => {
        otherItem.classList.remove('focused');
    });
    
    // Add focus class
    item.classList.add('focused');
    
    // Smooth scroll to item
    item.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    
    // Add temporary focus styles
    const content = item.querySelector('.timeline-content');
    const originalTransform = content.style.transform;
    
    content.style.transform = 'translateY(-8px) scale(1.02)';
    content.style.boxShadow = '0 25px 50px rgba(0, 82, 147, 0.15)';
    
    // Reset after animation
    setTimeout(() => {
        content.style.transform = originalTransform;
        content.style.boxShadow = 'var(--shadow-md)';
        item.classList.remove('focused');
    }, 2000);
    
    // Analytics or tracking could go here
    trackTimelineInteraction(index);
}

// Initialize progress tracking based on scroll
function initializeProgressTracking() {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineTrack = document.querySelector('.timeline-track');
    
    if (!timelineContainer || !timelineTrack) return;
    
    // Disable progress indicator on mobile to avoid positioning conflicts
    if (window.innerWidth <= 767) return;
    
    // Create progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'timeline-progress';
    progressIndicator.style.cssText = `
        position: absolute;
        left: 50%;
        top: 0;
        width: 4px;
        background: linear-gradient(to bottom, var(--primary), var(--primary-light));
        transform: translateX(-50%);
        border-radius: 2px;
        transition: height 0.3s ease;
        height: 0%;
        z-index: 2;
    `;
    
    timelineContainer.appendChild(progressIndicator);
    
    // Update progress on scroll
    const updateProgress = () => {
        const containerRect = timelineContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the timeline is visible
        const visibleTop = Math.max(0, viewportHeight - containerRect.bottom);
        const visibleBottom = Math.max(0, containerRect.top);
        const visibleHeight = Math.min(containerRect.height, viewportHeight - visibleBottom - visibleTop);
        
        const progress = Math.min(100, Math.max(0, (visibleHeight / containerRect.height) * 100));
        
        progressIndicator.style.height = `${progress}%`;
    };
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateProgress, 16); // ~60fps
    });
    
    // Initial progress calculation
    updateProgress();
}

// Track user interactions for analytics (placeholder)
function trackTimelineInteraction(index) {
    // This could send data to analytics service
    console.log(`Timeline item ${index + 1} was focused`);
    
    // Example: Send to analytics
    // gtag('event', 'timeline_interaction', {
    //     'timeline_item': index + 1,
    //     'page_title': document.title
    // });
}

// Utility function to check if element is in viewport
function isElementInViewport(element, threshold = 0.5) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const verticalVisibility = (rect.top + rect.height * threshold) < windowHeight && 
                              (rect.bottom - rect.height * threshold) > 0;
    const horizontalVisibility = (rect.left + rect.width * threshold) < windowWidth && 
                                (rect.right - rect.width * threshold) > 0;
    
    return verticalVisibility && horizontalVisibility;
}

// Initialize touch gestures for mobile
function initializeTouchGestures() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        let startY = 0;
        let startTime = 0;
        
        item.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaY = Math.abs(endY - startY);
            const deltaTime = endTime - startTime;
            
            // Detect tap (not swipe)
            if (deltaY < 10 && deltaTime < 300) {
                focusTimelineItem(item, index);
            }
        }, { passive: true });
    });
}

// Initialize touch gestures on mobile devices
if ('ontouchstart' in window) {
    initializeTouchGestures();
}

// Export functions for potential external use
window.TimelineInteractions = {
    focusTimelineItem,
    highlightTimelineSection,
    resetTimelineHighlight,
    isElementInViewport
};
