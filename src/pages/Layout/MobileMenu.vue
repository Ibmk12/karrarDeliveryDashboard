<template>
  <div class="k-mobile-menu">
    <div class="k-lang-switch is-dark" role="group" :aria-label="$tt('Language')">
      <button type="button" :class="{ active: $lang === 'en' }" @click="$setLang('en')">EN</button>
      <button type="button" :class="{ active: $lang === 'ar' }" @click="$setLang('ar')">عربي</button>
    </div>
    <button
      type="button"
      class="k-mobile-theme"
      :aria-label="$tt($theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')"
      @click="$toggleTheme()"
    >
      <md-icon>{{ $theme === 'dark' ? 'light_mode' : 'dark_mode' }}</md-icon>
    </button>
    <button type="button" class="k-mobile-logout" @click="logout">
      <md-icon>logout</md-icon>
      <span>{{ $tt("Logout") }}</span>
    </button>
  </div>
</template>
<script>
import { AuthenticationService } from "@/services/AuthenticationService";

/** Extra items shown at the top of the sidebar on small screens. */
export default {
  name: "MobileMenu",
  methods: {
    async logout() {
      try {
        await AuthenticationService.logout();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  },
};
</script>
