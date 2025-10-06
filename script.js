// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const loadingScreen = document.getElementById('loading-screen');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
});

// WhatsApp button functionality
const whatsappButton = document.querySelector('.whatsapp-float');
let isWhatsappVisible = false;

// Section Navigation
const sectionNav = document.querySelector('.section-nav');
const heroSection = document.querySelector('.hero');
const ctaButton = document.querySelector('.cta-button');
let currentSectionIndex = 0;

// Show navigation arrows and scroll to about section when clicking 'Découvrir'
ctaButton.addEventListener('click', () => {
    sectionNav.classList.add('visible');
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Navigation button click handlers
const prevButton = document.querySelector('.section-nav-btn.prev');
const nextButton = document.querySelector('.section-nav-btn.next');

prevButton.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
    }
});

nextButton.addEventListener('click', () => {
    if (currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
    }
});

// Carousel functionality
function initializeCarousel(carouselContainer) {
    const carousel = carouselContainer.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carouselContainer.querySelector('.carousel-button.prev');
    const nextButton = carouselContainer.querySelector('.carousel-button.next');
    const dotsContainer = carouselContainer.querySelector('.carousel-dots');

    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = carouselContainer.querySelectorAll('.carousel-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Initialize all carousels
document.querySelectorAll('.carousel-container').forEach(initializeCarousel);

// Investor form visibility
const toggleFormButton = document.querySelector('.toggle-form');
const investorForm = document.getElementById('investor-form');

toggleFormButton.addEventListener('click', (e) => {
    e.preventDefault();

    // First scroll to the investors section (like other nav links)
    const investorsSection = document.getElementById('investors');
    if (investorsSection) {
        investorsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Add active class to the section
        investorsSection.classList.add('active');

        // Update navigation to show investors as active
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === 'investors') {
                link.classList.add('active');
            }
        });
    }

    // Then show the form after a short delay to allow scrolling to complete
    setTimeout(() => {
        investorForm.classList.toggle('visible');
    }, 800);
});

function handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    
    // Update progress bar
    const progress = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
}


// Function to check if element is in viewport with cross-browser support
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    
    return (
        rect.top <= windowHeight * 0.5 && // Element's top is in the first half of viewport
        rect.bottom >= 0 && // Element's bottom is not above viewport
        rect.left <= windowWidth && // Element's left edge is in viewport
        rect.right >= 0 // Element's right edge is in viewport
    );
}

// Function to get current scroll position with cross-browser support
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// Function to toggle navigation visibility with cross-browser support
function toggleNavigationVisibility() {
    const scrollPosition = getScrollPosition();
    const heroHeight = heroSection.offsetHeight;
    
    if (scrollPosition < heroHeight * 0.5) {
        sectionNav.classList.remove('visible');
    } else {
        sectionNav.classList.add('visible');
    }
}

// Function to scroll to a specific section with cross-browser support
function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        const targetSection = sections[index];
        const targetPosition = targetSection.offsetTop - 80; // Account for fixed header
        currentSectionIndex = index; // Update current index before scrolling
        
        // Smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            smoothScrollFallback(targetPosition);
        }
    }
}

// Smooth scroll fallback for older browsers
function smoothScrollFallback(targetPosition) {
    const startPosition = getScrollPosition();
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    // Easing function
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    requestAnimationFrame(animation);
}

// Update current section index with cross-browser support
function updateCurrentSection() {
    const scrollPosition = getScrollPosition() + (window.innerHeight / 2);
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const absoluteTop = rect.top + getScrollPosition();
        const absoluteBottom = absoluteTop + rect.height;
        
        if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            currentSectionIndex = index;
        }
    });
}

// Add event listeners with passive option where supported
function addPassiveEventListener(element, eventName, func) {
    let passive = false;
    
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                passive = true;
                return true;
            }
        });
        window.addEventListener('test', null, opts);
    } catch (e) {}
    
    element.addEventListener(eventName, func, passive ? { passive: true } : false);
}

// Add scroll and resize event listeners
addPassiveEventListener(window, 'scroll', () => {
    updateCurrentSection();
    toggleNavigationVisibility();
    updateProgressBar();
});

addPassiveEventListener(window, 'resize', () => {
    toggleNavigationVisibility();
    updateProgressBar();
});

// Initial check
toggleNavigationVisibility();


// Navigation Functionality
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            
            // Add active class to current section and link
            targetSection.classList.add('active');
            link.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Section switching functionality
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }
}


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all elements with data-animate attribute
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});


// Scroll to section detection
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkSection = link.getAttribute('data-section');
        if (linkSection === current) {
            link.classList.add('active');
        }
    });
});

// Project cards hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery lightbox functionality
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay h3');
        createLightbox(img.src, overlay.textContent);
    });
});

