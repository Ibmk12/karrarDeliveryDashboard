import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { i18nState } from "@/i18n";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

/**
 * Parse the date strings the API returns: "23-10-2026 12:00 AM",
 * "23-10-2026", "2026-10-23", "2026-10-23T10:00:00", ...
 */
export function parseApiDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value) ? null : value;
  const s = String(value).trim();
  const dmy = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?)?/i);
  if (dmy) {
    let h = dmy[4] ? parseInt(dmy[4], 10) : 0;
    const m = dmy[5] ? parseInt(dmy[5], 10) : 0;
    const ap = (dmy[6] || "").toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return new Date(+dmy[3], +dmy[2] - 1, +dmy[1], h, m);
  }
  const d = new Date(s.replace(" ", "T"));
  return isNaN(d) ? null : d;
}

/** "23 Oct 2026" (+ ", 2:30 PM" when the time isn't midnight) */
export function displayDate(value, withTime = true) {
  const d = parseApiDate(value);
  if (!d) return value || "—";
  const ar = i18nState.lang === "ar";
  let out = `${String(d.getDate()).padStart(2, "0")} ${(ar ? MONTHS_AR : MONTHS)[d.getMonth()]} ${d.getFullYear()}`;
  if (withTime && (d.getHours() || d.getMinutes())) {
    const h = d.getHours() % 12 || 12;
    const pm = d.getHours() >= 12;
    const time = `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ar ? (pm ? "م" : "ص") : pm ? "PM" : "AM"}`;
    out += (ar ? "، " : ", ") + time;
  }
  return out;
}

/** 1250 -> "1,250"; 12.5 -> "12.50" */
export function displayMoney(value) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (isNaN(n)) return value;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export default {
  install(Vue) {
    // display filters
    Vue.filter("kDate", (v) => displayDate(v));
    Vue.filter("kDay", (v) => displayDate(v, false));
    Vue.filter("money", displayMoney);
    Vue.prototype.$parseApiDate = parseApiDate;

    // v-enter-submit="applyFilters": pressing Enter in any field inside the
    // element runs the handler (ignored while picking from a dropdown list)
    Vue.directive("enter-submit", {
      bind(el, binding) {
        el.__kEnter = (e) => {
          if (e.key !== "Enter" || e.isComposing) return;
          const t = e.target;
          if (t.closest && t.closest(".v-select, textarea, button")) return;
          if (typeof binding.value === "function") binding.value(e);
        };
        el.addEventListener("keyup", el.__kEnter);
      },
      unbind(el) {
        el.removeEventListener("keyup", el.__kEnter);
      },
    });

    // themed confirm dialog (single instance appended to <body>)
    let confirmVm = null;
    Vue.prototype.$kConfirm = function (opts) {
      if (!confirmVm) {
        const host = document.createElement("div");
        document.body.appendChild(host);
        confirmVm = new (Vue.extend(ConfirmDialog))().$mount(host);
      }
      return confirmVm.open(typeof opts === "string" ? { message: opts } : opts);
    };

    // `$toast.success(msg)` / `.error` / `.info` / `.warning` — used in OrdersList
    // but never registered before; route them to the dashboard notifications.
    if (!Vue.prototype.$toast) {
      const show = (type, icon) =>
        function (message) {
          this.$notify({ message, icon, type, horizontalAlign: "right", verticalAlign: "top" });
        };
      Object.defineProperty(Vue.prototype, "$toast", {
        get() {
          return {
            success: show("success", "check_circle").bind(this),
            error: show("danger", "error").bind(this),
            info: show("info", "info").bind(this),
            warning: show("warning", "warning").bind(this),
          };
        },
      });
    }
  },
};
