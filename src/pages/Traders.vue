<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="filters-section">
          <div class="md-layout">
            <!-- Trader Filters -->
            <div class="md-layout-item md-size-25">
              <md-field>
                <label>Name</label>
                <md-input v-model="filters.name"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-25">
              <md-field>
                <label>Phone Number</label>
                <md-input v-model="filters.phoneNumber"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-25">
              <md-field>
                <label>Email</label>
                <md-input v-model="filters.email"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-25">
              <div class="status-select">
                <label>Status</label>
                <select v-model="filters.deleted" class="md-select-value">
                  <option value="">All</option>
                  <option :value="false">Active</option>
                  <option :value="true">Deleted</option>
                </select>
              </div>
            </div>
            
            <!-- Apply Filters Button -->
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-primary" @click="applyFilters">Apply Filters</md-button>
              <md-button class="md-raised" @click="resetFilters">Reset</md-button>
            </div>
          </div>
        </div>
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Traders</h4>
            <p class="category">Manage traders</p>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-size-100 text-right">
                <md-button data-background-color="orange" class="md-raised md-success" @click="showAddDialog = true">Add Trader</md-button>
              </div>
            </div>

            <md-table v-model="filteredTraders" :table-header-color="tableHeaderColor">
              <md-table-row 
                slot="md-table-row" 
                slot-scope="{ item }" 
                :class="{ 'deleted-row': item.deleted }"
              >
                <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Code">{{ item.code }}</md-table-cell>
                <md-table-cell md-label="Name">
                  {{ item.name }}
                  <md-chip v-if="item.deleted" class="md-accent md-small">Deleted</md-chip>
                </md-table-cell>
                <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Phone">{{ item.phoneNumber }}</md-table-cell>
                <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                <md-table-cell md-label="Actions">
                  <md-button class="md-just-icon md-simple md-primary" @click="editTrader(item)">
                    <md-icon>edit</md-icon>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteTrader(item)">
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Add Dialog -->
    <md-dialog :md-active.sync="showAddDialog">
      <md-dialog-title>Add Trader</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>Code</label>
            <md-input v-model="newTrader.code" required></md-input>
          </md-field>

          <md-field>
            <label>Name</label>
            <md-input v-model="newTrader.name" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="newTrader.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>Phone Number</label>
            <md-input v-model="newTrader.phoneNumber" required></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea v-model="newTrader.description"></md-textarea>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showAddDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="addTrader">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <!-- Edit Dialog -->
    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit Trader</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>Code</label>
            <md-input v-model="currentTrader.code" required></md-input>
          </md-field>

          <md-field>
            <label>Name</label>
            <md-input v-model="currentTrader.name" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="currentTrader.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>Phone Number</label>
            <md-input v-model="currentTrader.phoneNumber" required></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea v-model="currentTrader.description"></md-textarea>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showEditDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="updateTrader">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { TraderService } from '@/services/TraderService';

