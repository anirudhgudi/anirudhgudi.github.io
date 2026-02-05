// ============================================
// Minimalist Portfolio - Simple JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
            title: "Learning Residual Footstep Policy",
            image: "assets/Media/Arch.png",
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
            overview: "A biomimetic robot designed to mimic the movement of biological snakes to navigate narrow, rough, and hazardous terrains. It features an 8-servo articulated body and a motor-driven base.",
            challenge: "Traditional wheeled or legged robots often fail in tight, unpredictable environments like disaster zones, minefields, or collapsed buildings where navigation requires high flexibility.",
            solution: "Developed a modular articulated design using PLA material and 8 metal gear servos for serpentine motion (lateral undulation). Controlled by a Raspberry Pi 4 and ESP32 with PCA9685/L298N drivers, the robot integrates both linear locomotion and biomimetic gaits.",
            impact: "Successfully demonstrated a functional prototype capable of navigating difficult spaces, providing a robust platform for future inspection and search-and-rescue applications in high-risk environments."
        },
        2: {
            title: "FClean Bot",
            image: "assets/Media/Project1_1.png",
            gallery: [
                "assets/Media/FClean.png",
                "assets/Media/Project1.png",
            ],
            overview: "An autonomous floor-cleaning system that combines mobile navigation with robotic manipulation to handle objects obstructing its path.",
            challenge: "Standard robotic vacuums are often stopped or diverted by small household objects, requiring manual intervention to clear the floor before cleaning.",
            solution: "Integrated an OpenManipulator-X robotic arm onto a TurtleBot3 Waffle Pi base. Using ROS, LiDAR-based GMapping (SLAM), and a boustrophedon coverage algorithm, the robot was programmed to detect obstacles via vision/LiDAR and use inverse kinematics to pick up and relocate them.",
            impact: "Achieved efficient automated cleaning coverage in Gazebo simulations while demonstrating the ability to actively interact with the environment, significantly increasing the autonomy of domestic service robots."
        },
        3: {
            title: "SMACBOT",
            image: "assets/Media/SMACBOT.jpg",
            gallery: [
                "assets/Media/SMACBOT1.jpg",
                "assets/Media/SMACBOT2.png",
            ],
            overview: "An automated, battery-powered floor mopping robot designed for efficient and eco-friendly cleaning in domestic or commercial spaces.",
            challenge: "Traditional floor cleaning is time-consuming, requires significant physical labor, and often involves excessive water consumption and slow drying times.",
            solution: "Development of a \"SMACBOT\" featuring automated navigation, optimized usage of water and chemicals, and a design focused on quick-drying and user-friendliness. The system notifies the user once the cleaning task is complete.",
            impact: "Significantly reduced physical effort and time for floor maintenance while promoting better resource management (water and chemical efficiency)."
        },
        4: {
            title: "Adaptive Sensor Fusion",
            image: "assets/Media/sensor_fusion_architecture.png",
            gallery: [
                "assets/Media/SensorFusion.png",
                "assets/Media/Adaptive_SF Trajectory.png",
            ],
            overview: "Advanced state estimation system combining Extended Kalman Filter (EKF) and Unscented Kalman Filter (UKF) for multi-sensor data fusion in robotic applications. Enables accurate position and velocity estimation from noisy sensor measurements.",
            challenge: "Individual sensors (IMU, GPS, encoders) have inherent noise and limitations. The challenge was to optimally combine multiple sensor inputs to produce accurate, reliable state estimates even when individual sensors provide conflicting or noisy data.",
            solution: "Implemented both EKF and UKF algorithms in C++ to handle linear and non-linear sensor models. Developed adaptive weighting system that adjusts sensor trust based on real-time noise characteristics. Integrated with ROS 2 for seamless sensor data processing and state publishing.",
            impact: "Reduced position estimation error by 60% compared to single-sensor approaches. System successfully handles sensor failures and maintains accurate state estimation, critical for autonomous navigation applications."
        },
        5: {
            title: "Fault Detection in SCARA Robot",
            image: "assets/Media/Scara.png",
            overview: "An advanced observer-based diagnostic system for monitoring the health and performance of SCARA robotic systems in real-time.",
            challenge: "Industrial robots are susceptible to actuator and sensor failures which can lead to catastrophic damage or downtime. Distinguishing between normal noise and genuine failure is difficult.",
            solution: "Developed a Luenberger Observer model that generates \"residuals\"—mathematical differences between actual and predicted states. By analyzing these residuals, the system precisely isolates faults in actuators or sensors.",
            impact: "Created a robust diagnostic framework that improves reliability and safety, enabling predictive maintenance and reducing unexpected operational costs."
        },
        6: {
            title: "Surveillance and Defence System",
            image: "assets/Media/SurvRob.png",
            gallery: [
                "assets/Media/SurvRob1.png",
                "assets/Media/SurvRob2.png",
            ],
            overview: "A visual feedback control system for automated object recognition, tracking, and surveillance, intended for border security and defense applications.",
            challenge: "Manual surveillance systems are prone to human error, fatigue, and delays in critical decision-making, which can compromise security.",
            solution: "Integration of quadrotors with computer vision algorithms to detect and track targets autonomously. The system uses visual feedback to track objects based on image coordinates, allowing for GPS-independent operation.",
            impact: "Created a more reliable and responsive surveillance framework that reduces human intervention and improves the speed and accuracy of target detection."
        },
        7: {
            title: "Gantry Loader Turning Machine",
            image: "assets/Media/sensor_fusion_architecture.png",
            overview: "Design and fabrication of a 3-axis Cartesian (Gantry) robot specifically engineered for automated material handling and loading for industrial turning machines.",
            challenge: "Manual material handling is labor-intensive, slow, and repetitive, leading to human error and safety hazards. Standard 6-axis arms are often too expensive for simple loading tasks.",
            solution: "Engineered a robust gantry system using a rack-and-pinion mechanism for reliable linear motion. Controlled by a PLC with integrated ultrasonic sensors for obstacle detection and collision avoidance.",
            impact: "Successfully automated the material loading cycle, improving production throughput and ensuring a safer working environment through reduced human-machine interaction."
        },
        8: {
            title: "Design Optimization of Cast Iron Flywheel",
            // image: "assets/Media/Project1.png",
            overview: "An engineering study aimed at using simulation-driven design to optimize the geometry of a cast iron flywheel for energy storage in IC engines or punch presses.",
            challenge: "Conventional flywheel designs are often over-engineered, resulting in excessive weight and material costs. This unnecessary mass increases rotational inertia beyond requirement and reduces system efficiency.",
            solution: "Utilized Finite Element Analysis (FEA) in ANSYS to conduct a detailed stress and deformation study across various geometries (rim vs. spoke types). Optimized parameters like rim thickness, width, and number of arms for better material distribution.",
            impact: "Achieved a significant reduction in material weight (up to 35%) and manufacturing cost while maintaining a high safety factor, demonstrating how computational analysis can refine traditional mechanical components."
        },
        9: {
            title: "Worktable Positioning System",
            // image: "assets/Media/Project1.png",
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
                document.getElementById('modalImage').src = project.image;
                document.getElementById('modalImage').alt = project.title;
                document.getElementById('modalOverview').textContent = project.overview;
                document.getElementById('modalChallenge').textContent = project.challenge;
                document.getElementById('modalSolution').textContent = project.solution;
                document.getElementById('modalSolution').textContent = project.solution;
                document.getElementById('modalImpact').textContent = project.impact;

                // Handle Gallery
                const galleryContainer = document.getElementById('modalGallery');
                galleryContainer.innerHTML = ''; // Clear previous

                if (project.gallery && project.gallery.length > 0) {
                    project.gallery.forEach(imgSrc => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = project.title + ' Gallery';
                        // Optional: Add click to view large? For now just display.
                        galleryContainer.appendChild(img);
                    });
                    galleryContainer.style.display = 'grid';
                } else {
                    galleryContainer.style.display = 'none';
                }

                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close modal when clicking X button
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Experience Journey Animation
    const journeyCards = document.querySelectorAll('.journey-card');

    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add specific delay based on index for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                journeyObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    journeyCards.forEach(card => {
        journeyObserver.observe(card);
    });

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
});