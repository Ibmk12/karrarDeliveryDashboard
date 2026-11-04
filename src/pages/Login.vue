<template>
  <div class="login-page" :class="{ 'is-paused': bgPaused }">
    <!-- Brand panel: Dubai at sunset, a KD van and a KD motorbike delivering; then the slogan and facts -->
    <div class="login-bg kl-panel">
      <div class="kl-top">
        <img class="kl-logo" src="@/assets/img/karrar-logo-light.png" alt="" />
        <span class="kl-name">{{ $tt('Karrar Delivery') }}</span>
      </div>

      <svg ref="bgSvg" class="kl-map kl-dubai" viewBox="0 0 620 300" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="klDubaiSun">
            <stop offset="0" stop-color="#ffb04d" stop-opacity=".55" />
            <stop offset=".5" stop-color="#f57c00" stop-opacity=".2" />
            <stop offset="1" stop-color="#f57c00" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- evening sun behind the skyline -->
        <circle cx="300" cy="200" r="170" fill="url(#klDubaiSun)" />
        <circle class="kl-dubai-sun" cx="360" cy="190" r="34" />

        <!-- Dubai skyline -->
        <g class="kl-dubai-sky">
          <!-- Dubai frame -->
          <path d="M70 250 V140 H118 V250 H108 V150 H80 V250 Z" />
          <!-- towers -->
          <rect x="128" y="176" width="22" height="74" />
          <rect x="154" y="160" width="16" height="90" />
          <rect x="176" y="186" width="26" height="64" />
          <!-- the tall tower -->
          <path d="M262 250 V196 H268 V150 H274 V104 H279 V64 H282 V30 L284 6 L286 30 H289 V64 H292 V104 H297 V150 H303 V196 H309 V250 Z" />
          <rect x="216" y="170" width="20" height="80" />
          <rect x="320" y="150" width="18" height="100" />
          <rect x="342" y="176" width="24" height="74" />
          <path d="M374 250 V160 L386 148 L398 160 V250 Z" />
          <!-- the sail on the coast -->
          <path d="M452 250 V120 Q 498 150 504 250 Z" />
          <path class="kl-sky-mast" d="M452 120 V100" />
          <rect x="516" y="190" width="24" height="60" />
          <rect x="544" y="172" width="18" height="78" />
        </g>

        <!-- the road -->
        <rect class="kl-dubai-road" x="0" y="250" width="620" height="50" />
        <path class="kl-dubai-lane" d="M0 276 H620" />

        <!-- KD van and KD motorbike delivering across the city -->
        <g class="kl-dubai-van"><g class="kl-v-bob">
              <path class="kl-v-body" d="M-36 -9 V-31 Q-36 -36 -31 -36 H12 Q15 -36 17 -34 L28 -23 H33 Q37 -23 37 -19 V-9 Q37 -6 34 -6 H-33 Q-36 -6 -36 -9 Z" />
              <path class="kl-v-glass" d="M15 -32 L25 -23 H15 Z" />
              <rect class="kl-v-panel" x="-31" y="-31" width="40" height="19" rx="3" />
              <image :href="logoDark" x="-28" y="-29" width="34" height="16" />
              <rect class="kl-v-light" x="34" y="-19" width="3" height="4" rx="1" />
            </g>
            <g class="kl-wheel"><circle r="6.5" cx="-21" cy="-5" /><circle class="kl-hubc" r="2" cx="-21" cy="-5" /></g>
            <g class="kl-wheel"><circle r="6.5" cx="22" cy="-5" /><circle class="kl-hubc" r="2" cx="22" cy="-5" /></g></g>
        <g class="kl-dubai-bike"><g class="kl-v-bob">
              <path class="kl-b-body" d="M-14 -8 L-6 -16 H6 L12 -20 H16 L18 -12 L14 -8 Z" />
              <path class="kl-b-rider" d="M0 -16 L3 -28 L11 -24 M3 -28 L6 -31" />
              <circle class="kl-b-helmet" cx="6" cy="-34" r="4.2" />
              <rect class="kl-b-box" x="-22" y="-30" width="17" height="15" rx="2.5" />
              <image :href="logoLight" x="-20.5" y="-26" width="14" height="7" />
            </g>
            <g class="kl-wheel"><circle r="5" cx="-12" cy="-4" /><circle class="kl-hubc" r="1.5" cx="-12" cy="-4" /></g>
            <g class="kl-wheel"><circle r="5" cx="15" cy="-4" /><circle class="kl-hubc" r="1.5" cx="15" cy="-4" /></g></g>

        <!-- where we are -->
        <g class="kl-dubai-tag" transform="translate(24 26)">
          <path d="M0 14 C -5 8, -7 5, -7 1 A 7 7 0 1 1 7 1 C 7 5, 5 8, 0 14 Z" />
          <circle cx="0" cy="1" r="2.6" />
          <text x="14" y="6">{{ $tt('Dubai') }}</text>
        </g>
      </svg>

      <div class="kl-copy">
        <h2 class="kl-slogan">{{ $tt('Your partner in success') }}</h2>
        <p class="kl-lead">{{ $tt('Deliveries to every emirate, tracked from the trader to the customer’s door.') }}</p>
        <ul class="kl-facts">
          <li><md-icon>place</md-icon><span>{{ $tt('All seven emirates') }}</span></li>
          <li><md-icon>timeline</md-icon><span>{{ $tt('Live status for every order') }}</span></li>
        </ul>
      </div>

      <p class="kl-legal">{{ $tt('Karrar for delivery services') }}</p>
    </div>

    <!-- language + theme, available before signing in -->
    <div class="login-tools">
      <button
        type="button"
        class="k-theme-btn"
        :aria-label="$tt($theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')"
        :title="$tt($theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')"
        @click="$toggleTheme()"
      >
        <transition name="k-theme-icon" mode="out-in">
          <md-icon :key="$theme">{{ $theme === 'dark' ? 'light_mode' : 'dark_mode' }}</md-icon>
        </transition>
      </button>
      <k-lang-toggle></k-lang-toggle>
    </div>

    <form class="action" @submit.prevent>
      <div class="login-card">
        <div class="login-brand">
          <span class="k-logo-fx">
            <img src="@/assets/img/karrar-logo-transparent.png" alt="KD" class="login-logo" />
          </span>
          <h1 class="login-title">
            {{ rememberedName ? $tt('Welcome back, {name}', { name: rememberedName }) : $tt('Welcome back') }}
          </h1>
          <p class="login-subtitle">
            {{ $tt('Sign in to the Karrar Delivery dashboard') }}
            <button v-if="remembered" type="button" class="k-not-you" @click="forgetMe">{{ $tt('Not you?') }}</button>
          </p>
        </div>

        <div v-if="!online" class="k-login-note is-offline" role="alert">
          <md-icon>wifi_off</md-icon>
          <span>{{ $tt("You're offline. Check your internet connection.") }}</span>
        </div>

        <transition name="k-note">
          <div v-if="online && signedOut && !errorMessage" class="k-login-note is-ok" role="status">
            <md-icon>check_circle</md-icon>
            <span>{{ $tt("You've signed out.") }}</span>
          </div>
        </transition>

        <div v-if="sessionExpired && !errorMessage" class="session-message" role="status">
          <md-icon>schedule</md-icon>
          <span>{{ $tt('Your session expired. Please sign in again.') }}</span>
        </div>

        <transition name="k-alert">
          <div v-if="errorMessage" class="error-message" :class="{ 'is-bump': alertBump }" role="alert" aria-live="assertive">
            <md-icon>error_outline</md-icon>
            <span>{{ $tt(errorMessage) }}</span>
          </div>
        </transition>

        <div class="k-phone" :class="{ 'has-error': hasPhoneError || phoneMissing, 'has-warning': phoneHint && !hasPhoneError && !phoneMissing }">
          <label class="k-phone-label" for="login-phone">{{ $tt('Phone number') }}</label>
          <div ref="ccWrap" class="k-phone-field">
          <div class="k-phone-input k-phone-box" :class="{ 'k-field-shake': shakePhone, 'is-cc-open': ccOpen }">
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
              id="login-phone"
              ref="phoneInput"
              :value="formattedPhone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              maxlength="20"
              :placeholder="country.placeholder"
              @input="onPhoneInput"
              @keydown.enter.prevent="onPhoneEnter"
            />
            <md-icon v-if="localPhone.length === 9" class="k-phone-ok" :title="$tt('Phone number looks right')">check_circle</md-icon>
            <span v-else class="k-phone-count">{{ localPhone.length }}/9</span>
          </div>

          <!-- country list -->
          <transition name="k-cc-pop">
            <ul
              v-if="ccOpen"
              ref="ccList"
              class="k-cc-list"
              role="listbox"
              tabindex="-1"
              :aria-label="$tt('Country key')"
              :aria-activedescendant="'k-cc-opt-' + ccActive"
              @keydown="onCcKey"
            >
              <li
                v-for="(c, i) in countries"
                :id="'k-cc-opt-' + i"
                :key="c.code"
                role="option"
                :aria-selected="String(c.code === countryCode)"
                class="k-cc-opt"
                :class="{ 'is-active': i === ccActive, 'is-selected': c.code === countryCode }"
                @mouseenter="ccActive = i"
                @mousedown.prevent="pickCc(c)"
              >
                <span class="k-flag is-lg" v-html="flags[c.code]"></span>
                <span class="k-cc-text">
                  <strong>{{ $tt(c.fullName) }}</strong>
                  <small>{{ c.sample }}</small>
                </span>
                <span class="k-cc-dial">+{{ c.code }}</span>
                <md-icon class="k-cc-check">{{ c.code === countryCode ? 'check_circle' : '' }}</md-icon>
              </li>
            </ul>
          </transition>
          </div>
          <transition name="k-hint">
            <p v-if="phoneHint" class="k-phone-hint is-warning" role="status">
              <md-icon>warning_amber</md-icon>
              {{ $tt(phoneHint, { first: country.firstDigitsText }) }}
            </p>
            <p v-else-if="phoneMissing" class="k-phone-hint" role="alert">
              <md-icon>error_outline</md-icon>
              {{ $tt('Enter your phone number') }}
            </p>
          </transition>
        </div>

        <div class="k-pass" :class="{ 'has-error': hasPasswordError || passwordMissing }">
          <div class="k-pass-head">
            <label class="k-phone-label" for="login-password">{{ $tt('Password') }}</label>
            <!-- hidden for now -->
            <!-- <button type="button" class="k-forgot" :aria-expanded="String(showForgot)" @click="showForgot = !showForgot">
              {{ $tt('Forgot password?') }}
            </button> -->
          </div>
          <div class="k-pass-input" :class="{ 'k-field-shake': shakePass }">
            <md-icon>lock_outline</md-icon>
            <input
              id="login-password"
              ref="passwordInput"
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              @input="onPasswordInput"
              @keydown="checkCapsLock"
              @keyup="checkCapsLock"
              @blur="capsLock = false"
              @keyup.enter="signIn"
            />
            <button
              type="button"
              class="k-pass-toggle"
              :aria-label="$tt(showPassword ? 'Hide password' : 'Show password')"
              :title="$tt(showPassword ? 'Hide password' : 'Show password')"
              @click="showPassword = !showPassword"
            >
              <md-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</md-icon>
            </button>
          </div>
          <transition name="k-hint">
            <p v-if="passwordMissing" class="k-phone-hint" role="alert">
              <md-icon>error_outline</md-icon>
              {{ $tt('Enter your password') }}
            </p>
          </transition>
          <transition name="k-hint">
            <p v-if="capsLock" class="k-caps-hint">
              <md-icon>keyboard_capslock</md-icon>
              {{ $tt('Caps Lock is on') }}
            </p>
          </transition>
          <!-- "Forgot password?" note, hidden for now
          <transition name="k-hint">
            <p v-if="showForgot" class="k-forgot-note" role="status">
              <md-icon>support_agent</md-icon>
              {{ $tt('Ask your administrator to reset your password.') }}
            </p>
          </transition>
          -->
        </div>

        <md-button class="md-raised md-primary login-btn" @click="signIn()" :disabled="isLoading || !online">
          <span v-if="isLoading" class="login-btn-busy">
            <md-progress-spinner :md-diameter="18" :md-stroke="3" md-mode="indeterminate" class="login-spinner"></md-progress-spinner>
            {{ $tt('Signing in…') }}
          </span>
          <span v-else>{{ $tt('Sign in') }}</span>
        </md-button>
        <transition name="k-hint">
          <p v-if="isLoading && slowServer" class="k-slow-note" role="status">
            <md-icon>hourglass_top</md-icon>
            {{ $tt('The server is waking up. This can take up to a minute…') }}
          </p>
        </transition>
      </div>
      <p class="login-footer">
        &copy; {{ new Date().getFullYear() }} {{ $tt('Karrar Delivery') }} · {{ $tt('Delivery Services') }}
        <span v-if="appVersion" class="login-version" :title="$tt('Version')">v{{ appVersion }}<template v-if="buildDate"> · {{ buildDate }}</template></span>
      </p>
    </form>
  </div>
