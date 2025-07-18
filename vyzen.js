document.addEventListener("DOMContentLoaded", () => {
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const blurredContent = document.getElementById('blurredContent');
  const mainContentWrapper = document.querySelector('.main-content-wrapper');
  const animatedText = document.getElementById('animatedText');
  const lastAnimatedText = animatedText.querySelector('text:nth-child(5)'); // Get the last animated letter (N)

  // Clock for blurred content (static text)
  function updateBlurredClock() {
    const clockElBlurred = document.getElementById('clock-blurred');
    if (clockElBlurred) {
      const now = new Date();
      clockElBlurred.textContent = `${now.toLocaleDateString('id-ID')} — ${now.toLocaleTimeString('id-ID')}`;
    }
  }
  updateBlurredClock(); // Call immediately to show current time
  setInterval(updateBlurredClock, 1000); // Start clock for blurred background

  // Listen for the end of the last animation in the SVG text
  lastAnimatedText.addEventListener('animationend', () => {
    welcomeOverlay.classList.add('hidden'); // Start fading out welcome text overlay
    blurredContent.classList.add('hidden'); // Start fading out blurred background

    // After the fade out transition for welcome overlay and blurred content
    setTimeout(() => {
      welcomeOverlay.style.display = 'none'; // Completely hide welcome overlay
      blurredContent.style.display = 'none'; // Completely hide blurred content
      document.body.style.overflowY = 'auto'; // Re-enable body scroll

      mainContentWrapper.classList.add('active'); // Activate fade-in for main content
      mainContentWrapper.style.position = 'relative'; // Change position back to flow

      // Start typing effect after main content is fully visible
      typingEffect();

      // Ensure home section is active after load
      showContent('homeSection', document.querySelector('.navigation-item.active'));

    }, 1000); // This should match the CSS transition duration (1s) for opacity fade out
  });

  // Typing effect for sidebar name
  const text = "VyzenHere";
  let i = 0, isDeleting = false;
  function typingEffect() {
    const el = document.getElementById("typing-name");
    if (!el) return; // Exit if element not found or not visible yet

    if (!isDeleting) {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(typingEffect, 150);
      } else {
        isDeleting = true;
        setTimeout(typingEffect, 1000);
      }
    } else {
      if (i > 0) {
        el.textContent = text.substring(0, --i);
        setTimeout(typingEffect, 100);
      } else {
        isDeleting = false;
        setTimeout(typingEffect, 500);
      }
    }
  }

  // Clock in sidebar (for main content)
  setInterval(() => {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `${now.toLocaleDateString('id-ID')} — ${now.toLocaleTimeString('id-ID')}`;
    }
  }, 1000);

  // Settings Panel Toggle
  function toggleSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
  }
  window.toggleSettingsPanel = toggleSettingsPanel;

  // Toggle Sections (Sewa Bot, Aplikasi Premium, Suntik Sosmed)
  const toggleSections = [
    { id: 'sewaSection', iconId: 'sewaIcon' },
    { id: 'premiumAppSection', iconId: 'premiumAppIcon' },
    { id: 'suntikSosmedSection', iconId: 'suntikSosmedIcon' }
  ];

  function toggleSection(targetId, targetIconId) {
    toggleSections.forEach(section => {
      const currentSection = document.getElementById(section.id);
      const currentIcon = document.getElementById(section.iconId);

      if (section.id === targetId) {
        const isVisible = currentSection.style.display === "flex";
        if (isVisible) {
          currentSection.style.opacity = '0';
          currentSection.style.transform = 'translateY(10px)';
          setTimeout(() => { currentSection.style.display = "none"; }, 500);
          currentIcon.classList.remove("fa-chevron-up");
          currentIcon.classList.add("fa-chevron-down");
        } else {
          currentSection.style.display = "flex"; /* Use flex for toggle sections */
          setTimeout(() => {
            currentSection.style.opacity = '1';
            currentSection.style.transform = 'translateY(0)';
          }, 10);
          currentIcon.classList.remove("fa-chevron-down");
          currentIcon.classList.add("fa-chevron-up");
        }
      } else {
        if (currentSection.style.display === "flex") {
          currentSection.style.opacity = '0';
          currentSection.style.transform = 'translateY(10px)';
          setTimeout(() => { currentSection.style.display = "none"; }, 500);
          currentIcon.classList.remove("fa-chevron-up");
          currentIcon.classList.add("fa-chevron-down");
        }
      }
    });
  }
  window.toggleSection = toggleSection;

  // Calculate Price for Suntik Sosmed
  function calculatePrice(inputElement, type, pricePerUnit) {
    const quantity = parseInt(inputElement.value);
    const parentItem = inputElement.closest('.suntik-item');
    const priceDisplay = parentItem.querySelector('.price-display');
    const orderButton = parentItem.querySelector('.order-button');
    const serviceName = inputElement.dataset.serviceName;

    if (isNaN(quantity) || quantity <= 0) {
      priceDisplay.textContent = 'Harga: Rp 0';
      orderButton.style.display = 'none';
      return;
    }

    let totalPrice = quantity * pricePerUnit;

    priceDisplay.textContent = `Harga: Rp ${totalPrice.toLocaleString('id-ID')}`;
    orderButton.style.display = 'block';
    orderButton.dataset.quantity = quantity;
    orderButton.dataset.price = totalPrice;
    orderButton.dataset.service = serviceName;
  }
  window.calculatePrice = calculatePrice;

  // Show Order Button on hover (Sewa Bot & Premium Apps)
  function showOrderButton(element, itemName, itemPrice) {
    if (element.classList.contains('unavailable')) {
        return;
    }
    const orderButton = element.querySelector('.order-button');
    if (orderButton) {
        orderButton.style.display = 'block';
        orderButton.dataset.itemName = itemName;
        orderButton.dataset.itemPrice = itemPrice;
    }
  }
  window.showOrderButton = showOrderButton;

  // Hide Order Button on mouse leave
  function hideOrderButton(element) {
    const orderButton = element.querySelector('.order-button');
    if (orderButton) {
        orderButton.style.display = 'none';
    }
  }
  window.hideOrderButton = hideOrderButton;

  // Send WhatsApp message for Suntik Sosmed
  function sendWhatsApp(buttonElement) {
    const quantity = buttonElement.dataset.quantity;
    const price = parseInt(buttonElement.dataset.price).toLocaleString('id-ID');
    const service = buttonElement.dataset.service;
    const whatsappNumber = '6285813232639';
    const message = encodeURIComponent(`Hai Vyzen, saya mau order ${quantity} ${service} dengan harga Rp ${price}.`);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  }
  window.sendWhatsApp = sendWhatsApp;

  // Send WhatsApp message for Sewa Bot & Premium Apps
  function sendWhatsAppOrder(itemName, itemPrice) {
    const whatsappNumber = '6285813232639';
    let message = '';

    if (itemName.startsWith('Sewa Bot')) {
        message = encodeURIComponent(`Hai Vyzen, saya ingin sewa ${itemName.replace('Sewa Bot ', '')} dengan harga Rp ${itemPrice}.`);
    } else {
        message = encodeURIComponent(`Hai Vyzen, saya ingin membeli ${itemName} dengan harga Rp ${itemPrice}.`);
    }

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  }
  window.sendWhatsAppOrder = sendWhatsAppOrder;

  // Canvas Effects (Snow, Stars, None)
  const canvas = document.getElementById("effect-canvas");
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let effectMode = 0; // 0: None, 1: Snow, 2: Stars
  let effectInterval = null;
  let angle = 0;

  const snowflakes = Array.from({ length: 100 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 1,
    d: Math.random() * 1 + 0.5
  }));

  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.3,
    d: Math.random() * 1 + 0.2
  }));

  function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    snowflakes.forEach(f => {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    });
    ctx.fill();
    angle += 0.01;
    snowflakes.forEach(f => {
      f.y += Math.pow(f.d, 2) + 0.5;
      f.x += Math.sin(angle) * 1.2;
      if (f.y > height) {
        f.y = 0;
        f.x = Math.random() * width;
      }
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    stars.forEach(s => {
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    });
    ctx.fill();
    stars.forEach(s => {
      s.y += s.d;
      if (s.y > height) {
        s.y = 0;
        s.x = Math.random() * width;
      }
    });
  }

  function cycleEffect() {
    clearInterval(effectInterval);
    ctx.clearRect(0, 0, width, height);
    effectMode = (effectMode + 1) % 3;
    if (effectMode === 1) {
      effectInterval = setInterval(drawSnow, 30);
    } else if (effectMode === 2) {
      effectInterval = setInterval(drawStars, 40);
    }
  }
  window.cycleEffect = cycleEffect;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (effectMode === 1) {
      drawSnow();
    } else if (effectMode === 2) {
      drawStars();
    }
  });

  // Music Player
  const musicList = [
    "https://files.catbox.moe/bdiwwz.mp3",
    "https://files.catbox.moe/n8257x.mpeg"
  ];
  let musicIndex = 0, isPlaying = false;
  const audio = new Audio(musicList[musicIndex]);
  audio.volume = 0.6;
  audio.addEventListener("ended", () => {
    musicIndex = (musicIndex + 1) % musicList.length;
    audio.src = musicList[musicIndex];
    audio.play();
  });

  function toggleMusic() {
    isPlaying ? audio.pause() : audio.play();
    isPlaying = !isPlaying;
  }
  window.toggleMusic = toggleMusic;

  // Function to switch main content sections
  function showContent(sectionId, clickedElement) {
    const sections = document.querySelectorAll('#homeSection, #jasaLayananSection, #portfolioSection, #connectSection');
    const navigationItems = document.querySelectorAll('.navigation-item');

    sections.forEach(section => {
      // Specifically set 'display: block' for main content sections
      // and 'display: flex' for toggle-sections if they are part of the target.
      if (section.id === sectionId) {
        section.style.display = 'block';
        section.classList.add('active');
      } else {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });

    navigationItems.forEach(item => {
      item.classList.remove('active');
    });

    if (clickedElement) {
      clickedElement.classList.add('active');
    }
  }
  window.showContent = showContent;
});
