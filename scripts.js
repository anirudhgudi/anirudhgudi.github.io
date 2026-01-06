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

    // --- Floating Navigation ---
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('header[id], section[id]');

    // Smooth scroll on click
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active dot on scroll
    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 250; // Increased offset for better feel

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        // Special case for bottom of page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentSection = 'contact';
        }

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${currentSection}`) {
                dot.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

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
            // Default to dark mode as requested
            applyTheme('dark');
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
            title: "Smart Floor-Cleaning Robot with Robotic Arm",
            description: "Developed an integrated mobile manipulation system for autonomous floor cleaning and object relocation in ROS simulation.",
            highlights: [
                "Orchestrated real-time SLAM using ROS GMapping for precise 2D occupancy grid mapping",
                "Architected Boustrophedon Coverage paths for systematic area cleaning",
                "Mastered Inverse Kinematics for target-based control of the OpenManipulator-X arm",
                "Configured hardware stack: TurtleBot3 Waffle Pi, LiDAR, and depth cameras"
            ],
            tech: ["ROS 2", "SLAM", "Kinematics"],
            metrics: [
                { value: "100%", label: "Sim. Accuracy" },
                { value: "15%", label: "Efficiency Gain" },
                { value: "<5cm", label: "Precision" }
            ],
            github: "https://github.com/anirudhgudi/FCleanBOT",
            report: "/assets/Project1.pdf",
            media: [
                { type: 'image', src: '/assets/Media/Project1.png' },
                { type: 'video', src: '/assets/Media/Move Robot 1.mp4' },
                { type: 'image', src: '/assets/Media/Project1_1.png' }
            ]
        },
        'project-2': {
            title: "Adaptive Sensor Fusion for Vehicle Localization",
            description: "Engineered a robust vehicle state estimation system that dynamically selects optimal fusion algorithms based on real-time sensor reliability.",
            highlights: [
                "Engineered EKF, UKF, and Factor Graph Optimization for high-fidelity state estimation",
                "Programmed dynamic confidence scoring for real-time sensor reliability auditing",
                "Boosted localization accuracy significantly compared to standalone GNSS/IMU streams",
                "Validated system resilience in high-noise and GNSS-denied environmental scenarios"
            ],
            tech: ["EKF/UKF", "Sensor Fusion", "MATLAB"],
            metrics: [
                { value: "4", label: "Algorithms" },
                { value: "30%", label: "Accuracy Up" },
                { value: "Real-time", label: "Reliability" }
            ],
            github: "https://github.com/anirudhgudi",
            report: "/assets/Project2.pdf",
            media: [
                { type: 'image', src: '/assets/Media/Adaptive Arch.png' },
                { type: 'image', src: '/assets/Media/SF2.png' }
            ]
        },
        'project-3': {
            title: "Fault Detection and Isolation for SCARA Robot",
            description: "Implemented an observer-based fault detection and isolation (FDI) technique to ensure safety in 2-DOF SCARA robot operations.",
            highlights: [
                "Formulated observer-based residual generation for sub-centimeter fault identification",
                "Linearized complex dynamic systems using Jacobian matrices for state estimation",
                "Isolated specific component failures within manufacturing assembly contexts",
                "Secured a robust framework for real-time structural and sensor-level anomaly tracking"
            ],
            tech: ["MATLAB/Simulink", "Fault Detection", "Observers"],
            metrics: [
                { value: "Real-time", label: "Detection" },
                { value: "2-DOF", label: "SCARA" },
                { value: "High", label: "Isolation" }
            ],
            github: "https://github.com/anirudhgudi",
            report: "/assets/Project3.pdf",
            media: [
                { type: 'image', src: '/assets/Media/Scara.png' }
            ]
        },
        'project-4': {
            title: 'Gantry Loader Robot for CNC',
            description: 'Designed and validated a 3DOF heavy-duty gantry system for industrial CNC workpiece handling.',
            highlights: [
                "Spearheaded a 4-member team for high-load 3DOF gantry conceptualization",
                "Executed rigorous engineering calculations for structural rigidity validation",
                "Confirmed hardware integrity using Ansys static and modal simulations",
                "Refined pick-and-place kinematics for high-precision workpiece alignment"
            ],
            tech: ['CATIA V5', 'FEA', 'Hardware Design'],
            metrics: [
                { value: '3-DOF', label: 'Robotic Stack' },
                { value: 'L&T', label: 'Internship' }
            ],
            report: '/assets/Project4.pdf',
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/fde68a/7c2d12?text=Gantry+Robot+1' }
            ]
        },
        'project-5': {
            title: 'Design Optimization of Cast Iron Flywheel',
            description: 'Applied finite element analysis to optimize flywheel geometry for maximum energy storage with minimum material weight.',
            highlights: [
                "Performed meticulous stress analysis and material weight reduction using Ansys",
                "Optimized flywheel geometry for uniform stress distribution across rotation cycles",
                "Reduced material consumption by 15% while maintaining safety factors",
                "Calculated fatigue life and rotational stability for industrial power applications"
            ],
            tech: ['FEA', 'Ansys', 'Optimization'],
            metrics: [
                { value: '15%', label: 'Mass Reduced' },
                { value: 'Ansys', label: 'FEA Stack' }
            ],
            report: '/assets/Project5.pdf',
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/60a5fa/1e3a8a?text=Flywheel+Optimization' }
            ]
        },
        'project-6': {
            title: 'SMACBOT - Autonomous Cleaning Platform',
            description: 'Designed an autonomous cleaning robot for both dry and wet maintenance, providing cost-effective smart solutions for industrial floor care.',
            highlights: [
                "Synthesized dual-action cleaning mechanisms into a single modular autonomous platform",
                "Implemented navigation with obstacle detection and specialized surface sensors",
                "Constructed a robust mechatronic chassis for multi-surface operation in varied environments",
                "Streamlined power consumption for extended autonomous industrial floor maintenance cycles"
            ],
            tech: ['Mechatronics', 'Arduino', 'Obstacle Avoidance'],
            metrics: [
                { value: 'Dry/Wet', label: 'Cleaning' },
                { value: 'Modular', label: 'Hardware' }
            ],
            report: '/assets/Project6.pdf',
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/d6d3d1/292524?text=SMACBOT' }
            ]
        },
        'project-7': {
            title: "Precision Worktable Positioning System",
            description: "Designed a high-precision positioning system for industrial worktables, focusing on extreme repeatability and error minimization.",
            highlights: [
                "Formulated PID and State-Space algorithms for micron-level positioning in production lines",
                "Analyzed precision mechanical components: ball screws, linear guides, and servo motors",
                "Achieved extreme system repeatability through rigorous frequency-response control analysis",
                "Simulated motion control profiles for high-speed industrial CNC applications"
            ],
            tech: ["Control Systems", "Mechatronics", "CNC"],
            metrics: [
                { value: "Micron", label: "Precision" },
                { value: "PID", label: "Control" },
                { value: "Stable", label: "Dynamics" }
            ],
            video: "https://drive.google.com/file/d/1Gh0IYNDm8UkjebQ1Rx5uqif9z0K6Af1q/view",
            report: "/assets/Project7.pdf",
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/d6d3d1/292524?text=Worktable' }
            ]
        },
        'project-8': {
            title: 'Automated Surveillance and Tracking System',
            description: 'Designed an automated surveillance system capable of detecting and tracking intruders using computer vision and multi-axis hardware control.',
            highlights: [
                "Engineered real-time target detection and motion tracking using advanced CV algorithms",
                "Architected a multi-axis motion control stack for precise sensor pointing",
                "Attained high responsiveness using low-latency microcontroller processing",
                "Deployed autonomous security response protocols for area defense and intrusion monitoring"
            ],
            tech: ['Computer Vision', 'Target Tracking', 'Mechatronics'],
            metrics: [
                { value: 'Real-time', label: 'Vision' },
                { value: 'Multi-axis', label: 'Tracking' }
            ],
            report: '/assets/Project8.pdf',
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/d6d3d1/292524?text=Surveillance' }
            ]
        },
        'project-9': {
            title: "Army Missile Launcher System Analysis",
            description: "Strategic analysis of mobile missile launcher systems and armored fighting vehicles, focusing on survivability and weapon integration.",
            highlights: [
                "Evaluated modular combat vehicle architectures for strategic survivability and weapon deployment",
                "Hypothesized automatic loading and launch mechanisms for high-mobility missile systems",
                "Studied design trade-offs between firepower, strategic mobility, and armored protection",
                "Analyzed the evolution of modular combat platforms toward tech-heavy battlefield solutions"
            ],
            tech: ["AFV Design", "Weapon Integration", "Strategic Mobility"],
            metrics: [
                { value: "Strategic", label: "Analysis" },
                { value: "Tactical", label: "Evaluation" }
            ],
            report: "/assets/Project9.pdf",
            video: "https://drive.google.com/file/d/1n_eKu8PLqzI0ZlFTMMBV2g7V7w26q-oN/view?usp=sharing",
            media: [
                { type: 'image', src: 'https://placehold.co/600x400/d6d3d1/292524?text=Missile+Launcher' }
            ]
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
        if (data.video) {
            actions += `<a href="${data.video}" target="_blank" class="modal-action-btn primary video-demo-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                Video Demo
            </a>`;
        }
        if (data.github) {
            actions += `<a href="${data.github}" target="_blank" class="modal-action-btn ${data.video ? 'secondary' : 'primary'}">
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