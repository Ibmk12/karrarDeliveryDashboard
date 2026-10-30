/**
 * Keyboard helpers:
 *  - Tab / Shift+Tab stay inside the window that is open on top (dialogs,
 *    the order drawer, the confirm box, quick search, the server-down screen);
 *  - when one of them opens, focus moves into it, and goes back to where it
 *    was when it closes.
 */
const MODALS = "[data-k-modal], .k-confirm, .k-drawer, .md-dialog-container";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function topModal() {
  const all = Array.from(document.querySelectorAll(MODALS)).filter(visible);
  return all[all.length - 1] || null;
}

function focusables(root) {
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => visible(el) && !el.closest("[inert]"));
}

export default {
  install() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const modal = topModal();
      if (!modal) return;
      const items = focusables(modal);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!modal.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // move focus into a window when it opens, and back when it closes
    let opener = null;
    let current = null;
    const check = () => {
      const modal = topModal();
      if (modal === current) return;
      if (modal && !current) opener = document.activeElement;
      current = modal;
      if (modal) {
        if (!modal.contains(document.activeElement)) {
          // skip dropdown search boxes (they swallow Escape, so the dialog wouldn't close)
          const target =
            modal.querySelector("[autofocus], input:not([type=hidden]):not([type=checkbox]):not(.vs__search)") ||
            focusables(modal)[0] ||
            modal;
          if (target === modal && !modal.hasAttribute("tabindex")) modal.setAttribute("tabindex", "-1");
          setTimeout(() => target.focus && target.focus({ preventScroll: true }), 60);
        }
      } else if (opener && document.body.contains(opener)) {
        opener.focus({ preventScroll: true });
        opener = null;
      }
    };
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      setTimeout(() => {
        queued = false;
        check();
      }, 80);
    }).observe(document.body, { childList: true, subtree: true });
  },
};
