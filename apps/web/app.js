const navItems = [...document.querySelectorAll('[data-panel-target]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const main = document.querySelector('#main');
const dialog = document.querySelector('#connections-dialog');
const panelNames = new Set(panels.map((panel) => panel.dataset.panel));

function panelFromLocation() {
  const candidate = window.location.hash.replace(/^#/, '');
  return panelNames.has(candidate) ? candidate : 'today';
}

function showPanel(name, { updateLocation = false, focusMain = true } = {}) {
  const target = panelNames.has(name) ? name : 'today';

  navItems.forEach((item) => {
    const active = item.dataset.panelTarget === target;
    if (active) {
      item.setAttribute('aria-current', 'page');
      item.dataset.state = 'selected';
    } else {
      item.removeAttribute('aria-current');
      item.removeAttribute('data-state');
    }
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== target;
  });

  if (updateLocation && window.location.hash !== `#${target}`) {
    window.history.pushState({ panel: target }, '', `#${target}`);
  }

  if (focusMain) main.focus({ preventScroll: true });
}

navItems.forEach((item) => {
  item.addEventListener('click', () => showPanel(item.dataset.panelTarget, { updateLocation: true }));
});

window.addEventListener('popstate', () => showPanel(panelFromLocation(), { focusMain: false }));
window.addEventListener('hashchange', () => showPanel(panelFromLocation(), { focusMain: false }));

document.querySelectorAll('[data-open-connections]').forEach((button) => {
  button.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
});

showPanel(panelFromLocation(), { focusMain: false });
