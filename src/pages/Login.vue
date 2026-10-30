<template>
  <div class="login-page">
    <!-- Brand background: navy + orange from the KD logo, delivery routes with moving parcels -->
    <div class="login-bg" aria-hidden="true">
      <!-- angular orange band echoing the "D" of the logo -->
      <div class="login-bg-band"></div>
      <div class="login-bg-band is-thin"></div>

      <!-- big KD watermark -->
      <img class="login-bg-mark" src="@/assets/img/karrar-logo-light.png" alt="" />

      <!-- delivery routes between hubs -->
      <svg class="login-bg-routes" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="kRoute" x1="0" x2="1">
            <stop offset="0" stop-color="#f57c00" stop-opacity="0" />
            <stop offset=".5" stop-color="#f57c00" stop-opacity=".55" />
            <stop offset="1" stop-color="#f57c00" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path id="kr1" class="route" d="M-40 690 C 260 560, 420 760, 700 610 S 1180 420, 1480 520" />
        <path id="kr2" class="route" d="M120 -20 C 230 220, 160 360, 380 470 S 760 520, 900 900" />
        <path id="kr3" class="route" d="M1480 160 C 1180 220, 1120 80, 860 170 S 520 260, 300 120" />
        <path id="kr4" class="route is-faint" d="M1040 940 C 1080 760, 1260 700, 1320 520 S 1300 240, 1460 60" />

        <!-- hubs -->
        <g class="hub"><circle cx="700" cy="610" r="5" /><circle class="pulse" cx="700" cy="610" r="5" /></g>
        <g class="hub"><circle cx="380" cy="470" r="5" /><circle class="pulse" cx="380" cy="470" r="5" /></g>
        <g class="hub"><circle cx="860" cy="170" r="5" /><circle class="pulse" cx="860" cy="170" r="5" /></g>
        <g class="hub"><circle cx="1320" cy="520" r="5" /><circle class="pulse" cx="1320" cy="520" r="5" /></g>

        <!-- parcels travelling along the routes -->
        <g class="parcel">
          <rect x="-7" y="-7" width="14" height="14" rx="3" />
          <animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#kr1" xlink:href="#kr1" /></animateMotion>
        </g>
        <g class="parcel is-small">
          <rect x="-5" y="-5" width="10" height="10" rx="2" />
          <animateMotion dur="18s" begin="-6s" repeatCount="indefinite" rotate="auto"><mpath href="#kr2" xlink:href="#kr2" /></animateMotion>
        </g>
        <g class="parcel">
          <rect x="-6" y="-6" width="12" height="12" rx="3" />
          <animateMotion dur="16s" begin="-3s" repeatCount="indefinite" rotate="auto"><mpath href="#kr3" xlink:href="#kr3" /></animateMotion>
        </g>
        <g class="parcel is-small">
          <rect x="-5" y="-5" width="10" height="10" rx="2" />
          <animateMotion dur="20s" begin="-10s" repeatCount="indefinite" rotate="auto"><mpath href="#kr4" xlink:href="#kr4" /></animateMotion>
        </g>
      </svg>

      <!-- company tagline -->
      <div class="login-bg-tagline">
        <strong>{{ $tt('Karrar for delivery services') }}</strong>
        <span>{{ $tt('Your partner in success') }}</span>
      </div>
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
      <div class="k-lang-switch" role="group" :aria-label="$tt('Language')">
        <button type="button" :class="{ active: $lang === 'en' }" @click="$setLang('en')">EN</button>
        <button type="button" :class="{ active: $lang === 'ar' }" @click="$setLang('ar')">عربي</button>
      </div>
    </div>

    <form class="action" @submit.prevent>
      <div class="login-card">
        <div class="login-brand">
          <img src="@/assets/img/karrar-logo-transparent.png" alt="KD" class="login-logo" />
          <h1 class="login-title">{{ $tt('Welcome back') }}</h1>
          <p class="login-subtitle">{{ $tt('Sign in to the Karrar Delivery dashboard') }}</p>
        </div>

        <div v-if="sessionExpired && !errorMessage" class="session-message" role="status">
          <md-icon>schedule</md-icon>
          <span>{{ $tt('Your session expired. Please sign in again.') }}</span>
        </div>

        <div v-if="errorMessage" class="error-message" role="alert" aria-live="assertive">
          <md-icon>error_outline</md-icon>
          <span>{{ $tt(errorMessage) }}</span>
        </div>

        <div class="k-phone" :class="{ 'has-error': hasPhoneError || phoneHint }">
          <label class="k-phone-label" for="login-phone">{{ $tt('Phone number') }}</label>
          <div class="k-phone-row">
            <div class="k-phone-country">
              <k-search-select
                v-model="countryCode"
                :options="countries"
                value-key="code"
                label-key="label"
                sub-key="name"
                :searchable="false"
                :clearable="false"
                @input="onCountryChange"
              ></k-search-select>
            </div>
            <div class="k-phone-input">
              <md-icon>phone_iphone</md-icon>
              <input
                id="login-phone"
                ref="phoneInput"
                :value="localPhone"
                type="tel"
                inputmode="numeric"
                autocomplete="tel-national"
                maxlength="9"
                :placeholder="country.placeholder"
                @input="onPhoneInput"
                @focus="clearErrors"
                @keyup.enter="signIn"
              />
              <span class="k-phone-count">{{ localPhone.length }}/9</span>
            </div>
          </div>
          <transition name="k-hint">
            <p v-if="phoneHint" class="k-phone-hint">
              <md-icon>info</md-icon>
              {{ $tt(phoneHint, { first: country.firstDigitsText }) }}
            </p>
          </transition>
        </div>

        <div class="k-pass" :class="{ 'has-error': hasPasswordError }">
          <label class="k-phone-label" for="login-password">{{ $tt('Password') }}</label>
          <div class="k-pass-input">
            <md-icon>lock_outline</md-icon>
            <input
              id="login-password"
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              @focus="clearErrors"
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
            <p v-if="capsLock" class="k-caps-hint">
              <md-icon>keyboard_capslock</md-icon>
              {{ $tt('Caps Lock is on') }}
            </p>
          </transition>
        </div>

        <md-button class="md-raised md-primary login-btn" @click="signIn()" :disabled="isLoading">
          <md-progress-spinner v-if="isLoading" :md-diameter="20" :md-stroke="3" md-mode="indeterminate" class="login-spinner"></md-progress-spinner>
          <span v-else>{{ $tt('Sign in') }}</span>
        </md-button>
        <!-- <router-link to="/forgotPassword">forgot password</router-link> -->
      </div>
      <p class="login-footer">&copy; {{ new Date().getFullYear() }} {{ $tt('Karrar Delivery') }} · {{ $tt('Delivery Services') }}</p>
    </form>
  </div>
