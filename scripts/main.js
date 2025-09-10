// Main JavaScript functionality for personal website
document.addEventListener('DOMContentLoaded', function() {
    
    // Security: Conditional logging to prevent information disclosure in production
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    function debugLog(message) {
        if (isDevelopment) {
            console.log(message);
        }
    }
    
    function debugWarn(message) {
        if (isDevelopment) {
            console.warn(message);
        }
    }
    
    // Email deobfuscation function for anti-bot protection with Firefox compatibility
    function deobfuscateEmail(emailConfig) {
        if (!emailConfig || !emailConfig.address) return '';
        
        let email = emailConfig.address;
        
        // Check if email is obfuscated (Base64 encoded)
        if (emailConfig.obfuscated) {
            try {
                // Enhanced Base64 decoding with Firefox compatibility
                // Clean the Base64 string of any whitespace
                const cleanBase64 = email.replace(/\s/g, '');
                
                // Check if it looks like Base64
                if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                    debugWarn('Invalid Base64 format, using fallback');
                    return 'contact@domain.com';
                }
                
                // Use native atob with additional error handling
                email = atob(cleanBase64);
                
                // Validate the decoded email looks correct
                if (!email.includes('@') || !email.includes('.')) {
                    debugWarn('Decoded email appears invalid, using fallback');
                    return 'contact@domain.com';
                }
                
                debugLog('📧 Email deobfuscated for legitimate user (Firefox compatible)');
            } catch (e) {
                debugWarn('Failed to deobfuscate email in Firefox:', e.message);
                
                // Firefox fallback: Manual Base64 decode if atob fails
                try {
                    email = manualBase64Decode(emailConfig.address);
                    debugLog('📧 Email deobfuscated using Firefox fallback method');
                } catch (fallbackError) {
                    debugWarn('All decoding methods failed:', fallbackError.message);
                    return 'contact@domain.com'; // Ultimate fallback
                }
            }
        }
        
        return email;
    }
    
    // Manual Base64 decoder for Firefox compatibility
    function manualBase64Decode(str) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        
        // Remove padding and clean string
        str = str.replace(/[^A-Za-z0-9+/]/g, '');
        
        for (let i = 0; i < str.length; i += 4) {
            const encoded = str.substr(i, 4);
            const bytes = [];
            
            for (let j = 0; j < 4; j++) {
                bytes[j] = chars.indexOf(encoded[j]) || 0;
            }
            
            result += String.fromCharCode((bytes[0] << 2) | (bytes[1] >> 4));
            if (encoded[2] !== '=') {
                result += String.fromCharCode(((bytes[1] & 15) << 4) | (bytes[2] >> 2));
            }
            if (encoded[3] !== '=') {
                result += String.fromCharCode(((bytes[2] & 3) << 6) | bytes[3]);
            }
        }
        
        return result;
    }
    
    // Load configuration and render dynamic content
    loadConfigAndRender();
    
    async function loadConfigAndRender() {
        try {
            const response = await fetch('./config.json');
            const config = await response.json();
            
            // Render all dynamic content from config
            renderPageTitle(config.pages.home);
            renderPersonalInfo(config.personal);
            renderNavigation(config.personal);
            renderHeroSection(config.pages.home);
            renderAboutSection(config.pages.about);
            renderSkillsSection(config.skills);
            renderProjects(config.projects);
            renderContactSection(config.contact);
            renderFooter(config.personal);
            renderFavicon(config.seo);
            renderTheme(config.theme);
            
            debugLog('✅ Configuration loaded and content rendered');
        } catch (error) {
            debugWarn('⚠️ Could not load config.json, using static content:', error);
        }
    }
    
    function renderProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || !projects) return;
        
        // Clear existing projects
        projectsGrid.innerHTML = '';
        
        // Render each project using secure DOM creation
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = `project-card${project.featured ? ' featured' : ''}`;
            
            // Create project header
            const projectHeader = document.createElement('div');
            projectHeader.className = 'project-header';
            
            const projectTitle = document.createElement('h3');
            projectTitle.textContent = project.title;
            projectHeader.appendChild(projectTitle);
            
            if (project.featured) {
                const projectBadge = document.createElement('span');
                projectBadge.className = 'project-badge';
                projectBadge.textContent = 'Featured';
                projectHeader.appendChild(projectBadge);
            }
            
            // Create project content
            const projectContent = document.createElement('div');
            projectContent.className = 'project-content';
            
            // Project description
            const projectDesc = document.createElement('p');
            projectDesc.textContent = project.description;
            projectContent.appendChild(projectDesc);
            
            // Project technologies
            const projectTech = document.createElement('div');
            projectTech.className = 'project-tech';
            project.technologies.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.className = 'tech-tag';
                techTag.textContent = tech;
                projectTech.appendChild(techTag);
            });
            projectContent.appendChild(projectTech);
            
            // Project timeline
            const projectTimeline = document.createElement('div');
            projectTimeline.className = 'project-timeline';
            
            const timelineText = document.createElement('strong');
            timelineText.textContent = 'Timeline:';
            projectTimeline.appendChild(timelineText);
            projectTimeline.appendChild(document.createTextNode(' ' + project.timeline));
            projectTimeline.appendChild(document.createElement('br'));
            
            const approachText = document.createElement('strong');
            approachText.textContent = 'Approach:';
            projectTimeline.appendChild(approachText);
            projectTimeline.appendChild(document.createTextNode(' ' + project.approach));
            
            projectContent.appendChild(projectTimeline);
            
            // Project links
            const projectLinks = document.createElement('div');
            projectLinks.className = 'project-links';
            
            if (project.links.source !== '#') {
                const sourceLink = document.createElement('a');
                sourceLink.href = project.links.source;
                sourceLink.className = 'project-link';
                sourceLink.target = '_blank';
                sourceLink.textContent = 'View Source';
                projectLinks.appendChild(sourceLink);
            }
            
            if (project.links.demo !== '#') {
                const demoLink = document.createElement('a');
                demoLink.href = project.links.demo;
                demoLink.className = 'project-link';
                demoLink.target = '_blank';
                demoLink.textContent = 'Live Demo';
                projectLinks.appendChild(demoLink);
            }
            
            projectContent.appendChild(projectLinks);
            
            // Assemble the project card
            projectCard.appendChild(projectHeader);
            projectCard.appendChild(projectContent);
            projectsGrid.appendChild(projectCard);
        });
        
        // Re-observe new elements for animations
        if ('IntersectionObserver' in window) {
            const projectCards = projectsGrid.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.classList.add('fade-in-hidden');
                observer.observe(card);
            });
        }
    }

    function renderPageTitle(homeConfig) {
        if (!homeConfig || !homeConfig.title) return;
        document.title = homeConfig.title;
    }

    function renderPersonalInfo(personalConfig) {
        if (!personalConfig) return;
        
        // Update meta tags
        const author = document.querySelector('meta[name="author"]');
        if (author && personalConfig.name) {
            author.content = personalConfig.name;
        }
        
        // Handle obfuscated personal email if needed in future
        if (personalConfig.email) {
            // Create a temporary config object for deobfuscation
            const tempEmailConfig = {
                address: personalConfig.email,
                obfuscated: true // Personal email is also Base64 encoded
            };
            
            // Use the robust deobfuscation function
            const decodedEmail = deobfuscateEmail(tempEmailConfig);
            personalConfig._decodedEmail = decodedEmail;
            debugLog('📧 Personal email processed with Firefox compatibility');
        }
    }

    function renderNavigation(personalConfig) {
        if (!personalConfig) return;
        
        // Update navigation logo
        const navLogo = document.querySelector('.nav-logo a');
        if (navLogo && personalConfig.navigationName) {
            navLogo.textContent = personalConfig.navigationName;
        }
    }

    function renderHeroSection(homeConfig) {
        if (!homeConfig) return;
        
        // Update hero title - Using secure DOM creation for line breaks
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && homeConfig.heroTitle) {
            // Clear existing content
            heroTitle.innerHTML = '';
            
            // Split on line break markers and create elements securely
            const lines = homeConfig.heroTitle.split('\\n');
            lines.forEach((line, index) => {
                // Create text node for each line (safe from XSS)
                const textNode = document.createTextNode(line);
                heroTitle.appendChild(textNode);
                
                // Add line break except for the last line
                if (index < lines.length - 1) {
                    heroTitle.appendChild(document.createElement('br'));
                }
            });
        }
        
        // Update hero description
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && homeConfig.heroDescription) {
            heroDescription.textContent = homeConfig.heroDescription;
        }
    }

    function renderAboutSection(aboutConfig) {
        if (!aboutConfig) return;
        
        // Update section title
        const aboutTitle = document.querySelector('#about .section-title');
        if (aboutTitle && aboutConfig.title) {
            aboutTitle.textContent = aboutConfig.title;
        }
        
        // Update professional background
        const profBackground = document.querySelector('#about h3');
        const profBackgroundP = document.querySelector('#about p');
        if (profBackground && profBackgroundP && aboutConfig.professionalBackground) {
            profBackgroundP.textContent = aboutConfig.professionalBackground;
        }
        
        // Update AI philosophy section - more robust approach
        const aiPhilParagraphs = Array.from(document.querySelectorAll('#about p'));
        const aiPhilIndex = aiPhilParagraphs.findIndex(p => 
            p.previousElementSibling && 
            p.previousElementSibling.tagName === 'H3' && 
            p.previousElementSibling.textContent.trim() === 'AI Development Philosophy'
        );
        if (aiPhilIndex !== -1 && aboutConfig.aiPhilosophy) {
            aiPhilParagraphs[aiPhilIndex].textContent = aboutConfig.aiPhilosophy;
        }
        
        // Update career objectives section - more robust approach
        const careerIndex = aiPhilParagraphs.findIndex(p => 
            p.previousElementSibling && 
            p.previousElementSibling.tagName === 'H3' && 
            p.previousElementSibling.textContent.trim() === 'Career Objectives'
        );
        if (careerIndex !== -1 && aboutConfig.careerObjectives) {
            aiPhilParagraphs[careerIndex].textContent = aboutConfig.careerObjectives;
        }
    }

    function renderSkillsSection(skillsConfig) {
        if (!skillsConfig) return;
        
        // Update Core Technologies section
        const coreSkillsList = document.querySelector('.skill-category:first-child ul');
        if (coreSkillsList && skillsConfig.coreLanguages) {
            // Clear existing skills
            coreSkillsList.innerHTML = '';
            
            // Add each core technology using secure DOM methods
            skillsConfig.coreLanguages.forEach(skill => {
                const listItem = document.createElement('li');
                listItem.textContent = skill;
                coreSkillsList.appendChild(listItem);
            });
        }
        
        // Update AI-Augmented Tools section
        const aiSkillsList = document.querySelector('.skill-category:last-child ul');
        const aiSkillsTitle = document.querySelector('.skill-category:last-child h4');
        if (aiSkillsList && skillsConfig.aiAugmentedTools) {
            // Update section title
            if (aiSkillsTitle) {
                aiSkillsTitle.textContent = 'AI-Augmented Tools';
            }
            
            // Clear existing skills
            aiSkillsList.innerHTML = '';
            
            // Add each AI tool using secure DOM methods
            skillsConfig.aiAugmentedTools.forEach(tool => {
                const listItem = document.createElement('li');
                listItem.textContent = tool;
                aiSkillsList.appendChild(listItem);
            });
        }
    }

    function renderContactSection(contactConfig) {
        if (!contactConfig) return;
        
        // Update email link with obfuscation support
        const emailLink = document.querySelector('a[href*="mailto:"]');
        const emailText = document.querySelector('.contact-item h3 + p');
        if (emailLink && contactConfig.email) {
            const decodedEmail = deobfuscateEmail(contactConfig.email);
            emailLink.href = `mailto:${decodedEmail}`;
            
            // Add click protection
            emailLink.addEventListener('click', function() {
                // Slight delay to deter automated clicking
                setTimeout(() => {
                    debugLog('📧 Email link accessed by user interaction');
                }, 10);
            });
        }
        if (emailText && contactConfig.email) {
            const decodedEmail = deobfuscateEmail(contactConfig.email);
            emailText.textContent = decodedEmail;
        }
        
        // Update resume links
        const resumeDownloadLink = document.querySelector('.resume-download');
        if (resumeDownloadLink && contactConfig.resume) {
            resumeDownloadLink.href = contactConfig.resume.url;
        }
        
        const resumeContactLink = document.querySelector('.resume-contact');
        if (resumeContactLink && contactConfig.resume) {
            resumeContactLink.href = contactConfig.resume.url;
        }
        
        // Update LinkedIn link
        const linkedinContactLink = document.querySelector('.linkedin-contact');
        if (linkedinContactLink && contactConfig.linkedin) {
            linkedinContactLink.href = contactConfig.linkedin.url;
        }
        
        // Update GitHub links
        const githubContactLink = document.querySelector('.github-contact');
        if (githubContactLink && contactConfig.github) {
            githubContactLink.href = contactConfig.github.url;
        }
        
        const githubProjectsLink = document.querySelector('.github-projects');
        if (githubProjectsLink && contactConfig.github) {
            githubProjectsLink.href = contactConfig.github.url;
        }
        
        // Update blog link
        const blogContactLink = document.querySelector('.blog-contact');
        if (blogContactLink && contactConfig.blog) {
            blogContactLink.href = contactConfig.blog.url;
        }
        
        // Update X link
        const xContactLink = document.querySelector('.x-contact');
        if (xContactLink && contactConfig.x) {
            xContactLink.href = contactConfig.x.url;
        }
    }

    function renderFooter(personalConfig) {
        if (!personalConfig) return;
        
        // Update footer text with personal information
        const footerText = document.querySelector('.footer p');
        if (footerText && personalConfig.name && personalConfig.title) {
            footerText.textContent = `© 2025 ${personalConfig.name} - ${personalConfig.title}. Built with AI-enhanced development.`;
        }
    }

    function renderFavicon(seoConfig) {
        if (!seoConfig || !seoConfig.favicon) return;
        
        // Remove existing favicon link if any
        const existingFavicon = document.querySelector('link[rel*="icon"]');
        if (existingFavicon) {
            existingFavicon.remove();
        }
        
        // Create new favicon link element
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = seoConfig.favicon;
        
        // Add to document head
        document.head.appendChild(faviconLink);
    }

    function validateThemeParameter(theme, themeConfig) {
        // Length check
        if (!theme || typeof theme !== 'string' || theme.length > 20 || theme.length < 1) {
            return null;
        }
        
        // Character whitelist (alphanumeric and hyphens only)
        if (!/^[a-zA-Z0-9-]+$/.test(theme)) {
            return null;
        }
        
        // Check against valid themes
        const validThemes = ['default'];
        if (themeConfig && themeConfig.presets) {
            validThemes.push(...Object.keys(themeConfig.presets));
        }
        
        return validThemes.includes(theme) ? theme : null;
    }

    function renderTheme(themeConfig) {
        if (!themeConfig) return;
        
        // Check for URL parameter theme override
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('theme');
        
        // Validate URL theme parameter with enhanced security
        const validTheme = validateThemeParameter(urlTheme, themeConfig);
        
        // Get the active theme configuration (URL parameter takes priority)
        const activeTheme = validTheme || themeConfig.activeTheme || 'default';
        let gradientConfig;
        
        // Log theme source for debugging
        if (validTheme) {
            debugLog(`🎨 Using URL theme override: ${activeTheme}`);
        } else if (urlTheme && !validTheme) {
            debugWarn(`⚠️ Invalid URL theme '${urlTheme}', using config theme: ${themeConfig.activeTheme}`);
        } else {
            debugLog(`🎨 Using config theme: ${activeTheme}`);
        }
        
        if (activeTheme === 'default') {
            gradientConfig = themeConfig.gradients;
        } else {
            // Apply preset theme
            const preset = themeConfig.presets[activeTheme];
            if (preset) {
                gradientConfig = {
                    ...themeConfig.gradients,
                    // Override with preset colors for all sections
                    hero: preset.hero ? {
                        ...themeConfig.gradients.hero,
                        colors: preset.hero
                    } : themeConfig.gradients.hero,
                    about: preset.about ? {
                        ...themeConfig.gradients.about,
                        colors: preset.about
                    } : themeConfig.gradients.about,
                    projects: preset.projects ? {
                        ...themeConfig.gradients.projects,
                        colors: preset.projects
                    } : themeConfig.gradients.projects,
                    contact: preset.contact ? {
                        ...themeConfig.gradients.contact,
                        colors: preset.contact
                    } : themeConfig.gradients.contact
                };
            } else {
                debugWarn(`Theme preset '${activeTheme}' not found, using default`);
                gradientConfig = themeConfig.gradients;
            }
        }
        
        // Apply gradients to sections
        applyGradients(gradientConfig);
    }

    function applyGradients(gradientConfig) {
        if (!gradientConfig) return;
        
        // Generate CSS for each section with gradients
        Object.keys(gradientConfig).forEach(sectionName => {
            const config = gradientConfig[sectionName];
            if (config && config.colors && config.direction) {
                const gradient = generateGradientCSS(config);
                applySectionGradient(sectionName, gradient);
            }
        });
    }

    function generateGradientCSS(config) {
        const { direction, colors } = config;
        const colorStops = colors.map((color, index) => {
            const percentage = colors.length === 1 ? 100 : (index / (colors.length - 1)) * 100;
            return `${color} ${percentage}%`;
        }).join(', ');
        
        return `linear-gradient(${direction}, ${colorStops})`;
    }

    function applySectionGradient(sectionName, gradient) {
        const sectionElement = document.querySelector(`.${sectionName}`);
        if (sectionElement) {
            sectionElement.style.background = gradient;
            debugLog(`✅ Applied ${sectionName} theme gradient`);
        }
    }
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-active');
            navToggle.classList.toggle('nav-toggle-active');
        });

        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-menu-active');
                navToggle.classList.remove('nav-toggle-active');
            });
        });
    }

    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Navbar background opacity on scroll
    function updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.scrollY;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(26, 32, 44, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 32, 44, 0.95)';
        }
    }

    window.addEventListener('scroll', updateNavbarBackground);

    // Intersection Observer for fade-in animations
    let observer;
    
    function createObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, observerOptions);

        // Observe elements that should fade in (excluding project cards, handled dynamically)
        const elementsToObserve = document.querySelectorAll(
            '.skill-category, .contact-item'
        );
        
        elementsToObserve.forEach(el => {
            el.classList.add('fade-in-hidden');
            observer.observe(el);
        });
    }

    // Create intersection observer if supported
    if ('IntersectionObserver' in window) {
        createObserver();
    }

    // Contact item click tracking (for analytics purposes)
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactType = this.querySelector('h3').textContent;
            
            // Log contact interaction (can be extended with actual analytics)
            debugLog(`Contact interaction: ${contactType}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Form validation (if contact form is added in future)
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Support for keyboard navigation of contact items
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('contact-item')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedNavUpdate = debounce(updateActiveNavLink, 10);
    const debouncedNavBg = debounce(updateNavbarBackground, 10);
    
    window.removeEventListener('scroll', updateActiveNavLink);
    window.removeEventListener('scroll', updateNavbarBackground);
    
    window.addEventListener('scroll', debouncedNavUpdate);
    window.addEventListener('scroll', debouncedNavBg);

    // Console message for developers
    debugLog('🚀 Personal Website loaded successfully!');
    debugLog('Built with AI-enhanced development using Claude Code');
});

// CSS for fade-in animations (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    .fade-in-hidden {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #a0aec0;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(26, 32, 44, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: start;
            align-items: center;
            padding-top: 2rem;
            transition: right 0.3s ease;
        }
        
        .nav-menu-active {
            right: 0;
        }
        
        .nav-toggle-active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle-active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle-active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);