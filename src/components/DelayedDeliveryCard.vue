<template>
  <div>
    <md-card>
      <md-card-header data-background-color="blue" class="card-chart">
        <div id="delayedDeliveryChartId" class="ct-chart" style="height: 250px;"></div>
      </md-card-header>
      <md-card-content>
        <h4 class="title">Delayed Deliveries</h4>
        <p class="category">
          <span v-if="totalDelayedCount > 0" class="text-danger">
            <i class="fas fa-exclamation-triangle"></i> {{ totalDelayedCount }} orders
          </span>
          <span v-else class="text-success">
            <i class="fas fa-check-circle"></i> No delayed deliveries
          </span>
          in "Under Delivery" status for more than {{ daysThreshold }} days
        </p>
      </md-card-content>

      <md-card-actions md-alignment="left">
        <div class="stats">
          <md-icon>access_time</md-icon>
          updated just now
        </div>
      </md-card-actions>
    </md-card>

    <!-- Table Card for Delayed Deliveries Details -->
    <md-card>
      <md-card-header data-background-color="red">
        <h4 class="title">Delayed Deliveries Details</h4>
        <p class="category">Orders requiring immediate attention</p>
      </md-card-header>
      <md-card-content>
        <div v-if="loading" class="text-center">
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div v-else-if="delayedOrders.length === 0" class="text-center empty-state">
          <p>No delayed deliveries found</p>
        </div>
        <div v-else>
          <md-table v-model="delayedOrders" md-sort="invoiceNo" md-sort-order="asc">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Invoice No" md-sort-by="invoiceNo">{{ item.invoiceNo }}</md-table-cell>
              <md-table-cell md-label="Agent" md-sort-by="deliveryAgent">{{ item.deliveryAgent }}</md-table-cell>
              <md-table-cell md-label="Order Date" md-sort-by="orderDate">{{ formatDate(item.orderDate) }}</md-table-cell>
              <md-table-cell md-label="Delivery Date" md-sort-by="deliveryDate">{{ formatDate(item.deliveryDate) }}</md-table-cell>
              <md-table-cell md-label="Days" md-sort-by="daysInDelivery" md-numeric>{{ item.daysInDelivery }}</md-table-cell>
              <md-table-cell md-label="Emirate" md-sort-by="emirate">{{ item.emirate }}</md-table-cell>
              <md-table-cell md-label="Trader" md-sort-by="traderName">{{ item.traderName }}</md-table-cell>
              <md-table-cell md-label="Customer" md-sort-by="customerPhoneNo">{{ item.customerPhoneNo }}</md-table-cell>
              <md-table-cell md-label="Amount" md-sort-by="totalAmount" md-numeric>{{ item.totalAmount }} AED</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
        <div class="text-right mt-3">
          <md-button class="md-raised md-primary" @click="viewAllDelayed">View All</md-button>
        </div>
    </md-card-content>
  </md-card>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";
import { formatDate } from "@/utils/dateFormatter";
import Chartist from "chartist";

