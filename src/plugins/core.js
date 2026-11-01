// Core UI for the dashboard: the Vue Material components, the base styles and the sidebar.
import SideBar from "../components/SidebarPlugin";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.css";
import "../assets/scss/app.scss";

// Promise support for older browsers
import "es6-promise/auto";

export default {
  install(Vue) {
    Vue.use(SideBar);
    Vue.use(VueMaterial);
  },
};
