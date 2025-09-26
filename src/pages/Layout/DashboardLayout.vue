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
        <p>Dashboard</p>
      </sidebar-link>
      <!--<sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link>-->
      <sidebar-link to="/orders">
        <md-icon>content_paste</md-icon>
        <p>Orders</p>
      </sidebar-link>

      <sidebar-link to="/traders">
        <md-icon>people</md-icon>
        <p>Traders</p>
      </sidebar-link>
     <sidebar-link to="/users">
        <md-icon>group</md-icon>
        <p>Users</p>
      </sidebar-link>
      <sidebar-link to="/reports">
        <md-icon>assessment</md-icon>
        <p>Reports</p>
      </sidebar-link>
      <!-- Commented out menu items
      <sidebar-link to="/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link>
      <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link>
      <sidebar-link to="/upgrade" class="active-pro">
        <md-icon>unarchive</md-icon>
        <p>Upgrade to PRO</p>
      </sidebar-link>
      -->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>



      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";


export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
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
