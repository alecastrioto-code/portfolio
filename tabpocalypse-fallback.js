/* Standalone recovery binding for Tabpocalypse.
   It only runs if the shared script did not finish initialising the game. */
(() => {
  const modal = document.querySelector('[data-tabpocalypse]');
  if (!modal || modal.dataset.tabpocalypseBound === 'true') return;

  const openButton = document.querySelector('[data-tabpocalypse-open]');
  const closeButtons = modal.querySelectorAll('[data-tabpocalypse-close]');
  const count = modal.querySelector('[data-tabpocalypse-count]');
  const health = modal.querySelector('[data-tabpocalypse-health]');
  const manual = modal.querySelector('[data-tabpocalypse-manual]');
  const ai = modal.querySelector('[data-tabpocalypse-ai]');
  const stressBar = modal.querySelector('[data-tabpocalypse-stress-bar]');
  const stressLabel = modal.querySelector('[data-tabpocalypse-stress-label]');
  const empty = modal.querySelector('[data-tabpocalypse-summary-empty]');
  const generated = modal.querySelector('[data-tabpocalypse-summary-generated]');
  const status = modal.querySelector('[data-tabpocalypse-summary-status]');
  const result = modal.querySelector('[data-tabpocalypse-result]');
  const tabs = modal.querySelector('[data-tabpocalypse-tabs]');

  let tabCount = 17;
  let manualClicks = 0;

  const buildTabs = () => {
    if (!tabs || tabs.children.length) return;
    ['Salesforce','Case #48172','Customer Chat','Order Search','Knowledge Base','Missing Orders Policy','Tracking','Chat — Jamie','Chat — Priya','Email','Case maybe','Untitled','Definitely the right case','Why is this open','???','Help','help'].forEach(label => {
      const el = document.createElement('div');
      el.className = 'tabpocalypse-tab';
      el.textContent = label;
      tabs.appendChild(el);
    });
  };

  const reset = () => {
    tabCount = 17;
    manualClicks = 0;
    modal.classList.remove('is-restored');
    if (count) count.textContent = '17';
    if (health) health.textContent = 'WORKSPACE HEALTH: QUESTIONABLE';
    if (stressBar) stressBar.style.width = '46%';
    if (stressLabel) stressLabel.textContent = 'MANAGEABLE-ISH';
    if (empty) empty.hidden = false;
    if (generated) generated.hidden = true;
    if (status) status.textContent = 'NOT STARTED';
    if (result) result.hidden = true;
    if (manual) manual.textContent = "I'll do it manually";
    buildTabs();
  };

  const open = () => {
    reset();
    modal.hidden = false;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
  };

  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden','true');
    }, 250);
  };

  openButton?.addEventListener('click', () => {
    window.PortfolioEggs?.unlock?.('egg-05');
    open();
  });

  closeButtons.forEach(button => button.addEventListener('click', close));
  modal.querySelector('.tabpocalypse-backdrop')?.addEventListener('click', close);

  manual?.addEventListener('click', () => {
    manualClicks += 1;
    tabCount += manualClicks === 1 ? 3 : manualClicks === 2 ? 4 : 5;
    if (count) count.textContent = String(tabCount);
    if (stressBar) stressBar.style.width = `${Math.min(46 + manualClicks * 18, 100)}%`;
    if (stressLabel) stressLabel.textContent = manualClicks === 1 ? 'MILDLY CURSED' : manualClicks === 2 ? 'CONCERNING' : 'CRITICAL';
    if (health) health.textContent = manualClicks === 1 ? 'WORKSPACE HEALTH: DETERIORATING' : manualClicks === 2 ? 'WORKSPACE HEALTH: POOR' : 'WORKSPACE HEALTH: ABSOLUTELY NOT';
  });

  ai?.addEventListener('click', () => {
    modal.classList.add('is-restored');
    if (count) count.textContent = '3';
    if (health) health.textContent = 'WORKSPACE HEALTH: SUSPICIOUSLY HEALTHY';
    if (empty) empty.hidden = true;
    if (generated) generated.hidden = false;
    if (status) status.textContent = 'GENERATED';
    if (result) result.hidden = false;
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });

  modal.dataset.tabpocalypseBound = 'fallback';
})();
