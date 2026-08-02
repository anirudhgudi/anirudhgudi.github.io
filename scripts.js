// ============================================
// Minimalist Portfolio - Simple JavaScript
// ============================================

function initSite() {
    // Theme Toggle (light/dark, persisted)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const currentlyDark = current ? current === 'dark' : prefersDark;
            const next = currentlyDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Simple fade-in animation on scroll for project cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Expandable projects functionality
    const viewAllBtn = document.getElementById('viewAllBtn');
    const projectsSection = document.querySelector('.projects');

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            const isExpanded = projectsSection.classList.contains('projects-expanded');

            if (isExpanded) {
                // Collapse projects
                projectsSection.classList.remove('projects-expanded');
                viewAllBtn.textContent = 'View all Projects';

                // Scroll to projects section
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Expand projects
                projectsSection.classList.add('projects-expanded');
                viewAllBtn.textContent = 'Show Less';

                // Re-observe new project cards for fade-in animation
                document.querySelectorAll('.hidden-project').forEach(card => {
                    if (card.style.opacity !== '1') {
                        observer.observe(card);
                    }
                });
            }
        });
    }

    // Project Modal Functionality
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    // Project data with Overview/Challenge/Solution/Impact structure
    const projectData = {
        0: {
            title: "Quadruped Robotics System",
            image: "assets/Media/Arch.png",
            gallery: [
                "assets/Media/QuadArchitecture.png",
            ],
            stats: [
                { value: "12D", label: "Residual Output" },
                { value: "1.25M", label: "Training Steps" },
                { value: "3", label: "Gait References" },
            ],
            stack: ["ROS 2 Humble", "PyTorch", "MuJoCo", "Quad-SDK", "C++", "Python"],
            overview: "A hybrid locomotion framework developed to enhance quadrupedal robot movement by combining classical footstep planners with Deep Reinforcement Learning (RL). The system uses the Quad-SDK control stack and MuJoCo for physics simulation.",
            challenge: "Standard model-based planners are efficient on flat ground but lack adaptability for complex terrains. Pure RL approaches often lack the safety and interpretability crucial for real-world robotics.",
            solution: "Implemented a residual learning approach using PPO-trained RL to output small Cartesian residuals that refine nominal foot targets from a Raibert planner. This maintains base stability while enabling adaptive corrections for terrain irregularities.",
            impact: "Successfully validated the end-to-end planning pipeline on flat terrain. Demonstrated that the residual policy can refine tracking behavior without compromising system stability. Modular architecture allows easy integration into ROS 2 stacks."
        },
        1: {
            title: "Snakebot",
            image: "assets/Media/Snakebot.jpeg",
            gallery: [
                "assets/Media/Snakebot3.jpg",
                "assets/Media/Snakebot2.jpg",
                // "assets/Media/Project1.png"
            ],
            stats: [
                { value: "8-DOF", label: "Articulated Body" },
                { value: "180° / 90°", label: "Yaw / Pitch per Joint" },
                { value: "1.6 Nm", label: "Actuator Torque" },
            ],
            stack: ["SolidWorks", "Raspberry Pi 4", "PCA9685", "L298N", "Python"],
            overview: "A biomimetic robot designed to mimic the movement of biological snakes to navigate narrow, rough, and hazardous terrains. It features an 8-servo articulated body and a motor-driven base.",
            challenge: "Traditional wheeled or legged robots often fail in tight, unpredictable environments like disaster zones, minefields, or collapsed buildings where navigation requires high flexibility.",
            solution: "Developed a modular articulated design using PLA material and 8 metal gear servos for serpentine motion (lateral undulation). Controlled by a Raspberry Pi 4 and ESP32 with PCA9685/L298N drivers, the robot integrates both linear locomotion and biomimetic gaits. Torque and power were sized from first principles — 1.6 Nm and 16.7 W — from mass distribution and friction coefficients rather than trial sizing, with a tolerance stack-up across all 8 joint interfaces to bound cumulative positional error.",
            impact: "Successfully demonstrated a functional prototype capable of navigating difficult spaces, providing a robust platform for future inspection and search-and-rescue applications in high-risk environments. Iterating link geometry through build-test cycles delivered a 30% strength gain over the initial print."
        },
        2: {
            title: "FClean Bot",
            image: "assets/Media/Project1_1.png",
            video: "assets/Media/Move Robot 1.mp4",
            gallery: [
                "assets/Media/FClean.png",
                "assets/Media/Project1.png",
            ],
            stats: [
                { value: "TurtleBot3", label: "Mobile Base" },
                { value: "SLAM", label: "GMapping Nav" },
                { value: "IK", label: "Pick & Place" },
            ],
            stack: ["ROS", "OpenManipulator-X", "Gazebo", "LiDAR"],
            overview: "An autonomous floor-cleaning system that combines mobile navigation with robotic manipulation to handle objects obstructing its path.",
            challenge: "Standard robotic vacuums are often stopped or diverted by small household objects, requiring manual intervention to clear the floor before cleaning.",
            solution: "Integrated an OpenManipulator-X robotic arm onto a TurtleBot3 Waffle Pi base. Using ROS, LiDAR-based GMapping (SLAM), and a boustrophedon coverage algorithm, the robot was programmed to detect obstacles via vision/LiDAR and use inverse kinematics to pick up and relocate them.",
            impact: "Achieved efficient automated cleaning coverage in Gazebo simulations while demonstrating the ability to actively interact with the environment, significantly increasing the autonomy of domestic service robots."
        },
        3: {
            title: "Gantry Loader Turning Machine",
            image: "assets/Media/GantryLoader.png",
            stats: [
                { value: "1500 mm", label: "Vertical Lift" },
                { value: "1000 mm", label: "Travel Range" },
                { value: "3 kg", label: "Payload" },
            ],
            stack: ["SolidWorks", "Pneumatics", "PLC", "Rack & Pinion"],
            overview: "Design and fabrication of a 3-axis Cartesian (Gantry) robot specifically engineered for automated material handling and loading for industrial turning machines.",
            challenge: "Manual material handling is labor-intensive, slow, and repetitive, leading to human error and safety hazards. Standard 6-axis arms are often too expensive for simple loading tasks.",
            solution: "Engineered a robust gantry system using a rack-and-pinion mechanism selected through trade studies against force transmission and spatial constraints, plus a 30–70 mm variable-diameter pneumatic gripper with an orientation-change actuator to reconcile vertical pickup with horizontal chuck placement. Every structural and actuating member was sized from beam-bending, torque, and force analysis on the 31 kg system, controlled by a PLC with integrated ultrasonic sensors for obstacle detection.",
            impact: "Successfully automated the material loading cycle, improving production throughput and ensuring a safer working environment through reduced human-machine interaction."
        },
        4: {
            title: "SMACBOT",
            image: "assets/Media/SMACBOT.jpg",
            gallery: [
                "assets/Media/SMACBOT1.jpg",
                "assets/Media/SMACBOT2.png",
            ],
            stats: [
                { value: "Battery", label: "Powered" },
                { value: "Auto", label: "Navigation" },
            ],
            stack: ["Mechanical Design", "Embedded Controls"],
            overview: "An automated, battery-powered floor mopping robot designed for efficient and eco-friendly cleaning in domestic or commercial spaces.",
            challenge: "Traditional floor cleaning is time-consuming, requires significant physical labor, and often involves excessive water consumption and slow drying times.",
            solution: "Development of a \"SMACBOT\" featuring automated navigation, optimized usage of water and chemicals, and a design focused on quick-drying and user-friendliness. The system notifies the user once the cleaning task is complete.",
            impact: "Significantly reduced physical effort and time for floor maintenance while promoting better resource management (water and chemical efficiency)."
        },
        5: {
            title: "Adaptive Sensor Fusion",
            image: "assets/Media/sensor_fusion_architecture.png",
            gallery: [
                "assets/Media/SensorFusion.png",
                "assets/Media/Adaptive_SF Trajectory.png",
            ],
            stats: [
                { value: "60%", label: "Error Reduction" },
                { value: "EKF + UKF", label: "Fusion Method" },
            ],
            stack: ["MATLAB", "ROS 2", "IMU", "GPS"],
            overview: "Advanced state estimation system combining Extended Kalman Filter (EKF) and Unscented Kalman Filter (UKF) for multi-sensor data fusion in robotic applications. Enables accurate position and velocity estimation from noisy sensor measurements.",
            challenge: "Individual sensors (IMU, GPS, encoders) have inherent noise and limitations. The challenge was to optimally combine multiple sensor inputs to produce accurate, reliable state estimates even when individual sensors provide conflicting or noisy data.",
            solution: "Implemented both EKF and UKF algorithms in MATLAB to handle linear and non-linear sensor models. Developed adaptive weighting system that adjusts sensor trust based on real-time noise characteristics. Integrated with ROS 2 for seamless sensor data processing and state publishing.",
            impact: "Reduced position estimation error by 60% compared to single-sensor approaches. System successfully handles sensor failures and maintains accurate state estimation, critical for autonomous navigation applications."
        },
        6: {
            title: "Fault Detection in SCARA Robot",
            image: "assets/Media/Scara.png",
            stats: [
                { value: "4-DOF", label: "Robotic Arm" },
                { value: "Luenberger", label: "Observer Model" },
            ],
            stack: ["MATLAB/Simulink", "Observer-Based Diagnostics"],
            overview: "An advanced observer-based diagnostic system for monitoring the health and performance of SCARA robotic systems in real-time.",
            challenge: "Industrial robots are susceptible to actuator and sensor failures which can lead to catastrophic damage or downtime. Distinguishing between normal noise and genuine failure is difficult.",
            solution: "Developed a Luenberger Observer model that generates \"residuals\"—mathematical differences between actual and predicted states. By analyzing these residuals, the system precisely isolates faults in actuators or sensors.",
            impact: "Created a robust diagnostic framework that improves reliability and safety, enabling predictive maintenance and reducing unexpected operational costs."
        },
        7: {
            title: "Surveillance and Defence System",
            image: "assets/Media/SurvRob.png",
            gallery: [
                "assets/Media/SurvRob1.png",
                "assets/Media/SurvRob2.png",
            ],
            stats: [
                { value: "GPS-Free", label: "Tracking" },
                { value: "Vision", label: "Based Control" },
            ],
            stack: ["Computer Vision", "Quadrotor", "Visual Servoing"],
            overview: "A visual feedback control system for automated object recognition, tracking, and surveillance, intended for border security and defense applications.",
            challenge: "Manual surveillance systems are prone to human error, fatigue, and delays in critical decision-making, which can compromise security.",
            solution: "Integration of quadrotors with computer vision algorithms to detect and track targets autonomously. The system uses visual feedback to track objects based on image coordinates, allowing for GPS-independent operation.",
            impact: "Created a more reliable and responsive surveillance framework that reduces human intervention and improves the speed and accuracy of target detection."
        },
        8: {
            title: "Design Optimization of Cast Iron Flywheel",
            // image: "assets/Media/Project1.png",
            stats: [
                { value: "35%", label: "Mass Reduction" },
                { value: "FEA", label: "Driven Design" },
            ],
            stack: ["ANSYS FEA", "Cast Iron Design"],
            overview: "An engineering study aimed at using simulation-driven design to optimize the geometry of a cast iron flywheel for energy storage in IC engines or punch presses.",
            challenge: "Conventional flywheel designs are often over-engineered, resulting in excessive weight and material costs. This unnecessary mass increases rotational inertia beyond requirement and reduces system efficiency.",
            solution: "Utilized Finite Element Analysis (FEA) in ANSYS to conduct a detailed stress and deformation study across various geometries (rim vs. spoke types). Optimized parameters like rim thickness, width, and number of arms for better material distribution.",
            impact: "Achieved a significant reduction in material weight (up to 35%) and manufacturing cost while maintaining a high safety factor, demonstrating how computational analysis can refine traditional mechanical components."
        },
        9: {
            title: "Worktable Positioning System",
            // image: "assets/Media/Project1.png",
            stats: [
                { value: "Arduino", label: "Feedback Control" },
                { value: "Ultrasonic", label: "Distance Sensing" },
            ],
            stack: ["Arduino", "MATLAB", "Control Systems"],
            overview: "A control system designed to automate the precise movement and positioning of worktables in conventional machining equipment like lathes.",
            challenge: "Manual positioning in traditional machining is often inaccurate and relies heavily on the skill of the operator, leading to inconsistencies in material shaping.",
            solution: "Implementation of an Arduino-based feedback control system utilizing ultrasonic sensors for distance measurement. The project also included mathematical modeling in MATLAB to determine the system's transfer function and optimize performance.",
            impact: "Enhanced the precision of material machining and demonstrated a successful transition from manual control to automated, sensor-driven positioning."
        },
    };

    // Add click handlers to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.dataset.project);
            const project = projectData[projectId];

            if (project) {
                // Populate modal with project data
                document.getElementById('modalTitle').textContent = project.title;
                document.getElementById('modalOverview').textContent = project.overview;
                document.getElementById('modalChallenge').textContent = project.challenge;
                document.getElementById('modalSolution').textContent = project.solution;
                document.getElementById('modalImpact').textContent = project.impact;

                // Video (if present) takes priority over the static image
                const videoEl = document.getElementById('modalVideo');
                const imageEl = document.getElementById('modalImage');
                if (project.video) {
                    videoEl.src = project.video;
                    videoEl.style.display = 'block';
                    imageEl.style.display = project.image ? 'block' : 'none';
                } else {
                    videoEl.removeAttribute('src');
                    videoEl.style.display = 'none';
                    imageEl.style.display = project.image ? 'block' : 'none';
                }
                if (project.image) {
                    imageEl.src = project.image;
                    imageEl.alt = project.title;
                }

                // Stat chips
                const statsContainer = document.getElementById('modalStats');
                statsContainer.innerHTML = '';
                if (project.stats && project.stats.length > 0) {
                    project.stats.forEach(stat => {
                        const chip = document.createElement('div');
                        chip.className = 'stat-chip';
                        chip.innerHTML = `<span class="stat-value">${stat.value}</span><span class="stat-label">${stat.label}</span>`;
                        statsContainer.appendChild(chip);
                    });
                    statsContainer.style.display = 'flex';
                } else {
                    statsContainer.style.display = 'none';
                }

                // Tech stack tags
                const stackContainer = document.getElementById('modalStack');
                stackContainer.innerHTML = '';
                if (project.stack && project.stack.length > 0) {
                    project.stack.forEach(item => {
                        const tag = document.createElement('span');
                        tag.className = 'stack-tag';
                        tag.textContent = item;
                        stackContainer.appendChild(tag);
                    });
                    stackContainer.style.display = 'flex';
                } else {
                    stackContainer.style.display = 'none';
                }

                // Handle Gallery
                const galleryContainer = document.getElementById('modalGallery');
                galleryContainer.innerHTML = ''; // Clear previous

                if (project.gallery && project.gallery.length > 0) {
                    project.gallery.forEach(imgSrc => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = project.title + ' Gallery';
                        galleryContainer.appendChild(img);
                    });
                    galleryContainer.style.display = 'grid';
                } else {
                    galleryContainer.style.display = 'none';
                }

                // Collapse the accordion back to closed on every open
                document.querySelectorAll('#modalAccordion .accordion-item').forEach(item => {
                    item.classList.remove('open');
                });

                // Show modal
                modal.style.display = 'block';
                modal.scrollTop = 0;
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Accordion toggle (Challenge / Solution / Impact)
    document.querySelectorAll('#modalAccordion .accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            trigger.closest('.accordion-item').classList.toggle('open');
        });
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const videoEl = document.getElementById('modalVideo');
        videoEl.pause();
    }

    // Close modal when clicking X button
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Experience Journey Animation
    // Use global scroll reveal observer
    const revealElements = document.querySelectorAll('.reveal');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    // Pronunciation Audio Logic
    const pronunciationBtn = document.getElementById('play-pronunciation');

    if (pronunciationBtn) {
        pronunciationBtn.addEventListener('click', () => {
            const audioPath = 'assets/Media/pronunciation.mp3';
            const audio = new Audio(audioPath);

            // Visual feedback
            pronunciationBtn.style.opacity = '0.7';

            audio.play()
                .then(() => {
                    // Audio playing successfully
                    setTimeout(() => {
                        pronunciationBtn.style.opacity = '1';
                    }, 500);
                })
                .catch(error => {
                    console.log("Audio file not found, using TTS fallback.");
                    // Fallback to Web Speech API
                    const utterance = new SpeechSynthesisUtterance("Anirudh Gudi");

                    // Voice Selection (Try to find a Male voice)
                    const voices = window.speechSynthesis.getVoices();
                    const maleVoice = voices.find(v => v.name.includes('David') || v.name.includes('Male'));

                    if (maleVoice) {
                        utterance.voice = maleVoice;
                    }

                    // Tweak parameters: Normal speed
                    utterance.rate = 1.0;
                    utterance.pitch = 0.8;
                    utterance.lang = 'en-US';

                    window.speechSynthesis.speak(utterance);

                    pronunciationBtn.style.opacity = '1';
                });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}