<template>
  <div class="k-net">
    <div class="k-loadbar" :class="{ active: busy }" aria-hidden="true"><span></span></div>
    <transition name="k-drawer-fade">
      <div
        v-if="state.offline && !dismissed"
        class="k-offline"
        data-k-modal
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="k-offline-title"
        aria-describedby="k-offline-text"
      >
        <div class="k-offline-card">
          <img class="k-offline-logo" src="@/assets/img/karrar-logo-transparent.png" :alt="$tt('Karrar Delivery')" />
          <div class="k-offline-icon"><md-icon>cloud_off</md-icon></div>
          <h2 id="k-offline-title">{{ $tt("We can't reach the server") }}</h2>
          <p id="k-offline-text">
            {{ $tt("Check your internet connection. If it's working, the server may be starting up — this can take up to a minute.") }}
          </p>
          <div class="k-offline-actions">
            <md-button class="md-raised md-primary" :disabled="state.checking" @click="retry">
              <md-icon>refresh</md-icon> {{ state.checking ? $tt("Checking…") : $tt("Retry") }}
            </md-button>
            <md-button class="md-simple" @click="dismissed = true">{{ $tt("Dismiss") }}</md-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { netState, checkServer } from "@/plugins/net";

export default {
  name: "NetStatus",
  data() {
    return { state: netState, busy: false, dismissed: false, timer: null };
  },
  computed: {
    working() {
      return this.state.pending > 0 || this.state.routing;
    },
  },
  watch: {
    working(n) {
      clearTimeout(this.timer);
      // only show the bar for things that take a moment
      if (n) this.timer = setTimeout(() => (this.busy = true), 150);
      else this.timer = setTimeout(() => (this.busy = false), 120);
    },
    "state.offline"(v) {
      if (v) this.dismissed = false;
    },
  },
  methods: {
    async retry() {
      if (await checkServer()) window.location.reload();
    },
  },
};
</script>
