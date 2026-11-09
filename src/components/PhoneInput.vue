<template>
  <div ref="wrap" class="k-phone k-phone-field" :class="{ 'has-warning': showError }">
    <label v-if="label" class="k-phone-label" :for="inputId">{{ label }}</label>

    <!-- one box: country key (same menu as the login page) + the 9-digit number -->
    <div ref="box" class="k-phone-input k-phone-box" :class="{ 'is-cc-open': ccOpen }">
      <button
        ref="ccBtn"
        type="button"
        class="k-cc-btn"
        :aria-label="$tt('Country key') + ': ' + $tt(country.fullName) + ' +' + country.code"
        aria-haspopup="listbox"
        :aria-expanded="String(ccOpen)"
        @click="toggleCc"
        @keydown.down.prevent="openCc"
        @keydown.up.prevent="openCc"
      >
        <span class="k-flag" v-html="flags[country.code]"></span>
        <span class="k-cc-code">+{{ country.code }}</span>
        <md-icon class="k-cc-chev">expand_more</md-icon>
      </button>
      <span class="k-phone-sep" aria-hidden="true"></span>
      <input
        :id="inputId"
        ref="input"
        :value="formatted"
        type="tel"
        inputmode="numeric"
        autocomplete="off"
        maxlength="20"
        :placeholder="country.placeholder"
        :aria-invalid="showError ? 'true' : 'false'"
        @input="onLocal"
        @blur="touched = true"
      />
      <md-icon v-if="local.length === 9 && !errorText" class="k-phone-ok" :title="$tt('Phone number looks right')">check_circle</md-icon>
      <span v-else class="k-phone-count">{{ local.length }}/9</span>
    </div>

    <!-- country list: fixed to the screen so a dialog never cuts it off -->
    <transition name="k-cc-pop">
      <ul
        v-if="ccOpen"
        ref="ccList"
        class="k-cc-list is-floating"
        role="listbox"
        tabindex="-1"
        :style="listStyle"
        :aria-label="$tt('Country key')"
        :aria-activedescendant="inputId + '-cc-' + ccActive"
        @keydown="onCcKey"
      >
        <li
          v-for="(c, i) in countries"
          :id="inputId + '-cc-' + i"
          :key="c.code"
          role="option"
          :aria-selected="String(c.code === code)"
          class="k-cc-opt"
          :class="{ 'is-active': i === ccActive, 'is-selected': c.code === code }"
          @mouseenter="ccActive = i"
          @mousedown.prevent="pickCc(c)"
        >
          <span class="k-flag is-lg" v-html="flags[c.code]"></span>
          <span class="k-cc-text">
            <strong>{{ $tt(c.fullName) }}</strong>
            <small>{{ c.sample }}</small>
          </span>
          <span class="k-cc-dial">+{{ c.code }}</span>
          <md-icon class="k-cc-check">{{ c.code === code ? "check_circle" : "" }}</md-icon>
        </li>
      </ul>
    </transition>

    <p v-if="showError" class="k-phone-hint is-warning" role="status">
      <md-icon>warning</md-icon>
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export const PHONE_COUNTRIES = [
  { code: "971", label: "🇦🇪 +971", name: "UAE", fullName: "United Arab Emirates", sample: "50 123 4567", first: ["5"], firstText: "5", placeholder: "5X XXX XXXX" },
  { code: "966", label: "🇸🇦 +966", name: "KSA", fullName: "Saudi Arabia", sample: "55 123 4567", first: ["5"], firstText: "5", placeholder: "5X XXX XXXX" },
  { code: "249", label: "🇸🇩 +249", name: "Sudan", fullName: "Sudan", sample: "91 234 5678", first: ["9", "1"], firstText: "9 / 1", placeholder: "9X XXX XXXX" },
  { code: "251", label: "🇪🇹 +251", name: "Ethiopia", fullName: "Ethiopia", sample: "91 123 4567", first: ["9", "7"], firstText: "9 / 7", placeholder: "9X XXX XXXX" },
];