export default {
  name: "Traders",
  data() {
    return {
      tableHeaderColor: "orange",
      traders: [],
      filteredTraders: [],
      showAddDialog: false,
      showEditDialog: false,
      newTrader: {
        code: "",
        name: "",
        email: "",
        phoneNumber: "",
        description: ""
      },
      currentTrader: {
        id: null,
        code: "",
        name: "",
        email: "",
        phoneNumber: "",
        description: ""
      },
      filters: {
        name: "",
        phoneNumber: "",
        email: "",
        deleted: ""
      },
      originalTrader: null
    };
  },
  methods: {
    async loadTraders() {
      try {
        const response = await TraderService.getAllTraders(this.filters);
        this.traders = response;
        this.filteredTraders = [...this.traders];
      } catch (error) {
        console.error('Error loading traders:', error);
        // You might want to show an error notification here
      }
    },
    
    applyFilters() {
      this.loadTraders();
    },
    
    resetFilters() {
      this.filters = {
        name: "",
        phoneNumber: "",
        email: "",
        deleted: ""
      };
      this.loadTraders();
    },
    editTrader(trader) {
      // Store the original trader data for comparison when updating
      this.originalTrader = { ...trader };
      this.currentTrader = { ...trader };
      this.showEditDialog = true;
    },
    async deleteTrader(trader) {
      if (confirm("Are you sure you want to delete this trader?")) {
        try {
          await TraderService.deleteTrader(trader.id);
          await this.loadTraders(); // Refresh the list
        } catch (error) {
          console.error('Error deleting trader:', error);
          // You might want to show an error notification here
        }
      }
    },
    async addTrader() {
      try {
        await TraderService.addNewTrader(this.newTrader);
        await this.loadTraders(); // Refresh the list
        this.showAddDialog = false;
        this.resetNewTraderForm();
      } catch (error) {
        console.error('Error adding trader:', error);
        if (error.isApiError) {
          // Display the exact error message from the API
          this.$notify({
            type: 'error',
            title: 'Add Failed',
            message: error.errorMessage || 'An error occurred while adding the trader.',
            icon: 'warning',
            horizontalAlign: 'right',
            verticalAlign: 'top',
          });
          // Keep the dialog open so the user can fix the issue
        } else {
          // Handle general errors
          this.$notify({
              type: 'error',
              title: 'Add Failed',
              message: 'An unexpected error occurred. Please try again later.',
              icon: 'warning',
              horizontalAlign: 'right',
              verticalAlign: 'top',
          });
        }
      }
    },
    async updateTrader() {
      try {
        // Determine which fields have changed
        const updatedFields = {};
        
        // Compare each field and only include changed ones
        if (this.currentTrader.code !== this.originalTrader.code) {
          updatedFields.code = this.currentTrader.code;
        }
        if (this.currentTrader.name !== this.originalTrader.name) {
          updatedFields.name = this.currentTrader.name;
        }
        if (this.currentTrader.email !== this.originalTrader.email) {
          updatedFields.email = this.currentTrader.email;
        }
        if (this.currentTrader.phoneNumber !== this.originalTrader.phoneNumber) {
          updatedFields.phoneNumber = this.currentTrader.phoneNumber;
        }
        if (this.currentTrader.description !== this.originalTrader.description) {
          updatedFields.description = this.currentTrader.description;
        }
        
        // Only proceed with update if there are changes
        if (Object.keys(updatedFields).length > 0) {
          // Pass only the trader ID and the changed fields
          await TraderService.updateTrader(this.currentTrader.id, updatedFields);
          await this.loadTraders(); // Refresh the list
        }
        
        this.showEditDialog = false;
      } catch (error) {
        console.error('Error updating trader:', error);
        if (error.isApiError) {
          // Display the exact error message from the API
          this.$notify({
            type: 'error',
            title: 'Update Failed',
            message: error.errorMessage || 'An error occurred while updating the trader.',
            icon: 'warning'
          });
          // Keep the dialog open so the user can fix the issue
        } else {
          // Handle general errors
          this.$notify({
              type: 'error',
              title: 'Update Failed',
              message: 'An unexpected error occurred. Please try again later.',
              icon: 'warning'
          });
        }
      }
    },
    resetNewTraderForm() {
      this.newTrader = {
        code: "",
        name: "",
        email: "",
        phoneNumber: "",
        description: ""
      };
    }
  },
  created() {
    this.loadTraders();
  }
};
</script>

<style>
.deleted-row {
  opacity: 0.7;
  background-color: #ffebee !important;
}

.md-chip.md-small {
  height: 20px;
  padding: 0 8px;
  margin-left: 8px;
  font-size: 12px;
}

.deleted-row .md-button {
  opacity: 0.5;
}

.filters-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  margin-bottom: 20px;
  padding: 15px;
}

.status-select {
  margin-top: 16px;
}

.status-select label {
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  display: block;
  margin-bottom: 5px;
}

.md-select-value {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: transparent;
}
</style>
