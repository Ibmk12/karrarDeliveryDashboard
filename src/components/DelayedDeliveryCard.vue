<template>
  <div>
    <div class="md-layout k-delayed-top">
    <div class="md-layout-item md-medium-size-100" :class="$slots.aside ? 'md-size-50' : 'md-size-100'">
    <md-card>
      <md-card-header data-background-color="blue" class="card-chart">
        <div id="delayedDeliveryChartId" class="ct-chart" style="height: 250px;"></div>
      </md-card-header>
      <md-card-content>
        <h4 class="title">{{ $tt('Delayed Deliveries') }}</h4>
        <p class="category">
          <span v-if="totalDelayedCount > 0" class="status-badge text-red">
            {{ $tt('{n} orders', { n: totalDelayedCount }) }}
          </span>
          <span v-else class="status-badge text-green">{{ $tt('No delayed deliveries') }}</span>
          {{ $tt('in “Under Delivery” status for more than {n} days', { n: daysThreshold }) }}
        </p>
        <slot name="controls"></slot>
      </md-card-content>

      <md-card-actions md-alignment="left">
        <div class="stats">
          <md-icon>access_time</md-icon>
          {{ $tt('updated just now') }}
        </div>
      </md-card-actions>
    </md-card>
    </div>
    <div v-if="$slots.aside" class="md-layout-item md-size-50 md-medium-size-100">
      <slot name="aside"></slot>
    </div>
    </div>

    <!-- Table Card for Delayed Deliveries Details -->
    <md-card class="k-delayed-details">
      <md-card-header data-background-color="red">
        <h4 class="title">{{ $tt('Delayed Deliveries Details') }}</h4>
        <p class="category">{{ $tt('Orders requiring immediate attention') }}</p>
      </md-card-header>
      <md-card-content>
        <div v-if="loading" class="text-center k-loading">
          <md-progress-spinner md-mode="indeterminate" :md-diameter="40" :md-stroke="3"></md-progress-spinner>
        </div>
        <div v-else-if="paginatedOrders.length === 0" class="text-center empty-state">
          <p>{{ $tt('No delayed deliveries found — everything is on time.') }}</p>
        </div>
        <div v-else>
          <md-table class="delayed-table" v-model="paginatedOrders" md-sort="invoiceNo" md-sort-order="asc">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell :md-label="$tt('Invoice / Agent')" md-sort-by="invoiceNo">
                <div class="k-stack">
                  <span class="k-id">{{ item.invoiceNo }}</span>
                  <span v-if="item.agentName || item.deliveryAgent" class="k-sub"><md-icon>delivery_dining</md-icon>{{ item.agentName || item.deliveryAgent }}</span>
                </div>
              </md-table-cell>
              <md-table-cell :md-label="$tt('Order / Delivery Date')" md-sort-by="orderDate">
                <div class="k-stack k-dates">
                  <span><small>{{ $tt('Ordered') }}</small>{{ item.orderDate | kDate }}</span>
                  <span><small>{{ $tt('Delivery') }}</small>{{ item.deliveryDate ? $options.filters.kDate(item.deliveryDate) : '—' }}</span>
                </div>
              </md-table-cell>
              <md-table-cell class="k-wrap" :md-label="$tt('Address / Emirate')" md-sort-by="address">
                <div class="k-stack">
                  <span v-if="item.address">{{ item.address }}</span>
                  <span class="k-sub"><md-icon>place</md-icon>{{ $tt(item.emirate) }}</span>
                </div>
              </md-table-cell>
              <md-table-cell :md-label="$tt('Status')" md-sort-by="deliveryStatus"><span class="status-badge text-blue">{{ $tt($statusLabel(item.deliveryStatus)) }}</span><span v-if="$daysUnderDelivery(item)" class="k-late">{{ $tt('{n}d late', { n: $daysUnderDelivery(item) }) }}</span></md-table-cell>
              <md-table-cell :md-label="$tt('Trader / Customer')" md-sort-by="traderName">
                <div class="k-stack">
                  <span>{{ item.traderName }}</span>
                  <span class="k-sub"><md-icon>phone</md-icon>{{ item.customerPhoneNo }}</span>
                </div>
              </md-table-cell>
              <md-table-cell :md-label="$tt('Amounts (AED)')" md-sort-by="totalAmount">
                <div class="k-stack k-amounts">
                  <span class="k-money"><strong>{{ item.totalAmount | money }}</strong> <small>{{ $tt('AED total') }}</small></span>
                  <span class="k-breakdown">
                    <span>{{ $tt('Trader') }} <b>{{ item.traderAmount | money }}</b></span>
                    <span>{{ $tt('Delivery') }} <b>{{ item.deliveryAmount | money }}</b></span>
                    <span>{{ $tt('Agent') }} <b>{{ item.agentAmount | money }}</b></span>
                  </span>
                </div>
              </md-table-cell>
            </md-table-row>
          </md-table>
          
          <!-- Pagination Controls -->
          <div class="pagination-container" v-if="pagination.totalPages > 0">
            <div class="pagination-info">
              {{ $tt('Showing {a} of {b} orders', { a: paginatedOrders.length, b: delayedOrders.length }) }} · {{ $tt('Page {a} of {b}', { a: pagination.pageNumber + 1, b: pagination.totalPages }) }}
            </div>
            <div class="pagination-controls">
              <md-button 
                class="md-icon-button md-raised" 
                @click="goToPage(0)" 
                :disabled="pagination.pageNumber === 0">
                <md-icon>first_page</md-icon>
              </md-button>
              <md-button 
                class="md-icon-button md-raised" 
                @click="prevPage()" 
                :disabled="pagination.pageNumber === 0">
                <md-icon>chevron_left</md-icon>
              </md-button>
              
              <span class="page-numbers">
                <span 
                  v-for="page in displayedPages" 
                  :key="page" 
                  @click="goToPage(page)" 
                  :class="['page-number', pagination.pageNumber === page ? 'active' : '']">
                  {{ page + 1 }}
                </span>
              </span>
              
              <md-button 
                class="md-icon-button md-raised" 
                @click="nextPage()" 
                :disabled="pagination.pageNumber >= pagination.totalPages - 1">
                <md-icon>chevron_right</md-icon>
              </md-button>
              <md-button 
                class="md-icon-button md-raised" 
                @click="goToPage(pagination.totalPages - 1)" 
                :disabled="pagination.pageNumber >= pagination.totalPages - 1">
                <md-icon>last_page</md-icon>
              </md-button>
            </div>
            <div class="page-size-selector">
              <span>{{ $tt('Items per page:') }}</span>
              <select v-model="pageSize" @change="changePageSize">
                <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
          </div>
        </div>
    </md-card-content>
  </md-card>
  </div>
