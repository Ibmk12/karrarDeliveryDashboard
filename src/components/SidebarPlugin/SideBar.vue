<template>
  <div
    class="sidebar"
    :data-color="sidebarItemColor"
    :data-image="sidebarBackgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo k-brand-wrap">
      <a href="#/dashboard" class="k-brand" :title="title">
        <img
          src="@/assets/img/karrar-logo-light.png"
          alt="KD"
          class="k-brand-logo"
        />
        <span class="k-brand-text">
          <strong>{{ $tt('Karrar') }}</strong>
          <small>{{ $tt('Delivery Services') }}</small>
        </span>
      </a>
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          >
          </sidebar-link>
        </slot>
      </md-list>
    </div>

    <!-- brand decoration: delivery route, angular band, tagline -->
    <div class="k-side-brand" aria-hidden="true">
      <svg class="k-side-route" viewBox="0 0 260 220" preserveAspectRatio="none">
        <path id="kSideRoute" d="M-10 200 C 60 150, 40 90, 120 80 S 220 40, 270 -10" />
        <circle cx="120" cy="80" r="3.5" class="hub" />
        <g class="parcel">
          <rect x="-4.5" y="-4.5" width="9" height="9" rx="2" />
          <animateMotion dur="12s" repeatCount="indefinite" rotate="auto"><mpath href="#kSideRoute" xlink:href="#kSideRoute" /></animateMotion>
        </g>
      </svg>
      <div class="k-side-tagline">{{ $tt('Your partner in success') }}</div>
    </div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink,
  },
  props: {
    title: {
      type: String,
      default: "Karrar Delivery",
    },
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/background.png"),
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/karrar-logo2.jpg"),
    },
    sidebarItemColor: {
      type: String,
      default: "green",
      validator: (value) => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.sidebarBackgroundImage})`,
      };
    },
  },
};
</script>
<style>
@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }
 
}
</style>
