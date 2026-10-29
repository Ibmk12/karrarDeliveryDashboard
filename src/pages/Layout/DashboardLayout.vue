<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
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
     
     <sidebar-link to="/users">
        <md-icon>group</md-icon>
        <p>{{ $tt('Users') }}</p>
      </sidebar-link>
      <sidebar-link to="/reports">
        <md-icon>assessment</md-icon>
        <p>{{ $tt('Reports') }}</p>
      </sidebar-link>
      <sidebar-link to="/traders-financial-report">
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
