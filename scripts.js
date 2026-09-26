document.addEventListener('DOMContentLoaded', () => {
  const routes = ['home', 'experience', 'projects', 'more'];
  const panels = new Map(routes.map((name) => [name, document.getElementById(name)]));
  const routeLinks = [...document.querySelectorAll('[data-route]')];
  const navigationBars = document.querySelectorAll('.desktop-tabs-inner, .mobile-nav');
  const main = document.getElementById('main');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visibleRoute;
  let transitionTimer;
  let entranceTimer;
  let initialTimer;
  let transitionId = 0;
  let focusAfterNavigation = false;

  function hashTarget() {
    try {
      return decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return '';
    }
  }

  function routeFromHash() {
    const hash = hashTarget();
    if (panels.has(hash)) return hash;
    if (['about', 'technical-profile', 'leadership', 'contact'].includes(hash)) return 'more';
    return 'home';
  }

  function setNavigation(route) {
    const index = routes.indexOf(route);
    navigationBars.forEach((bar) => bar.style.setProperty('--active-index', index));
    routeLinks.forEach((link) => {
      if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function showPanel(route) {
    panels.forEach((panel, name) => {
      const active = name === route;
      panel.classList.toggle('is-active', active);
      panel.inert = !active;
      if (active) panel.removeAttribute('aria-hidden');
      else panel.setAttribute('aria-hidden', 'true');
    });
    visibleRoute = route;
  }

  function positionAndFocus(route, shouldFocus) {
    const hash = hashTarget();
    const nestedTarget = hash && !panels.has(hash) ? document.getElementById(hash) : null;
    if (nestedTarget && panels.get(route).contains(nestedTarget)) nestedTarget.scrollIntoView();
    else window.scrollTo(0, 0);

    if (shouldFocus) {
      const heading = (nestedTarget && nestedTarget.querySelector('h1, h2')) || panels.get(route).querySelector('h1, h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function cancelTransition() {
    transitionId += 1;
    clearTimeout(transitionTimer);
    clearTimeout(entranceTimer);
    clearTimeout(initialTimer);
    transitionTimer = null;
    entranceTimer = null;
    initialTimer = null;
    panels.forEach((panel) => panel.classList.remove('is-exiting', 'is-entering', 'is-initial'));
    main.removeAttribute('aria-busy');
  }

  function updateView() {
    const route = routeFromHash();
    const shouldFocus = focusAfterNavigation;
    focusAfterNavigation = false;
    const initial = !document.documentElement.classList.contains('is-routed');
    cancelTransition();
    setNavigation(route);

    if (initial) {
      document.documentElement.classList.add('is-routed');
      showPanel(route);
      positionAndFocus(route, shouldFocus);
      if (route === 'home' && !reducedMotion.matches) {
        panels.get('home').classList.add('is-initial');
        initialTimer = setTimeout(() => panels.get('home').classList.remove('is-initial'), 420);
      }
      requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'));
      return;
    }

    if (route === visibleRoute || reducedMotion.matches) {
      showPanel(route);
      positionAndFocus(route, shouldFocus);
      return;
    }

    const previous = panels.get(visibleRoute);
    const direction = routes.indexOf(route) > routes.indexOf(visibleRoute) ? 'forward' : 'backward';
    main.dataset.motionDirection = direction;
    main.setAttribute('aria-busy', 'true');
    previous.classList.add('is-exiting');
    const thisTransition = transitionId;

    transitionTimer = setTimeout(() => {
      if (thisTransition !== transitionId) return;
      transitionTimer = null;
      previous.classList.remove('is-exiting');
      showPanel(route);
      const next = panels.get(route);
      next.classList.add('is-entering');
      main.removeAttribute('aria-busy');
      positionAndFocus(route, shouldFocus);
      entranceTimer = setTimeout(() => {
        if (thisTransition !== transitionId) return;
        entranceTimer = null;
        next.classList.remove('is-entering');
      }, 340);
    }, 80);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = link.getAttribute('href').slice(1);
    if (!panels.has(target) && !['about', 'technical-profile', 'leadership', 'contact'].includes(target)) return;
    focusAfterNavigation = true;
    if (window.location.hash === link.getAttribute('href')) {
      event.preventDefault();
      updateView();
    }
  }));

  document.querySelector('.skip-link').addEventListener('click', (event) => {
    event.preventDefault();
    const heading = panels.get(routeFromHash()).querySelector('h1, h2');
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  });

  const portrait = document.querySelector('.portrait-flip');
  let pinned = false;
  let hovered = false;
  function updatePortrait() {
    const flipped = pinned || hovered;
    portrait.classList.toggle('is-flipped', flipped);
    portrait.setAttribute('aria-pressed', String(flipped));
    portrait.setAttribute('aria-label', flipped ? 'Show professional photo of Belal' : 'Show casual photo of Belal');
  }
  portrait.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    updatePortrait();
  });
  portrait.addEventListener('pointerleave', () => {
    hovered = false;
    updatePortrait();
  });
  portrait.addEventListener('click', () => {
    pinned = !(pinned || hovered);
    hovered = false;
    updatePortrait();
  });

  window.addEventListener('hashchange', updateView);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) updateView();
  });
  updateView();
});
