(() => {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu() {
      mobileMenu.classList.toggle('hidden');
      if (mobileMenu.classList.contains('hidden')) {
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
      } else {
          menuIcon.classList.remove('fa-bars');
          menuIcon.classList.add('fa-xmark');
      }
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (!mobileMenu.classList.contains('hidden')) {
              toggleMenu();
          }
      });
  });

  // Form Submit Handler
  function handleFormSubmit(event) {
      event.preventDefault();
      const feedback = document.getElementById('form-feedback');
      const form = document.getElementById('contact-form');
      
      feedback.classList.remove('hidden');
      form.reset();

      setTimeout(() => {
          feedback.classList.add('hidden');
      }, 6000);
  }
})();
