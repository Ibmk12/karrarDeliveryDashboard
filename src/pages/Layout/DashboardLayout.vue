<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <!-- brand backdrop behind the pages (very subtle, never over content) -->
    <div class="k-app-bg" aria-hidden="true">
      <div class="k-app-band"></div>
      <img class="k-app-mark" src="@/assets/img/karrar-logo-light.png" alt="" />
      <svg class="k-app-routes" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 640 C 220 520, 380 700, 640 560 S 1040 380, 1260 470" />
        <path d="M1240 120 C 980 180, 920 60, 700 140 S 420 230, 220 110" />
        <circle cx="640" cy="560" r="4" />
        <circle cx="700" cy="140" r="4" />
      </svg>
    </div>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link v-if="$isAdmin" to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>{{ $tt('Dashboard') }}</p>
      </sidebar-link>
      <sidebar-link to="/orders">
        <md-icon>content_paste</md-icon>
        <p>{{ $tt('Orders') }}</p>
      </sidebar-link>

      <sidebar-link to="/delivery-agents">
        <md-icon>delivery_dining</md-icon>
        <p>{{ $tt('Delivery Agents') }}</p>
      </sidebar-link>

      <sidebar-link to="/traders">
        <md-icon>people</md-icon>
        <p>{{ $tt('Traders') }}</p>
      </sidebar-link>
     
     <sidebar-link v-if="$isAdmin" to="/users">
        <md-icon>group</md-icon>
        <p>{{ $tt('Users') }}</p>
      </sidebar-link>
      <sidebar-link to="/reports">
        <md-icon>assessment</md-icon>
        <p>{{ $tt('Reports') }}</p>
      </sidebar-link>
      <sidebar-link v-if="$isAdmin" to="/traders-financial-report">
        <md-icon>account_balance</md-icon>
        <p>{{ $tt('Traders Financial Report') }}</p>
      </sidebar-link>
    </side-bar>

    <transition name="k-drawer-fade">
      <div
        v-if="$sidebar.showSidebar"
        class="k-sidebar-overlay"
        @click="$sidebar.displaySidebar(false)"
      ></div>
    </transition>

    <div class="main-panel">
      <top-navbar></top-navbar>



      <dashboard-content> </dashboard-content>

    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";


export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,

  },
  data() {
    return {
      sidebarBackground: "orange",
      sidebarBackgroundImage: require("@/assets/img/background.png"),
    };
  },
};
</script>
