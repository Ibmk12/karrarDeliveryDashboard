<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
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
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>person</md-icon>
                      <p class="hidden-lg hidden-md">User</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <!-- <li><a href="#/user">My Profile</a></li> -->
                      <li><a href="#" @click.prevent="logout">Logout</a></li>
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