export default {
  name: "DelayedDeliveryCard",
  props: {
    daysThreshold: {
      type: Number,
      default: 10
    },
    maxItems: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      delayedOrders: [],
      allDelayedOrdersData: [],
      loading: false,
      chart: null,
    };
  },
  computed: {
    totalDelayedCount() {
      return this.allDelayedOrdersData.length;
    }
  },
  methods: {
    formatDate(dateString) {
      return formatDate(dateString);
    },
    async loadDelayedOrders() {
      console.log('Loading delayed orders with threshold:', this.daysThreshold);
      this.loading = true;
      try {
        const response = await OrderService.getDelayedDeliveryOrders(this.daysThreshold);
        console.log('API response:', response);
        
        // Get all orders for chart data
        const allDelayedOrders = response.orders || [];
        console.log('All delayed orders:', allDelayedOrders);
        
        // Limit displayed orders in the table
        this.delayedOrders = allDelayedOrders.slice(0, this.maxItems);
        console.log('Displayed orders:', this.delayedOrders);
        
        // Store all orders for chart data
        this.allDelayedOrdersData = allDelayedOrders;
        console.log('Total delayed count:', this.totalDelayedCount);
        
        // Prepare chart data
        this.prepareChartData();
        
        // Log chart data preparation complete
        console.log('Chart data preparation complete');
      } catch (error) {
        console.error("Error loading delayed orders:", error);
      } finally {
        this.loading = false;
      }
    },
    
    initChart() {
      // Define chart data
      const data = {
        labels: ['10d', '11d', '12d', '13d', '14d', '15+d'],
        series: [[0, 0, 0, 0, 0, 0]]
      };
      
      // Define chart options
      const options = {
        seriesBarDistance: 10,
        horizontalBars: true,
        axisX: {
          showGrid: false
        },
        axisY: {
          offset: 40
        },
        high: 10,
        chartPadding: {
          top: 20,
          right: 15,
          bottom: 20,
          left: 20
        }
      };
      
      // Create the chart
      console.log('Initializing chart with data:', data);
      this.chart = new Chartist.Bar('#delayedDeliveryChartId', data, options);
    },
    
    prepareChartData() {
      console.log('Preparing chart data with orders:', this.allDelayedOrdersData);
      
      // Create an array for our data (for days 10, 11, 12, 13, 14, 15+)
      const counts = [0, 0, 0, 0, 0, 0];
      
      // Count orders in each group
      this.allDelayedOrdersData.forEach(order => {
        console.log('Processing order:', order.invoiceNo, 'with days:', order.daysInDelivery);
        const days = order.daysInDelivery;
        
        // Check if days is undefined or null
        if (days === undefined || days === null) {
          console.warn('Order has no daysInDelivery value:', order);
          return;
        }
        
        // Assign to appropriate index in the array
        if (days === 10) {
          counts[0]++;
        } else if (days === 11) {
          counts[1]++;
        } else if (days === 12) {
          counts[2]++;
        } else if (days === 13) {
          counts[3]++;
        } else if (days === 14) {
          counts[4]++;
        } else if (days >= 15) {
          counts[5]++;
        }
      });
      
      console.log('Final counts:', counts);
      
      // Update chart data
      const data = {
        labels: ['10d', '11d', '12d', '13d', '14d', '15+d'],
        series: [counts]
      };
      
      // Adjust chart height based on max value
      const maxValue = Math.max(...counts, 1); // Minimum of 1 for scale
      const options = {
        high: maxValue + 1, // Add padding
        horizontalBars: true,
        axisY: {
          offset: 40
        }
      };
      
      // Update the chart with new data
      if (this.chart) {
        this.chart.update(data, options);
      } else {
        console.error('Chart not initialized');
        this.initChart(); // Initialize if not already done
        setTimeout(() => {
          this.chart.update(data, options);
        }, 100);
      }
    },
    viewAllDelayed() {
      // Navigate to orders list with filter for delayed deliveries
      this.$router.push({
        name: 'OrdersList',
        query: { 
          deliveryStatus: 'UNDER_DELIVERY',
          delayedDelivery: 'true',
          daysThreshold: this.daysThreshold
        }
      });
    }
  },
  created() {
    console.log('DelayedDeliveryCard created');
    this.loadDelayedOrders();
  },
  mounted() {
    console.log('DelayedDeliveryCard mounted');
    
    // Initialize chart with default data
    this.initChart();
    
    // Load data after component is mounted
    this.loadDelayedOrders();
  },
  
  beforeDestroy() {
    // Clean up chart instance if it exists
    if (this.chart) {
      this.chart.detach();
    }
  },
  watch: {
    // Watch for threshold changes to reload data
    daysThreshold: {
      handler() {
        this.loadDelayedOrders();
      }
    }
  }
};
</script>

<style>
/* Chart styles */
.card-chart {
  min-height: 280px;
}

.ct-chart {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* Chartist custom styles */
.ct-series-a .ct-bar {
  stroke: #fff;
  stroke-width: 20px;
}

.ct-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.threshold-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.threshold-control .md-field {
  margin-right: 15px;
  width: 120px;
}
</style>

<style scoped>
.empty-state {
  padding: 20px;
  color: #999;
  font-style: italic;
}

.mt-3 {
  margin-top: 16px;
}
</style>
