import Vue from "vue";

/**
 * Light / dark theme.
 * - remembers the user's choice (localStorage "karrar.theme")
 * - the default is light; dark only when the user picks it
 * - sets <html data-theme="light|dark">; all colours come from CSS variables
 */
const STORAGE_KEY = "karrar.theme";

function saved() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch (e) {
    return null;
  }
}

export const themeState = Vue.observable({
  theme: saved() || "light",
});

function apply(theme, animate) {
  const html = document.documentElement;
  if (animate) {
    html.classList.add("k-theme-switching");
    window.setTimeout(() => html.classList.remove("k-theme-switching"), 400);
  }
  html.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0f1c" : "#0f172a");
}

export function setTheme(theme) {
  themeState.theme = theme === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(STORAGE_KEY, themeState.theme);
  } catch (e) {
    /* not remembered if storage is unavailable */
  }
  apply(themeState.theme, true);
}

export default {
  install(V) {
    apply(themeState.theme, false);
    Object.defineProperty(V.prototype, "$theme", {
      get() {
        return themeState.theme;
      },
    });
    V.prototype.$toggleTheme = () => setTheme(themeState.theme === "dark" ? "light" : "dark");
  },
};