// Small SVG flags (emoji flags show as letters on Windows); same as the login page
const FLAGS = {
  971: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#00732f"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><rect width="8" height="20" fill="#ef3340"/></svg>',
  966: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#006c35"/><path d="M8 7.6c1.5-1.1 3 .9 4.5-.2s3 .9 4.5-.1 3 .9 4.5-.2" stroke="#fff" stroke-width="1.15" fill="none" stroke-linecap="round"/><path d="M8.6 13.4h12.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/><path d="M21.2 12.5l1.8.9-1.8.9z" fill="#fff"/></svg>',
  251: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#da121a"/><rect width="30" height="13.33" fill="#fcdd09"/><rect width="30" height="6.67" fill="#078930"/><circle cx="15" cy="10" r="4.6" fill="#0f47af"/><path d="M15 6.9l.9 2.2 2.3.1-1.8 1.4.7 2.3-2.1-1.3-2 1.3.6-2.3-1.8-1.4 2.3-.1z" fill="#fcdd09"/></svg>',
  249: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#d21034"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M0 0 11 10 0 20z" fill="#007229"/></svg>',
};

/** "+971501234567" / "0501234567" / "971501234567" -> { code: "971", local: "501234567" } */
export function splitPhone(value) {
  const raw = String(value || "").trim();
  let d = raw.replace(/\D/g, "");
  const international = raw.startsWith("+") || d.startsWith("00");
  if (d.startsWith("00")) d = d.slice(2);
  // "+971..." always carries the code; a bare "971501234567" only when it's long enough
  const c = PHONE_COUNTRIES.find((x) => d.startsWith(x.code) && (international || d.length > 9));
  if (c) return { code: c.code, local: d.slice(c.code.length) };
  if (d.startsWith("0")) d = d.slice(1);
  return { code: "971", local: d };
}

/** true when the number is a full, valid local number for its country */
export function isValidPhone(value) {
  return !phoneProblem(value, true);
}

/**
 * What is wrong with a phone number, or null when it is fine.
 * Accepts "+971501234567", "971501234567", "0501234567" or "501234567".
 * The first digit must fit the country (UAE / KSA: 5, Sudan: 9 or 1).
 * `strict` also asks for all 9 digits (used when saving).
 */
export function phoneProblem(value, strict) {
  const { code, local } = splitPhone(value);
  const c = PHONE_COUNTRIES.find((x) => x.code === code) || PHONE_COUNTRIES[0];
  if (!local) return strict ? { key: "Enter the phone number" } : null;
  if (!c.first.includes(local[0])) return { key: "Numbers in {c} start with {d}", params: { c: c.name, d: c.firstText } };
  if (strict && !/^\d{9}$/.test(local)) return { key: "Enter 9 digits after +{code} ({n} so far)", params: { code: c.code, n: local.length } };
  return null;
}

/** how a stored number is written: "+971…" (plus), "971…" (plain) or "05…" (local) */
function formatOf(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.startsWith("+") || raw.startsWith("00")) return "plus";
  if (raw.startsWith("0")) return "local";
  return raw.replace(/\D/g, "").length > 9 ? "plain" : null;
}

