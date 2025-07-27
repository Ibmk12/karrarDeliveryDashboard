<template>
  <div class="content">
    <!-- Error Dialog -->
    <md-dialog :md-active.sync="showErrorDialog" class="error-dialog">
      <md-dialog-title>Error</md-dialog-title>
      <md-dialog-content>
        <p>{{ errorMessage }}</p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">

        
        <div class="filters-section">
              <div class="md-layout">
                <!-- Trader Name Dropdown -->
                <div class="md-layout-item md-size-50">
                  <div class="status-select">
                    <label>Trader Name</label>
                    <select v-model="filters.traderName" class="md-select-value">
                      <option value="">All</option>
                      <option v-for="trader in uniqueTraders" :key="trader" :value="trader">
                        {{ trader }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Date Range -->
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>From Delivery Date</label>
                    <md-input type="date" v-model="filters.fromDeliveryDate"></md-input>
                  </md-field>
                </div>

                <!-- Apply/Reset Buttons -->
                <div class="md-layout-item md-size-100 text-right">
                  <md-button class="md-raised md-primary" @click="applyFilters">Apply Filters</md-button>
                  <md-button class="md-raised" @click="resetFilters">Reset</md-button>
                </div>
              </div>
            </div>
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Reports</h4>
            <p class="category">All Orders</p>
          </md-card-header>
          <md-card-content>
            <!-- Export Button -->
            <div class="export-button">
              <md-button class="md-raised md-primary" @click="exportToExcel">
                <md-icon>file_download</md-icon> Export to Excel
              </md-button>
            </div>
            
            <!-- Orders Table -->
            <div>
              <md-table v-model="reportData.orderList" md-sort="sequenceNo" md-sort-order="desc" class="report-table">
                <md-table-row slot="md-table-row" slot-scope="{ item }" @click.native="viewOrderDetails(item)" class="clickable-row">
                  <md-table-cell md-label="S.No" md-sort-by="sequenceNo" md-numeric>{{ item.sequenceNo }}</md-table-cell>
                  <md-table-cell md-label="Order Date" md-sort-by="orderDate">{{ formatDate(item.orderDate) }}</md-table-cell>
                  <md-table-cell md-label="Delivery Date" md-sort-by="deliveryDate">{{ formatDate(item.deliveryDate) }}</md-table-cell>
                  <md-table-cell md-label="Invoice No" md-sort-by="invoiceNo">{{ item.invoiceNo }}</md-table-cell>
                  <md-table-cell md-label="Emirate" md-sort-by="emirate">{{ item.emirate }}</md-table-cell>
                  <md-table-cell md-label="Customer Phone" md-sort-by="customerPhoneNo">{{ item.customerPhoneNo }}</md-table-cell>
                  <md-table-cell md-label="Trader" md-sort-by="traderName">{{ item.traderName }}</md-table-cell>
                  <md-table-cell md-label="Trader Code" md-sort-by="traderCode">{{ item.traderCode }}</md-table-cell>
                  <md-table-cell md-label="Total" md-sort-by="totalAmount" md-numeric>{{ item.totalAmount }} AED</md-table-cell>
                  <md-table-cell md-label="Delivery amount" md-sort-by="deliveryAmount" md-numeric>{{ item.deliveryAmount }} AED</md-table-cell>
                  <md-table-cell md-label="Trader  amount" md-sort-by="traderAmount" md-numeric>{{ item.traderAmount }} AED</md-table-cell>
                  <md-table-cell md-label="Status">
                    <md-chip :class="statusClass(item.deliveryStatus)">{{ item.deliveryStatus }}</md-chip>
                  </md-table-cell>
                </md-table-row>
              </md-table>
              
                <!-- Totals Summary Card -->
                <div class="totals-summary" v-if="reportData.orderList && reportData.orderList.length > 0">
                  <div class="total-card">
                    <div class="total-label">Grand Total</div>
                    <div class="total-value">{{ reportData.grandTotalAmount || 0 }} AED</div>
                  </div>
                  <div class="total-card">
                    <div class="total-label">Delivery Amount</div>
                    <div class="total-value">{{ reportData.totalDeliveryAmount || 0 }} AED</div>
                  </div>
                  <div class="total-card">
                    <div class="total-label">Trader Amount</div>
                    <div class="total-value">{{ reportData.totalTraderAmount || 0 }} AED</div>
                  </div>
                  <div class="total-card">
                    <div class="total-label">Agent Amount</div>
                    <div class="total-value">{{ reportData.totalAgentAmount || 0 }} AED</div>
                  </div>
                
                </div>

                <!-- Empty State -->
                <div v-if="!reportData.orderList || reportData.orderList.length === 0" class="empty-state text-center">
                  No orders found
                </div>
            </div>


          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";
import { TraderService } from "@/services/TraderService";

export default {

  data() {
    return {
      tableHeaderColor: "orange",
      showAddDialog: false,
      showErrorDialog: false,
      errorMessage: '',
      traders: [], // Array to store the list of traders
      reportData: {
        traderName: '',
        orderList: [],
        grandTotalAmount: 0,
        totalDeliveryAmount: 0,
        totalTraderAmount: 0,
        totalAgentAmount: 0,
        totalNetCompanyAmount: 0
      },

      loading: false,
      statusOptions: [
        { value: "", label: "All" },
        { value: "PENDING", label: "Pending" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELLED", label: "Cancelled" },
        { value: "UNDER_DELIVERY", label: "Under Delivery" },
      ],
      orders: [],
      filteredOrders: [],
      filters: {
        traderName: "",
        fromDeliveryDate: ""
      },
    };
  },
  methods: {  
    // Format date string
    formatDate(dateString) {
      if (!dateString) return '';
      
      // Check if dateString is a string before trying to split it
      if (typeof dateString !== 'string') {
        return dateString;
      }
      
      // Split the date string to get just the date part (without time)
      return dateString.split(' ')[0];
    },
    
    // Load report data
    async loadReportData() {
      try {
        this.loading = true;
        console.log('kkkkkkkkkkkkkk',this.filters.fromDeliveryDate);
        const response = await OrderService.getReport(this.filters);
        
        // Check if response has dataProperties with isEmpty flag
        if (response?.pagination?.isEmpty) {
          this.showError('No orders found matching your search criteria');
          this.reportData = { 
            orderList: [], 
            grandTotalAmount: 0,
            totalDeliveryAmount: 0,
            totalTraderAmount: 0,
            totalAgentAmount: 0,
            totalNetCompanyAmount: 0
          };
        } else if (response) {
          // If we have a valid response with data
          this.reportData = response;
        } else {
          // Handle case where response is empty or null
          this.showError('No data received from server');
          this.reportData = { 
            orderList: [], 
            grandTotalAmount: 0,
            totalDeliveryAmount: 0,
            totalTraderAmount: 0,
            totalAgentAmount: 0,
            totalNetCompanyAmount: 0
          };
        }
        this.loading = false;
      } catch (error) {
        console.error('Error loading report data:', error);
        this.showError(error.response?.data?.message || 'Failed to load report data. Please try again.');
        this.reportData = { 
          orderList: [], 
          grandTotalAmount: 0,
          totalDeliveryAmount: 0,
          totalTraderAmount: 0,
          totalAgentAmount: 0,
          totalNetCompanyAmount: 0
        };
        this.loading = false;
      }
    },
    
    // Show error message in dialog
    showError(message) {
      this.errorMessage = message;
      this.showErrorDialog = true;
    },
    
    // Apply filters and load report data
    async applyFilters() {
      // Reset pagination to first page when applying new filters
      this.currentPage = 1;
      await this.loadReportData();
    },
    
    // Reset filters and clear the report data
    async resetFilters() {
      this.filters = {
        traderName: "",
        fromDeliveryDate: ""
      };
      // Clear the report data when resetting filters
      this.reportData = {
        orderList: [],
        grandTotalAmount: 0,
        totalDeliveryAmount: 0,
        totalTraderAmount: 0,
        totalAgentAmount: 0,
        totalNetCompanyAmount: 0
      };
    },
    
    // View order details when a row is clicked
    viewOrderDetails(order) {
      console.log("View order details", order);
      // TODO: Navigate to order details page or show modal
    },
    
    
    // Export current report data to Excel
    exportToExcel() {
      try {
        // Call the OrderService exportToExcel method with current filters
        OrderService.exportDailyOrdersToExcel(this.filters);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
    },
    
    statusClass(status) {
      if (!status) return '';
      
      // Normalize the status to uppercase for comparison
      const normalizedStatus = status.toUpperCase();
    
      // Map of status to color class
      const statusColorMap = {
        'DELIVERED': 'status-delivered',
        'PENDING': 'status-pending',
        'CANCELLED': 'status-cancelled',
        'UNDER_DELIVERY': 'status-under-delivery',
        'EXCHANGED': 'status-exchanged',
        'FAILED': 'status-failed'
      };

      return statusColorMap[normalizedStatus] || '';
    },

     async fetchTraders() {
      console.log('Fetching traders...');
      try {
        const traders = await TraderService.getAllTraders();
        this.traders = traders;
      } catch (error) {
        console.error('Error fetching traders:', error);
      }
    }
  },
  computed: {
    uniqueTraders() {
            return this.traders.map(trader => trader.name);
    },
  },
  
  created() {
    // Only fetch the list of traders on component creation
    this.fetchTraders();
  }
};
</script>

<style scoped>
/* Error Dialog Styles */
.error-dialog {
  max-width: 500px;
  width: 90%;
  margin: 0 auto;
  border-radius: 8px;
}

.error-dialog .md-dialog-container {
  padding: 20px;
}

.error-dialog .md-dialog-title {
  color: #ff5252;
  font-weight: 500;
}

.error-dialog .md-dialog-content {
  padding: 16px 24px;
  font-size: 16px;
  line-height: 1.5;
}

.error-dialog .md-dialog-actions {
  padding: 8px 16px 16px;
  justify-content: flex-end;
}

.error-dialog .md-button {
  margin: 0;
  min-width: 80px;
}
.filters-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.filters-section .md-layout {
  margin: -8px;
}

.filters-section .md-layout-item {
  padding: 8px;
  margin-bottom: 0;
}

.md-field {
  margin: 0;
  min-height: 48px;
}

.md-field label {
  font-size: 0.85em;
}

.md-button {
  margin: 4px 8px;
}

.md-button.md-primary {
  background-color: #ff9800 !important;
}

.md-field.md-theme-default.md-focused .md-input {
  border-color: #ff9800;
}

.md-field.md-theme-default.md-focused label {
  color: #ff9800;
}

/* View Toggle Styles */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

/* Table Styles */
.report-table {
  width: 100%;
  margin-bottom: 16px;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

.summary-row {
  background-color: #fff8e1 !important;
  font-weight: bold;
  border-top: 2px solid #ffca28;
  border-bottom: 2px solid #ffca28;
}

.summary-table {
  margin-top: -1px;
  width: 100%;
  border-collapse: collapse;
}

.summary-table td {
  padding: 12px 8px;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

/* Status Chip Styles */
.md-chip {
  min-height: 24px;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-delivered {
  background-color: #4caf50 !important;
  color: white !important;
}

.status-pending {
  background-color: #ff9800 !important;
  color: white !important;
}

.status-cancelled {
  background-color: #f44336 !important;
  color: white !important;
}

.status-under-delivery {
  background-color: #2196f3 !important;
  color: white !important;
}

.status-exchanged {
  background-color: #9c27b0 !important;
  color: white !important;
}

.status-failed {
  background-color: #795548 !important;
  color: white !important;
}

/* Tab Styles */
.md-tabs {
  margin-bottom: 24px;
}

/* Export Button */
.export-button {
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

/* Empty State */
.empty-state {
  font-style: italic;
  color: #757575;
}

/* Totals Summary Cards */
.totals-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.totals-heading {
  width: 100%;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.total-card {
  flex: 1;
  min-width: 150px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.total-card.highlight {
  background-color: #fff8e1;
  border: 1px solid #ffca28;
}

.total-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.total-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}
</style>
