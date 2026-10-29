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
                      <span class="k-avatar"><md-icon>person</md-icon></span>
                      <span>{{ $tt('Account') }}</span>
                      <md-icon>expand_more</md-icon>
                    </span>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <!-- <li><a href="#/user">My Profile</a></li> -->
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
  methods: {
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
