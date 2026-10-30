import Vue from "vue";
import axios from "axios";
import { Config } from "@/services/Config";

/**
 * Network state for the whole app:
 *  - `pending`: how many requests / page changes are in progress (drives the
 *    orange loading bar at the top of the screen);
 *  - `offline`: the server could not be reached (shows the "can't reach the
 *    server" screen with a Retry button).
 */
export const netState = Vue.observable({ pending: 0, routing: false, offline: false, checking: false });

// page changes: a guard can cancel or redirect a navigation, so don't count
// them, just flag "busy" (with a safety timeout)
let routeTimer = null;
export function routeStart() {
  netState.routing = true;
  clearTimeout(routeTimer);
  routeTimer = setTimeout(() => (netState.routing = false), 3000);
}
export function routeDone() {
  clearTimeout(routeTimer);
  netState.routing = false;
}

export function netStart() {
  netState.pending += 1;
}
export function netDone() {
  netState.pending = Math.max(0, netState.pending - 1);
}

function isServerDown(error) {
  if (axios.isCancel && axios.isCancel(error)) return false;
  if (!error || !error.config) return false;
  if (!error.response) return true; // network error / CORS / server not running
  return [502, 503, 504].includes(error.response.status);
}

/** Ask the server if it is back. Any HTTP answer (even 401/404) means it is up. */
export async function checkServer() {
  netState.checking = true;
  try {
    await fetch(Config.base_url(), { method: "GET", mode: "no-cors", cache: "no-store" });
    netState.offline = false;
    return true;
  } catch (e) {
    netState.offline = true;
    return false;
  } finally {
    netState.checking = false;
  }
}

export default {
  install() {
    axios.interceptors.request.use(
      (config) => {
        if (!config.__kSilent) netStart();
        return config;
      },
      (error) => {
        netDone();
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        if (!response.config || !response.config.__kSilent) netDone();
        netState.offline = false;
        return response;
      },
      (error) => {
        if (!error.config || !error.config.__kSilent) netDone();
        if (isServerDown(error)) netState.offline = true;
        return Promise.reject(error);
      }
    );
    window.addEventListener("offline", () => (netState.offline = true));
    window.addEventListener("online", () => checkServer());
  },
};
