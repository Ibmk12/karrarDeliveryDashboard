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
            <!-- From Delivered Date -->
            <div class="md-layout-item md-size-33">
              <md-field>
                <label>From Delivered Date</label>
                <md-input type="date" v-model="filters.fromDeliveredDate"></md-input>
              </md-field>
            </div>

            <!-- To Delivered Date -->
            <div class="md-layout-item md-size-33">
              <md-field>
                <label>To Delivered Date</label>
                <md-input type="date" v-model="filters.toDeliveredDate"></md-input>
              </md-field>
            </div>

            <!-- Delivery Status -->
            <div class="md-layout-item md-size-33">
              <div class="status-select">
                <label>Delivery Status</label>
                <select v-model="filters.deliveryStatus" class="md-select-value">
                  <option value="">All Status</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXCHANGED">Exchanged</option>
                  <option value="UNDER_DELIVERY">Under Delivery</option>
                  <option value="FAILED">Failed</option>
                 
                </select>
              </div>
            </div>

            <!-- Apply/Reset Buttons -->
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-primary" @click="generateReport" :disabled="isLoading">
                <span v-if="isLoading">Generating...</span>
                <span v-else>Generate Report</span>
              </md-button>
              <md-button class="md-raised" @click="resetFilters">Reset</md-button>
            </div>
          </div>
        </div>
          
      </div>
    </div>
  </div>
</template>

<script>
import { Config } from "@/services/Config";
import AuthenticationService from "@/services/AuthenticationService";
import { TraderService } from "@/services/TraderService";

export default {
  name: "TradersFinancialReport",
  data() {
    return {
      filters: {
        fromDeliveredDate: "",
        toDeliveredDate: "",
        deliveryStatus: "DELIVERED"
      },
      reportData: null,
      isLoading: false,
      showErrorDialog: false,
      errorMessage: ""
    };
  },
  methods: {
    async generateReport() {
      if (!this.filters.fromDeliveredDate) {
        this.showError("Please select from date");
        return;
      }

      this.isLoading = true;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$router.push("/login");
          return;
        }

        const blob = await TraderService.generateTraderFinancialReport(this.filters);

        // Handle file download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trader-financial-report-${this.filters.fromDeliveredDate}-to-${this.filters.toDeliveredDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.reportData = { downloaded: true };
      } catch (error) {
        console.error("Error generating report:", error);
        if (error.response && error.response.status === 401) {
          AuthenticationService.logout();
          this.$router.push("/login");
          return;
        }
        this.showError("Failed to generate report. Please try again.");
      } finally {
        this.isLoading = false;
      }
    },

    
    resetFilters() {
      this.filters = {
        fromDeliveredDate: "",
        toDeliveredDate: "",
        deliveryStatus: "DELIVERED"
      };
      this.reportData = null;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    showError(message) {
      this.errorMessage = message;
      this.showErrorDialog = true;
    }
  }
};
</script>

<style scoped>
.filters-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.status-select {
  margin-top: 20px;
}

.status-select label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-weight: 500;
}

.status-select select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.text-right {
  text-align: right;
}

.report-section {
  padding: 20px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.summary-item {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #ff9800;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-section {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-dialog {
  max-width: 400px;
}

.md-table {
  margin-top: 20px;
}

h5 {
  color: #333;
  margin: 20px 0 10px 0;
}

.success-message {
  padding: 20px;
  background-color: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 8px;
  text-align: center;
}

.success-message h5 {
  color: #2e7d32;
  margin-bottom: 10px;
}

.download-info {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: left;
  line-height: 1.6;
}
</style>