</template>

<script>
import {AuthenticationService} from "@/services/AuthenticationService";
import { ensureProfile } from "@/plugins/auth";
import { Config } from "@/services/Config";

// Country keys for the phone number. The number is sent to the backend as
// key + 9 digits, e.g. 971 + 501234567 -> "971501234567".
const COUNTRIES = [
  { code: "971", label: "🇦🇪 +971", name: "UAE", fullName: "United Arab Emirates", sample: "50 123 4567", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "966", label: "🇸🇦 +966", name: "KSA", fullName: "Saudi Arabia", sample: "55 123 4567", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "249", label: "🇸🇩 +249", name: "Sudan", fullName: "Sudan", sample: "91 234 5678", firstDigits: ["9", "1"], firstDigitsText: "9 / 1", placeholder: "9XXXXXXXX" },
];
const COUNTRY_KEY = "karrar.loginCountry";

// Small SVG flags: emoji flags don't show on Windows (they appear as "AE", "SA").
const FLAGS = {
  971:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#00732f"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><rect width="8" height="20" fill="#ef3340"/></svg>',
  966:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#006c35"/><path d="M8 7.6c1.5-1.1 3 .9 4.5-.2s3 .9 4.5-.1 3 .9 4.5-.2" stroke="#fff" stroke-width="1.15" fill="none" stroke-linecap="round"/><path d="M8.6 13.4h12.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/><path d="M21.2 12.5l1.8.9-1.8.9z" fill="#fff"/></svg>',
  249:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#d21034"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M0 0 11 10 0 20z" fill="#007229"/></svg>',
};
// last person who signed in on this device: { cc, phone (9 digits), name }
const REMEMBER_KEY = "karrar.lastLogin";