// "501234567" -> "50 123 4567"
const group = (d) => (d ? [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ") : "");

let uid = 0;

/**
 * Country key (login-style menu with flags) + 9-digit number, checked as you type.
 * v-model format (`format` prop):
 *   "plus"  -> "+971501234567" (default)
 *   "plain" -> "971501234567"  (what the login sends; used for users)
 *   "local" -> "0501234567"
 *   "auto"  -> keep the way the existing number is written; new numbers use `newFormat`
 */
export default {
  name: "KPhoneInput",
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    format: { type: String, default: "plus" },
    newFormat: { type: String, default: "plain" },
    emptyText: { type: String, default: "Enter the customer's phone number" },
  },
  data() {
    uid += 1;
    const p = splitPhone(this.value);
    return {
      inputId: `k-phone-${uid}`,
      code: p.code,
      local: p.local,
      touched: false,
      lastEmitted: null,
      countries: PHONE_COUNTRIES,
      flags: FLAGS,
      ccOpen: false,
      ccActive: 0,
      listStyle: {},
      startFormat: formatOf(this.value),
    };
  },
  computed: {
    country() {
      return this.countries.find((c) => c.code === this.code) || this.countries[0];
    },
    formatted() {
      return group(this.local);
    },
    outFormat() {
      if (this.format !== "auto") return this.format;
      return this.startFormat || this.newFormat;
    },
    errorText() {
      if (!this.local) return this.$tt(this.emptyText);
      if (!this.country.first.includes(this.local[0])) return this.$tt("Numbers in {c} start with {d}", { c: this.country.name, d: this.country.firstText });
      if (this.local.length < 9) return this.$tt("Enter 9 digits after +{code} ({n} so far)", { code: this.code, n: this.local.length });
      return "";
    },
    showError() {
      // complain early about a wrong first digit, otherwise once the field is left
      const wrongStart = this.local && !this.country.first.includes(this.local[0]);
      return !!this.errorText && (wrongStart || this.touched);
    },
  },
  watch: {
    value(v) {
      if (v === this.lastEmitted) return; // our own update coming back
      this.touched = false;
      this.startFormat = formatOf(v);
      const p = splitPhone(v);
      if (p.local !== this.local || p.code !== this.code) {
        this.code = p.code;
        this.local = p.local;
      }
    },
  },
  beforeDestroy() {
    this.unlisten();
  },
  methods: {
    onLocal(e) {
      const el = e.target;
      let d = String(el.value || "").replace(/\D/g, "");
      if (d.startsWith("00")) d = d.slice(2);
      // a pasted full number picks its own country
      if (d.length > 9) {
        const c = this.countries.find((x) => d.startsWith(x.code) && d.length - x.code.length >= 9);
        if (c) {
          this.code = c.code;
          d = d.slice(c.code.length);
        }
      }
      if (d.startsWith("0")) d = d.replace(/^0+/, ""); // people often type the leading 0
      d = d.slice(0, 9);
      this.local = d;
      el.value = group(d);
      this.emit();
    },
    emit() {
      let v = "";
      if (this.local) {
        if (this.outFormat === "plain") v = this.code + this.local;
        else if (this.outFormat === "local") v = "0" + this.local;
        else v = `+${this.code}${this.local}`;
      }
      this.lastEmitted = v;
      this.$emit("input", v);
    },
    isValid() {
      this.touched = true;
      return !this.errorText;
    },

    // ---- country key menu (keyboard: ↑ ↓ Home End Enter Esc)
    toggleCc() {
      if (this.ccOpen) this.closeCc(true);
      else this.openCc();
    },
    openCc() {
      if (this.ccOpen) return;
      const i = this.countries.findIndex((c) => c.code === this.code);
      this.ccActive = i < 0 ? 0 : i;
      this.place();
      this.ccOpen = true;
      document.addEventListener("mousedown", this.onOutside, true);
      window.addEventListener("resize", this.onMove);
      window.addEventListener("scroll", this.onMove, true);
      this.$nextTick(() => {
        const ul = this.$refs.ccList;
        if (!ul) return;
        // live on <body> so dialogs (which clip and transform their content) can't hide or shift it
        if (ul.parentNode !== document.body) document.body.appendChild(ul);
        ul.focus();
      });
    },
    closeCc(focusButton) {
      this.ccOpen = false;
      this.unlisten();
      if (focusButton) this.$nextTick(() => this.$refs.ccBtn && this.$refs.ccBtn.focus());
    },
    unlisten() {
      document.removeEventListener("mousedown", this.onOutside, true);
      window.removeEventListener("resize", this.onMove);
      window.removeEventListener("scroll", this.onMove, true);
    },
    /** put the list under the box (or above it when there is no room below) */
    place() {
      const r = this.$refs.box.getBoundingClientRect();
      const h = 64 * this.countries.length + 14;
      const below = window.innerHeight - r.bottom > h + 12 || r.top < h + 12;
      this.listStyle = {
        position: "fixed",
        left: `${r.left}px`,
        width: `${Math.max(r.width, 280)}px`,
        top: below ? `${r.bottom + 6}px` : `${r.top - h - 6}px`,
        right: "auto",
      };
    },
    // the page or dialog moved: keep the list under the box (close it if the box left the screen)
    onMove(e) {
      if (e && e.type === "scroll" && this.$refs.ccList && this.$refs.ccList.contains(e.target)) return;
      const r = this.$refs.box && this.$refs.box.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) this.closeCc(false);
      else this.place();
    },
    onOutside(e) {
      const inside = (el) => el && el.contains(e.target);
      if (!inside(this.$refs.wrap) && !inside(this.$refs.ccList)) this.closeCc(false);
    },
    onCcKey(e) {
      const n = this.countries.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.ccActive = (this.ccActive + 1) % n;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.ccActive = (this.ccActive - 1 + n) % n;
      } else if (e.key === "Home") {
        e.preventDefault();
        this.ccActive = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        this.ccActive = n - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.pickCc(this.countries[this.ccActive]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        this.closeCc(true);
      } else if (e.key === "Tab") {
        this.closeCc(false);
      }
    },
    pickCc(c) {
      this.closeCc(false);
      if (c.code !== this.code) {
        this.code = c.code;
        this.emit();
      }
      this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
    },
  },
};
</script>
