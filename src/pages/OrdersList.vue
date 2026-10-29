<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="filters-section" v-enter-submit="applyFilters">
              <div class="md-layout">
                <!-- Basic Info Filters -->
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <md-field>
                    <label>Invoice No</label>
                    <md-input v-model="filters.invoiceNo"></md-input>
                  </md-field>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <k-date-field v-model="filters.fromOrderDate" label="From Order Date" placeholder="Any date"></k-date-field>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <k-date-field v-model="filters.toOrderDate" label="To Order Date" placeholder="Any date"></k-date-field>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <md-field>
                    <label>Customer Phone</label>
                    <md-input v-model="filters.customerPhoneNo"></md-input>
                  </md-field>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <md-field>
                    <label>Total Amount</label>
                    <md-input type="number" v-model="filters.totalAmount"></md-input>
                  </md-field>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <div class="status-select">
                    <label>Status</label>
                    <k-search-select v-model="filters.deliveryStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="All"></k-search-select>
                  </div>
                </div>
                
                <div class="md-layout-item md-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                  <div class="status-select">
                    <label>Trader Name</label>
                    <k-search-select v-model="filters.traderName" :options="traders" value-key="name" sub-key="code" placeholder="All traders" noun="traders"></k-search-select>
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
              <h4 class="title">All Orders</h4>
              <p class="category">Complete list of all delivery orders</p>
          </md-card-header>
          <md-card-content>
            <div class="k-toolbar">
              <div class="k-toolbar-group">
                <md-button class="md-raised" @click="openUpdateDialog" :disabled="selectedOrders.length === 0">
                  <md-icon>sync_alt</md-icon> Update Status
                </md-button>
                <md-button class="md-raised" @click="openStatusAndAmountDialog" :disabled="selectedOrders.length === 0">
                  <md-icon>price_change</md-icon> Update Status and amount
                </md-button>
                <span class="k-selection-hint">
                  <md-icon>{{ selectedOrders.length ? 'check_box' : 'info_outline' }}</md-icon>
                  <template v-if="selectedOrders.length">{{ selectedOrders.length }} selected</template>
                  <template v-else>Select rows to update</template>
                </span>
              </div>
              <div class="k-toolbar-group">
                <md-button class="md-raised" @click="exportOrderReport">
                  <md-icon>file_download</md-icon> Export Report
                </md-button>
                <md-button class="md-raised md-info" @click="openUploadDialog">
                  <md-icon>file_upload</md-icon> Upload Orders
                </md-button>
                <md-button class="md-raised md-primary" @click="showAddDialog = true">
                  <md-icon>add</md-icon> Add Order
                </md-button>
              </div>
            </div>
           
            
            <md-table class="orders-table" v-model="filteredOrders" :table-header-color="tableHeaderColor" @md-selected="onSelect" @md-selection-change="onSelectionChange" :md-selected-value="selectedOrders">
              <md-table-row
                slot="md-table-row"
                slot-scope="{ item }"
                md-selectable="multiple"
                :md-selected="isSelected(item)"
              >
                <md-table-cell class="cell-small" md-label=" ID "><span class="k-id">#{{ item.orderId }}</span></md-table-cell>
                <md-table-cell class="cell-small action-cell" md-label="Actions">
                  <div class="action-buttons">
                    <md-button class="md-just-icon md-simple md-warning action-btn" @click="openEditDialog(item)">
                      <md-icon>edit</md-icon>
                      <md-tooltip md-direction="top">Edit</md-tooltip>
                    </md-button>
                    <md-button class="md-just-icon md-simple md-danger action-btn" @click="deleteOrder(item)">
                      <md-icon>delete_outline</md-icon>
                      <md-tooltip md-direction="top">Delete</md-tooltip>
                    </md-button>
                  </div>
                </md-table-cell>
                <md-table-cell class="cell-small" md-label="Invoice">{{ item.invoiceNo }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Trader Name">{{ item.traderName }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Total"><span class="k-money">{{ item.totalAmount | money }} <small>AED</small></span></md-table-cell>
                <md-table-cell class="cell-small" md-label="Emirate">{{ item.emirate }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Customer Phone">{{ item.customerPhoneNo }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="deliveryStatus">
                  <span :class="['status-badge', statusClass(item.deliveryStatus)]">{{ item.deliveryStatus }}</span>
                </md-table-cell>
                <md-table-cell class="cell-small" md-label="Agent">{{ item.agentName || '—' }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Order Date">{{ item.orderDate | kDay }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Delivery Date">{{ item.deliveryDate | kDay }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Address">{{ item.address }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Trader Amount"><span class="k-money">{{ item.traderAmount | money }} <small>AED</small></span></md-table-cell>
                <md-table-cell class="cell-small" md-label="Delivery Fee"><span class="k-money">{{ item.deliveryAmount | money }} <small>AED</small></span></md-table-cell>
                <md-table-cell class="cell-small" md-label="Agent Fee"><span class="k-money">{{ item.agentAmount | money }} <small>AED</small></span></md-table-cell>
                <md-table-cell class="cell-small" md-label="Net Company"><span class="k-money">{{ item.netCompanyAmount | money }} <small>AED</small></span></md-table-cell>
                <md-table-cell class="cell-small" md-label="Comment">{{ item.comment }}</md-table-cell>
                
              </md-table-row>
            </md-table>

            <!-- Loading placeholder rows -->
            <div v-if="loading && filteredOrders.length === 0" class="k-skeleton" aria-hidden="true">
              <div v-for="n in 5" :key="n" class="k-skeleton-row">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else-if="!loading && filteredOrders.length === 0" class="k-empty">
              <md-icon>inventory_2</md-icon>
              <h4>No orders found</h4>
              <p>Try changing or clearing the filters above.</p>
              <md-button class="md-raised" @click="resetFilters"><md-icon>filter_alt_off</md-icon> Clear filters</md-button>
            </div>
            
            <!-- Pagination Controls -->
            <div class="pagination-container" v-if="pagination.totalPages > 0">
              <div class="pagination-info">
                Showing {{ filteredOrders.length }} of {{ pagination.totalElements }} orders | 
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

            <!-- Edit Order Dialog -->
            <md-dialog :md-active.sync="showEditDialog" :md-fullscreen="false">
              <md-dialog-title>Edit Order</md-dialog-title>

              <md-dialog-content>
                <form>
                  <md-field>
                    <label>Invoice No</label>
                    <md-input v-model="editingOrder.invoiceNo"></md-input>
                  </md-field>

                  <k-date-field v-model="editingOrder.orderDate" label="Order Date" placeholder="Select date"></k-date-field>

                  <k-date-field v-model="editingOrder.deliveryDate" label="Delivery Date" placeholder="Select date"></k-date-field>

                  <div class="status-select">
                    <label>Emirate</label>
                    <k-search-select v-model="editingOrder.emirate" :options="emirateOptions" value-key="value" label-key="label" :clearable="false" placeholder="Select emirate" noun="emirates"></k-search-select>
                  </div>

                  <md-field>
                    <label>Address</label>
                    <md-input v-model="editingOrder.address"></md-input>
                  </md-field>

                  <md-field>
                    <label>Customer Phone</label>
                    <md-input v-model="editingOrder.customerPhone"></md-input>
                  </md-field>

                  <md-field>
                    <label>Total Amount</label>
                    <md-input type="number" v-model="editingOrder.traderAmount"></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Amount</label>
                    <md-input type="number" v-model="editingOrder.deliveryAmount"></md-input>
                  </md-field>

                  <md-field>
                    <label>Agent Amount</label>
                    <md-input type="number" v-model="editingOrder.agentAmount"></md-input>
                  </md-field>

                  <div class="status-select">
                    <label>Delivery Agent</label>
                    <k-search-select v-model="editingOrder.agentId" :options="agents" value-key="id" sub-key="code" placeholder="Select agent" noun="agents"></k-search-select>
                  </div>
                  
                  <div class="status-select">
                    <label>Trader Name</label>
                    <k-search-select v-model="editingOrder.traderId" :options="traders" value-key="id" sub-key="code" placeholder="Select trader" noun="traders"></k-search-select>
                  </div>

                  <div class="status-select">
                    <label>Status</label>
                    <k-search-select v-model="editingOrder.deliveryStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="Select status"></k-search-select>
                  </div>

                  <md-field>
                    <label>Comment</label>
                    <md-input v-model="editingOrder.comment"></md-input>
                  </md-field>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showEditDialog = false">Cancel</md-button>
                <md-button class="md-primary" @click="saveEditOrder">Save</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Add Order Dialog -->
            <md-dialog :md-active.sync="showAddDialog" :md-fullscreen="false" class="add-order-dialog">
              <md-dialog-title>Add New Order</md-dialog-title>

              <md-dialog-content class="add-order-content">
                <form>
                  <div class="form-grid">
                    <!-- Row 1 -->
                    <div class="form-field">
                      <label>Order Date</label>
                      <k-date-field v-model="newOrder.orderDate"></k-date-field>
                    </div>

                    <div class="form-field">
                      <label>Delivery Date</label>
                      <k-date-field v-model="newOrder.deliveryDate"></k-date-field>
                    </div>

                    <div class="form-field">
                      <label>Status</label>
                      <k-search-select v-model="newOrder.deliveryStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="Select status"></k-search-select>
                    </div>

                    <!-- Row 2 -->
                    <div class="form-field">
                      <label>Invoice No</label>
                      <md-input v-model="newOrder.invoiceNo" required class="form-input"></md-input>
                    </div>

                    <div class="form-field">
                      <label>Emirate</label>
                      <k-search-select v-model="newOrder.emirate" :options="emirateOptions" value-key="value" label-key="label" :clearable="false" placeholder="Select emirate" noun="emirates"></k-search-select>
                    </div>
                    
                    <div class="form-field">
                      <label>Customer Phone</label>
                      <md-input v-model="newOrder.customerPhone" required class="form-input"></md-input>
                    </div>

                    <!-- Row 3 -->
                    <div class="form-field">
                      <label>Delivery Agent</label>
                      <k-search-select v-model="newOrder.agentId" :options="agents" value-key="id" sub-key="code" placeholder="Select agent" noun="agents"></k-search-select>
                    </div>

                    <div class="form-field">
                      <label>Trader Name</label>
                      <k-search-select v-model="newOrder.traderId" :options="traders" value-key="id" sub-key="code" placeholder="Select trader" noun="traders"></k-search-select>
                    </div>

                    <div class="form-field">
                      <label>Trader Amount</label>
                      <md-input type="number" v-model="newOrder.traderAmount" required class="form-input"></md-input>
                    </div>

                    <!-- Row 4 -->
                    

                    <div class="form-field">
                      <label>Delivery Amount</label>
                      <md-input type="number" v-model="newOrder.deliveryAmount" required class="form-input"></md-input>
                    </div>

                    <div class="form-field">
                      <label>Agent Amount</label>
                      <md-input type="number" v-model="newOrder.agentAmount" required class="form-input"></md-input>
                    </div>

                    <div class="form-field">
                      <label>Address</label>
                      <md-input v-model="newOrder.address" class="form-input"></md-input>
                    </div>

                    <!-- Row 5 - Full Width -->
                    <div class="form-field full-width">
                      <label>Comment</label>
                      <md-input v-model="newOrder.comment" class="form-input"></md-input>
                    </div>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showAddDialog = false">Cancel</md-button>
                <md-button class="md-primary" @click="saveNewOrder">Save</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Upload Orders Dialog -->
            <md-dialog :md-active.sync="showUploadDialog" :md-fullscreen="false">
              <md-dialog-title>Upload Orders</md-dialog-title>

              <md-dialog-content>
                <form>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100">
                      <p>Please select an Excel file to upload orders.</p>
                      <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx, .xls" />
                      <p v-if="selectedFile" class="file-selected">Selected file: {{ selectedFile.name }}</p>
                    </div>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="cancelUpload">Cancel</md-button>
                <md-button class="md-primary" @click="uploadOrders" :disabled="!selectedFile">Upload</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Update Status and Amount Dialog -->
            <md-dialog :md-active.sync="showStatusAndAmountDialog" :md-fullscreen="false">
              <md-dialog-title>Update Order Status and Amount</md-dialog-title>

              <md-dialog-content>
                <form>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100">
                      <p class="order-info">Order #{{ statusAmountOrder.orderId }} - Invoice: {{ statusAmountOrder.invoiceNo }}</p>
                    </div>
                    
                    <div class="md-layout-item md-size-100">
                      <div class="status-select">
                        <label>Status</label>
                        <k-search-select v-model="statusAmountOrder.deliveryStatus" :options="statusOptions.filter(s => s.value)" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="Select status"></k-search-select>
                      </div>
                    </div>
                    
                    <div class="md-layout-item md-size-100">
                      <md-field>
                        <label>to trader Amount</label>
                        <md-input type="number" v-model="statusAmountOrder.traderAmount"></md-input>
                      </md-field>
                      <md-field>
                        <label>to Delivery Amount</label>
                        <md-input type="number" v-model="statusAmountOrder.deliveryAmount"></md-input>
                      </md-field>
                      <md-field>
                        <label>to Agent Amount</label>
                        <md-input type="number" v-model="statusAmountOrder.agentAmount"></md-input>
                      </md-field>
                    </div>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showStatusAndAmountDialog = false">Cancel</md-button>
                <md-button class="md-primary" @click="updateOrderStatusAndAmount">Update</md-button>
              </md-dialog-actions>
            </md-dialog>

             <!-- Update Status Dialog -->
            <md-dialog :md-active.sync="showUpdateDialog">
              <md-dialog-title>Update Order Status</md-dialog-title>

              <md-dialog-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-100">
                    <div class="status-select">
                      <label>Select New Status</label>
                      <k-search-select v-model="selectedStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="Select status"></k-search-select>
                    </div>
                    <p class="selected-orders-info">Selected Orders: {{ selectedOrders.length }}</p>
                  </div>
                </div>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showUpdateDialog = false">Cancel</md-button>
                <md-button class="md-primary" @click="updateSelectedOrdersStatus" :disabled="!selectedStatus">Update</md-button>
              </md-dialog-actions>
            </md-dialog>

          </md-card-content>
        </md-card>              
      </div>
    </div>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";
import { TraderService } from "@/services/TraderService";
import { DeliveryAgentService } from "@/services/DeliveryAgentService";

export default {
  data() {
    return {
      showUploadDialog: false,
      selectedFile: null,
      isUploading: false,
      showEditDialog: false,
      showAddDialog: false,
      showUpdateDialog: false,
      showStatusAndAmountDialog: false,
      selectedOrders: [],
      selectedStatus: '',
      editingOrder: {},
      traders: [],
      agents: [],
      statusAmountOrder: {
        orderId: '',
        invoiceNo: '',
        deliveryStatus: '',
        deliveryAmount: 0,
        agentAmount: 0,
        traderAmount: 0
      },
      newOrder: {
        invoiceNo: '',
        agentId: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        address: '',
        emirate: '',
        deliveryStatus: 'UNDER_DELIVERY',
        traderAmount: '',
        deliveryAmount: '25',
        agentAmount: '15',
        customerPhone: '',
        traderId: '',
        netCompanyAmount: '',
        comment: ''
      },
      tableHeaderColor: "orange",
      orders: [],
      filteredOrders: [],
      loading: false,
      // Pagination
      pagination: {
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        isEmpty: true,
        sortedBy: ''
      },
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50, 100],
      statusOptions: [
        { value: "", label: "All" },
        { value: "PENDING", label: "Pending" },
        { value: "UNDER_DELIVERY", label: "Under delivery" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "EXCHANGED", label: "Exchanged" },
        { value: "FAILED", label: "Failed" },
        { value: "CANCELED", label: "Canceled" }
      ],
      emirateOptions: [
        { value: "", label: "All" },
        { value: "Abu Dhabi", label: "Abu Dhabi" },
        { value: "Ajman", label: "Ajman" },
        { value: "Dubai", label: "Dubai" },
        { value: "Fujairah", label: "Fujairah" },
        { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
        { value: "Sharjah", label: "Sharjah" },
        { value: "Umm Al Quwain", label: "Umm Al Quwain" },
        { value: "Al Ain", label: "Al Ain" },
        { value: "Western Emirates", label: "Western Emirates" }
      ],
      filters: {
        invoiceNo: "",
        fromOrderDate: "",
        toOrderDate: "",
        customerPhoneNo: "",
        totalAmount: "",
        deliveryStatus: "",
        traderId: ""
      },
    };
  },
  methods: {
    openUploadDialog() {
      this.showUploadDialog = true;
      this.selectedFile = null;
    },
    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },
    
    cancelUpload() {
      this.showUploadDialog = false;
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },
    
    uploadOrders() {
      if (!this.selectedFile) {
        this.$notify({
          type: 'warning',
          message: 'Please select a file to upload'
        });
        return;
      }
      
      this.isUploading = true;
      
      OrderService.uploadOrders(this.selectedFile)
        .then(response => {
          this.$notify({
            type: 'success',
            message: 'Orders uploaded successfully!',
            icon: 'check',
            horizontalAlign: 'right',
            verticalAlign: 'top',
          });
          this.showUploadDialog = false;
          this.selectedFile = null;
          this.$refs.fileInput.value = '';
          
          // Reload the orders list to show the newly uploaded orders
          this.loadOrders();
        })
        .catch(error => {
          console.error('Error uploading orders:', error);
          let errorMessage = 'Failed to upload orders';
          
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          
          this.$notify({
          type: 'danger',
          message: errorMessage,
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',

          });
        })
        .finally(() => {
          this.isUploading = false;
        });
    },
    //upload file methods end header

    onSelect(items) {
      this.selectedOrders = items;
    },
    
    onSelectionChange(items) {
      this.selectedOrders = items;
    },
    
    isSelected(item) {
      return this.selectedOrders.includes(item);
    },
    
    openUpdateDialog() {
      this.selectedStatus = '';
      this.showUpdateDialog = true;
    },
    
    async updateSelectedOrdersStatus() {
      if (!this.selectedStatus) return;

      if (this.selectedOrders.length === 0) return;
      
      try {
        const orderList = this.selectedOrders.map(order => order.invoiceNo);
        await OrderService.updateOrderStatus({
          orderList,
          deliveryStatus: this.selectedStatus
        });
        
        // Close the dialog
        this.showUpdateDialog = false;
        
        // Refresh the orders list
        await this.loadOrders();
        
        // Clear selection
        this.selectedOrders = [];
        
        // Show success notification
        this.$toast.success('Orders status updated successfully');
      } catch (error) {
        console.error('Error updating orders status:', error);
        this.$toast.error('Failed to update orders status');
      }
    },
    async exportOrderReport() {
      try {
        this.$root.$emit('show-loading', 'Preparing export...');
        await OrderService.exportOrderReport(this.filters);
      } catch (error) {
        console.error('Export failed:', error);
        this.$notify({
          message: 'Failed to export report. Please try again.',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      } finally {
        this.$root.$emit('hide-loading');
      }
    },
    saveNewOrder() {
      // Validate required fields
      if (!this.newOrder.invoiceNo || !this.newOrder.agentId || !this.newOrder.orderDate || 
          !this.newOrder.emirate || 
          !this.newOrder.traderAmount || !this.newOrder.deliveryAmount || !this.newOrder.agentAmount || 
          !this.newOrder.customerPhone || !this.newOrder.traderId) {
        this.$notify({
          message: 'Please fill in all required fields',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
        return;
      }
      
      if (this.newOrder.deliveryStatus === 'UNDER_DELIVERY') {
        this.newOrder.deliveryStatus = 'Under Delivery';
      }
      
      const orderToAdd = {
        invoiceNo: this.newOrder.invoiceNo,
        agentId: this.newOrder.agentId,
        orderDate: this.formatDateTime(this.newOrder.orderDate),
        deliveryDate: this.formatDateTime(this.newOrder.deliveryDate),
        address: this.newOrder.address,
        emirate: this.newOrder.emirate,
        traderId: this.newOrder.traderId,
        traderAmount: this.newOrder.traderAmount,
        deliveryAmount: this.newOrder.deliveryAmount,
        agentAmount: this.newOrder.agentAmount,
        customerPhoneNo: this.newOrder.customerPhone,
        deliveryStatus: this.newOrder.deliveryStatus,
        comment: this.newOrder.comment
      };

      OrderService.addNewOrder(orderToAdd)
        .then(() => {
          this.showAddDialog = false;
          this.loadOrders();
          this.$notify({
            message: 'Order added successfully',
            icon: 'check',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'success'
          });
          // Reset the form
          this.resetNewOrder();
        })
        .catch(error => {
          console.error('Error adding order:', error);
          this.$notify({
            message: 'Error adding order',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
        });
    },

    resetNewOrder() {
      this.newOrder = {
        invoiceNo: '',
        agentId: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date().toISOString().split('T')[0],
        address: '',
        emirate: '',
        deliveryStatus: 'PENDING',
        traderAmount: '',
        deliveryAmount: '',
        agentAmount: '',
        customerPhone: '',
        traderId: '',
        netCompanyAmount: '',
        comment: ''
      };
    },
    openEditDialog(order) {
      this.editingOrder = {
        orderId: order.orderId,
        invoiceNo: order.invoiceNo,
        agentId: order.agentId,
        orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
        deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
        address: order.address,
        emirate: order.emirate,
        deliveryStatus: order.deliveryStatus || '',
        deliveryAmount: order.deliveryAmount,
        agentAmount: order.agentAmount,
        customerPhone: order.customerPhone,
        traderId: order.traderId,
        traderAmount: order.traderAmount,
        netCompanyAmount: order.netCompanyAmount,
        comment: order.comment
      };
      this.showEditDialog = true;
    },

    saveEditOrder() {
      if (this.editingOrder.deliveryStatus === 'UNDER_DELIVERY') {
        this.editingOrder.deliveryStatus = 'Under Delivery';
      }
      
      const orderToUpdate = {
        orderId: this.editingOrder.orderId,
        invoiceNo: this.editingOrder.invoiceNo,
        agentId: this.editingOrder.agentId,
        orderDate: this.editingOrder.orderDate,
        deliveryDate: this.editingOrder.deliveryDate,
        address: this.editingOrder.address,
        emirate: this.editingOrder.emirate,
        deliveryStatus: this.editingOrder.deliveryStatus,
        traderAmount: this.editingOrder.traderAmount,
        deliveryAmount: this.editingOrder.deliveryAmount,
        agentAmount: this.editingOrder.agentAmount,
        customerPhone: this.editingOrder.customerPhone,
        traderId: this.editingOrder.traderId,
        netCompanyAmount: this.editingOrder.netCompanyAmount,
        comment: this.editingOrder.comment
      };

      OrderService.updateOrder(orderToUpdate)
        .then(() => {
          this.showEditDialog = false;
          this.loadOrders();
          this.$notify({
            message: `Order #${orderToUpdate.orderId}${orderToUpdate.invoiceNo ? " (invoice " + orderToUpdate.invoiceNo + ")" : ""} updated successfully`,
            icon: 'check_circle',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'success'
          });
        })
        .catch(error => {
          console.error('Error updating order:', error);
          this.$notify({
            message: 'Error updating order',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
        });
    },

     async deleteOrder(order) {
      if (await this.$kConfirm({ title: "Delete order?", message: `Order #${order.orderId}${order.invoiceNo ? " (invoice " + order.invoiceNo + ")" : ""} will be permanently deleted.`, confirmText: "Delete", danger: true })) {
        try {
          await OrderService.deleteOrder(order.orderId);
          await this.loadOrders(); // Refresh the list
          this.$toast.success(`Order #${order.orderId}${order.invoiceNo ? " (invoice " + order.invoiceNo + ")" : ""} deleted successfully`);
        } catch (error) {
               console.error('Error deleting order:', error);
              this.$toast.error('Failed to delete order');
        }
      }
    },

    formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return dateString.split(' ')[0];
    },
    async loadOrders() {
      // Load orders with current pagination and filters
      const filters = {
        ...this.filters,
        page: this.pagination.pageNumber,
        size: this.pageSize
      };
      
      this.loadOrdersWithFilters(filters);
    },
    
    goToPage(pageNumber) {
      if (pageNumber < 0 || pageNumber >= this.pagination.totalPages) return;
      this.pagination.pageNumber = pageNumber;
      
      // Include current filters when changing pages
      const filters = {
        ...this.filters,
        page: pageNumber,
        size: this.pageSize
      };
      
      this.loadOrdersWithFilters(filters);
    },
    
    changePageSize() {
      this.pagination.pageNumber = 0; // Reset to first page when changing page size
      
      // Include current filters when changing page size
      const filters = {
        ...this.filters,
        page: 0,
        size: this.pageSize
      };
      
      this.loadOrdersWithFilters(filters);
    },
    
    // Helper method to load orders with filters
    loadOrdersWithFilters(filters) {
      this.loading = true;
      OrderService.getAllOrders(filters)
        .then(response => {
          this.orders = response.orders || [];
          this.filteredOrders = response.orders || [];
          this.pagination = response.pagination || this.pagination;
        })
        .catch(error => {
          console.error('Error loading orders:', error);
          this.$notify({
            message: 'Failed to load orders',
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
    
    async applyFilters() {
      try {
        this.loading = true;
        // Reset pagination when applying new filters
        this.pagination.pageNumber = 0;
        
        const filters = {
          ...this.filters,
          page: this.pagination.pageNumber,
          size: this.pageSize
        };
        
        const response = await OrderService.getAllOrders(filters);
        this.orders = response.orders || [];
        this.filteredOrders = response.orders || [];
        this.pagination = response.pagination || this.pagination;
        
        if (this.filteredOrders.length === 0) {
          this.$notify({
            message: 'No orders found matching the selected filters',
            icon: 'info',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'info'
          });
        }
      } catch (error) {
        console.error('Error fetching filtered orders:', error);
        this.$notify({
          message: 'Failed to apply filters',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    
    resetFilters() {
      // Reset all filters
      this.filters = {
        invoiceNo: "",
        fromOrderDate: "",
        toOrderDate: "",
        customerPhoneNo: "",
        totalAmount: "",
        deliveryStatus: "",
        traderId: ""
      };
      
      // Reset pagination and reload orders
      this.pagination.pageNumber = 0;
      this.loadOrders();
    },
    statusClass(status) {
      if (!status) return '';
      
      // Normalize the status to uppercase for comparison
      const normalizedStatus = status.toUpperCase();
    
      // Map of status to color class
      const statusColorMap = {
        'DELIVERED': 'text-green',
        'PENDING': 'text-orange',
        'CANCELED': 'text-red',
        'UNDER DELIVERY': 'text-blue',
        'EXCHANGED': 'text-yellow',
        'FAILED': 'text-red'
      };

      return statusColorMap[normalizedStatus] || '';
    },
    
    openStatusAndAmountDialog() {
      // Only use the first selected order for status and amount update
      const selectedOrder = this.selectedOrders[0];
      
      // Set the order details for the status and amount update dialog
      this.statusAmountOrder = {
        orderId: selectedOrder.orderId,
        invoiceNo: selectedOrder.invoiceNo,
        deliveryStatus: selectedOrder.deliveryStatus || '',
        deliveryAmount: selectedOrder.deliveryAmount || 0,
        agentAmount: selectedOrder.agentAmount || 0,
        traderAmount: selectedOrder.traderAmount || 0
      };
      
      // Show the dialog
      this.showStatusAndAmountDialog = true;
    },
    
    async updateOrderStatusAndAmount() {
      try {
        // Validate inputs
        if (!this.statusAmountOrder.deliveryStatus) {
          this.$notify({
            message: 'Please select a status',
            icon: 'error',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger'
          });
          return;
        }
        
        // Create the order object to update
        const order = {
          invoiceNo: this.statusAmountOrder.invoiceNo,
          deliveryStatus: this.statusAmountOrder.deliveryStatus,
          deliveryAmount: this.statusAmountOrder.deliveryAmount,
          agentAmount: this.statusAmountOrder.agentAmount,
          traderAmount: this.statusAmountOrder.traderAmount
        };
        
        // Call the service method
        const result = await OrderService.updateOrderStatusAndDeliveryAmount({ order });
        
        // Close the dialog
        this.showStatusAndAmountDialog = false;
        
        // Refresh the orders list
        await this.loadOrders();
        
        // Show success notification
        this.$notify({
          message: 'Order status and delivery amount updated successfully',
          icon: 'check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        });
      } catch (error) {
        console.error('Error updating order status and amount:', error);
        this.$notify({
          message: 'Failed to update order status and amount',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      }
    },
    async fetchTraders() {
      try {
        const response = await TraderService.getAllTraders({ size: 2000 }); // all traders for the dropdowns (backend default is 10)
        this.traders = response.traders;
      } catch (error) {
        console.error('Error fetching traders:', error);
      }
    },
    
    async fetchAgents() {
      try {
        const response = await DeliveryAgentService.getAllAgents({ size: 2000 }); // all agents for the dropdowns (backend default is 10)
        this.agents = response.data || [];
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    }
  },
  computed: {
    displayedPages() {
      const totalPages = this.pagination.totalPages;
      const currentPage = this.pagination.pageNumber;
      const maxDisplayedPages = 5;
      
      if (totalPages <= maxDisplayedPages) {
        // If we have fewer pages than the max to display, show all pages
        return Array.from({ length: totalPages }, (_, i) => i);
      }
      
      // Calculate the range of pages to display
      let startPage = Math.max(0, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = startPage + maxDisplayedPages - 1;
      
      // Adjust if we're near the end
      if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - maxDisplayedPages + 1);
      }
      
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  },
  
  created() {
    // Fetch the list of traders, agents, and initial orders on component creation
    this.fetchTraders();
    this.fetchAgents();
    this.loadOrders();
  }
};
</script>

<style scoped>
/* Optimize will-change usage */

.md-dialog-container,
.md-dialog-backdrop {
  will-change: auto;
}

.md-table {
  will-change: auto;
}

.header-content {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
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

.md-field.md-theme-default.md-focused .md-input {
  border-color: #ff9800;
}

.md-field.md-theme-default.md-focused label {
  color: #ff9800;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.pagination-info {
  font-size: 14px;
  color: #666;
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

/* Add Order Dialog Grid Styles */

.add-order-content {
  padding: 20px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  height: 42px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.form-input:focus {
  border-color: #ff9800;
  outline: none;
  box-shadow: 0 0 0 1px #ff9800;
}

.form-select {
  width: 100%;
  height: 42px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.form-select:focus {
  border-color: #ff9800;
  outline: none;
  box-shadow: 0 0 0 1px #ff9800;
}

/* Remove all Vue Material field styling */
.add-order-content .md-field {
  margin: 0;
  padding: 0;
  min-height: auto;
}

.add-order-content .md-field:before,
.add-order-content .md-field:after {
  display: none;
}

.add-order-content .md-input {
  border: 1px solid #ddd !important;
  border-radius: 4px;
  height: 42px;
  min-height: 42px;
  padding: 10px 12px;
}

.add-order-content .md-input:focus {
  border-color: #ff9800 !important;
  box-shadow: 0 0 0 1px #ff9800 !important;
}

/* Remove animations */
.add-order-dialog * {
  transition: none !important;
  animation: none !important;
}

/* Responsive */
@media (max-width: 960px) {
  .add-order-dialog {
    width: 95vw;
    max-width: 95vw;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.md-dialog {
  pointer-events: auto; /* Enable interaction */
}

.add-order-dialog {
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  border-radius: 8px;
}
/* Action buttons styling */
.action-cell {
  padding: 0 !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-btn {
  margin: 0 !important;
  padding: 0 !important;
  min-width: 30px !important;
  width: 30px !important;
  height: 30px !important;
}

.action-btn .md-icon {
  font-size: 18px !important;
  min-height: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  width: 18px !important;
}
</style>
