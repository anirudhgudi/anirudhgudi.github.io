// Professional Asymmetric Grid - Scroll Animations
// Staggered fade-in on scroll with IntersectionObserver

// Project data with Unsplash images
const projectsDataEnhanced = [
    {
        title: "Smart Floor-Cleaning Robot",
        images: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
        ],
        what: "Integrated mobile manipulation system combining autonomous navigation with a robotic arm for floor cleaning tasks in ROS 2 simulation.",
        why: "Demonstrates integration of mobile robotics and manipulation in practical applications, addressing coordination challenges in modern service robotics.",
        how: "Implemented using ROS 2 framework with Gazebo simulation, custom SLAM algorithms, inverse kinematics solvers, and behavior trees for task coordination.",
        results: "Achieved 95% navigation accuracy, ±2cm manipulator precision, and 40% faster task completion than manual teleoperation.",
        resources: [
            { type: "github", url: "https://github.com/anirudhgudi/FCleanBOT", label: "Source Code" }
        ]
    },
    {
        title: "Adaptive Sensor Fusion",
        images: [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop"
        ],
        what: "Robust vehicle state estimation system that dynamically selects between EKF and UKF based on real-time sensor reliability metrics.",
        why: "Traditional sensor fusion uses fixed algorithms regardless of conditions. This addresses adaptive estimation needs in varying sensor environments.",
        how: "Developed in MATLAB/Simulink with custom reliability metrics, dual estimators (EKF/UKF), and real-time algorithm switching based on sensor health monitoring.",
        results: "30% improvement in estimation accuracy during sensor degradation, <1m RMS position error during GPS outages, validated across 500+ scenarios.",
        resources: [
            { type: "pdf", url: "/assets/Project2.pdf", label: "Technical Report" }
        ]
    },
    {
        title: "SCARA Fault Detection",
        images: [
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&h=500&fit=crop"
        ],
        what: "Observer-based fault detection and isolation system for 2-DOF SCARA robot monitoring joint positions, velocities, and torques in real-time.",
        why: "Industrial robots require high reliability and uptime. Early fault detection prevents catastrophic failures and improves safety in manufacturing.",
        how: "Implemented Luenberger observers and residual generation in MATLAB/Simulink with dynamic models, state estimation, and threshold-based detection.",
        results: "Detected actuator faults within 0.5 seconds with 98% accuracy, zero false positives across 100+ test scenarios, robust to modeling uncertainties.",
        resources: [
            { type: "pdf", url: "/assets/Project3.pdf", label: "Technical Report" }
        ]
    },
    {
        title: "Gantry Loader Robot",
        images: [
            "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=700&h=500&fit=crop"
        ],
        what: "3-DOF heavy-duty gantry system designed for automated workpiece handling in CNC machining centers, capable of 50kg payloads.",
        why: "Manual loading/unloading is time-consuming and poses safety risks. Automated system improves productivity and enables lights-out manufacturing.",
        how: "Designed complete mechanical system in CATIA V5, performed FEA analysis for structural optimization, selected commercial linear guides and servo motors.",
        results: "±0.1mm positioning accuracy across 2m workspace, 15% weight reduction while maintaining stiffness, <0.5mm deflection under full load.",
        resources: [
            { type: "pdf", url: "/assets/Project4.pdf", label: "Design Report" }
        ]
    },
    {
        title: "Flywheel Optimization",
        images: [
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=600&fit=crop"
        ],
        what: "FEA-based topology optimization of high-speed flywheel for energy storage, maximizing capacity while minimizing material usage.",
        why: "Optimizing flywheel design reduces material costs, improves energy density, and enhances overall system efficiency in energy storage applications.",
        how: "Performed iterative FEA simulations in Ansys, applied topology optimization algorithms, validated against failure criteria at operating speeds up to 10,000 RPM.",
        results: "15% material reduction with safety factor >2.5, 12% increase in energy storage density, no resonance issues, 20% manufacturing cost reduction.",
        resources: [
            { type: "pdf", url: "/assets/Project5.pdf", label: "Analysis Report" }
        ]
    },
    {
        title: "SMACBOT",
        images: [
            "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop"
        ],
        what: "Autonomous cleaning platform with dual-action mechanisms (sweeping and mopping) for industrial floor care in warehouse environments.",
        why: "Industrial facilities require frequent floor cleaning. Autonomous platform reduces labor costs while improving cleaning consistency and coverage.",
        how: "Designed custom chassis with integrated cleaning mechanisms, Arduino-based control with ultrasonic/IR sensors, path planning algorithms for systematic coverage.",
        results: "95% coverage in 500m² test area, zero collisions during 50+ hours of testing, 40% improvement in cleaning effectiveness vs single-action systems.",
        resources: [
            { type: "pdf", url: "/assets/Project6.pdf", label: "Project Report" }
        ]
    },
    {
        title: "Precision Worktable Positioning",
        images: [
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=700&h=500&fit=crop"
        ],
        what: "High-precision positioning system for CNC worktables featuring both PID and state-space control for micron-level accuracy.",
        why: "Modern CNC machining requires extremely precise workpiece positioning to achieve tight tolerances despite disturbances and system dynamics.",
        how: "Developed mathematical models including motor dynamics and mechanical transmission, implemented PID and LQR control in MATLAB/Simulink, tuned using frequency response analysis.",
        results: "±2 microns positioning accuracy with state-space control (30% improvement over PID), 40% reduced settling time, robust against load variations.",
        resources: [
            { type: "pdf", url: "/assets/Project7.pdf", label: "Control Analysis" }
        ]
    },
    {
        title: "Automated Surveillance & Tracking",
        images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&h=500&fit=crop",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&h=500&fit=crop"
        ],
        what: "Real-time target detection and tracking system combining computer vision with multi-axis motion control using pan-tilt camera platform.",
        why: "Security applications require continuous monitoring of large areas. Automated system improves coverage, reduces operator fatigue, enables 24/7 surveillance.",
        how: "Implemented OpenCV algorithms for object detection/tracking, developed control algorithms for pan-tilt servos, integrated Kalman filtering for smooth tracking.",
        results: "Tracked targets at speeds up to 2 m/s with <50ms latency, 92% detection accuracy in various lighting, ±5 pixel accuracy, 30+ minutes continuous tracking.",
        resources: [
            { type: "pdf", url: "/assets/Project8.pdf", label: "System Report" }
        ]
    },
    {
        title: "Army Missile Launcher Analysis",
        images: [
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop"
        ],
        what: "Comprehensive strategic analysis of mobile missile launcher systems and armored fighting vehicles examining design considerations and operational requirements.",
        why: "Modern military operations require mobile, survivable weapon platforms. Understanding design trade-offs is critical for developing effective defense systems.",
        how: "Conducted literature review of existing platforms, analyzed mobility requirements, evaluated protection systems, studied weapon integration challenges.",
        results: "Identified key design trade-offs between mobility/protection/firepower, proposed optimization framework for platform selection, highlighted modular design importance.",
        resources: [
            { type: "pdf", url: "/assets/Project9.pdf", label: "Analysis Report" }
        ]
    }
];

class EnhancedProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.currentProject = 0;
        this.currentImageIndex = 0;
        this.init();
    }

    init() {
        // AUTO-EXTRACT IMAGES FROM HTML PROJECT CARDS
        const cards = document.querySelectorAll('.project-item:not(.placeholder-pro)');
        cards.forEach((card, index) => {
            if (projectsDataEnhanced[index]) {
                const visual = card.querySelector('.project-visual-pro');
                let imageSrc = '';

                // Check if it's a video or image
                const video = visual?.querySelector('video source');
                const img = visual?.querySelector('img');

                if (video) {
                    const fallbackImg = visual.querySelector('img');
                    imageSrc = fallbackImg?.getAttribute('src') || video.getAttribute('src');
                } else if (img) {
                    imageSrc = img.getAttribute('src');
                }

                // Store extracted image
                if (imageSrc) {
                    projectsDataEnhanced[index].images = [imageSrc];
                }

                // Extract tags from HTML
                const tags = Array.from(card.querySelectorAll('.project-tags-pro span')).map(tag => tag.textContent);
                projectsDataEnhanced[index].tags = tags;
            }
        });

        // Scroll animations for project items
        this.setupScrollAnimations();

        // Project card click listeners
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const projectIndex = parseInt(card.dataset.project);
                this.openModal(projectIndex);
            });
        });

        // Close button
        const closeBtn = document.querySelector('.modal-close-enhanced');
        closeBtn?.addEventListener('click', () => this.closeModal());

        // Backdrop click
        const backdrop = document.querySelector('.modal-backdrop-enhanced');
        backdrop?.addEventListener('click', () => this.closeModal());

        // Navigation arrows (for navigating between projects)
        const prevBtn = document.querySelector('.modal-nav-prev');
        const nextBtn = document.querySelector('.modal-nav-next');
        prevBtn?.addEventListener('click', () => this.navigateProject(-1));
        nextBtn?.addEventListener('click', () => this.navigateProject(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.navigateProject(-1);
            if (e.key === 'ArrowRight') this.navigateProject(1);
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Faster stagger animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50); // 50ms stagger (faster)
                }
            });
        }, {
            threshold: 0.1 // Trigger earlier
        });

        document.querySelectorAll('.project-item').forEach(project => {
            observer.observe(project);
        });
    }

    openModal(index) {
        this.currentProject = index;
        const project = projectsDataEnhanced[index];

        // Populate title
        document.getElementById('modalTitle').textContent = project.title;

        // Populate tags
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = (project.tags || []).map(tag => `<span>${tag}</span>`).join('');

        // Populate sections
        document.getElementById('sectionWhat').textContent = project.what;
        document.getElementById('sectionWhy').textContent = project.why;
        document.getElementById('sectionHow').textContent = project.how;
        document.getElementById('sectionResults').textContent = project.results;

        // Populate images for each section (alternate between 2 images)
        if (project.images && project.images.length > 0) {
            const img1 = project.images[0];
            const img2 = project.images.length > 1 ? project.images[1] : project.images[0];

            // Alternate images across sections
            const imageWhat = document.getElementById('imageWhat');
            const imageWhy = document.getElementById('imageWhy');
            const imageHow = document.getElementById('imageHow');
            const imageResults = document.getElementById('imageResults');

            if (imageWhat) {
                imageWhat.src = img1;
                imageWhat.alt = project.title;
            }
            if (imageWhy) {
                imageWhy.src = img2;
                imageWhy.alt = project.title;
            }
            if (imageHow) {
                imageHow.src = img2;
                imageHow.alt = project.title;
            }
            if (imageResults) {
                imageResults.src = img1;
                imageResults.alt = project.title;
            }
        }

        // Populate resources
        const resourcesContainer = document.getElementById('modalResources');
        resourcesContainer.innerHTML = project.resources.map(resource => {
            const icon = this.getResourceIcon(resource.type);
            return `
                <a href="${resource.url}" target="_blank" rel="noopener" class="resource-link">
                    ${icon}
                    ${resource.label}
                </a>
            `;
        }).join('');

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateProject(direction) {
        this.currentProject += direction;
        if (this.currentProject < 0) this.currentProject = projectsDataEnhanced.length - 1;
        if (this.currentProject >= projectsDataEnhanced.length) this.currentProject = 0;
        this.openModal(this.currentProject);
    }

    getResourceIcon(type) {
        const icons = {
            github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
            pdf: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
            video: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
        };
        return icons[type] || icons.pdf;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedProjectModal();
});
