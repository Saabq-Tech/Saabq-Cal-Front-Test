/**
 * Saabq-Cal — Scroll Animations
 * IntersectionObserver-based reveal animations
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Scroll reveal animations (Snappy & Instant)
    const observerOptions = {
      threshold: 0.01,
      rootMargin: '0px 0px 60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Add compact stagger delay if data-delay is set
          const rawDelay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
          if (rawDelay > 0) {
            entry.target.style.transitionDelay = Math.min(rawDelay * 0.4, 120) + 'ms';
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function(el) {
      observer.observe(el);
    });

    // Smooth counter animation for stat values
    document.querySelectorAll('[data-count-to]').forEach(function(el) {
      const targetVal = parseInt(el.getAttribute('data-count-to'), 10);
      const duration = parseInt(el.getAttribute('data-count-duration') || '2000', 10);
      const suffix = el.getAttribute('data-count-suffix') || '';
      const prefix = el.getAttribute('data-count-prefix') || '';

      const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCount(el, 0, targetVal, duration, prefix, suffix);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      countObserver.observe(el);
    });

    // Accordion functionality
    document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        
        // Close all other accordion items in the same group
        const group = item.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item.open').forEach(function(openItem) {
            if (openItem !== item) {
              openItem.classList.remove('open');
            }
          });
        }
        
        item.classList.toggle('open');
      });
    });

    // Enhanced Tab Switching with Micro-Animations
    document.querySelectorAll('[data-tab-group]').forEach(function(group) {
      const tabs = group.querySelectorAll('.tab-item');
      const groupName = group.getAttribute('data-tab-group');
      
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          // Remove active from all tabs in group
          tabs.forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');

          // Show/hide tab panels with smooth entrance animation
          const targetPanel = tab.getAttribute('data-tab-target');
          if (targetPanel) {
            document.querySelectorAll('[data-tab-panel="' + groupName + '"]').forEach(function(panel) {
              panel.style.display = 'none';
              panel.classList.remove('animate-tab-panel');
            });
            const active = document.querySelector('[data-tab-panel="' + groupName + '"][data-tab-id="' + targetPanel + '"]');
            if (active) {
              active.style.display = 'block';
              // Trigger animation re-flow
              void active.offsetWidth;
              active.classList.add('animate-tab-panel');
            }
          }
        });
      });
    });

    // Smooth Page Transition Handler for Internal Links
    document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
      // Exclude external links, anchors, or new tabs
      if (link.target === '_blank' || link.getAttribute('href').startsWith('#') || link.getAttribute('href').startsWith('javascript:')) return;

      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href) return;

        const main = document.querySelector('main, .main-content');
        if (main) {
          e.preventDefault();
          main.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
          main.style.opacity = '0';
          main.style.transform = 'translateY(-6px)';
          setTimeout(function() {
            window.location.href = href;
          }, 180);
        }
      });
    });

    // Public mobile navigation toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
          mobileMenu.classList.add('hidden');
        }
      });
    }

    // Mobile sidebar toggle
    document.querySelectorAll('[data-sidebar-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.classList.toggle('open');
        }
      });
    });

    // Close sidebar on link click (mobile)
    document.querySelectorAll('.sidebar-link').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 1024) {
          const sidebar = document.querySelector('.sidebar');
          if (sidebar) sidebar.classList.remove('open');
        }
      });
    });

    // Close sidebar on overlay click
    document.addEventListener('click', function(e) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !e.target.closest('[data-sidebar-toggle]')) {
          sidebar.classList.remove('open');
        }
      }
    });

    // Navbar scroll effect
    const publicNavbar = document.querySelector('.public-navbar');
    if (publicNavbar) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
          publicNavbar.classList.add('scrolled');
        } else {
          publicNavbar.classList.remove('scrolled');
        }
      });
    }
    // Universal Modal System Triggers
    document.querySelectorAll('[data-modal-open]').forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-modal-open');
        openModal(targetId);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = btn.closest('.modal-backdrop');
        if (modal) closeModal(modal.id);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(function(modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open, .modal-backdrop.active').forEach(function(modal) {
          closeModal(modal.id);
        });
      }
    });
  });

  // Global Modal Controller API
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open', 'active');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (modal) {
      modal.classList.remove('open', 'active');
      setTimeout(function() {
        if (!modal.classList.contains('open')) {
          modal.classList.add('hidden');
        }
      }, 250);
      document.body.style.overflow = '';
    }
  };

  // Global Slider / Carousel Controller API
  window.slideCarousel = function(trackId, direction) {
    const track = document.getElementById(trackId);
    if (track) {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const slide = track.querySelector('.slider-slide') || track.firstElementChild;
      const slideWidth = slide ? slide.offsetWidth + 20 : 320;
      const scrollAmount = direction === 'next' ? (isRtl ? -slideWidth : slideWidth) : (isRtl ? slideWidth : -slideWidth);
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Counter animation helper
  function animateCount(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      
      el.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
})();
