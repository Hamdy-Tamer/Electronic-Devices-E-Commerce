// Active Link Observer

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const mobileLinks = document.querySelectorAll('.offcanvas .nav-link');
    
    // More sensitive observer for large sections like Products
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -300px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const desktopLink = document.querySelector(`.navbar .nav-link[href="#${id}"]`);
            const mobileLink = document.querySelector(`.offcanvas .nav-link[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active-link'));
                mobileLinks.forEach(link => link.classList.remove('active-link'));
                
                // Add active class to corresponding links
                if (desktopLink) desktopLink.classList.add('active-link');
                if (mobileLink) mobileLink.classList.add('active-link');
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle initial load
    const currentHash = window.location.hash || '#home';
    const initialDesktopLink = document.querySelector(`.navbar .nav-link[href="${currentHash}"]`);
    const initialMobileLink = document.querySelector(`.offcanvas .nav-link[href="${currentHash}"]`);
    
    if (initialDesktopLink) initialDesktopLink.classList.add('active-link');
    if (initialMobileLink) initialMobileLink.classList.add('active-link');
});

//==========================================================================================================================================================

/* Scroll to Top */

document.addEventListener('DOMContentLoaded', function() {
            const scrollTopBtn = document.getElementById("scrollTopBtn");

            // Show/Hide the button on scroll
            window.addEventListener('scroll', function() {
                if (window.scrollY > 2000) { //
                    scrollTopBtn.style.display = "block";
                } else {
                    scrollTopBtn.style.display = "none";
                }
            });

            // Scroll to top after clicking on button
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });