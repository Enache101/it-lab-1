'use strict';
(() => {
  const buttons = [...document.querySelectorAll('[data-install]')];
  const dialog = document.getElementById('installDialog');
  const action = document.getElementById('installConfirm');
  const status = document.getElementById('installStatus');
  const displayMode = window.matchMedia('(display-mode: standalone)');
  let pendingPrompt = null;
  let installedThisVisit = false;
  let busy = false;
  let opener = null;
  const standalone = () => displayMode.matches || navigator.standalone === true;
  function refresh() {
    const installed = standalone() || installedThisVisit;
    action.hidden = !pendingPrompt || installed;
    action.disabled = busy;
    buttons.forEach(button => {
      button.textContent = installed ? '✓ App added · Help' : '📲 Add to Home Screen';
    });
    if (installed) status.textContent = 'IT lab 1 is already open as an app or has just been added on this device.';
  }
  const ua = navigator.userAgent;
  const platform = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
    ? 'ios' : /Android/.test(ua) ? 'android' : /Macintosh/.test(ua) ? 'mac' : 'desktop';
  dialog.querySelectorAll('[data-platform]').forEach(item => { item.open = item.dataset.platform === platform; });
  buttons.forEach(button => button.addEventListener('click', () => {
    opener = button;
    refresh();
    if (!dialog.open) dialog.showModal();
  }));
  document.getElementById('installClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingPrompt = event;
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    installedThisVisit = true;
    pendingPrompt = null;
    refresh();
  });
  if (displayMode.addEventListener) displayMode.addEventListener('change', refresh);
  action.addEventListener('click', async () => {
    if (!pendingPrompt || busy) return;
    const prompt = pendingPrompt;
    pendingPrompt = null;
    busy = true;
    action.disabled = true;
    try {
      const result = await prompt.prompt();
      const choice = result || await prompt.userChoice;
      if (!installedThisVisit) status.textContent = choice && choice.outcome === 'accepted'
        ? 'Installation requested. Follow your browser’s confirmation, then find IT lab 1 in your apps or on your Home Screen.'
        : 'Nothing was added. You can use the website normally or add it later from your browser’s menu.';
    } catch {
      status.textContent = 'The browser could not open its install prompt. Follow the instructions for your device below.';
    } finally {
      busy = false;
      refresh();
    }
  });
  refresh();
})();
