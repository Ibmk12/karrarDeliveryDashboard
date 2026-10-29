import Vue from "vue";
import ar, { patterns as arPatterns } from "./ar";

const dictionaries = { ar };
const dictPatterns = { ar: arPatterns };
const STORAGE_KEY = "karrar.lang";

function readLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
  } catch (e) {
    return "en";
  }
}

export const i18nState = Vue.observable({ lang: readLang() });
const listeners = [];

/** Run fn(lang) whenever the language changes. */
export function onLangChange(fn) {
  listeners.push(fn);
}

function fill(text, params) {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined && params[k] !== null ? params[k] : ""));
}

/**
 * Translate an English UI string to the current language.
 * $tt("Showing {a} of {b} orders", { a: 5, b: 29 })
 */
export function translate(text, params) {
  if (text === null || text === undefined) return text;
  const s = String(text);
  const lang = i18nState.lang; // reactive dependency
  if (lang !== "en") {
    const dict = dictionaries[lang] || {};
    if (Object.prototype.hasOwnProperty.call(dict, s)) return fill(dict[s], params);
    const trimmed = s.trim();
    if (trimmed !== s && Object.prototype.hasOwnProperty.call(dict, trimmed)) return fill(dict[trimmed], params);
    for (const [re, out] of dictPatterns[lang] || []) {
      if (re.test(s)) return s.replace(re, out);
    }
  }
  return fill(s, params);
}

export function applyDocumentLang(lang) {
  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
}

export function setLang(lang) {
  i18nState.lang = lang === "ar" ? "ar" : "en";
  try {
    localStorage.setItem(STORAGE_KEY, i18nState.lang);
  } catch (e) {
    /* storage unavailable: language just won't be remembered */
  }
  applyDocumentLang(i18nState.lang);
  listeners.forEach((fn) => fn(i18nState.lang));
}

export default {
  install(V) {
    V.prototype.$tt = translate;
    V.prototype.$setLang = setLang;
    Object.defineProperty(V.prototype, "$lang", {
      get() {
        return i18nState.lang;
      },
    });
    applyDocumentLang(i18nState.lang);
  },
};
