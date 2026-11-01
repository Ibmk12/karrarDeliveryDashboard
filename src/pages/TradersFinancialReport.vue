<template>
  <div class="content">
    <!-- Error Dialog -->
    <md-dialog :md-active.sync="showErrorDialog" class="error-dialog">
      <md-dialog-content class="k-error-dialog">
        <div class="k-error-icon"><md-icon>error_outline</md-icon></div>
        <h3 class="k-error-title">{{ $tt('Error') }}</h3>
        <p class="k-error-text">{{ $tt(errorMessage) }}</p>
      </md-dialog-content>
      <md-dialog-actions class="k-error-actions">
        <md-button class="md-raised md-primary" @click="showErrorDialog = false">{{ $tt('Close') }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        
        <md-card class="report-card">
          <md-card-header data-background-color="orange">
            <h4 class="title">{{ $tt('Traders Financial Report') }}</h4>
            <p class="category">{{ $tt('Pick a delivered-date range and an optional status, then generate the report') }}</p>
          </md-card-header>
          <md-card-content>
          <div class="md-layout report-filters" v-enter-submit="generateReport">
            <!-- From Delivered Date -->
            <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
              <k-date-field v-model="filters.fromDeliveredDate" :range-end="filters.toDeliveredDate" :label="$tt('From Delivered Date')" :placeholder="$tt('Select date')"></k-date-field>
            </div>

            <!-- To Delivered Date -->
            <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
              <k-date-field v-model="filters.toDeliveredDate" :range-start="filters.fromDeliveredDate" :label="$tt('To Delivered Date')" :placeholder="$tt('Select date')"></k-date-field>
            </div>

            <!-- Delivery Status -->
            <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="status-select">
                <label>{{ $tt('Delivery Status') }}</label>
                <k-search-select
                  v-model="filters.deliveryStatus"
                  :options="[
                    { value: '', label: 'All Status' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                    { value: 'EXCHANGED', label: 'Exchanged' },
                    { value: 'UNDER_DELIVERY', label: 'Under Delivery' },
                    { value: 'FAILED', label: 'Failed' }
                  ]"
                  value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('All Status')"
                ></k-search-select>
              </div>
            </div>

            <!-- Apply/Reset Buttons -->
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised" @click="resetFilters">{{ $tt('Reset') }}</md-button>
              <md-button class="md-raised md-primary" @click="generateReport" :disabled="isLoading">
                <md-progress-spinner v-if="isLoading" :md-diameter="16" :md-stroke="2" md-mode="indeterminate" class="btn-spinner"></md-progress-spinner>
                <md-icon v-else>description</md-icon>
                <span v-if="isLoading">{{ $tt('Generating...') }}</span>
                <span v-else>{{ $tt('Generate Report') }}</span>
              </md-button>
            </div>
          </div>
          </md-card-content>
        </md-card>
          
      </div>
    </div>
  </div>
</template>

<script>
import { Config } from "@/services/Config";
import { AuthenticationService } from "@/services/AuthenticationService";
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
.report-card {
  max-width: 980px;
}

.report-filters {
  margin: 0 -8px;
  align-items: flex-end;
}

.report-filters .md-layout-item {
  padding: 0 8px;
}

.report-filters .md-layout-item.text-right {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.report-filters .md-button {
  margin: 0;
}

.btn-spinner {
  display: inline-block;
  vertical-align: middle;
}

.btn-spinner >>> .md-progress-spinner-circle {
  stroke: #fff !important;
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
  margin: 0 auto;
}

.error-dialog .md-dialog-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-dialog .md-dialog-title {
  text-align: center;
}

.error-dialog .md-dialog-content p {
  text-align: center !important;
  margin: 0;
  display: block;
}

.error-dialog .md-dialog-actions {
  text-align: center;
  justify-content: center;
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