</template>

<script>
import { enhanceBarChart } from "@/utils/barChart";
import { OrderService } from "@/services/OrderService";
import { formatDate } from "@/utils/dateFormatter";
import Chartist from "chartist";
import { AuthenticationService } from "@/services/AuthenticationService";

export default {
  name: "DelayedDeliveryCard",
  props: {
    daysThreshold: {
      type: Number,
      default: 2
    },
    maxItems: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      delayedOrders: [], // All delayed orders from API
      paginatedOrders: [], // Orders for current page
      allDelayedOrdersData: [], // Used for chart data
      loading: false,
      chart: null,
      pageSize: 5,
      pageSizeOptions: [5, 10, 25, 50],
      pagination: {
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        totalElementsPerPage: 5,
        isEmpty: false,
        sortedBy: "orderDate: DESC"
      }
    };
  },
  computed: {
    totalDelayedCount() {
      return this.allDelayedOrdersData.length;
    },
    displayedPages() {
      const totalPages = this.pagination.totalPages;
      const currentPage = this.pagination.pageNumber;
      
      // If 5 or fewer pages, show all pages
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i);
      }
      
      // Otherwise show a window of pages around current page
      let startPage = Math.max(0, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);
      
      // Adjust window if at the edges
      if (currentPage < 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage > totalPages - 3) {
        startPage = Math.max(0, totalPages - 5);
      }
      
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  },
  methods: {
    formatDate(dateString) {
      return formatDate(dateString);
    },
    async loadDelayedOrders() {
      this.loading = true;
      try {
        // Ensure token is valid before making API call
        await AuthenticationService.ensureValidToken();
        const response = await OrderService.getDelayedDeliveryOrders(this.daysThreshold);
        
        // Get all orders for chart data and table
        const allDelayedOrders = response.data || [];
        
        // Store all orders
        this.delayedOrders = allDelayedOrders;
        
        // Update pagination info from response
        if (response.dataProperties) {
          this.pagination = response.dataProperties;
        } else {
          // If no pagination info, calculate it
          this.pagination.totalElements = allDelayedOrders.length;
          this.pagination.totalPages = Math.ceil(allDelayedOrders.length / this.pageSize);
          this.pagination.isEmpty = allDelayedOrders.length === 0;
        }
        
        // Apply pagination to get current page data
        this.applyPagination();
        
        // Store all orders for chart data
        this.allDelayedOrdersData = allDelayedOrders;
        
        // Prepare chart data
        this.prepareChartData();
        
        // Log chart data preparation complete
      } catch (error) {
        console.error("Error loading delayed orders:", error);
      } finally {
        this.loading = false;
      }
    },
    
    initChart() {
      // Define chart data with empty initial state
      const data = {
        labels: [],
        series: [[]]
      };
      
      // Define chart options
      const options = {
        seriesBarDistance: 10,
        horizontalBars: false, // Vertical bars
        axisX: {
          showGrid: false,
          labelInterpolationFnc: (value) => this.$tt('{n} days', { n: value })
        },
        axisY: {
          onlyInteger: true,
          offset: 40
        },
        high: 10,
        fullWidth: true,
        chartPadding: {
          top: 30,
          right: 15,
          bottom: 20,
          left: 20
        }
      };
      
      // Create the chart
      this.chart = new Chartist.Bar('#delayedDeliveryChartId', data, options);
      enhanceBarChart(this.chart, { maxWidth: 40, tooltip: (label, value) => `${this.$tt('{n} days', { n: label })}: ${this.$tt('{n} orders', { n: value })}` });
    },
    
    prepareChartData() {
      
      // Create a map to count orders by days in delivery
      const delayCountMap = new Map();
      
      // Count orders for each delay day
      this.allDelayedOrdersData.forEach(order => {
        // Calculate daysInDelivery from orderDate
        let days;
        if (order.orderDate) {
          // Parse date correctly from DD-MM-YYYY format
          let orderDate;
          const dateStr = order.orderDate;
          
          // Check if it's in DD-MM-YYYY format (10-08-2025)
          if (dateStr.match(/^\d{2}-\d{2}-\d{4}/)) {
            const parts = dateStr.split(/[-\s:]/);
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
            const year = parseInt(parts[2], 10);
            
            // Check if there's time information
            let hours = 0, minutes = 0;
            if (parts.length > 3) {
              hours = parseInt(parts[3], 10);
              if (parts.length > 4) {
                minutes = parseInt(parts[4], 10);
              }
              
              // Handle AM/PM if present
              if (dateStr.includes('PM') && hours < 12) {
                hours += 12;
              } else if (dateStr.includes('AM') && hours === 12) {
                hours = 0;
              }
            }
            
            orderDate = new Date(year, month, day, hours, minutes);
          } else {
            // Fallback to standard parsing
            orderDate = new Date(dateStr);
          }
          
          const today = new Date();
          
          // Calculate difference in days directly
          const utcOrderDate = Date.UTC(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
          const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
          days = Math.floor((utcToday - utcOrderDate) / (24 * 60 * 60 * 1000));
          
        } else {
          console.warn('Order has no orderDate:', order);
          return;
        }
        
        // Check if days calculation is valid
        if (isNaN(days) || days < 0) {
          console.warn('Invalid days calculation for order:', order.invoiceNo);
          return;
        }
        
        // Increment count for this day
        const currentCount = delayCountMap.get(days) || 0;
        delayCountMap.set(days, currentCount + 1);
      });
      
      // Filter to only include orders that exceed the threshold
      const filteredDelayMap = new Map();
      delayCountMap.forEach((count, days) => {
        if (days >= this.daysThreshold) {
          filteredDelayMap.set(days, count);
        }
      });
      
      
      
      // Sort days in ascending order
      const sortedDays = Array.from(filteredDelayMap.keys()).sort((a, b) => a - b);
      
      // Create labels and data arrays
      const labels = sortedDays;
      const counts = sortedDays.map(day => filteredDelayMap.get(day));
      
      
      this.updateChart(labels, [counts]);
    },
    
    updateChart(labels, series) {
      if (!this.chart) {
        console.error('Chart not initialized');
        this.initChart(); // Try to initialize if not already done
        if (!this.chart) {
          console.error('Failed to initialize chart');
          return;
        }
      }
      
      // If there is no valid data, do not update the chart with placeholders
      if (!labels || !labels.length || !series || !series[0] || !series[0].length) {
        console.warn('No valid chart data to display');
        return;
      }
      
      
      // Calculate max value for Y axis
      const maxValue = Math.max(...series[0], 1); // Minimum of 1 for scale
      const highValue = Math.ceil(maxValue * 1.2); // Add 20% padding
      
      // Update chart with new data and options
      const data = {
        labels: labels,
        series: series
      };
      
      const options = {
        seriesBarDistance: 10,
        horizontalBars: false, // Vertical bars
        axisX: {
          showGrid: false,
          labelInterpolationFnc: (value) => this.$tt('{n} days', { n: value })
        },
        axisY: {
          onlyInteger: true,
          offset: 40
        },
        high: highValue,
        fullWidth: true,
        chartPadding: {
          top: 30,
          right: 15,
          bottom: 20,
          left: 20
        }
      };
      
      
      try {
        // Update the chart
        this.chart.update(data, options);
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    },
    // Apply pagination to the orders data
    applyPagination() {
      const start = this.pagination.pageNumber * this.pageSize;
      const end = start + this.pageSize;
      
      // Slice the orders array to get current page data
      this.paginatedOrders = this.delayedOrders.slice(start, end);
      
      // Update pagination info
      this.pagination.totalElementsPerPage = this.pageSize;
      this.pagination.totalPages = Math.ceil(this.delayedOrders.length / this.pageSize);
    },
    
    // Pagination navigation methods
    goToPage(pageNumber) {
      if (pageNumber < 0 || pageNumber >= this.pagination.totalPages) return;
      this.pagination.pageNumber = pageNumber;
      this.applyPagination();
    },
    
    nextPage() {
      if (this.pagination.pageNumber < this.pagination.totalPages - 1) {
        this.pagination.pageNumber++;
        this.applyPagination();
      }
    },
    
    prevPage() {
      if (this.pagination.pageNumber > 0) {
        this.pagination.pageNumber--;
        this.applyPagination();
      }
    },
    
    changePageSize() {
      this.pagination.pageNumber = 0; // Reset to first page
      this.applyPagination();
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
  async created() {
    // Ensure token is valid before component initialization
    await AuthenticationService.ensureValidToken();
    this.loadDelayedOrders();
  },
  async mounted() {
    
    // Initialize chart with default data
    this.initChart();
    
    // Load data after component is mounted - no need to check token again
    // as it was already checked in created() hook
    // this.loadDelayedOrders();
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
  stroke-width: 15px;
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

/* Pagination styles */
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.pagination-info {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-numbers {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-number:hover {
  background-color: #eee;
}

.page-number.active {
  background-color: #f44336;
  color: white;
}

.page-size-selector {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-size-selector span {
  margin-right: 10px;
  font-size: 14px;
}

.page-size-selector select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

<style scoped>
.k-loading {
  padding: 32px 0;
}

.mt-3 {
  margin-top: 16px;
}
</style>
