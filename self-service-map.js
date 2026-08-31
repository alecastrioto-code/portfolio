(() => {
  const root = document.querySelector('[data-system-map]');
  if (!root || root.dataset.mapReady === 'true') return;
  root.dataset.mapReady = 'true';

  const content = {
    context: {
      kicker: 'SELECTED LAYER · CONTEXT',
      title: 'Identify the customer, order and item.',
      description: 'Resolution has to attach to the right customer and product before the service can safely reason about an outcome.',
      example: 'Which product does “it” refer to?',
      why: 'Conversation can be ambiguous; the underlying system cannot be.'
    },
    state: {
      kicker: 'SELECTED LAYER · STATE',
      title: 'Establish what is actually happening.',
      description: 'The service assembles the relevant operational state rather than treating the customer’s wording as the system state.',
      example: 'Is the order still in production, in transit, or already delivered?',
      why: 'The same intent can require a different response depending on current state.'
    },
    policy: {
      kicker: 'SELECTED LAYER · POLICY',
      title: 'Determine which classes of outcome are permitted.',
      description: 'Policy, history and exceptions constrain what the service may safely offer without exposing the proprietary thresholds behind those decisions.',
      example: 'Is this case eligible for an automated action, guided next step, or specialist review?',
      why: 'A good experience cannot promise an outcome the business cannot execute.'
    },
    resolution: {
      kicker: 'SELECTED LAYER · RESOLUTION',
      title: 'Choose the safest useful next step.',
      description: 'Once enough information is available, the same logic can inform, guide, automate or route the case across different channels.',
      example: 'Give an update, complete an allowed action, or transfer with context.',
      why: 'Automation is one possible resolution mode, not the goal of the system.'
    },
    recovery: {
      kicker: 'SELECTED LAYER · RECOVERY',
      title: 'Design what happens when the system cannot decide safely.',
      description: 'Missing information, uncertainty and exceptions are explicit parts of the service rather than accidental dead ends.',
      example: 'Ask for one missing input or hand over with the context already collected.',
      why: 'Trust depends on graceful recovery as much as successful automation.'
    }
  };

  const buttons = Array.from(root.querySelectorAll('[data-map-step]'));
  const kicker = root.querySelector('[data-map-kicker]');
  const title = root.querySelector('[data-map-title]');
  const description = root.querySelector('[data-map-description]');
  const example = root.querySelector('[data-map-example]');
  const why = root.querySelector('[data-map-why]');

  function select(step, focus = false) {
    const data = content[step];
    if (!data) return;

    buttons.forEach((button) => {
      const active = button.dataset.mapStep === step;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });

    kicker.textContent = data.kicker;
    title.textContent = data.title;
    description.textContent = data.description;
    example.textContent = data.example;
    why.textContent = data.why;
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.mapStep));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;
      select(buttons[nextIndex].dataset.mapStep, true);
    });
  });
})();
