<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="filters-section">
          <div class="md-layout">
            <!-- Agent Filters -->
            <div class="md-layout-item md-size-33">
              <md-field>
                <label>Name</label>
                <md-input v-model="filters.name"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-33">
              <md-field>
                <label>Phone Number</label>
                <md-input v-model="filters.phoneNumber"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-33">
              <md-field>
                <label>Email</label>
                <md-input v-model="filters.email"></md-input>
              </md-field>
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
            <h4 class="title">Delivery Agents</h4>
            <p class="category">Manage all delivery agents</p>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-size-100 text-right">
                <md-button data-background-color="orange" class="md-raised md-success" @click="showAddDialog = true">Add Agent</md-button>
              </div>
            </div>

            <md-table v-model="filteredAgents" :table-header-color="tableHeaderColor">
              <md-table-row 
                slot="md-table-row" 
                slot-scope="{ item }" 
              >
                <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Phone">{{ item.phoneNumber }}</md-table-cell>
                <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                <md-table-cell md-label="Code">{{ item.code || 'N/A' }}</md-table-cell>
                <md-table-cell md-label="Actions">
                  <md-button class="md-just-icon md-simple md-primary" @click="editAgent(item)">
                    <md-icon>edit</md-icon>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteAgent(item)">
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
            
            <!-- Pagination Controls -->
            <div class="pagination-container" v-if="pagination.totalPages > 0">
              <div class="pagination-info">
                Showing {{ filteredAgents.length }} of {{ pagination.totalElements }} agents | 
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
                  @click="goToPage(pagination.pageNumber - 1)" 
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
                  @click="goToPage(pagination.pageNumber + 1)" 
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
            
            <!-- Loading Indicator -->
            <div v-if="loading" class="loading-overlay">
              <md-progress-spinner md-mode="indeterminate" :md-diameter="50"></md-progress-spinner>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Add Dialog -->
    <md-dialog :md-active.sync="showAddDialog">
      <md-dialog-title>Add Agent</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>Name</label>
            <md-input v-model="newAgent.name" required></md-input>
          </md-field>

          <md-field>
            <label>Phone Number</label>
            <md-input v-model="newAgent.phoneNumber" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="newAgent.email" type="email"></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea v-model="newAgent.description"></md-textarea>
          </md-field>

          <md-field>
            <label>Code</label>
            <md-input v-model="newAgent.code"></md-input>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showAddDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="addAgent">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <!-- Edit Dialog -->
    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit Agent</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-field>
            <label>Name</label>
            <md-input v-model="currentAgent.name" required></md-input>
          </md-field>

          <md-field>
            <label>Phone Number</label>
            <md-input v-model="currentAgent.phoneNumber" required></md-input>
          </md-field>

          <md-field>
            <label>Email</label>
            <md-input v-model="currentAgent.email" type="email"></md-input>
          </md-field>

          <md-field>
            <label>Description</label>
            <md-textarea v-model="currentAgent.description"></md-textarea>
          </md-field>

          <md-field>
            <label>Code</label>
            <md-input v-model="currentAgent.code"></md-input>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showEditDialog = false">Cancel</md-button>
        <md-button class="md-raised md-success" @click="updateAgent">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { DeliveryAgentService } from '@/services/DeliveryAgentService';