function readRemembered() {
  try {
    const r = JSON.parse(localStorage.getItem(REMEMBER_KEY) || "null");
    return r && /^\d{9}$/.test(r.phone) && COUNTRIES.some((c) => c.code === r.cc) ? r : null;
  } catch (e) {
    return null;
  }
}

// "501234567" -> "50 123 4567"
function formatPhone(d) {
  if (!d) return "";
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ");
}

// Pull the 9 local digits out of whatever was typed, pasted or autofilled.
// Returns { digits, code (country found in the number, if any), dropped (digits removed) }.
function parsePhone(raw, countries) {
  const all = String(raw || "").replace(/\D/g, "");
  let d = all;
  let code = null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length > 9) {
    const c = countries.find((x) => d.startsWith(x.code) && d.length - x.code.length >= 9);
    if (c) {
      code = c.code;
      d = d.slice(c.code.length);
    }
  }
  if (d.startsWith("0")) d = d.replace(/^0+/, ""); // local "05..." -> "5..."
  d = d.slice(0, 9);
  return { digits: d, code, dropped: all.length - d.length };
}

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone: null,
        password: null
      },
      countries: COUNTRIES,
      flags: FLAGS,
      ccOpen: false,
      ccActive: 0,
      countryCode: (() => {
        try {
          const saved = localStorage.getItem(COUNTRY_KEY);
          return COUNTRIES.some((c) => c.code === saved) ? saved : "971"; // UAE by default
        } catch (e) {
          return "971";
        }
      })(),
      localPhone: "",
      phoneHint: null,
      showPassword: false,
      capsLock: false,
      sessionExpired: false,
      redirectTo: null,
      errorMessage: null,
      hasPhoneError: false,
      hasPasswordError: false,
      isLoading: false,
      slowServer: false,
      showForgot: false,
      bgPaused: false,
      logoLight: require("@/assets/img/karrar-logo-light.png"),
      logoDark: require("@/assets/img/karrar-logo-transparent.png"),
      remembered: readRemembered(),
      signedOut: false,
      phoneMissing: false,
      passwordMissing: false,
      online: typeof navigator === "undefined" || navigator.onLine !== false,
      shakePhone: false,
      shakePass: false,
      alertBump: false,
      appVersion: process.env.VUE_APP_VERSION || "",
      buildDate: process.env.VUE_APP_BUILD_DATE || ""
    }
  },
  computed: {
    country() {
      return this.countries.find((c) => c.code === this.countryCode) || this.countries[0];
    },
    // 501234567 -> "50 123 4567" (easier to check by eye)
    rememberedName() {
      const n = this.remembered && this.remembered.name;
      return n ? String(n).trim() : ""; // first and last name, as in the top bar
    },
    formattedPhone() {
      return formatPhone(this.localPhone);
    },
  },
  mounted() {
    // why we are here: session ran out (set by the API layer) or a page needed sign-in
    try {
      const expiredFrom = sessionStorage.getItem("karrar.sessionExpired");
      if (expiredFrom !== null) {
        this.sessionExpired = true;
        sessionStorage.removeItem("karrar.sessionExpired");
        if (expiredFrom && expiredFrom !== "/login") this.redirectTo = expiredFrom;
      }
    } catch (e) {
      /* sessionStorage unavailable */
    }
    const q = this.$route.query || {};
    if (q.redirect && String(q.redirect).startsWith("/") && q.redirect !== "/login") this.redirectTo = q.redirect;
    if (q.expired) this.sessionExpired = true;

    // just signed out?
    try {
      if (sessionStorage.getItem("karrar.signedOut")) {
        this.signedOut = !this.sessionExpired;
        sessionStorage.removeItem("karrar.signedOut");
        this.signedOutTimer = setTimeout(() => (this.signedOut = false), 4000);
      }
    } catch (e) {
      /* ignore */
    }

    // same person as last time on this device: fill the number, go straight to the password
    if (this.remembered) {
      this.countryCode = this.remembered.cc;
      this.localPhone = this.remembered.phone;
      this.syncPhone();
    }

    // start typing straight away
    this.$nextTick(() => {
      const target = this.remembered ? this.$refs.passwordInput : this.$refs.phoneInput;
      if (target) target.focus();
    });

    // Render puts the backend to sleep: knock on the door now so it's awake
    // by the time the password is typed (the reply itself doesn't matter)
    this.wakeServer();

    window.addEventListener("online", this.onOnline);
    window.addEventListener("offline", this.onOnline);

    // stop the background animation while the tab is hidden (saves battery on phones)
    document.addEventListener("visibilitychange", this.onVisibility);
    this.onVisibility();
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("online", this.onOnline);
    window.removeEventListener("offline", this.onOnline);
    clearTimeout(this.slowTimer);
    clearTimeout(this.shakeTimer);
    clearTimeout(this.signedOutTimer);
    document.removeEventListener("mousedown", this.onCcOutside, true);
  },
  methods: {
    checkCapsLock(e) {
      if (e && typeof e.getModifierState === "function") this.capsLock = e.getModifierState("CapsLock");
    },
    onOnline() {
      this.online = navigator.onLine !== false;
      if (this.online) this.wakeServer();
    },
    wakeServer() {
      if (!this.online || typeof fetch !== "function") return;
      try {
        const root = Config.base_url().replace(/\/api\/v1\/?$/, "/");
        fetch(root, { mode: "no-cors", cache: "no-store", credentials: "omit" }).catch(() => {});
      } catch (e) {
        /* best effort only */
      }
    },
    forgetMe() {
      try {
        localStorage.removeItem(REMEMBER_KEY);
      } catch (e) {
        /* ignore */
      }
      this.remembered = null;
      this.localPhone = "";
      this.user.password = null;
      this.syncPhone();
      this.clearErrors();
      this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
    },
    rememberMe() {
      const entry = { cc: this.countryCode, phone: this.localPhone, name: "" };
      const prev = readRemembered();
      if (prev && prev.cc === entry.cc && prev.phone === entry.phone) entry.name = prev.name || "";
      const save = () => {
        try {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify(entry));
        } catch (e) {
          /* ignore */
        }
      };
      save();
      // fill in the name once the profile is loaded
      Promise.resolve(ensureProfile())
        .then((p) => {
          if (p && p.name) {
            entry.name = p.name;
            save();
          }
        })
        .catch(() => {});
    },
    // Shake only the box(es) that need attention, with a red ring, and
    // nudge the message at the top if it was already showing.
    shakeFields(phone, pass) {
      this.shakePhone = false;
      this.shakePass = false;
      this.alertBump = false;
      clearTimeout(this.shakeTimer);
      // wait a frame so the animation restarts on repeated clicks
      this.$nextTick(() =>
        requestAnimationFrame(() => {
          this.shakePhone = !!phone;
          this.shakePass = !!pass;
          this.alertBump = true;
          this.shakeTimer = setTimeout(() => {
            this.shakePhone = false;
            this.shakePass = false;
            this.alertBump = false;
          }, 800);
        })
      );
    },
    onVisibility() {
      this.bgPaused = document.hidden;
      const svg = this.$refs.bgSvg;
      if (svg && typeof svg.pauseAnimations === "function") {
        if (document.hidden) svg.pauseAnimations();
        else svg.unpauseAnimations();
      }
    },
    // Accepts typing, pasting and browser autofill:
    //   "+971 50 123 4567", "00971501234567", "0501234567", "501234567"
    // A full number picks its country; a leading 0 is dropped; max 9 digits,
    // and the first digit must fit the country.
    onPhoneInput(e) {
      const el = e.target;
      const raw = String(el.value || "");
      const caret = el.selectionStart == null ? raw.length : el.selectionStart;
      const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

      const parsed = parsePhone(raw, this.countries);
      let changedShape = parsed.dropped > 0;
      if (parsed.code && parsed.code !== this.countryCode) {
        this.countryCode = parsed.code;
        this.rememberCountry();
        changedShape = true;
      }

      let digits = parsed.digits;
      if (digits && !this.country.firstDigits.includes(digits[0])) {
        digits = "";
        this.phoneHint = "Numbers for this country start with {first}";
      } else {
        this.phoneHint = null;
      }
      this.localPhone = digits;
      if (digits) this.phoneMissing = false;
      this.signedOut = false;
      this.clearErrors();
      this.syncPhone();

      // write the formatted value back and keep the caret after the same digit
      const formatted = formatPhone(digits);
      el.value = formatted;
      let pos = formatted.length;
      if (!changedShape) {
        let seen = 0;
        pos = 0;
        while (pos < formatted.length && seen < digitsBeforeCaret) {
          if (/\d/.test(formatted[pos])) seen++;
          pos++;
        }
      }
      if (document.activeElement === el) el.setSelectionRange(pos, pos);
    },
    // Enter in the phone box moves on to the password (or signs in if it's filled)
    onPhoneEnter() {
      if (this.user.password) this.signIn();
      else if (this.$refs.passwordInput) this.$refs.passwordInput.focus();
    },
    rememberCountry() {
      try {
        localStorage.setItem(COUNTRY_KEY, this.countryCode);
      } catch (e) {
        /* not remembered */
      }
    },
    onCountryChange() {
      this.rememberCountry();
      // a number typed for the previous country may not fit the new one
      if (this.localPhone && !this.country.firstDigits.includes(this.localPhone[0])) {
        this.localPhone = "";
        this.phoneHint = "Numbers for this country start with {first}";
      } else {
        this.phoneHint = null;
      }
      this.syncPhone();
      this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
    },
    syncPhone() {
      this.user.phone = this.localPhone ? this.countryCode + this.localPhone : null;
    },
    stopSlowTimer() {
      clearTimeout(this.slowTimer);
      this.slowServer = false;
    },
    // ---- country key list
    toggleCc() {
      if (this.ccOpen) this.closeCc(true);
      else this.openCc();
    },
    openCc() {
      if (this.ccOpen) return;
      const i = this.countries.findIndex((c) => c.code === this.countryCode);
      this.ccActive = i < 0 ? 0 : i;
      this.ccOpen = true;
      document.addEventListener("mousedown", this.onCcOutside, true);
      this.$nextTick(() => this.$refs.ccList && this.$refs.ccList.focus());
    },
    closeCc(focusButton) {
      this.ccOpen = false;
      document.removeEventListener("mousedown", this.onCcOutside, true);
      if (focusButton) this.$nextTick(() => this.$refs.ccBtn && this.$refs.ccBtn.focus());
    },
    onCcOutside(e) {
      if (this.$refs.ccWrap && !this.$refs.ccWrap.contains(e.target)) this.closeCc(false);
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
      if (c.code !== this.countryCode) {
        this.countryCode = c.code;
        this.onCountryChange(); // remembers it and puts the cursor in the number
      } else {
        this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
      }
    },
    onPasswordInput() {
      if (this.user.password) this.passwordMissing = false;
      this.signedOut = false;
      this.clearErrors();
    },
    clearErrors() {
      this.errorMessage = null;
      this.hasPhoneError = false;
      this.hasPasswordError = false;
    },
    signIn() {
      // Phone must be exactly 9 digits after the country key
      if (this.localPhone && this.localPhone.length !== 9) {
        this.hasPhoneError = true;
        this.errorMessage = "Enter 9 digits after the country key";
        this.signedOut = false;
        this.shakeFields(true, false);
        return;
      }
      // Validate inputs
      if (!this.user.phone || !this.user.password) {
        this.phoneMissing = !this.user.phone;
        this.passwordMissing = !this.user.password;
        this.signedOut = false;
        this.errorMessage =
          this.phoneMissing && this.passwordMissing
            ? "Enter your phone number and password"
            : this.phoneMissing
              ? "Enter your phone number"
              : "Enter your password";
        this.shakeFields(this.phoneMissing, this.passwordMissing);
        // put the cursor in the first empty box
        this.$nextTick(() => {
          const el = this.phoneMissing ? this.$refs.phoneInput : this.$refs.passwordInput;
          if (el) el.focus();
        });
        return;
      }

      this.isLoading = true;
      this.clearErrors();
      // Render puts the backend to sleep; the first sign-in can take a while
      this.slowServer = false;
      clearTimeout(this.slowTimer);
      this.slowTimer = setTimeout(() => {
        this.slowServer = true;
      }, 5000);

      AuthenticationService.login(this.user)
        .then(response => {
          this.isLoading = false;
          this.stopSlowTimer();
          if (response.data && response.data.accessToken) {
            if (AuthenticationService.isAuth()) {
              this.rememberMe(); // also loads the profile
              // back to the page the user was on before (if any), otherwise home
              this.$router.push(this.redirectTo || "/");
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.stopSlowTimer();
          const apiError = err && err.response && err.response.data && err.response.data.errorDtoList && err.response.data.errorDtoList[0];
          const apiMessage = (apiError && apiError.errorMessage) || "";

          if (err.isAuthError) {
            // wrong phone number or password
            this.errorMessage = "Invalid phone number or password";
            this.hasPhoneError = true;
            this.hasPasswordError = true;
            this.shakeFields(true, true);
            // select the password so typing again replaces it
            this.$nextTick(() => {
              const el = this.$refs.passwordInput;
              if (el) {
                el.focus();
                el.select();
              }
            });
          } else if (/disabled|غير مفعل/i.test(apiMessage)) {
            this.errorMessage = "Your account is disabled. Please contact an administrator.";
          } else if (!err.response) {
            // backend not reachable (down, offline, CORS ...)
            this.errorMessage = "Can't reach the server. Check your connection and try again.";
          } else if (err.response.status >= 500 && !apiMessage) {
            this.errorMessage = "The server had a problem. Please try again in a moment.";
          } else {
            this.errorMessage = apiMessage || "An error occurred during login. Please try again later.";
            console.error("Login error:", err);
          }
        });
    }
  },
}
</script>
<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(1200px 600px at 85% 110%, rgba(245, 124, 0, 0.38), transparent 60%),
    radial-gradient(900px 500px at -10% -20%, rgba(59, 130, 246, 0.16), transparent 60%),
    linear-gradient(160deg, #0b1222 0%, #111c33 55%, #0d1526 100%);
}

/* faint dotted grid for texture (single-column layout only) */
@media (min-width: 1024px) {
  .login-page::after { display: none; }
}

.login-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  pointer-events: none;
}

.login-tools {
  position: absolute;
  top: 16px;
  inset-inline-end: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d4ed8;
  background-color: #dbeafe;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: start;
}

.session-message .md-icon {
  color: #2563eb !important;
  font-size: 20px !important;
  margin: 0;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 18px;
  padding: 32px 32px 28px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 22px;
}

.login-logo {
  height: 56px;
  width: auto;
  margin-bottom: 16px;
  animation: k-logo-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.login-subtitle {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: #6b7280;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: start;
}

.error-message .md-icon {
  color: #dc2626 !important;
  font-size: 20px !important;
  margin: 0;
}

.login-btn {
  width: 100%;
  height: 44px !important;
  margin: 18px 0 0 !important;
  font-size: 15px !important;
}

.login-spinner {
  display: inline-block;
  vertical-align: middle;
}

.login-spinner >>> .md-progress-spinner-circle {
  stroke: #fff !important;
}

.login-footer {
  margin-top: 20px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }
}
</style>
