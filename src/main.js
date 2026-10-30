// =========================================================
// * Vue Material Dashboard - v1.5.2
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter, { isNavigationFailure, NavigationFailureType } from "vue-router";
import App from "./App";

// router setup
import routes from "./routes/routes";


// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";
import KarrarUI from "./plugins/ui";
import I18n, { onLangChange } from "./i18n";
import UrlState from "./plugins/urlState";
import Theme from "./plugins/theme";
import Auth, { ensureRole } from "./plugins/auth";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

// A guard that sends the user somewhere else (e.g. a USER to Orders instead of the
// Dashboard) is expected behaviour, not an error: don't report those as
// "Uncaught (in promise)" in the console.
["push", "replace"].forEach((method) => {
  const original = VueRouter.prototype[method];
  VueRouter.prototype[method] = function (location, onComplete, onAbort) {
    if (onComplete || onAbort) return original.call(this, location, onComplete, onAbort);
    return original.call(this, location).catch((err) => {
      if (
        isNavigationFailure(err, NavigationFailureType.redirected) ||
        isNavigationFailure(err, NavigationFailureType.duplicated) ||
        isNavigationFailure(err, NavigationFailureType.aborted)
      ) {
        return err;
      }
      return Promise.reject(err);
    });
  };
});

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active",
});

// Import AuthenticationService
import { AuthenticationService } from "./services/AuthenticationService";

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Check if route requires authentication
  const authRequired = to.matched.some(record => record.meta.requiresAuth);
  const loggedIn = AuthenticationService.isAuth();

  // Redirect to login page if not logged in and trying to access a restricted page
  if (authRequired && !loggedIn) {
    const target = to.fullPath && to.fullPath !== "/" ? { redirect: to.fullPath } : {};
    return next({ path: "/login", query: target });
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (loggedIn && to.path === "/login") {
    return next("/");
  }

  next();
});

// Browser tab title: "Orders · Karrar Delivery"
function setTitle(to) {
  const page = (to.meta && to.meta.title) || to.name;
  const brand = Vue.prototype.$tt("Karrar Delivery");
  document.title = page ? `${Vue.prototype.$tt(page)} · ${brand}` : brand;
}
onLangChange(() => setTitle(router.currentRoute));

router.afterEach((to) => {
  setTitle(to);
  // close the mobile menu after navigating
  if (router.app && router.app.sidebarStore) router.app.sidebarStore.displaySidebar(false);
});

// Pages only admins may open (Dashboard, Users, Traders Financial Report).
// Other users are sent to Orders.
router.beforeEach(async (to, from, next) => {
  if (!to.matched.some((r) => r.meta && r.meta.adminOnly)) return next();
  if (!AuthenticationService.isAuth()) return next("/login");
  const role = await ensureRole();
  if (role === "ADMIN") return next();
  next(from.name && from.path !== "/login" ? false : "/orders");
});

// Work out the role early so the menu shows the right items
if (AuthenticationService.isAuth()) ensureRole();

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.use(Auth);
Vue.use(Theme);
Vue.use(I18n);
Vue.use(KarrarUI);
Vue.use(UrlState);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  data: {
    Chartist: Chartist,
  },
});
