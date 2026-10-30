<template>
  <div class="content">
    <div class="md-layout">
      <!-- KPI summary cards -->
      <div class="md-layout-item md-size-100">
        <dashboard-kpis :days-threshold="delayedDeliveryThreshold"></dashboard-kpis>
      </div>

      <!-- Monthly chart + delayed orders by age -->
      <div class="md-layout-item md-size-100">
        <div class="k-dash-row">
          <monthly-delivery-chart></monthly-delivery-chart>
          <delayed-by-age :days-threshold="delayedDeliveryThreshold" @open="openOrder"></delayed-by-age>
        </div>
      </div>

      <!-- Agents today -->
      <div class="md-layout-item md-size-100">
        <agents-today></agents-today>
      </div>

      <!-- Delayed Delivery Chart + full-width details table -->
      <div class="md-layout-item md-size-100">
        <delayed-delivery-card :days-threshold="delayedDeliveryThreshold" :max-items="5">
          <!-- "Delayed after [2] days" — orders under delivery longer than this are flagged -->
          <div slot="controls" class="k-threshold">
            <md-icon>timer</md-icon>
            <span id="k-threshold-label">{{ $tt('Delayed after') }}</span>
            <div class="k-stepper" role="group" aria-labelledby="k-threshold-label">
              <button type="button" :aria-label="$tt('Fewer days')" :disabled="thresholdInput <= 1" @click="step(-1)">
                <md-icon>remove</md-icon>
              </button>
              <input
                v-model.number="thresholdInput"
                type="number"
                min="1"
                max="60"
                inputmode="numeric"
                :aria-label="$tt('Days threshold')"
                @keyup.enter="applyThreshold"
                @blur="applyThreshold"
              />
              <button type="button" :aria-label="$tt('More days')" :disabled="thresholdInput >= 60" @click="step(1)">
                <md-icon>add</md-icon>
              </button>
            </div>
            <span>{{ $tt('days') }}</span>
            <md-icon class="k-threshold-info">info_outline</md-icon>
            <md-tooltip md-direction="top">{{ $tt('Orders in “Under Delivery” status for more than the threshold days will be flagged') }}</md-tooltip>
          </div>
        </delayed-delivery-card>
      </div>
    </div>
    <order-details-drawer ref="details" @changed="reloadAll"></order-details-drawer>
  </div>
</template>

<script>
import DelayedDeliveryCard from "@/components/DelayedDeliveryCard.vue";
import MonthlyDeliveryChart from "@/components/MonthlyDeliveryChart.vue";
import DelayedByAge from "@/components/DelayedByAge.vue";
import AgentsToday from "@/components/AgentsToday.vue";

const KEY = "karrar.delayDays";

function savedThreshold() {
  try {
    const n = parseInt(localStorage.getItem(KEY), 10);
    return n >= 1 && n <= 60 ? n : 2;
  } catch (e) {
    return 2;
  }
}

export default {
  components: {
    DelayedDeliveryCard,
    MonthlyDeliveryChart,
    DelayedByAge,
    AgentsToday,
  },
  data() {
    const days = savedThreshold();
    return {
      delayedDeliveryThreshold: days, // orders under delivery longer than this are "delayed"
      thresholdInput: days,
      timer: null,
    };
  },
  watch: {
    // apply a moment after the last click / keystroke so the charts reload once
    thresholdInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.applyThreshold, 600);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    openOrder(order) {
      this.$refs.details.open(order);
    },
    // after "Mark delivered" in the drawer: reload the page's numbers
    reloadAll() {
      this.$children.forEach((c) => {
        if (typeof c.load === "function") c.load();
        if (typeof c.loadDelayedOrders === "function") c.loadDelayedOrders();
      });
    },
    step(delta) {
      const n = parseInt(this.thresholdInput, 10) || 1;
      this.thresholdInput = Math.min(60, Math.max(1, n + delta));
    },
    applyThreshold() {
      clearTimeout(this.timer);
      let n = parseInt(this.thresholdInput, 10);
      if (!(n >= 1)) n = 1;
      if (n > 60) n = 60;
      if (n !== this.thresholdInput) this.thresholdInput = n;
      if (n === this.delayedDeliveryThreshold) return;
      this.delayedDeliveryThreshold = n;
      try {
        localStorage.setItem(KEY, String(n));
      } catch (e) {
        /* ignore */
      }
    },
  },
};
</script>
