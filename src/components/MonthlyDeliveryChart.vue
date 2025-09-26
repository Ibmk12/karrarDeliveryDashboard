<template>
  <md-card>
    <md-card-header data-background-color="blue" class="card-chart">
      <div id="monthlyDeliveryChartId" class="ct-chart" style="height: 250px;"></div>
    </md-card-header>
    <md-card-content>
      <h4 class="title">Monthly Deliveries</h4>
      <p class="category">
        <span>Delivery counts by month</span>
      </p>
      
      <!-- Filter controls -->
      <div class="filter-controls">
        <!-- Months to display -->
        <md-field>
          <label for="months">Months</label>
          <md-select v-model="monthsToDisplay" name="months" id="months" @md-selected="loadData">
            <md-option v-for="option in monthOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </md-option>
          </md-select>
        </md-field>
        
        <!-- Delivery status -->
        <md-field>
          <label for="status">Status</label>
          <md-select v-model="selectedStatus" name="status" id="status" @md-selected="loadData">
            <md-option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </md-card-content>
    
    <md-card-actions md-alignment="left">
      <div class="stats">
        <md-icon>access_time</md-icon>
        updated {{ lastUpdated }}
      </div>
    </md-card-actions>
  </md-card>
</template>

<script>
import { OrderService } from "@/services/OrderService";
import Chartist from 'chartist';

export default {
  name: "MonthlyDeliveryChart",
  data() {
    return {
      monthsToDisplay: 50,
      selectedStatus: null,
      lastUpdated: "-",
      chart: null,
      chartData: {
        labels: [],
        series: [[]]
      },
      monthOptions: [
        { value: 6, text: "Last 6 months" },
        { value: 12, text: "Last 12 months" },
        { value: 24, text: "Last 24 months" },
        { value: 50, text: "Last 50 months" }
      ],
      statusOptions: [
        { value: "", text: "All" },
        { value: "DELIVERED", text: "Delivered" },
        { value: "UNDER_DELIVERY", text: "Under Delivery" },
        { value: "PENDING", text: "Pending" },
        { value: "CANCELED", text: "Cancelled" }
      ]
    };
  },
  mounted() {
    this.initChart();
    this.loadData();
  },
  beforeDestroy() {
    // Clean up chart when component is destroyed
    if (this.chart) {
      this.chart.detach();
    }
  },
  methods: {
    initChart() {
      // Initialize empty chart
      const options = {
        seriesBarDistance: 10,
        axisX: {
          showGrid: true,
          showLabel: true,
          offset: 40
        },
        axisY: {
          showGrid: true,
          showLabel: true,
          offset: 40
        },
        high: 10, // Default high value, will be updated with data
        fullWidth: true,
        chartPadding: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 20
        }
      };
      
      // Create initial empty chart
      console.log('Initializing chart with empty data');
      this.chart = new Chartist.Bar('#monthlyDeliveryChartId', this.chartData, options);
    },
    
    updateChart(labels, series) {
      if (!this.chart) {
        console.error('Chart not initialized');
        return;
      }
      
      // Calculate max value for Y axis
      const maxOrders = Math.max(...series[0]);
      const highValue = Math.ceil(maxOrders * 1.2); // Add 20% padding
      
      // Update chart with new data and options
      const data = {
        labels: labels,
        series: series
      };
      
      const options = {
        seriesBarDistance: 10,
        axisX: {
          showGrid: true,
          showLabel: true,
          offset: 40
        },
        axisY: {
          showGrid: true,
          showLabel: true,
          offset: 40
        },
        high: highValue,
        fullWidth: true,
        chartPadding: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 20
        }
      };
      
      console.log('Updating chart with data:', data);
      console.log('Chart options:', options);
      
      // Update the chart
      this.chart.update(data, options);
      
      // Store the data for reference
      this.chartData = data;
    },
    
    loadData() {
      console.log('Loading data with months:', this.monthsToDisplay, 'status:', this.selectedStatus);
      OrderService.getOrderCountPerMonth(this.monthsToDisplay, this.selectedStatus)
        .then(response => {
          console.log('API Response:', response);
          if (response && response.data) {
            // Format the data for the chart
            const monthData = response.data;
            console.log('Month data:', monthData);
            
            // Sort data by month (ascending)
            monthData.sort((a, b) => a.month.localeCompare(b.month));
            
            // Extract labels (months) and values (order counts)
            const labels = monthData.map(item => {
              // Format YYYY-MM to MMM YYYY (e.g., "2025-08" to "Aug 2025")
              const [year, month] = item.month.split('-');
              const date = new Date(year, month - 1);
              return date.toLocaleString('default', { month: 'short', year: 'numeric' });
            });
            
            const series = [monthData.map(item => item.totalOrders)];
            console.log('Processed chart data - labels:', labels, 'series:', series);
            
            // Update the chart with new data
            this.updateChart(labels, series);
            
            // Update last updated timestamp
            this.lastUpdated = new Date().toLocaleTimeString();
          } else {
            console.error('Response missing data property:', response);
          }
        })
        .catch(error => {
          console.error("Error loading monthly delivery data:", error);
        });
    }
  }
};
</script>

<style scoped>
.filter-controls {
  display: flex;
  margin-top: 15px;
}

.filter-controls .md-field {
  flex: 1;
  margin-right: 10px;
  min-width: 120px;
}

.filter-controls .md-field:last-child {
  margin-right: 0;
}
</style>
