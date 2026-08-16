/* Main JavaScript file for Priyesh Raj Portfolio */
import '@fortawesome/fontawesome-free/css/all.min.css';


document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initMobileMenu();
  initTheme();
  initLabTabs();
  initLabDemos();
  init3DTilt();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   1. Interactive Particles Background
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse move tracking
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    
    // Draw individual particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    // Update particle movement
    update() {
      // Check boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;

      // Mouse interactive collision
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 1.5;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 1.5;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 1.5;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 1.5;
          }
        }
      }
      this.draw();
    }
  }

  // Populate particles
  function init() {
    particlesArray = [];
    let numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
    // Cap particles count for performance
    if (numberOfParticles > 120) numberOfParticles = 120;
    if (numberOfParticles < 40) numberOfParticles = 40;

    const isLightTheme = document.body.classList.contains('light-theme');
    const color = isLightTheme ? 'rgba(15, 23, 42, 0.16)' : 'rgba(0, 242, 254, 0.12)';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw connecting web lines
  function connect() {
    let opacityValue = 1;
    const isLightTheme = document.body.classList.contains('light-theme');
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 130) {
          opacityValue = 1 - (distance / 130);
          ctx.strokeStyle = isLightTheme 
            ? `rgba(15, 23, 42, ${opacityValue * 0.15})` 
            : `rgba(0, 242, 254, ${opacityValue * 0.085})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  // Adapt particle colors when theme changes
  window.addEventListener('theme-changed', () => {
    init();
  });

  init();
  animate();
}

/* ==========================================================================
   2. Typing Animation
   ========================================================================== */
function initTyping() {
  const typingSpan = document.getElementById('typing-text');
  if (!typingSpan) return;

  const roles = [
    "Computer Science Teacher",
    "Artificial Intelligence Instructor",
    "Informatics Practices Mentor",
    "STEM Lab Designer & Innovator",
    "Python Developer"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deleting
    } else {
      typingSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // normal typing
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Kickstart
  setTimeout(typeEffect, 1000);
}

/* ==========================================================================
   3. Mobile Responsive Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   4. Theme Configuration (Dark / Light Mode Toggle)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');

  // Check saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    icon.className = 'fas fa-moon';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    icon.className = 'fas fa-sun';
  }

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      icon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      icon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'light');
    }
    // Dispatch custom event to let particles redraw with suitable colors
    window.dispatchEvent(new Event('theme-changed'));
  });
}

/* ==========================================================================
   5. Interactive Lab Dashboard (Tab Toggling)
   ========================================================================== */
function initLabTabs() {
  const tabs = document.querySelectorAll('.lab-tab-btn');
  const panels = document.querySelectorAll('.lab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active classes
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active class
      tab.classList.add('active');
      const subject = tab.getAttribute('data-subject');
      const targetPanel = document.getElementById(`panel-${subject}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Subject Interactive Sandbox/Demos
   ========================================================================== */
function initLabDemos() {
  /* --- (A) CS Demo: Python Bubble Sort Runner --- */
  const btnRunCs = document.getElementById('btn-run-cs');
  const outputCs = document.getElementById('output-cs');
  
  if (btnRunCs && outputCs) {
    btnRunCs.addEventListener('click', () => {
      btnRunCs.disabled = true;
      outputCs.innerHTML = '<span class="code-font" style="color: #cbd5e1;">&gt;_ Initializing interpreter...</span>';
      
      const sortingSteps = [
        "Running bubble_sort([64, 34, 25, 12, 22])...",
        "Iteration 1: [34, 25, 12, 22, 64] (Sorted element: 64)",
        "Iteration 2: [25, 12, 22, 34, 64] (Sorted element: 34)",
        "Iteration 3: [12, 22, 25, 34, 64] (Sorted element: 25)",
        "Iteration 4: [12, 22, 25, 34, 64] (Array sorted, no swaps needed)",
        "Sorted Array: [12, 22, 25, 34, 64] (Finished in 0.04ms)"
      ];

      let step = 0;
      function printStep() {
        if (step < sortingSteps.length) {
          const separator = step === 0 ? '' : '<br>';
          const colorStyle = step === sortingSteps.length - 1 ? 'color: #39ff14; font-weight: bold;' : 'color: #85d6ff;';
          
          if (step === 0) outputCs.innerHTML = '';
          outputCs.innerHTML += `${separator}<span class="code-font" style="${colorStyle}">&gt; ${sortingSteps[step]}</span>`;
          step++;
          setTimeout(printStep, 800);
        } else {
          btnRunCs.disabled = false;
        }
      }
      setTimeout(printStep, 500);
    });
  }

  /* --- (B) AI Demo: Interactive Neural Net Simulator & Canvas Chart --- */
  const btnTrainAi = document.getElementById('btn-train-ai');
  const epochVal = document.getElementById('epoch-val');
  const lossVal = document.getElementById('loss-val');
  const lossCanvas = document.getElementById('loss-canvas');
  const nnSvg = document.getElementById('nn-svg');

  let currentEpoch = 0;
  let currentLoss = 0.9542;
  let lossHistory = [0.9542];

  // Draw Neural Network Nodes inside SVG
  function drawNeuralNetwork(activePulse = false) {
    if (!nnSvg) return;
    nnSvg.innerHTML = ''; // clear svg

    const width = nnSvg.clientWidth || 300;
    const height = nnSvg.clientHeight || 150;

    const layers = [3, 4, 2]; // 3 nodes input, 4 hidden, 2 output
    const nodes = [];

    // Compute coordinates
    for (let l = 0; l < layers.length; l++) {
      const layerSize = layers[l];
      const x = (width / (layers.length - 1)) * l * 0.85 + width * 0.07;
      const ySpacing = height / (layerSize + 1);
      
      const layerNodes = [];
      for (let n = 0; n < layerSize; n++) {
        layerNodes.push({
          x: x,
          y: ySpacing * (n + 1),
          id: `node-${l}-${n}`
        });
      }
      nodes.push(layerNodes);
    }

    // Draw Links
    for (let l = 0; l < layers.length - 1; l++) {
      const activeLinkIndex = activePulse ? Math.floor(Math.random() * nodes[l + 1].length) : -1;
      for (let n = 0; n < nodes[l].length; n++) {
        for (let next = 0; next < nodes[l + 1].length; next++) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', nodes[l][n].x);
          line.setAttribute('y1', nodes[l][n].y);
          line.setAttribute('x2', nodes[l + 1][next].x);
          line.setAttribute('y2', nodes[l + 1][next].y);
          
          if (activePulse && (next === activeLinkIndex || Math.random() > 0.6)) {
            line.setAttribute('class', 'nn-link active');
          } else {
            line.setAttribute('class', 'nn-link');
          }
          nnSvg.appendChild(line);
        }
      }
    }

    // Draw Nodes
    for (let l = 0; l < nodes.length; l++) {
      for (let n = 0; n < nodes[l].length; n++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', nodes[l][n].x);
        circle.setAttribute('cy', nodes[l][n].y);
        circle.setAttribute('r', '8');
        
        if (activePulse && (Math.random() > 0.4)) {
          circle.setAttribute('class', 'nn-node active');
        } else {
          circle.setAttribute('class', 'nn-node');
        }
        
        nnSvg.appendChild(circle);
      }
    }
  }

  // Draw Loss Chart
  function drawLossChart() {
    if (!lossCanvas) return;
    const ctx = lossCanvas.getContext('2d');
    
    // Fit size
    const dpr = window.devicePixelRatio || 1;
    lossCanvas.width = lossCanvas.clientWidth * dpr;
    lossCanvas.height = lossCanvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const w = lossCanvas.clientWidth;
    const h = lossCanvas.clientHeight;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.moveTo(0, h-2); ctx.lineTo(w, h-2);
    ctx.stroke();

    if (lossHistory.length < 2) return;

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = '#b927fc';
    ctx.lineWidth = 2.5;
    
    const stepX = w / (Math.max(10, lossHistory.length - 1));
    for (let i = 0; i < lossHistory.length; i++) {
      const x = i * stepX;
      // Map loss (0 to 1) to canvas height (margin-top to bottom)
      const y = h - (lossHistory[i] * (h - 8)) - 4;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Glow under line
    ctx.lineTo((lossHistory.length-1) * stepX, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(185, 39, 252, 0.08)';
    ctx.fill();
  }

  // Train action
  if (btnTrainAi) {
    btnTrainAi.addEventListener('click', () => {
      btnTrainAi.disabled = true;
      let count = 0;
      
      function pulseTraining() {
        if (count < 8) {
          drawNeuralNetwork(true);
          
          currentLoss = Math.max(0.015, currentLoss - (currentLoss * (Math.random() * 0.09 + 0.03)));
          lossVal.textContent = currentLoss.toFixed(4);
          
          count++;
          setTimeout(pulseTraining, 120);
        } else {
          currentEpoch += 10;
          epochVal.textContent = currentEpoch;
          
          lossHistory.push(currentLoss);
          if (lossHistory.length > 20) lossHistory.shift(); // sliding window
          
          drawNeuralNetwork(false);
          drawLossChart();
          btnTrainAi.disabled = false;
        }
      }
      pulseTraining();
    });
  }

  // Init AI panel items
  drawNeuralNetwork();
  setTimeout(drawLossChart, 300);

  /* --- (C) IP Demo: SQL Select Box Query Executer --- */
  const btnRunSql = document.getElementById('btn-run-sql');
  const sqlSelect = document.getElementById('sql-query-select');
  const sqlResult = document.getElementById('sql-result');

  if (btnRunSql && sqlSelect && sqlResult) {
    const databaseResponses = {
      q1: `<table class="sql-table">
            <thead>
              <tr><th>Name</th><th>Score</th></tr>
            </thead>
            <tbody>
              <tr><td>Priyesh Raj</td><td>85</td></tr>
              <tr><td>Anjali Gupta</td><td>94</td></tr>
              <tr><td>Suresh Kumar</td><td>89</td></tr>
            </tbody>
           </table>
           <p style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">Rows returned: 3 (Query executed in 0.005s)</p>`,
      q2: `<table class="sql-table">
            <thead>
              <tr><th>Grade</th><th>AVG(Score)</th></tr>
            </thead>
            <tbody>
              <tr><td>A</td><td>89.33</td></tr>
              <tr><td>B</td><td>72.50</td></tr>
              <tr><td>C</td><td>56.10</td></tr>
            </tbody>
           </table>
           <p style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">Rows returned: 3 (Query executed in 0.008s)</p>`,
      q3: `<table class="sql-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Grade</th><th>Score</th></tr>
            </thead>
            <tbody>
              <tr><td>104</td><td>Anjali Gupta</td><td>A</td><td>94</td></tr>
              <tr><td>101</td><td>Priyesh Raj</td><td>A</td><td>85</td></tr>
              <tr><td>103</td><td>Suresh Kumar</td><td>A</td><td>89</td></tr>
              <tr><td>102</td><td>Rahul Singh</td><td>B</td><td>75</td></tr>
              <tr><td>105</td><td>Karan Verma</td><td>C</td><td>56</td></tr>
            </tbody>
           </table>
           <p style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">Rows returned: 5 (Query executed in 0.003s)</p>`
    };

    btnRunSql.addEventListener('click', () => {
      sqlResult.innerHTML = '<span class="code-font" style="color: var(--text-muted);">&gt;_ Query processing...</span>';
      
      setTimeout(() => {
        const selectedQuery = sqlSelect.value;
        sqlResult.innerHTML = databaseResponses[selectedQuery] || 'Error executing query.';
      }, 550);
    });
  }

  /* --- (D) IT Demo: HTML sandbox renderer --- */
  const btnRenderHtml = document.getElementById('btn-render-html');
  const htmlTextArea = document.getElementById('html-code');
  const htmlPreview = document.getElementById('html-preview');

  if (btnRenderHtml && htmlTextArea && htmlPreview) {
    btnRenderHtml.addEventListener('click', () => {
      const userHtml = htmlTextArea.value;
      // Quick clean up to avoid total broken preview layout
      htmlPreview.innerHTML = userHtml;
    });
  }

  /* --- (E) STEM Demo: Switch & Wire LED glow toggle --- */
  const circuitBtn = document.getElementById('circuit-btn-switch');
  const switchIcon = document.getElementById('switch-icon');
  const wire1 = document.getElementById('wire-1');
  const wire2 = document.getElementById('wire-2');
  const ledBulbIcon = document.getElementById('led-bulb-icon');
  const circuitState = document.getElementById('circuit-state');

  if (circuitBtn && switchIcon && wire1 && wire2 && ledBulbIcon && circuitState) {
    let circuitOn = false;

    circuitBtn.addEventListener('click', () => {
      circuitOn = !circuitOn;
      
      if (circuitOn) {
        // Toggle Switch Class
        switchIcon.className = 'fas fa-toggle-on';
        
        // Activate Wires
        wire1.classList.add('active');
        wire2.classList.add('active');
        
        // Light LED bulb
        ledBulbIcon.className = 'fas fa-lightbulb led-icon active';
        
        // State Text
        circuitState.textContent = 'CLOSED CIRCUIT (ON)';
        circuitState.className = 'text-on';
      } else {
        switchIcon.className = 'fas fa-toggle-off';
        wire1.classList.remove('active');
        wire2.classList.remove('active');
        ledBulbIcon.className = 'far fa-lightbulb led-icon';
        circuitState.textContent = 'OPEN CIRCUIT (OFF)';
        circuitState.className = 'text-off';
      }
    });
  }
}

/* ==========================================================================
   7. 3D ID Badge Card Tilt Effect
   ========================================================================== */
function init3DTilt() {
  const badge = document.getElementById('id-badge');
  const avatarFrame = document.getElementById('avatar-frame');

  function applyTilt(el) {
    if (!el) return;
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within element
      const y = e.clientY - rect.top;  // y coordinate within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (cap max angle at 18 degrees)
      const rotateY = -((x - (width / 2)) / (width / 2)) * 18;
      const rotateX = ((y - (height / 2)) / (height / 2)) * 18;
      
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      el.style.transition = 'transform 0.05s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform 0.5s ease';
    });
  }

  applyTilt(badge);
  applyTilt(avatarFrame);
}

/* ==========================================================================
   8. Contact Form Validation & Mock Submit
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  
  if (!form || !formFeedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (!nameInput || !emailInput || !subjectInput || !messageInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Disable submission
    btnSubmit.disabled = true;
    formFeedback.textContent = 'Verifying and transmitting message...';
    formFeedback.style.color = 'var(--color-cs)';

    setTimeout(() => {
      formFeedback.innerHTML = `<i class="fas fa-check-circle"></i> Message Sent Successfully! Thank you, <strong>${name}</strong>. Priyesh Raj will connect with you soon at <strong>${email}</strong>.`;
      formFeedback.style.color = 'var(--color-ip)';
      
      // Reset inputs
      nameInput.value = '';
      emailInput.value = '';
      subjectInput.value = '';
      messageInput.value = '';
      
      btnSubmit.disabled = false;

      // Clear feedback banner after 6 seconds
      setTimeout(() => {
        formFeedback.textContent = '';
      }, 6500);
    }, 1800);
  });
}

/* ==========================================================================
   9. Scrollspy for Active Navbar Links
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = 'hero';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Check if we are currently scrolled within this section (with offset margin)
      if (window.scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href').substring(1);
      
      if (linkHref === currentSection) {
        link.classList.add('active');
      }
    });
  });
}
