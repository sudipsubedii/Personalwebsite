const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if (navToggle) {
    const toggleMenu = () => {
        navMenu.classList.add('show-menu')
        navToggle.setAttribute('aria-expanded', 'true')
    }

    navToggle.addEventListener('click', toggleMenu)
    navToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggleMenu()
        }
    })
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false')
            navToggle.focus()
        }
    })
}

const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills() {
    const item = this.parentElement
    const wasClosed = item.classList.contains('skills__close')

    Array.from(skillsContent).forEach(content => {
        content.classList.remove('skills__open')
        content.classList.add('skills__close')
    })

    if (wasClosed) {
        item.classList.remove('skills__close')
        item.classList.add('skills__open')
    }
}

skillsHeader.forEach((eL) => {
    eL.addEventListener('click', toggleSkills)
})

/* Qualification section tab switching */
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = Array.from(document.querySelectorAll(".qual-tab-btn"));
  const tabContents = Array.from(document.querySelectorAll(".qual-content"));

  const activateTab = (button, moveFocus = false) => {
    const target = button.dataset.tab;
    const targetPanel = document.getElementById(target);
    if (!targetPanel) return;

    tabButtons.forEach(btn => {
      const isActive = btn === button;
      btn.classList.toggle("qual-tab-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    tabContents.forEach(content => {
      const isActive = content === targetPanel;
      content.classList.toggle("qual-content-active", isActive);
      content.hidden = !isActive;
    });

    if (moveFocus) button.focus();
  };

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(button));

    button.addEventListener("keydown", event => {
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabButtons.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabButtons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(tabButtons[nextIndex], true);
    });
  });

  const initiallyActive = tabButtons.find(btn => btn.classList.contains("qual-tab-active")) || tabButtons[0];
  if (initiallyActive) activateTab(initiallyActive);
});

/* Custom portfolio carousel: 3 cards, 3-second autoplay, 700ms transition */
;(function() {
    const slides = Array.from(document.querySelectorAll('.portfolio__slides .portfolio__card'))
    const prevBtn = document.querySelector('.portfolio__nav-prev')
    const nextBtn = document.querySelector('.portfolio__nav-next')
    const pagination = document.querySelector('.portfolio__pagination')
    const container = document.querySelector('.portfolio__container')

    if (!slides.length) return

    let current = 0
    const total = slides.length
    let intervalId = null
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function render() {
        slides.forEach((slide, index) => {
            slide.classList.remove('card--center', 'card--left', 'card--right', 'card--hidden')
            if (index === current) {
                slide.classList.add('card--center')
            } else if (index === (current - 1 + total) % total) {
                slide.classList.add('card--left')
            } else if (index === (current + 1) % total) {
                slide.classList.add('card--right')
            } else {
                slide.classList.add('card--hidden')
            }
        })

        slides.forEach((_, index) => {
            const dot = pagination?.children[index]
            if (dot) {
                dot.classList.toggle('active', index === current)
            }
        })
    }

    function buildPagination() {
        if (!pagination) return
        pagination.innerHTML = ''
        slides.forEach((_, index) => {
            const dot = document.createElement('button')
            dot.className = 'portfolio__dot' + (index === current ? ' active' : '')
            dot.setAttribute('aria-label', `Go to project ${index + 1}`)
            dot.addEventListener('click', () => {
                current = index
                render()
                restartAuto()
            })
            pagination.appendChild(dot)
        })
    }

    function next() {
        current = (current + 1) % total
        render()
    }

    function prev() {
        current = (current - 1 + total) % total
        render()
    }

    function startAuto() {
        if (intervalId) return
        intervalId = setInterval(next, 3000)
    }

    function stopAuto() {
        if (!intervalId) return
        clearInterval(intervalId)
        intervalId = null
    }

    function restartAuto() {
        stopAuto()
        startAuto()
    }

    nextBtn && nextBtn.addEventListener('click', () => {
        next()
        restartAuto()
    })
    prevBtn && prevBtn.addEventListener('click', () => {
        prev()
        restartAuto()
    })
    container && container.addEventListener('mouseenter', stopAuto)
    container && container.addEventListener('mouseleave', startAuto)
    container && container.addEventListener('focusin', stopAuto)
    container && container.addEventListener('focusout', event => {
        if (!container.contains(event.relatedTarget)) startAuto()
    })
    container && container.addEventListener('touchstart', stopAuto, { passive: true })
    container && container.addEventListener('touchend', () => {
        if (!reduceMotion) restartAuto()
    }, { passive: true })
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAuto()
        else if (!reduceMotion) startAuto()
    })

    buildPagination()
    render()
    if (!reduceMotion) startAuto()
})()

