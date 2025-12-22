document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const canvas = document.getElementById('shooting-stars-canvas');
    const ctx = canvas.getContext('2d');

    let floatingMotes = [];
    let shimmerPoints = [];
    const GRID_SIZE = 50; // Size of the grid cells in pixels

    // --- Smooth Scroll Navigation ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.sticky-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Theme Toggle Functionality ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            body.classList.remove('dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemPrefersDark ? 'dark' : 'light');
        }
    }

    // --- Canvas & Animation Definitions ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- Light Mode: Floating Motes ---
    class FloatingMote {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = -Math.random() * 0.3 - 0.1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < -this.radius) {
                this.y = canvas.height + this.radius;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            const moteColor = 'rgba(74, 93, 80, 0.7)';
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = moteColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createFloatingMotes() {
        floatingMotes = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            floatingMotes.push(new FloatingMote());
        }
    }

    // --- Dark Mode: Grid Shimmer ---
    function drawGrid() {
        ctx.save();
        ctx.strokeStyle = '#3a443e'; // var(--divider-color-dark)
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    class ShimmerPoint {
        constructor() { this.reset(); }
        reset() {
            const col = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
            const row = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
            this.x = col * GRID_SIZE;
            this.y = row * GRID_SIZE;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.7 + 0.2;
            this.speed = Math.random() * 0.015 + 0.005;
            this.fadingIn = true;
        }
        update() {
            if (this.fadingIn) {
                this.opacity += this.speed;
                if (this.opacity >= this.maxOpacity) {
                    this.opacity = this.maxOpacity;
                    this.fadingIn = false;
                }
            } else {
                this.opacity -= this.speed;
                if (this.opacity <= 0) {
                    this.reset(); // Re-assign to a new random point
                }
            }
        }
        draw() {
            const shimmerColor = '#8fbc8f'; // var(--accent-color-dark)
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = shimmerColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.shadowColor = shimmerColor;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
        }
    }

    function createShimmerPoints() {
        shimmerPoints = [];
        const count = 75;
        for (let i = 0; i < count; i++) {
            shimmerPoints.push(new ShimmerPoint());
        }
    }

    // --- Main Animation Loop ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (body.classList.contains('dark')) {
            drawGrid();
            shimmerPoints.forEach(point => {
                point.update();
                point.draw();
            });
        } else {
            floatingMotes.forEach(mote => {
                mote.update();
                mote.draw();
            });
        }

        requestAnimationFrame(animate);
    }

    // --- Project Logbook & Slideshow Logic (Unchanged) ---
    const projectNavLinks = document.querySelectorAll('.project-nav-item a');
    const projectDetails = document.querySelectorAll('.project-detail-item');
    const observerOptions = { root: null, rootMargin: "-40% 0px -60% 0px", threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.project-nav-item a[href="#${id}"]`);
            if (navLink) {
                if (entry.isIntersecting) {
                    projectNavLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                    entry.target.classList.add('is-visible');
                } else {
                    navLink.classList.remove('active');
                    entry.target.classList.remove('is-visible');
                }
            }
        });
    }, observerOptions);
    projectDetails.forEach(detail => {
        if (detail) observer.observe(detail);
    });

    const sliders = document.querySelectorAll('.project-media-slider');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentSlide = 0;
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) slide.classList.add('active');
            });
        }
        if (prevBtn && nextBtn && slides.length > 0) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }
    });

    // --- Event Listeners & Initialization ---
    themeToggleButton.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            body.style.setProperty('--cursor-x', `${e.clientX}px`);
            body.style.setProperty('--cursor-y', `${e.clientY}px`);
        });
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        createFloatingMotes();
        createShimmerPoints();
    });

    // --- Start Everything ---
    initializeTheme();
    resizeCanvas();
    createFloatingMotes();
    createShimmerPoints();
    animate();

    // --- Click-based Project Preview Modal ---
    const projectData = {
        'project-1': {
            title: 'FCleanBOT - Autonomous Cleaning Robot',
            media: [
                { type: 'image', src: '/assets/Media/Project1.png' },
                { type: 'video', src: '/assets/Media/Move Robot 1.mp4' },
                { type: 'image', src: '/assets/Media/Project1_1.png' }
            ],
            metrics: [
                { value: '85%', label: 'Grasp Success' },
                { value: '0.02s', label: 'Cycle Time' }
            ],
            tech: ['ROS', 'SLAM', 'Gazebo', 'Python', 'MoveIt'],
            description: 'Developed an integrated mobile manipulation system combining TurtleBot3 with OpenManipulator-X arm for autonomous object collection. Implemented LiDAR-based SLAM (GMapping) for real-time environment mapping, boustrophedon path planning for complete coverage, and custom inverse kinematics solver for precise pick-and-place operations.',
            highlights: [
                'Integrated TurtleBot3 with OpenManipulator-X arm for autonomous object collection',
                'Implemented Gmapping SLAM for real-time environment mapping',
                'Achieved 85% grasp success rate with custom inverse kinematics solver',
                '0.02s pick-and-place cycle time in simulation environment'
            ],
            github: 'https://github.com/anirudhgudi/FCleanBOT',
            report: '/assets/Project1.pdf'
        },
        'project-2': {
            title: 'Adaptive Sensor Fusion for Localization',
            media: [
                { type: 'image', src: '/assets/Media/Sensor_fusion_architecture.png' }
            ],
            metrics: [
                { value: '15%', label: 'Accuracy Gain' },
                { value: 'Real-time', label: 'Processing' }
            ],
            tech: ['Kalman Filter', 'MATLAB', 'IMU', 'GNSS', 'EKF', 'UKF'],
            description: 'Built an adaptive multi-sensor fusion system combining GNSS, IMU, and odometry using Extended Kalman Filter (EKF), Unscented Kalman Filter (UKF), and Particle Filters. System dynamically selects fusion models based on real-time sensor confidence metrics to ensure robust localization accuracy in varying environmental noise conditions.',
            highlights: [
                'Developed adaptive Extended Kalman Filter for multi-sensor fusion',
                '15% improvement in localization accuracy over standard EKF',
                'Dynamic weight adjustment based on real-time sensor confidence',
                'Robust performance in high-noise environments'
            ],
            report: '/assets/Project2.pdf'
        },
        'project-3': {
            title: 'SCARA 3DOF Robot Fault Detection',
            media: [
                { type: 'image', src: '/assets/Media/SCARA_Robot_Simulink.png' }
            ],
            metrics: [
                { value: '92%', label: 'Detection Rate' },
                { value: '3DOF', label: 'System' }
            ],
            tech: ['MATLAB', 'Simulink', 'Simscape', 'Machine Learning'],
            description: 'Created a comprehensive MATLAB/Simulink model of a 3DOF SCARA robot with fault injection capabilities for actuator and sensor failures. Designed and implemented residual-based fault detection logic using machine learning classification to identify anomalies and trigger automatic recovery behaviors.',
            highlights: [
                'Developed complete 3DOF SCARA robot simulation in MATLAB/Simulink',
                '92% fault detection accuracy using machine learning classification',
                'Real-time anomaly detection with automatic recovery protocols',
                'Comprehensive testing with multiple fault injection scenarios'
            ],
            report: '/assets/Project3.pdf'
        },
        'project-4': {
            title: 'Gantry Loader Robot for CNC Machine',
            media: [
                { type: 'image', src: '/assets/Media/Gantry_Robot.png' }
            ],
            metrics: [
                { value: '3DOF', label: 'System' },
                { value: '4 Members', label: 'Team' }
            ],
            tech: ['CREO', 'Ansys', 'Arduino', 'Mechanical Design'],
            description: 'Led a 4-member team to design and build a 3DOF gantry robot for automated part loading/unloading in CNC turning machines. Managed complete project lifecycle from concept to implementation, including CAD modeling, structural analysis, and Arduino-based motion control.',
            highlights: [
                'Led 4-member team for complete design and fabrication',
                '3DOF gantry system for precise part handling',
                'Validated structural integrity through Ansys simulations',
                'Automated loading/unloading for improved efficiency'
            ],
            report: '/assets/Project4.pdf'
        },
        'project-5': {
            title: 'Design and Optimization of Flywheel',
            media: [
                { type: 'image', src: '/assets/Media/Flywheel.png' }
            ],
            metrics: [],
            tech: ['CREO', 'Ansys', 'Optimization', 'FEA'],
            description: 'Flywheel optimization project exploring different design approaches and materials to achieve optimal energy storage and structural integrity.',
            highlights: [
                'Multiple design iterations and approaches',
                'FEA analysis for stress and deformation',
                'Material selection optimization',
                'Performance validation'
            ],
            report: '/assets/Project5.pdf'
        },
        'project-6': {
            title: 'SMAC-Robot',
            media: [
                { type: 'image', src: '/assets/Media/SMAC_Robot.png' }
            ],
            metrics: [],
            tech: ['Mechanical Design', 'Arduino', 'Automation'],
            description: 'Autonomous floor cleaning robot designed with a mechanical approach, focusing on robust mechanical systems for effective cleaning operations.',
            highlights: [
                'Mechanical-focused autonomous cleaning system',
                'Robust design for floor cleaning',
                'Arduino-based control system',
                'Practical implementation and testing'
            ],
            report: '/assets/Project6.pdf'
        },
        'project-7': {
            title: 'Worktable Positioning System',
            media: [
                { type: 'image', src: '/assets/Media/Worktable.png' }
            ],
            metrics: [],
            tech: ['Mechanical Design', 'Precision Engineering'],
            description: 'Precision worktable positioning system for manufacturing applications.',
            highlights: [
                'High-precision positioning mechanism',
                'Mechanical design optimization',
                'Manufacturing application focus'
            ],
            report: '/assets/Project7.pdf'
        },
        'project-8': {
            title: 'Surveillance Robot',
            media: [
                { type: 'image', src: '/assets/Media/Surveillance_Robot.png' }
            ],
            metrics: [],
            tech: ['Robotics', 'Surveillance', 'Mobile Platform'],
            description: 'Mobile surveillance robot for monitoring and security applications.',
            highlights: [
                'Mobile surveillance platform',
                'Remote monitoring capabilities',
                'Autonomous navigation'
            ],
            report: '/assets/Project8.pdf'
        },
        'project-9': {
            title: 'Missile Launching Robot',
            media: [
                { type: 'image', src: '/assets/Media/Missile_Robot.png' }
            ],
            metrics: [],
            tech: ['Robotics', 'Targeting', 'Control Systems'],
            description: 'Robotic system for missile launching with precision targeting capabilities.',
            highlights: [
                'Precision targeting system',
                'Launch mechanism design',
                'Control system integration'
            ],
            report: '/assets/Project9.pdf'
        }
    };

    // Create modal HTML
    const modalHTML = `
        <div id="project-preview-modal" class="project-preview-modal">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <button class="modal-project-nav prev-project" aria-label="Previous Project">&#8249;</button>
                <button class="modal-project-nav next-project" aria-label="Next Project">&#8250;</button>
                <div class="modal-grid">
                    <div class="modal-media">
                        <div id="modal-media-container"></div>
                    </div>
                    <div class="modal-details">
                        <h3 id="modal-title"></h3>
                        <div id="modal-metrics" class="modal-metrics"></div>
                        <div id="modal-tech-tags" class="modal-tech-tags"></div>
                        <p id="modal-description" class="modal-description"></p>
                        <ul id="modal-highlights" class="modal-highlights"></ul>
                        <div class="modal-actions" id="modal-actions"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('project-preview-modal');
    const modalClose = modal.querySelector('.modal-close');
    const prevProjectBtn = modal.querySelector('.prev-project');
    const nextProjectBtn = modal.querySelector('.next-project');
    let currentProjectId = null;
    const projectIds = Object.keys(projectData);
    let currentSlideIndex = 0;
    let currentMediaArray = [];

    function updateSlide(index) {
        const slides = modal.querySelectorAll('.modal-slide');
        const indicators = modal.querySelectorAll('.modal-slide-indicator');

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        currentSlideIndex = index;
    }

    function nextSlide() {
        const newIndex = (currentSlideIndex + 1) % currentMediaArray.length;
        updateSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlideIndex - 1 + currentMediaArray.length) % currentMediaArray.length;
        updateSlide(newIndex);
    }

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        currentProjectId = projectId;

        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-description').textContent = data.description;

        // Handle media (single or slider)
        const mediaContainer = document.getElementById('modal-media-container');
        currentMediaArray = data.media;
        currentSlideIndex = 0;

        if (data.media.length === 1) {
            // Single media item
            const media = data.media[0];
            if (media.type === 'video') {
                mediaContainer.innerHTML = `<video autoplay loop muted playsinline style="width:100%;height:auto;display:block;border-radius:0.5rem;max-height:500px;">
                    <source src="${media.src}" type="video/mp4">
                </video>`;
            } else {
                mediaContainer.innerHTML = `<img src="${media.src}" alt="${data.title}" style="width:100%;height:auto;display:block;border-radius:0.5rem;max-height:500px;">`;
            }
        } else {
            // Multiple media items - create slider
            const slidesHTML = data.media.map((media, index) => {
                const activeClass = index === 0 ? 'active' : '';
                if (media.type === 'video') {
                    return `<div class="modal-slide ${activeClass}">
                        <video autoplay loop muted playsinline>
                            <source src="${media.src}" type="video/mp4">
                        </video>
                    </div>`;
                } else {
                    return `<div class="modal-slide ${activeClass}">
                        <img src="${media.src}" alt="${data.title}">
                    </div>`;
                }
            }).join('');

            const indicatorsHTML = data.media.map((_, index) => {
                const activeClass = index === 0 ? 'active' : '';
                return `<div class="modal-slide-indicator ${activeClass}" data-index="${index}"></div>`;
            }).join('');

            mediaContainer.innerHTML = `
                <div class="modal-media-slider">
                    <div class="modal-slides">
                        ${slidesHTML}
                    </div>
                    <button class="modal-slide-nav prev" id="modal-prev">&lt;</button>
                    <button class="modal-slide-nav next" id="modal-next">&gt;</button>
                    <div class="modal-slide-indicators">
                        ${indicatorsHTML}
                    </div>
                </div>
            `;

            // Attach slider event listeners
            modal.querySelector('#modal-prev').addEventListener('click', prevSlide);
            modal.querySelector('#modal-next').addEventListener('click', nextSlide);

            modal.querySelectorAll('.modal-slide-indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => updateSlide(index));
            });
        }

        // Metrics
        const metricsContainer = document.getElementById('modal-metrics');
        metricsContainer.innerHTML = data.metrics.map(m => `
            <div class="modal-metric-item">
                <span class="modal-metric-value">${m.value}</span>
                <span class="modal-metric-label">${m.label}</span>
            </div>
        `).join('');

        // Tech tags
        const techContainer = document.getElementById('modal-tech-tags');
        techContainer.innerHTML = data.tech.map(t => `
            <span class="modal-tech-tag">${t}</span>
        `).join('');

        // Highlights
        const highlightsContainer = document.getElementById('modal-highlights');
        highlightsContainer.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

        // Actions
        const actionsContainer = document.getElementById('modal-actions');
        let actions = '';
        if (data.github) {
            actions += `<a href="${data.github}" target="_blank" class="modal-action-btn primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
            </a>`;
        }
        if (data.report) {
            actions += `<a href="${data.report}" target="_blank" class="modal-action-btn secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                View Report
            </a>`;
        }
        actionsContainer.innerHTML = actions;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateProject(direction) {
        const currentIndex = projectIds.indexOf(currentProjectId);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % projectIds.length;
        } else {
            newIndex = (currentIndex - 1 + projectIds.length) % projectIds.length;
        }

        openModal(projectIds[newIndex]);
    }

    // Event listeners
    modalClose.addEventListener('click', closeModal);
    prevProjectBtn.addEventListener('click', () => navigateProject('prev'));
    nextProjectBtn.addEventListener('click', () => navigateProject('next'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateProject('prev');
            if (e.key === 'ArrowRight') navigateProject('next');
        }
    });

    // Attach click handlers to all projects
    document.querySelectorAll('.project-detail-item').forEach(item => {
        const projectId = item.getAttribute('id');

        // Make entire project item clickable
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
            // Prevent modal opening if clicking on a link
            if (e.target.tagName !== 'A') {
                openModal(projectId);
            }
        });
    });
});