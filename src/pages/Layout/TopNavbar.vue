<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <button
          type="button"
          class="k-menu-btn"
          :aria-label="$tt('Menu')"
          :aria-expanded="$sidebar.showSidebar ? 'true' : 'false'"
          @click="$sidebar.displaySidebar(!$sidebar.showSidebar)"
        >
          <md-icon>{{ $sidebar.showSidebar ? 'close' : 'menu' }}</md-icon>
        </button>
        <div class="k-page-heading">
          <transition name="k-title" mode="out-in">
            <div :key="$route.name" class="k-page-heading-inner">
              <h3 class="md-title">{{ $tt($route.name) }}</h3>
              <span class="k-breadcrumb">{{ $tt('Karrar Delivery') }} &rsaquo; {{ $tt($route.name) }}</span>
            </div>
          </transition>
        </div>
      </div>
      <div class="md-toolbar-section-end">
        <button
          type="button"
          class="k-qs-btn"
          :aria-label="$tt('Quick search')"
          :title="$tt('Quick search')"
          @click="openQuickSearch"
        >
          <md-icon>search</md-icon>
          <span class="k-qs-btn-text">{{ $tt('Search…') }}</span>
          <kbd>{{ modKey }}K</kbd>
        </button>
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
        <div class="md-collapse">
          <md-list>

            <li class="md-list-item">
              <a
                href="#"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
                @click.prevent="toggleUserDropdown"
              >
                <div class="md-list-item-content">
                  <drop-down>
                    <span
                      slot="title"
                      class="k-user-chip"
                      data-toggle="dropdown"
                    >
                      <span class="k-avatar">{{ userInitials }}</span>
                      <span class="k-user-chip-text">
                        <span class="k-user-name">{{ userName }}</span>
                        <span v-if="$role" class="k-user-role" :class="{ 'is-admin': $role === 'ADMIN' }">{{ $tt($role) }}</span>
                      </span>
                      <md-icon>expand_more</md-icon>
                    </span>
                    <ul class="dropdown-menu dropdown-menu-right k-account-menu">
                      <li class="k-account-head">
                        <span class="k-avatar is-lg">{{ userInitials }}</span>
                        <div>
                          <strong>{{ userName }}</strong>
                          <span dir="ltr">{{ userPhone }}</span>
                        </div>
                      </li>
                      <li>
                        <a href="#" @click.prevent="logout"
                          ><md-icon>logout</md-icon> {{ $tt('Logout') }}</a
                        >
                      </li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import { AuthenticationService } from "@/services/AuthenticationService";

export default {
  data() {
    return {};
  },
  computed: {
    modKey() {
      return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl ";
    },
    userPhone() {
      const p = (this.$profile && this.$profile.phone) || "";
      // 971501234567 -> +971 50 123 4567
      const m = String(p).match(/^(\d{3})(\d{2})(\d{3})(\d{4})$/);
      return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : p;
    },
    userName() {
      return (this.$profile && this.$profile.name) || this.userPhone || this.$tt("Account");
    },
    userInitials() {
      const name = this.$profile && this.$profile.name;
      if (!name) return "KD";
      return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    },
  },
  methods: {
    openQuickSearch() {
      window.dispatchEvent(new CustomEvent("k-quick-search"));
    },
    toggleUserDropdown() {
      // This will be handled by the dropdown component
    },
    async logout() {
      try {
        await AuthenticationService.logout();
        // The redirect is handled in the AuthenticationService
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
};
</script>

<style lang="css"></style>