export default {
  name: "DeliveryAgentsList",
  computed: {
    displayedPages() {
      const currentPage = this.pagination.pageNumber;
      const totalPages = this.pagination.totalPages;
      
      // Show up to 5 page numbers
      if (totalPages <= 5) {
        // If we have 5 or fewer pages, show all of them
        return Array.from({ length: totalPages }, (_, i) => i);
      } else {
        // Always include current page, 2 before and 2 after if possible
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, startPage + 4);
        
        // Adjust if we're near the end
        if (endPage - startPage < 4) {
          startPage = Math.max(0, endPage - 4);
        }
        
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
      }
    }
  },
  data() {
    return {
      tableHeaderColor: "orange",
      agents: [],
      filteredAgents: [],
      showAddDialog: false,
      showEditDialog: false,
      newAgent: {
        name: "",
        phoneNumber: "",
        email: "",
        description: "",
        code: ""
      },
      currentAgent: {
        id: null,
        name: "",
        phoneNumber: "",
        email: "",
        description: "",
        code: null
      },
      filters: {
        name: "",
        phoneNumber: "",
        email: ""
      },
      originalAgent: null,
      // Pagination state
      pagination: {
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        totalElementsPerPage: 10,
        isEmpty: false,
        sortedBy: "UNSORTED"
      },
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100],
      loading: false
    };
  },
  methods: {
    async loadAgents() {
      try {
        this.loading = true;
        const filters = {
          ...this.filters,
          page: this.pagination.pageNumber,
          size: this.pageSize
        };
        
        const response = await DeliveryAgentService.getAllAgents(filters);
        // Handle the actual API response format
        this.agents = response.data || [];
        this.filteredAgents = [...this.agents];
        this.pagination = response.dataProperties || this.pagination;
      } catch (error) {
        console.error('Error loading agents:', error);
        this.$notify({
          message: 'Failed to load agents',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    
    applyFilters() {
      // Reset to first page when applying filters
      this.pagination.pageNumber = 0;
      this.loadAgents();
    },
    
    resetFilters() {
      // Reset filters and pagination
      this.filters = {
        name: "",
        phoneNumber: "",
        email: ""
      };
      this.pagination.pageNumber = 0;
      this.loadAgents();
    },
    
    editAgent(agent) {
      // Store the original agent data for comparison when updating
      this.originalAgent = { ...agent };
      this.currentAgent = { ...agent };
      
      // No need to format date with the new API structure
      
      this.showEditDialog = true;
    },
    
    async deleteAgent(agent) {
      if (confirm("Are you sure you want to delete this agent?")) {
        try {
          this.loading = true;
          await DeliveryAgentService.deleteAgent(agent.id);
          await this.loadAgents(); // Refresh the list
          this.$notify({
            message: 'Agent deleted successfully',
            icon: 'check',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'success'
          });
        } catch (error) {
          console.error('Error deleting agent:', error);
          this.$notify({
            message: 'Failed to delete agent',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
        } finally {
          this.loading = false;
        }
      }
    },
    
    async addAgent() {
      try {
        this.loading = true;
        await DeliveryAgentService.addNewAgent(this.newAgent);
        await this.loadAgents(); // Refresh the list
        this.showAddDialog = false;
        this.resetNewAgentForm();
        this.$notify({
          message: 'Agent added successfully',
          icon: 'check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        });
      } catch (error) {
        console.error('Error adding agent:', error);
        if (error.isApiError) {
          // Display the exact error message from the API
          this.$notify({
            type: 'error',
            title: 'Add Failed',
            message: error.errorMessage || 'An error occurred while adding the agent.',
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
      } finally {
        this.loading = false;
      }
    },
    
    async updateAgent() {
      try {
        this.loading = true;
        
        // Send all fields regardless of whether they've changed
        const allFields = {
          name: this.currentAgent.name,
          phoneNumber: this.currentAgent.phoneNumber,
          email: this.currentAgent.email,
          description: this.currentAgent.description,
          code: this.currentAgent.code
        };
        
        // Pass the agent ID and all fields
        await DeliveryAgentService.updateAgent(this.currentAgent.id, allFields);
        await this.loadAgents(); // Refresh the list
        this.$notify({
          message: 'Agent updated successfully',
          icon: 'check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        });
        this.showEditDialog = false;
      } catch (error) {
        console.error('Error updating agent:', error);
        if (error.isApiError) {
          // Display the exact error message from the API
          this.$notify({
            type: 'error',
            title: 'Update Failed',
            message: error.errorMessage || 'An error occurred while updating the agent.',
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
      } finally {
        this.loading = false;
      }
    },
    
    resetNewAgentForm() {
      this.newAgent = {
        name: "",
        phoneNumber: "",
        email: "",
        description: "",
        code: ""
      };
    },
    
    // Pagination methods
    goToPage(pageNumber) {
      if (pageNumber < 0 || pageNumber >= this.pagination.totalPages) return;
      this.pagination.pageNumber = pageNumber;
      
      // Include current filters when changing pages
      const filters = {
        ...this.filters,
        page: pageNumber,
        size: this.pageSize
      };
      
      this.loadAgentsWithFilters(filters);
    },
    
    changePageSize() {
      this.pagination.pageNumber = 0; // Reset to first page when changing page size
      
      // Include current filters when changing page size
      const filters = {
        ...this.filters,
        page: 0,
        size: this.pageSize
      };
      
      this.loadAgentsWithFilters(filters);
    },
    
    // Helper method to load agents with filters
    loadAgentsWithFilters(filters) {
      this.loading = true;
      DeliveryAgentService.getAllAgents(filters)
        .then(response => {
          this.agents = response.data || [];
          this.filteredAgents = response.data || [];
          this.pagination = response.dataProperties || this.pagination;
        })
        .catch(error => {
          console.error('Error loading agents:', error);
          this.$notify({
            message: 'Failed to load agents',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
  },
  created() {
    this.loadAgents();
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

/* Status colors */
.text-green {
  color: #4caf50;
  font-weight: 500;
}

.text-orange {
  color: #ff9800;
  font-weight: 500;
}

.text-red {
  color: #f44336;
  font-weight: 500;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.pagination-info {
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
  margin-bottom: 10px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.page-numbers {
  display: flex;
  margin: 0 10px;
}

.page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-number:hover {
  background-color: #f5f5f5;
}

.page-number.active {
  background-color: #ff9800;
  color: white;
}

.page-size-selector {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.page-size-selector select {
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
