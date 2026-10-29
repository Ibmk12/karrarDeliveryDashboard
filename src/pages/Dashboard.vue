<template>
  <div class="content">
    <div class="md-layout">
      <!-- KPI summary cards -->
      <div class="md-layout-item md-size-100">
        <dashboard-kpis :days-threshold="delayedDeliveryThreshold"></dashboard-kpis>
      </div>

      <!-- Monthly Delivery Chart -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <monthly-delivery-chart></monthly-delivery-chart>
      </div>

      <!-- Delayed Delivery Chart + full-width details table -->
      <div class="md-layout-item md-size-100">
        <delayed-delivery-card :days-threshold="delayedDeliveryThreshold" :max-items="5">
          <!-- Settings Card for Delayed Delivery Threshold (shown beside the delayed chart) -->
          <template slot="aside">
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>timer</md-icon>
          </template>

          <template slot="content">
            <p class="category">{{ $tt('Delivery Delay Threshold') }}</p>
            <div class="threshold-control">
              <md-field>
                <label>{{ $tt('Days threshold') }}</label>
                <md-input v-model.number="delayedDeliveryThreshold" type="number" min="1"></md-input>
              </md-field>
              <md-button class="md-raised md-primary" @click="refreshDelayedDeliveries"><md-icon>check</md-icon> {{ $tt('Apply') }}</md-button>
            </div>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>info</md-icon>
              {{ $tt('Orders in “Under Delivery” status for more than the threshold days will be flagged') }}
            </div>
          </template>
        </stats-card>
          </template>
        </delayed-delivery-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard } from "@/components";
import DelayedDeliveryCard from "@/components/DelayedDeliveryCard.vue";
import MonthlyDeliveryChart from "@/components/MonthlyDeliveryChart.vue";

export default {
  components: {
    StatsCard,
    DelayedDeliveryCard,
    MonthlyDeliveryChart,
  },
  methods: {
    refreshDelayedDeliveries() {
      // Find the DelayedDeliveryCard component and call its loadDelayedOrders method
      this.$nextTick(() => {
        const delayedDeliveryComponent = this.$children.find(child => child.$options.name === 'DelayedDeliveryCard');
        if (delayedDeliveryComponent) {
          delayedDeliveryComponent.loadDelayedOrders();
        }
      });
    }
  },
  data() {
    return {
      delayedDeliveryThreshold: 2 // Default threshold for delayed deliveries (in days)
    };
  }
};
</script>

<style scoped>
.threshold-control {
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
}

.threshold-control .md-field {
  flex: 1;
  margin-right: 10px;
  margin-bottom: 0;
}

.threshold-control .md-button {
  margin: 0;
  height: 36px;
}
</style>
