document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');
  const loginModal = document.getElementById('login-modal');
  const loginBtn = document.getElementById('login-btn');
  const closeBtn = document.querySelector('.close-btn');
  const loginForm = document.getElementById('login-form');
  const userGreeting = document.getElementById('user-greeting');
  const userNameDisplay = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');

  // Código do Carousel (executa apenas se os elementos existirem)
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.slide');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (carousel && slides.length > 0 && prevButton && nextButton && dotsContainer) {
    let currentIndex = 0;
  
    // Criação dos pontos (dots)
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  
    const dots = document.querySelectorAll('.dot');
  
    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.remove('active');
        dots[index].classList.remove('active');
      });
      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }
  
    function goToSlide(index) {
      currentIndex = index;
      updateSlides();
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    }
  
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    }
  
    // Eventos do Carousel
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
  
    let autoplayInterval = setInterval(nextSlide, 5000);
  
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });
  
    carousel.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    });
  
    let touchStartX = 0;
    let touchEndX = 0;
  
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
  
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const difference = touchStartX - touchEndX;
      if (Math.abs(difference) > swipeThreshold) {
        difference > 0 ? nextSlide() : prevSlide();
      }
    });
  }
  
  // Menu Mobile
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.querySelectorAll('span').forEach(span => span.classList.toggle('active'));
    });
  }
  
  // Dropdowns
  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
  
  // Exibição do Modal de Login
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'block';
    });
  }
  
  if (closeBtn && loginModal) {
    closeBtn.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });
  }
  
  window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
  
  // Validação e persistência do Login
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password === "demo") {
      localStorage.setItem('loggedUser', username);
      updateUserState(username);
      loginModal.style.display = 'none';
    } else {
      alert('Credenciais inválidas! Tente: usuário qualquer + senha "demo"');
    }
  });
  
  function updateUserState(username) {
    if (username) {
      userGreeting.style.display = 'flex';
      userNameDisplay.textContent = username;
      loginBtn.style.display = 'none';
    } else {
      userGreeting.style.display = 'none';
      loginBtn.style.display = 'block';
    }
  }
  
  const savedUser = localStorage.getItem('loggedUser');
  if (savedUser) updateUserState(savedUser);
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedUser');
      updateUserState(null);
    });
  }
  
  // Controles de vídeo (mantidos inalterados)
  document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('.play-button');
    
    container.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        container.classList.add('playing');
      } else {
        video.pause();
        container.classList.remove('playing');
      }
    });
    
    container.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        video[video.paused ? 'play' : 'pause']();
        container.classList.toggle('playing', !video.paused);
      }
    });
    
    video.addEventListener('ended', () => {
      container.classList.remove('playing');
      video.currentTime = 0;
    });
    
    video.setAttribute('tabindex', '0');
  });

  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const container = button.closest('.video-container');
      const video = container.querySelector('.game-trailer');
      const poster = container.querySelector('.video-poster');
      
      if (!video.innerHTML) {
        container.classList.add('loading');
        const sources = `
          <source src="${button.dataset.srcMp4}" type="video/mp4">
          <source src="${button.dataset.srcWebm}" type="video/webm">
        `;
        video.innerHTML = sources;
        await new Promise(resolve => {
          video.addEventListener('loadedmetadata', resolve, { once: true });
          video.load();
        });
      }

      if (video.paused) {
        container.classList.add('playing');
        video.play().then(() => {
          poster.style.opacity = '0';
          video.classList.add('ready');
          video.controls = true;
        }).catch(error => {
          console.error('Erro na reprodução:', error);
        });
      } else {
        video.pause();
        video.controls = false;
        video.classList.remove('ready');
        poster.style.opacity = '1';
        container.classList.remove('playing');
      }
      
      container.classList.remove('loading');
    });

    video.addEventListener('ended', () => {
      video.controls = false;
      video.classList.remove('ready');
      poster.style.opacity = '1';
      container.classList.remove('playing');
    });
  });

  document.querySelectorAll('.youtube-play-button').forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.video-container');
      const thumbnail = container.querySelector('.youtube-thumbnail');
      const embedDiv = container.querySelector('.youtube-embed');
      const videoId = thumbnail.dataset.ytId;

      embedDiv.innerHTML = `
        <iframe 
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          title="Reprodutor de vídeo do YouTube"
        ></iframe>
      `;

      thumbnail.style.display = 'none';
      this.style.display = 'none';
      embedDiv.style.display = 'block';
    });
  });
});
