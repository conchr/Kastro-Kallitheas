/* ============================================================
   KASTRO KALLITHEAS — PRESENTATION SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const welcomeScreen         = document.getElementById('welcome-screen');
    const presentationContainer = document.getElementById('presentation-container');
    const startBtn              = document.getElementById('start-btn');
    const restartBtn            = document.getElementById('restart-btn');
    const loadingSpinner        = document.getElementById('loading-spinner');
    const slides                = document.querySelectorAll('.slide');
    const totalSlides           = slides.length;
    let currentPage = 1;

    // --------------------------------------------------------
    // Preload critical images
    // --------------------------------------------------------
    function preloadImages() {
        const criticalImages = [
            'https://raw.githubusercontent.com/conchr/Kastro-Kallitheas/main/cityWalls.jpg'
        ];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // --------------------------------------------------------
    // Loading spinner
    // --------------------------------------------------------
    function showLoading() { loadingSpinner.style.display = 'block'; }
    function hideLoading() { loadingSpinner.style.display = 'none'; }

    // --------------------------------------------------------
    // Start presentation
    // --------------------------------------------------------
    startBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('fade-out');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            presentationContainer.style.display = 'block';
            showSlide(1);
            preloadImages();
        }, 800);
    });

    // --------------------------------------------------------
    // Restart presentation
    // --------------------------------------------------------
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            showSlide(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --------------------------------------------------------
    // Show slide
    // --------------------------------------------------------
    function showSlide(index) {
        if (index < 1 || index > totalSlides) return;

        showLoading();
        currentPage = index;

        slides.forEach(slide => slide.classList.remove('active'));

        const currentSlide = document.querySelector(`.slide[data-page-index="${currentPage}"]`);
        if (currentSlide) {
            currentSlide.classList.add('active');

            setTimeout(() => {
                currentSlide.scrollIntoView({ behavior: 'smooth' });
                hideLoading();
                updateProgressBar(currentSlide);
            }, 100);
        }

        updateAllButtons();
    }

    // --------------------------------------------------------
    // Progress bar — update the CURRENT slide's bar only
    // --------------------------------------------------------
    function updateProgressBar(slideEl) {
        const fill = slideEl.querySelector('.progress-fill');
        if (fill) {
            const progress = (currentPage / totalSlides) * 100;
            fill.style.width = progress + '%';
        }
    }

    // --------------------------------------------------------
    // Next / Prev
    // --------------------------------------------------------
    function nextSlide() { showSlide(currentPage + 1); }
    function prevSlide() { showSlide(currentPage - 1); }

    // --------------------------------------------------------
    // Update all nav buttons state
    // --------------------------------------------------------
    function updateAllButtons() {
        for (let i = 1; i <= totalSlides; i++) {
            const prevBtn = document.getElementById(`prev-btn-${i}`);
            const nextBtn = document.getElementById(`next-btn-${i}`);

            if (prevBtn) {
                prevBtn.disabled = currentPage === 1;
                prevBtn.setAttribute('aria-disabled', currentPage === 1);
            }
            if (nextBtn) {
                nextBtn.disabled = currentPage === totalSlides;
                nextBtn.setAttribute('aria-disabled', currentPage === totalSlides);
            }
        }
    }

    // --------------------------------------------------------
    // Attach event listeners to all navigation buttons
    // --------------------------------------------------------
    for (let i = 1; i <= totalSlides; i++) {
        const prevBtn = document.getElementById(`prev-btn-${i}`);
        const nextBtn = document.getElementById(`next-btn-${i}`);

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    }

    // --------------------------------------------------------
    // Keyboard navigation
    // --------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Escape') {
            // Return to welcome screen
            welcomeScreen.style.display = 'flex';
            welcomeScreen.classList.remove('fade-out');
            presentationContainer.style.display = 'none';
        } else if (e.key >= '1' && e.key <= '9') {
            const slideNumber = parseInt(e.key);
            if (slideNumber <= totalSlides) {
                showSlide(slideNumber);
            }
        }
    });

    // --------------------------------------------------------
    // Initialize
    // --------------------------------------------------------
    preloadImages();
});