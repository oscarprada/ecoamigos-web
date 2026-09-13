// Native modal dialog supplies top-layer rendering and an inert background.
export function activateDialog(dialog, trigger, onClose) {
  const focusable = () => [...dialog.querySelectorAll(
    'a[href],button,input,select,textarea,[tabindex],video[controls],audio[controls]'
  )].filter(node => !node.matches(':disabled') && node.tabIndex >= 0 &&
    !node.closest('[hidden],[inert]') && node.getClientRects().length > 0 &&
    getComputedStyle(node).visibility !== 'hidden');
  dialog.showModal();
  (focusable()[0] || dialog).focus();
  const keydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); onClose(); return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0], last = items.at(-1);
    const active = dialog.ownerDocument.activeElement;
    if (!first) { event.preventDefault(); dialog.focus(); }
    else if (event.shiftKey && (active === first || !items.includes(active))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || !items.includes(active))) {
      event.preventDefault(); first.focus();
    }
  };
  dialog.addEventListener('keydown', keydown);
  return () => {
    dialog.removeEventListener('keydown', keydown);
    if (dialog.open) dialog.close();
    if (trigger?.isConnected) trigger.focus();
  };
}