const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        const sectionId = current.getAttribute('id')
        const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if (!link) return
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add('active-link')
        } else {
            link.classList.remove('active-link')
        }
    })
}

window.addEventListener('scroll', scrollActive)

function scrollHeader() {
    const nav = document.getElementById('header')
    if (this.scrollY >= 80) nav.classList.add('scroll-header')
    else nav.classList.remove('scroll-header')
}

const tabs = document.querySelectorAll('.toggle button');
  const views = document.querySelectorAll('.view');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      views.forEach(v => v.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });
window.addEventListener('scroll', scrollHeader)

function scrollUp() {
    const scrollUp = document.getElementById('scroll-up')
    if (!scrollUp) return
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll')
    else scrollUp.classList.remove('show-scroll')
}

window.addEventListener('scroll', scrollUp)

const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'

if (themeButton) {
    const applyTheme = (isDark) => {
        document.body.classList.toggle(darkTheme, isDark)
        if (themeIcon) {
            themeIcon.classList.toggle('uil-sun', isDark)
            themeIcon.classList.toggle('uil-moon', !isDark)
        }
        themeButton.setAttribute('aria-pressed', String(isDark))
        themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
        localStorage.setItem('selected-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('selected-icon', isDark ? 'uil-sun' : 'uil-moon')
    }

    const savedTheme = localStorage.getItem('selected-theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark
    applyTheme(initialDark)

    themeButton.addEventListener('click', () => {
        const nextDark = !document.body.classList.contains(darkTheme)
        applyTheme(nextDark)
    })
}

/* ==================== Contact animations + form validation ==================== */

// Fade-up entrance for elements with data-anim="fade-up"
(function() {
    const els = document.querySelectorAll('[data-anim="fade-up"]')
    if (!els.length) return
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('show'))
        return
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                ent.target.classList.add('show')
                io.unobserve(ent.target)
            }
        })
    }, { threshold: 0.12 })
    els.forEach(e => io.observe(e))
})()
const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transition = "0.35s";
    });

});
// Contact form: client-side validation + real backend submission
(function() {
    const form = document.getElementById('contact-form')
    if (!form) return

    const submitBtn = document.getElementById('contact-submit')
    const statusEl = document.getElementById('contact-status')

    function setLoading(on) {
        submitBtn.classList.toggle('contact__btn--loading', on)
        submitBtn.disabled = on
    }

    function setSuccess() {
        submitBtn.classList.add('contact__btn--success')
        statusEl.textContent = 'Message sent. Thank you!'
    }

    function setError(msg) {
        submitBtn.classList.remove('contact__btn--success')
        statusEl.textContent = msg || 'Please check the form and try again.'
    }

    function validateField(input) {
        const err = input.parentElement.querySelector('.input__error')
        if (!input.checkValidity()) {
            if (input.validity.valueMissing) err.textContent = 'This field is required.'
            else if (input.type === 'email') err.textContent = 'Please enter a valid email.'
            else err.textContent = 'Invalid value.'
            return false
        }
        err.textContent = ''
        return true
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        statusEl.textContent = ''
        submitBtn.classList.remove('contact__btn--success')

        const fields = [
            document.getElementById('contact-name'),
            document.getElementById('contact-email'),
            document.getElementById('contact-subject'),
            document.getElementById('contact-message')
        ]

        const ok = fields.map(validateField).every(Boolean)
        if (!ok) return setError('Please fix the errors above.')

        try {
            setLoading(true)
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            })

            if (!response.ok) throw new Error('Form submission failed')

            setSuccess()
            form.reset()
        } catch (err) {
            setError('Submission failed. Please email sudipsubedi1024@gmail.com or try again later.')
        } finally {
            setLoading(false)
        }
    })

    form.querySelectorAll('.contact__input, .contact__textarea').forEach(i => i.addEventListener('blur', () => validateField(i)))
})()