function createLightbox(imageSrc, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="${title}">
            <h3>${title}</h3>
        </div>
    `;
    
    // Add lightbox styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    const title_el = lightbox.querySelector('h3');
    title_el.style.cssText = `
        color: white;
        margin-top: 1rem;
        font-size: 1.5rem;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// WhatsApp Form Submission Functions
function sendToWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new window/tab
    const whatsappWindow = window.open(whatsappURL, '_blank');

    // Fallback if popup is blocked
    if (!whatsappWindow) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(message).then(() => {
            showNotification('Message copié dans le presse-papiers. Veuillez l\'envoyer manuellement sur WhatsApp.', 'info');
        }).catch(() => {
            showNotification('Veuillez ouvrir WhatsApp et envoyer ce message manuellement.', 'info');
            console.log('Message à envoyer:', message);
        });
    }
}

function formatFormData(formData, formType) {
    let message = '';

    if (formType === 'investor') {
        message = `*🔔 Nouveau Contact Investisseur*\n\n`;
        message += `*Nom:* ${formData.name}\n`;
        message += `*Téléphone:* ${formData.phone}\n`;
        if (formData.email) message += `*Email:* ${formData.email}\n`;
        if (formData.additional_info) message += `*Informations supplémentaires:* ${formData.additional_info}\n`;
        message += `\n_Date:_ ${new Date().toLocaleString('fr-FR')}`;
    } else if (formType === 'contact') {
        message = `*📧 Nouveau Message de Contact*\n\n`;
        message += `*Nom:* ${formData.name}\n`;
        message += `*Email:* ${formData.email}\n`;
        message += `*Message:* ${formData.message}\n`;
        message += `\n_Date:_ ${new Date().toLocaleString('fr-FR')}`;
    }

    return message;
}

// Investor Form Handler
document.querySelector('.slick-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        phone: form.querySelector('input[name="phone"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        additional_info: form.querySelector('textarea[name="additional_info"]').value.trim()
    };

    // Validation
    if (!formData.name || !formData.phone) {
        showNotification('Veuillez remplir tous les champs obligatoires (Nom et Téléphone)', 'error');
        return;
    }

    if (formData.phone.length < 8) {
        showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
        return;
    }

    // Format and send message
    const message = formatFormData(formData, 'investor');
    sendToWhatsApp('221788989898', message);

    // Show success message and reset form
    showNotification('Demande d\'investissement envoyée avec succès!', 'success');
    form.reset();
});


// Contact Form Handler
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
        name: form.querySelector('input[type="text"]').value.trim(),
        telephone: form.querySelector('input[type="tel"]').value.trim(),
        email: form.querySelector('input[type="email"]').value.trim(),
        message: form.querySelector('textarea').value.trim()
    };

    // Validation
    if (!formData.name || !formData.telephone || !formData.message) {
        showNotification('Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Message)', 'error');
        return;
    }

    if (formData.telephone.length < 8) {
        showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
        return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    // Format and send message
    const message = formatContactFormData(formData);
    sendToWhatsApp('221788989898', message);

    // Show success message and reset form
    showNotification('Message envoyé avec succès!', 'success');
    form.reset();
});

function formatContactFormData(formData) {
    let message = `*📧 Nouveau Message de Contact*\n\n`;
    message += `*Nom:* ${formData.name}\n`;
    message += `*Téléphone:* ${formData.telephone}\n`;
    if (formData.email) message += `*Email:* ${formData.email}\n`;
    message += `*Message:* ${formData.message}\n`;
    message += `\n_Date:_ ${new Date().toLocaleString('fr-FR')}`;

    return message;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Define colors for different notification types
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-background');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Smooth hover effects for cards
document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');
    
    // Add smooth transitions to all elements
    document.body.style.opacity = '1';
    
    // Initialize any additional animations
    initializeAnimations();
});

function initializeAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.about-card, .project-card, .gallery-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1500);
    }
}

// Add floating animation to hero elements
setInterval(() => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.transform = 'translateX(-50%) translateY(-5px)';
        setTimeout(() => {
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }, 1000);
    }
}, 3000);

// Performance optimization: Throttle scroll events
let ticking = false;

function updateOnScroll() {
    // Your scroll-related code here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Add resize handler for responsive behavior
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'Images/Presentation Fruits.jpg',
        'Images/Compostière1.jpg',
        'Images/Chateau d\'eau.jpg',
        'Images/Abeille1.jpg',
        'Images/Pépinière1.jpg',
        'Images/Papaye1.jpg',
        'Images/Oignons1.jpeg',
        'Images/Aerien1.jpg',
        'Images/Contenaire1.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload function
preloadImages();

// Preload videos for better performance
function preloadVideos() {
    const video = [
        'Video/Carroussel1/car1.mp4',
        'Video/Carroussel1/car2.mp4',
        'Video/Carroussel1/car3.mp4',
        'Video/Carroussel2/car1.mp4',
        'Video/Carroussel2/car2.mp4',
        'Video/Carroussel2/car3.mp4',

    ];
    
    video.forEach(src => {
        const video = document.createElement('video');
        video.src = src;
    });
}
// Call preload function
preloadVideos();
