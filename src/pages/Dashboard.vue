<template>
  <div class="content">
    <div class="md-layout">
      <!-- Monthly Delivery Chart -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <monthly-delivery-chart></monthly-delivery-chart>
      </div>

      <!-- Delayed Delivery Chart -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <delayed-delivery-card :days-threshold="delayedDeliveryThreshold" :max-items="5"></delayed-delivery-card>
      </div>
      
      <!-- Settings Card for Delayed Delivery Threshold -->
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>settings</md-icon>
          </template>

          <template slot="content">
            <p class="category">Delivery Delay Threshold</p>
            <div class="threshold-control">
              <md-field>
                <label>Days threshold</label>
                <md-input v-model.number="delayedDeliveryThreshold" type="number" min="1"></md-input>
              </md-field>
              <md-button class="md-raised md-primary" @click="refreshDelayedDeliveries">Apply</md-button>
            </div>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>info</md-icon>
              Orders in "Under Delivery" status for more than the threshold days will be flagged
            </div>
          </template>
        </stats-card>
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
