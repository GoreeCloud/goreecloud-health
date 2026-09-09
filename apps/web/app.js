const navItems = [...document.querySelectorAll('[data-panel-target]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const dialog = document.querySelector('#connections-dialog');

function showPanel(name) {
  navItems.forEach((item) => {
    const active = item.dataset.panelTarget === name;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== name;
  });

  document.querySelector('#main').focus?.({ preventScroll: true });
}

navItems.forEach((item) => item.addEventListener('click', () => showPanel(item.dataset.panelTarget)));

document.querySelectorAll('[data-open-connections]').forEach((button) => {
  button.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
});
