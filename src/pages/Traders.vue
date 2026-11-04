<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <!-- search + filters: everything applies as you type -->
        <div class="k-dir-filters" :class="{ 'is-filtering': hasFilters }">
          <div class="k-dir-head">
            <span class="k-dir-title"><md-icon>tune</md-icon>{{ $tt('Search & filters') }}</span>
            <span v-if="activeFilterCount" class="k-dir-count">{{ $tt('{n} active', { n: activeFilterCount }) }}</span>
          </div>
          <div class="k-dir-top">
            <div class="k-search-box k-live-search">
              <md-icon>search</md-icon>
              <input
                v-model="search"
                type="search"
                :placeholder="$tt('Search name, code or phone')"
                :aria-label="$tt('Search name, code or phone')"
                @input="onSearch"
              />
              <button v-if="search" type="button" class="k-search-clear" :aria-label="$tt('Clear')" @click="clearSearch"><md-icon>close</md-icon></button>
            </div>
            <div class="status-select k-trader-status k-toolbar-status" :class="traderStatusClass">
              <k-search-select
                v-model="filters.deleted"
                :options="[
                  { value: '', label: 'All', dot: 'gray' },
                  { value: false, label: 'Active', dot: 'green' },
                  { value: true, label: 'Deleted', dot: 'red' }
                ]"
                value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :placeholder="$tt('All')"
                @input="applyFilters"
              ></k-search-select>
            </div>
            <md-button class="md-simple k-dir-reset" :disabled="!hasFilters" @click="resetFilters"><md-icon>filter_alt_off</md-icon> {{ $tt('Reset') }}</md-button>
          </div>
          <div class="k-dir-fields">
                <label class="k-dir-field" :class="{ 'is-filled': filters.name }">
                  <span><md-icon>badge</md-icon>{{ $tt('Name') }}</span>
                  <input v-model="filters.name" type="text" :placeholder="$tt('Any name')" @input="onSearch" />
                </label>
                <label class="k-dir-field" :class="{ 'is-filled': filters.code }">
                  <span><md-icon>tag</md-icon>{{ $tt('Code') }}</span>
                  <input v-model="filters.code" type="text" :placeholder="$tt('e.g. TR-01')" @input="onSearch" />
                </label>
                <label class="k-dir-field" :class="{ 'is-filled': filters.phoneNumber }">
                  <span><md-icon>call</md-icon>{{ $tt('Phone Number') }}</span>
                  <input v-model="filters.phoneNumber" type="tel" dir="ltr" inputmode="tel" :placeholder="$tt('Part of the number')" @input="onSearch" />
                </label>
                <label class="k-dir-field" :class="{ 'is-filled': filters.email }">
                  <span><md-icon>alternate_email</md-icon>{{ $tt('Email') }}</span>
                  <input v-model="filters.email" type="text" :placeholder="$tt('Any email')" @input="onSearch" />
                </label>
          </div>
        </div>
        <md-card class="k-dir-card">
          <md-card-header data-background-color="orange" class="k-card-head">
            <div>
              <h4 class="title">{{ $tt('Traders') }}</h4>
              <p class="category">{{ $tt('Manage traders') }}</p>
            </div>
            <md-button class="md-raised md-primary k-head-action" @click="phoneTried = false; showAddDialog = true">
              <md-icon>add_business</md-icon> {{ $tt('Add Trader') }}
            </md-button>
          </md-card-header>
          <md-card-content>
            <div class="k-toolbar">
              <span class="k-selection-hint">
                <md-icon>storefront</md-icon>
                {{ $tt('{n} traders', { n: pagination.totalElements }) }}
              </span>

            </div>

            <md-table v-model="filteredTraders" :table-header-color="tableHeaderColor">
              <md-table-row 
                slot="md-table-row" 
                slot-scope="{ item }" 
                :class="{ 'deleted-row': item.deleted }"
              >
                <md-table-cell md-label="#"><span class="k-rowno">{{ rowNo(item) }}</span></md-table-cell>
                <md-table-cell :md-label="$tt('Name')">
                  <span class="k-user-cell">
                    <span class="k-initials" :class="'tone-' + (item.id % 5)">{{ $initialsOf(item.name) }}</span>
                    <span class="k-dir-name">
                      <strong>{{ item.name }}</strong>
                      <md-chip v-if="item.deleted" class="md-accent md-small">{{ $tt('Deleted') }}</md-chip>
                    </span>
                  </span>
                </md-table-cell>
                <md-table-cell :md-label="$tt('Code')"><span v-if="item.code" class="k-code-pill">{{ item.code }}</span><span v-else class="k-muted">—</span></md-table-cell>
                <md-table-cell :md-label="$tt('Phone')"><a v-if="item.phoneNumber" class="k-dir-phone" dir="ltr" :href="'tel:' + item.phoneNumber">{{ $phoneDisplay(item.phoneNumber) }}</a></md-table-cell>
                <md-table-cell :md-label="$tt('Email')"><a v-if="item.email" class="k-dir-mail" :href="'mailto:' + item.email">{{ item.email }}</a><span v-else class="k-muted">—</span></md-table-cell>
                <md-table-cell :md-label="$tt('Description')"><span class="k-dir-desc" :title="item.description">{{ item.description || '—' }}</span></md-table-cell>
                <md-table-cell :md-label="$tt('Actions')">
                  <md-button class="md-just-icon md-simple md-primary" @click="editTrader(item)">
                    <md-icon>edit</md-icon>
                    <md-tooltip md-direction="top">{{ $tt('Edit') }}</md-tooltip>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteTrader(item)">
                    <md-icon>delete_outline</md-icon>
                    <md-tooltip md-direction="top">{{ $tt('Delete') }}</md-tooltip>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>

            <!-- Loading placeholder rows -->
            <div v-if="loading && filteredTraders.length === 0" class="k-skeleton" aria-hidden="true">
              <div v-for="n in 5" :key="n" class="k-skeleton-row">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else-if="!loading && filteredTraders.length === 0" class="k-empty">
              <md-icon>storefront</md-icon>
              <h4>{{ $tt('No traders found') }}</h4>
              <p>{{ search ? $tt('Nothing matches “{q}”.', { q: search }) : $tt('Try changing or clearing the filters above.') }}</p>
              <md-button class="md-raised" @click="resetFilters"><md-icon>filter_alt_off</md-icon> {{ $tt('Clear filters') }}</md-button>
            </div>
            
            <!-- Pagination Controls -->
            <div class="pagination-container" v-if="pagination.totalPages > 0">
              <div class="pagination-info">
                {{ $tt('Showing {a} of {b} traders', { a: filteredTraders.length, b: pagination.totalElements }) }} · {{ $tt('Page {a} of {b}', { a: pagination.pageNumber + 1, b: pagination.totalPages }) }}
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
                <span>{{ $tt('Items per page:') }}</span>
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
    <md-dialog :md-active.sync="showAddDialog" class="k-wide-dialog">
      <md-dialog-title>{{ $tt('Add Trader') }}</md-dialog-title>

      <md-dialog-content>
        <form class="k-form-grid">
          <md-field>
            <label>{{ $tt('Code') }}</label>
            <md-input v-model="newTrader.code" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Name') }}</label>
            <md-input v-model="newTrader.name" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Email') }}</label>
            <md-input v-model="newTrader.email" type="email" required></md-input>
          </md-field>

          <k-phone-input ref="newPhone" v-model="newTrader.phoneNumber" :label="$tt('Phone Number') + ' *'" format="auto" new-format="plain" empty-text="Enter the phone number"></k-phone-input>

          <md-field class="k-span-2">
            <label>{{ $tt('Description') }}</label>
            <md-textarea v-model="newTrader.description"></md-textarea>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showAddDialog = false">{{ $tt('Cancel') }}</md-button>
        <md-button class="md-raised md-success" @click="addTrader">{{ $tt('Save') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <!-- Edit Dialog -->
    <md-dialog :md-active.sync="showEditDialog" class="k-wide-dialog">
      <md-dialog-title>{{ $tt('Edit Trader') }}</md-dialog-title>

      <md-dialog-content>
        <form class="k-form-grid">
          <md-field>
            <label>{{ $tt('Code') }}</label>
            <md-input v-model="currentTrader.code" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Name') }}</label>
            <md-input v-model="currentTrader.name" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $tt('Email') }}</label>
            <md-input v-model="currentTrader.email" type="email" required></md-input>
          </md-field>

          <k-phone-input ref="editPhone" v-model="currentTrader.phoneNumber" :label="$tt('Phone Number') + ' *'" format="auto" new-format="plain" empty-text="Enter the phone number"></k-phone-input>

          <md-field class="k-span-2">
            <label>{{ $tt('Description') }}</label>
            <md-textarea v-model="currentTrader.description"></md-textarea>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-simple" @click="showEditDialog = false">{{ $tt('Cancel') }}</md-button>
        <md-button class="md-raised md-success" @click="updateTrader">{{ $tt('Save') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { searchMatch, newestFirst } from '@/plugins/ui';
import { TraderService } from '@/services/TraderService';

export default {
  name: "Traders",
  computed: {
    activeFilterCount() {
      const f = this.filters;
      return [this.search, f.name, f.code, f.phoneNumber, f.email].filter((v) => String(v || "").trim()).length + (f.deleted !== false ? 1 : 0);
    },
    hasFilters() {
      const f = this.filters;
      return !!(this.search || f.name || f.code || f.phoneNumber || f.email || f.deleted !== false);
    },
    /** colours the Status filter: green for Active, red for Deleted */
    traderStatusClass() {
      if (this.filters.deleted === true) return "is-deleted";
      if (this.filters.deleted === false) return "is-active";
      return "";
    },
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
      phoneTried: false,
      traders: [],
      filteredTraders: [],
      search: "",
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
        code: "",
        phoneNumber: "",
        email: "",
        deleted: false
      },
      originalTrader: null,
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
    /** Load the whole list once (newest first); search and paging then happen instantly in the browser */
    async loadTraders() {
      try {
        this.loading = true;
        const response = await TraderService.getAllTraders({ deleted: this.filters.deleted, page: 0, size: 2000, sort: "id,desc" });
        this.traders = (response.traders || []).slice().sort(newestFirst);
        this.applyView();
      } catch (error) {
        console.error('Error loading traders:', error);
        this.$notify({
          message: 'Failed to load traders',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },

    /** search (Search name, code or phone) + the current page, without asking the server */
    applyView() {
      const f = this.filters;
      const has = (v, q) => !q || String(v || "").toLowerCase().includes(String(q).trim().toLowerCase());
      const list = this.traders.filter(
        (x) =>
          searchMatch(this.search, [x.name, x.code, x.phoneNumber, x.email], [x.phoneNumber]) &&
          has(x.name, f.name) &&
          has(x.code, f.code) &&
          has(x.email, f.email) &&
          (!String(f.phoneNumber || "").trim() || searchMatch(f.phoneNumber, [], [x.phoneNumber]))
      );
      const size = this.pageSize || 10;
      const totalPages = Math.ceil(list.length / size);
      const pageNumber = Math.min(this.pagination.pageNumber || 0, Math.max(totalPages - 1, 0));
      this.pagination = { ...this.pagination, totalElements: list.length, totalPages, pageNumber, totalElementsPerPage: size };
      this.filteredTraders = list.slice(pageNumber * size, pageNumber * size + size);
    },

    /** 1, 2, 3 … down the list (newest first), continuing across pages */
    rowNo(item) {
      return this.pagination.pageNumber * (this.pageSize || 10) + this.filteredTraders.indexOf(item) + 1;
    },

    onSearch() {
      this.pagination.pageNumber = 0;
      this.applyView();
    },

    clearSearch() {
      this.search = "";
      this.onSearch();
    },

    applyFilters() {
      this.pagination.pageNumber = 0;
      this.loadTraders();
    },

    resetFilters() {
      this.search = "";
      this.filters = { ...this.filters, name: "", code: "", phoneNumber: "", email: "" };
      this.filters.deleted = false;
      this.pagination.pageNumber = 0;
      this.loadTraders();
    },
    editTrader(trader) {
      // Store the original trader data for comparison when updating
      this.originalTrader = { ...trader };
      this.currentTrader = { ...trader };
      this.phoneTried = false;
      this.showEditDialog = true;
    },
    async deleteTrader(trader) {
      if (await this.$kConfirm({ title: "Delete trader?", message: "{name} will be removed from the traders list.", params: { name: trader.name }, confirmText: "Delete", danger: true })) {
        try {
          await TraderService.deleteTrader(trader.id);
          await this.loadTraders(); // Refresh the list
          this.$toast.success(`Trader "${trader.name}" deleted successfully`);
        } catch (error) {
          console.error('Error deleting trader:', error);
          this.$toast.error(`Failed to delete trader "${trader.name}"`);
        }
      }
    },
    async addTrader() {
      if (this.$phoneWarning(this.newTrader.phoneNumber, true)) {
        this.phoneTried = true;
        Object.values(this.$refs).forEach((r) => r && typeof r.isValid === "function" && r.isValid());
        this.$toast.warning(this.$tt("Check the phone number"));
        return;
      }
      try {
        await TraderService.addNewTrader(this.newTrader);
        await this.loadTraders(); // Refresh the list
        this.$toast.success(`Trader "${this.newTrader.name}" added successfully`);
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
      const phoneChanged = this.currentTrader.phoneNumber !== (this.originalTrader && this.originalTrader.phoneNumber);
      if (phoneChanged && this.$phoneWarning(this.currentTrader.phoneNumber, true)) {
        this.phoneTried = true;
        Object.values(this.$refs).forEach((r) => r && typeof r.isValid === "function" && r.isValid());
        this.$toast.warning(this.$tt("Check the phone number"));
        return;
      }
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
          this.$toast.success(`Trader "${this.currentTrader.name}" updated successfully`);
        } else {
          this.$toast.info("No changes to save");
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
    },
    
    // Pagination methods
    goToPage(pageNumber) {
      if (pageNumber < 0 || pageNumber >= this.pagination.totalPages) return;
      this.pagination.pageNumber = pageNumber;
      this.applyView();
    },

    changePageSize() {
      this.pagination.pageNumber = 0;
      this.applyView();
    },
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
