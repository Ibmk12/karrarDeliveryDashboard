<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <div class="k-page-heading">
          <h3 class="md-title">{{ $route.name }}</h3>
          <span class="k-breadcrumb">Karrar Delivery &rsaquo; {{ $route.name }}</span>
        </div>
      </div>
      <div class="md-toolbar-section-end">
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
                      <span>Account</span>
                      <md-icon>expand_more</md-icon>
                    </span>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <!-- <li><a href="#/user">My Profile</a></li> -->
                      <li>
                        <a href="#" @click.prevent="logout"
                          ><md-icon>logout</md-icon> Logout</a
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