</template>

<script>
import {AuthenticationService} from "@/services/AuthenticationService";

// Country keys for the phone number. The number is sent to the backend as
// key + 9 digits, e.g. 971 + 501234567 -> "971501234567".
const COUNTRIES = [
  { code: "971", label: "🇦🇪 +971", name: "UAE", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "966", label: "🇸🇦 +966", name: "KSA", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "249", label: "🇸🇩 +249", name: "Sudan", firstDigits: ["9", "1"], firstDigitsText: "9 / 1", placeholder: "9XXXXXXXX" },
];
const COUNTRY_KEY = "karrar.loginCountry";

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone: null,
        password: null
      },
      countries: COUNTRIES,
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
      isLoading: false
    }
  },
  computed: {
    country() {
      return this.countries.find((c) => c.code === this.countryCode) || this.countries[0];
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

    // start typing straight away
    this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
  },
  methods: {
    checkCapsLock(e) {
      if (e && typeof e.getModifierState === "function") this.capsLock = e.getModifierState("CapsLock");
    },
    // keep only digits, max 9, and the first digit must fit the country
    onPhoneInput(e) {
      let digits = String(e.target.value || "").replace(/\D/g, "").slice(0, 9);
      if (digits && !this.country.firstDigits.includes(digits[0])) {
        digits = "";
        this.phoneHint = "Numbers for this country start with {first}";
      } else {
        this.phoneHint = null;
      }
      this.localPhone = digits;
      e.target.value = digits;
      this.syncPhone();
    },
    onCountryChange() {
      try {
        localStorage.setItem(COUNTRY_KEY, this.countryCode);
      } catch (e) {
        /* not remembered */
      }
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
        return;
      }
      // Validate inputs
      if (!this.user.phone || !this.user.password) {
        if (!this.user.phone) this.hasPhoneError = true;
        if (!this.user.password) this.hasPasswordError = true;
        this.errorMessage = "Please enter both phone number and password";
        return;
      }

      this.isLoading = true;
      this.clearErrors();

      AuthenticationService.login(this.user)
        .then(response => {
          this.isLoading = false;
          if (response.data && response.data.accessToken) {
            if (AuthenticationService.isAuth()) {
              // back to the page the user was on before (if any), otherwise home
              this.$router.push(this.redirectTo || "/");
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          const apiError = err && err.response && err.response.data && err.response.data.errorDtoList && err.response.data.errorDtoList[0];
          const apiMessage = (apiError && apiError.errorMessage) || "";

          if (err.isAuthError) {
            // wrong phone number or password
            this.errorMessage = "Invalid phone number or password";
            this.hasPhoneError = true;
            this.hasPasswordError = true;
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

/* faint dotted grid for texture */
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
  text-align: left;
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
