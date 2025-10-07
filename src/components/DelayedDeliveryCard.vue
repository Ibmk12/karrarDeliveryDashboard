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
        <div v-else-if="paginatedOrders.length === 0" class="text-center empty-state">
          <p>No delayed deliveries found</p>
        </div>
        <div v-else>
          <md-table v-model="paginatedOrders" md-sort="invoiceNo" md-sort-order="asc">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Invoice No" md-sort-by="invoiceNo">{{ item.invoiceNo }}</md-table-cell>
              <md-table-cell md-label="Agent" md-sort-by="deliveryAgent">{{ item.deliveryAgent }}</md-table-cell>
              <md-table-cell md-label="Order Date" md-sort-by="orderDate">{{ formatDate(item.orderDate) }}</md-table-cell>
              <md-table-cell md-label="Delivery Date" md-sort-by="deliveryDate">{{ formatDate(item.deliveryDate) }}</md-table-cell>
              <md-table-cell md-label="Address" md-sort-by="address">{{ item.address }}</md-table-cell>
              <md-table-cell md-label="Emirate" md-sort-by="emirate">{{ item.emirate }}</md-table-cell>
              <md-table-cell md-label="Status" md-sort-by="deliveryStatus">{{ item.deliveryStatus }}</md-table-cell>
              <md-table-cell md-label="Trader" md-sort-by="traderName">{{ item.traderName }}</md-table-cell>
              <md-table-cell md-label="Customer" md-sort-by="customerPhoneNo">{{ item.customerPhoneNo }}</md-table-cell>
              <md-table-cell md-label="Total" md-sort-by="totalAmount" md-numeric>{{ item.totalAmount }} AED</md-table-cell>
              <md-table-cell md-label="Trader Amt" md-sort-by="traderAmount" md-numeric>{{ item.traderAmount }} AED</md-table-cell>
              <md-table-cell md-label="Delivery Amt" md-sort-by="deliveryAmount" md-numeric>{{ item.deliveryAmount }} AED</md-table-cell>
              <md-table-cell md-label="Agent Amt" md-sort-by="agentAmount" md-numeric>{{ item.agentAmount }} AED</md-table-cell>
            </md-table-row>
          </md-table>
          
          <!-- Pagination Controls -->
          <div class="pagination-container" v-if="pagination.totalPages > 0">
            <div class="pagination-info">
              Showing {{ paginatedOrders.length }} of {{ pagination.totalElements }} orders | 
              Page {{ pagination.pageNumber + 1 }} of {{ pagination.totalPages }}
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
              <span>Items per page:</span>
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
      console.log('Loading delayed orders with threshold:', this.daysThreshold);
      this.loading = true;
      try {
        // Ensure token is valid before making API call
        await AuthenticationService.ensureValidToken();
        const response = await OrderService.getDelayedDeliveryOrders(this.daysThreshold);
        console.log('API response:', response);
        
        // Get all orders for chart data and table
        const allDelayedOrders = response.data || [];
        console.log('All delayed orders:', allDelayedOrders);
        
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
          showGrid: true,
          labelInterpolationFnc: (value) => `${value}d` // Add 'd' suffix to day numbers
        },
        axisY: {
          onlyInteger: true,
          offset: 40
        },
        high: 10,
        fullWidth: true,
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
            console.log('Parsed date parts:', { day, month, year, hours, minutes });
          } else {
            // Fallback to standard parsing
            orderDate = new Date(dateStr);
          }
          
          const today = new Date();
          console.log('Order date string:', order.orderDate);
          console.log('Parsed order date:', orderDate);
          console.log('Today date:', today);
          
          // Calculate difference in days directly
          const utcOrderDate = Date.UTC(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
          const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
          days = Math.floor((utcToday - utcOrderDate) / (24 * 60 * 60 * 1000));
          
          console.log('Processing order:', order.invoiceNo, 'orderDate:', order.orderDate, 'calculated days:', days);
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
      
      console.log('Filtered delay map:', Array.from(filteredDelayMap.entries()));
      
      
      // Sort days in ascending order
      const sortedDays = Array.from(filteredDelayMap.keys()).sort((a, b) => a - b);
      
      // Create labels and data arrays
      const labels = sortedDays;
      const counts = sortedDays.map(day => filteredDelayMap.get(day));
      
      console.log('Days:', labels);
      console.log('Final counts:', counts);
      
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
      
      console.log('Chart data before update - labels:', labels, 'series:', series);
      
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
          showGrid: true,
          labelInterpolationFnc: (value) => `${value}d` // Add 'd' suffix to day numbers
        },
        axisY: {
          onlyInteger: true,
          offset: 40
        },
        high: highValue,
        fullWidth: true,
        chartPadding: {
          top: 20,
          right: 15,
          bottom: 20,
          left: 20
        }
      };
      
      console.log('Updating chart with data:', data);
      console.log('Chart options:', options);
      
      try {
        // Update the chart
        this.chart.update(data, options);
        console.log('Chart update completed');
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
    console.log('DelayedDeliveryCard created');
    // Ensure token is valid before component initialization
    await AuthenticationService.ensureValidToken();
    this.loadDelayedOrders();
  },
  async mounted() {
    console.log('DelayedDeliveryCard mounted');
    
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
.empty-state {
  padding: 20px;
  color: #999;
  font-style: italic;
}

.mt-3 {
  margin-top: 16px;
}
</style>
