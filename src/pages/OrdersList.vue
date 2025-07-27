<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="filters-section">
              <div class="md-layout">
                <!-- Basic Info Filters -->
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Invoice No</label>
                    <md-input v-model="filters.invoiceNo"></md-input>
                  </md-field>
                </div>
    
                <div class="md-layout-item md-size-20">
                  <div class="status-select">
                    <label>Status</label>
                    <select v-model="filters.deliveryStatus" class="md-select-value">
                      <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
                    </select>
                  </div>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Delivery Agent</label>
                    <md-input v-model="filters.deliveryAgent"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Customer Phone</label>
                    <md-input v-model="filters.customerPhoneNo"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Address</label>
                    <md-input v-model="filters.address"></md-input>
                  </md-field>
                </div>

                <!-- Trader Info Filters -->
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Trader Name</label>
                    <md-input v-model="filters.traderName"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Trader Phone</label>
                    <md-input v-model="filters.traderPhoneNumber"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>Email</label>
                    <md-input v-model="filters.email"></md-input>
                  </md-field>
                </div>

                <!-- Date Range Filters -->
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Order Date</label>
                    <md-input type="date" v-model="filters.fromOrderDate"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Order Date</label>
                    <md-input type="date" v-model="filters.toOrderDate"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Delivery Date</label>
                    <md-input type="date" v-model="filters.fromDeliveryDate"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Delivery Date</label>
                    <md-input type="date" v-model="filters.toDeliveryDate"></md-input>
                  </md-field>
                </div>

                <!-- Amount Range Filters -->
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Total Amount</label>
                    <md-input type="number" v-model="filters.fromTotalAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Total Amount</label>
                    <md-input type="number" v-model="filters.toTotalAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Trader Amount</label>
                    <md-input type="number" v-model="filters.fromTraderAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Trader Amount</label>
                    <md-input type="number" v-model="filters.toTraderAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Delivery Amount</label>
                    <md-input type="number" v-model="filters.fromDeliveryAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Delivery Amount</label>
                    <md-input type="number" v-model="filters.toDeliveryAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Agent Amount</label>
                    <md-input type="number" v-model="filters.fromAgentAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Agent Amount</label>
                    <md-input type="number" v-model="filters.toAgentAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>From Net Company Amount</label>
                    <md-input type="number" v-model="filters.fromNetCompanyAmount"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-field>
                    <label>To Net Company Amount</label>
                    <md-input type="number" v-model="filters.toNetCompanyAmount"></md-input>
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
              <h4 class="title">All Orders</h4>
              <p class="category">Complete list of all delivery orders</p>
          </md-card-header>
          <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-size-50 text-left">
                  <md-button class="md-raised md-primary" @click="openUpdateDialog" :disabled="selectedOrders.length === 0">Update Status</md-button>
                  <md-button class="md-raised md-primary" @click="openStatusAndAmountDialog" :disabled="selectedOrders.length === 0">Update Status and amount</md-button>
                </div>
                <div class="md-layout-item md-size-50 text-right">
                  <md-button class="md-raised md-success" @click="exportOrderReport" style="margin-right: 10px;">
                    <md-icon>file_download</md-icon> Export Report
                  </md-button>
                  <md-button class="md-raised md-info" @click="openUploadDialog" style="margin-right: 10px;">
                    <md-icon>file_upload</md-icon> Upload Orders
                  </md-button>
                  <md-button class="md-raised md-primary" @click="showAddDialog = true">
                    <md-icon>add</md-icon> Add Order
                  </md-button>
                </div>
              </div>
           
            
            <md-table v-model="filteredOrders" :table-header-color="tableHeaderColor" @md-selected="onSelect" @md-selection-change="onSelectionChange" :md-selected-value="selectedOrders">
              <md-table-row
                slot="md-table-row"
                slot-scope="{ item }"
                md-selectable="multiple"
                :md-selected="isSelected(item)"
              >
                <md-table-cell class="cell-small" md-label="Order ID">#{{ item.orderId }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Invoice">{{ item.invoiceNo }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Agent">{{ item.deliveryAgent }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Order Date">{{ formatDate(item.orderDate) }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Delivery Date">{{ formatDate(item.deliveryDate) }}</md-table-cell>
                <md-table-cell class="cell-normal" md-label="Address">{{ item.address }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Emirate">{{ item.emirate }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="deliveryStatus">
                  <span :class="[statusClass(item.deliveryStatus)]">{{ item.deliveryStatus }}</span>
                </md-table-cell>
                <md-table-cell class="cell-small" md-label="Total">{{ item.totalAmount }} AED</md-table-cell>
                <md-table-cell class="cell-small" md-label="Trader Amount">{{ item.traderAmount }} AED</md-table-cell>
                <md-table-cell class="cell-small" md-label="Delivery Fee">{{ item.deliveryAmount }} AED</md-table-cell>
                <md-table-cell class="cell-small" md-label="Agent Fee">{{ item.agentAmount }} AED</md-table-cell>
                <md-table-cell class="cell-small" md-label="Net Company">{{ item.netCompanyAmount }} AED</md-table-cell>
                <md-table-cell class="cell-small" md-label="Customer Phone">{{ item.customerPhone }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Trader ID">#{{ item.traderId }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Comment">{{ item.comment }}</md-table-cell>
                <md-table-cell class="cell-small" md-label="Actions">
                  <md-button class="md-just-icon md-simple md-warning" @click="openEditDialog(item)">
                    <md-icon>edit</md-icon>
                  </md-button>
                  <md-button class="md-just-icon md-simple md-danger" @click="deleteOrder(item)">
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>

            <!-- Edit Order Dialog -->
            <md-dialog :md-active.sync="showEditDialog" :md-fullscreen="false">
              <md-dialog-title>Edit Order</md-dialog-title>

              <md-dialog-content>
                <form>
                  <md-field>
                    <label>Invoice No</label>
                    <md-input v-model="editingOrder.invoiceNo"></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Agent</label>
                    <md-input v-model="editingOrder.deliveryAgent"></md-input>
                  </md-field>

                  <md-field>
                    <label>Order Date</label>
                    <md-input type="date" v-model="editingOrder.orderDate"></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Date</label>
                    <md-input type="date" v-model="editingOrder.deliveryDate"></md-input>
                  </md-field>

                  <md-field>
                    <label>Address</label>
                    <md-input v-model="editingOrder.address"></md-input>
                  </md-field>

                  <md-field>
                    <label>Emirate</label>
                    <md-input v-model="editingOrder.emirate"></md-input>
                  </md-field>

                  <md-field>
                    <label>Total Amount</label>
                    <md-input type="number" v-model="editingOrder.totalAmount"></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Amount</label>
                    <md-input type="number" v-model="editingOrder.deliveryAmount"></md-input>
                  </md-field>

                  <md-field>
                    <label>Agent Amount</label>
                    <md-input type="number" v-model="editingOrder.agentAmount"></md-input>
                  </md-field>

                  <md-field>
                    <label>Customer Phone</label>
                    <md-input v-model="editingOrder.customerPhone"></md-input>
                  </md-field>

                  <div class="status-select">
                    <label>Status</label>
                    <select v-model="editingOrder.deliveryStatus" class="md-select-value">
                      <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
                    </select>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showEditDialog = false">Cancel</md-button>
                <md-button class="md-primary" @click="saveEditOrder">Save</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Add Order Dialog -->
            <md-dialog :md-active.sync="showAddDialog" :md-fullscreen="false">
              <md-dialog-title>Add New Order</md-dialog-title>

              <md-dialog-content>
                <form>
                  <md-field>
                    <label>Invoice No</label>
                    <md-input v-model="newOrder.invoiceNo" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Agent</label>
                    <md-input v-model="newOrder.deliveryAgent" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Order Date</label>
                    <md-input type="date" v-model="newOrder.orderDate" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Date</label>
                    <md-input type="date" v-model="newOrder.deliveryDate" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Address</label>
                    <md-input v-model="newOrder.address" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Emirate</label>
                    <md-input v-model="newOrder.emirate" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Total Amount</label>
                    <md-input type="number" v-model="newOrder.totalAmount" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Delivery Amount</label>
                    <md-input type="number" v-model="newOrder.deliveryAmount" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Agent Amount</label>
                    <md-input type="number" v-model="newOrder.agentAmount" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Customer Phone</label>
                    <md-input v-model="newOrder.customerPhone" required></md-input>
                  </md-field>

                  <div class="status-select">
                    <label>Status</label>
                    <select v-model="newOrder.deliveryStatus" class="md-select-value">
                      <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
                    </select>
                  </div>

                  <md-field>
                    <label>Trader ID</label>
                    <md-input v-model="newOrder.traderId" required></md-input>
                  </md-field>

                  <md-field>
                    <label>Comment</label>
                    <md-input v-model="newOrder.comment"></md-input>
                  </md-field>
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
                        <select v-model="statusAmountOrder.deliveryStatus" class="md-select-value">
                          <option v-for="status in statusOptions.filter(s => s.value)" :key="status.value" :value="status.value">{{ status.label }}</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="md-layout-item md-size-100">
                      <md-field>
                        <label>Delivery Amount</label>
                        <md-input type="number" v-model="statusAmountOrder.deliveryAmount"></md-input>
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
                      <select v-model="selectedStatus" class="md-select-value">
                        <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
                      </select>
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
      statusAmountOrder: {
        orderId: '',
        invoiceNo: '',
        deliveryStatus: '',
        deliveryAmount: 0
      },
      newOrder: {
        invoiceNo: '',
        deliveryAgent: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date().toISOString().split('T')[0],
        address: '',
        emirate: '',
        deliveryStatus: 'PENDING',
        totalAmount: '',
        deliveryAmount: '',
        agentAmount: '',
        customerPhone: '',
        traderId: '',
        traderAmount: '',
        netCompanyAmount: '',
        comment: ''
      },
      tableHeaderColor: "orange",
      orders: [],
      filteredOrders: [],
      loading: false,
      statusOptions: [
        { value: "", label: "All" },
        { value: "PENDING", label: "Pending" },
        { value: "UNDER_DELIVERY", label: "Under delivery" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "EXCHANGED", label: "Exchanged" },
        { value: "FAILED", label: "Failed" },
        { value: "CANCELED", label: "Canceled" }
      ],
      filters: {
        deliveryStatus: "",
        deliveryAgent: "",
        invoiceNo: "",
        customerPhoneNo: "",
        address: "",
        traderName: "",
        traderPhoneNumber: "",
        email: "",
        fromOrderDate: "",
        toOrderDate: "",
        fromDeliveryDate: "",
        toDeliveryDate: "",
        fromTotalAmount: "",
        toTotalAmount: "",
        fromTraderAmount: "",
        toTraderAmount: "",
        fromDeliveryAmount: "",
        toDeliveryAmount: "",
        fromAgentAmount: "",
        toAgentAmount: "",
        fromNetCompanyAmount: "",
        toNetCompanyAmount: ""
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
      if (!this.newOrder.invoiceNo || !this.newOrder.deliveryAgent || !this.newOrder.orderDate || 
          !this.newOrder.deliveryDate || !this.newOrder.address || !this.newOrder.emirate || 
          !this.newOrder.totalAmount || !this.newOrder.deliveryAmount || !this.newOrder.agentAmount || 
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

      // Convert dates to ISO format
      const orderToAdd = {
        invoiceNo: this.newOrder.invoiceNo,
        deliveryAgent: this.newOrder.deliveryAgent,
        orderDate: this.formatDateTime(this.newOrder.orderDate),
        deliveryDate: this.formatDateTime(this.newOrder.deliveryDate),
        address: this.newOrder.address,
        emirate: this.newOrder.emirate,
        traderId: this.newOrder.traderId,
        totalAmount: this.newOrder.totalAmount,
        deliveryAmount: this.newOrder.deliveryAmount,
        agentAmount: this.newOrder.agentAmount,
        customerPhoneNo: this.newOrder.customerPhone,
        deliveryStatus: this.newOrder.deliveryStatus || 'PENDING'
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
        deliveryAgent: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date().toISOString().split('T')[0],
        address: '',
        emirate: '',
        deliveryStatus: 'PENDING',
        totalAmount: '',
        deliveryAmount: '',
        agentAmount: '',
        customerPhone: '',
        traderId: '',
        traderAmount: '',
        netCompanyAmount: '',
        comment: ''
      };
    },
    openEditDialog(order) {
      // Create a new plain object for editing
      this.editingOrder = {
        orderId: order.orderId,
        invoiceNo: order.invoiceNo,
        deliveryAgent: order.deliveryAgent,
        orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
        deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
        address: order.address,
        emirate: order.emirate,
        deliveryStatus: order.deliveryStatus || '',
        totalAmount: order.totalAmount,
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
      // Create a new object for the update to avoid reactivity issues
      const orderToUpdate = {
        orderId: this.editingOrder.orderId,
        invoiceNo: this.editingOrder.invoiceNo,
        deliveryAgent: this.editingOrder.deliveryAgent,
        orderDate: this.editingOrder.orderDate,
        deliveryDate: this.editingOrder.deliveryDate,
        address: this.editingOrder.address,
        emirate: this.editingOrder.emirate,
        deliveryStatus: this.editingOrder.deliveryStatus,
        totalAmount: this.editingOrder.totalAmount,
        deliveryAmount: this.editingOrder.deliveryAmount,
        agentAmount: this.editingOrder.agentAmount,
        customerPhone: this.editingOrder.customerPhone,
        traderId: this.editingOrder.traderId,
        traderAmount: this.editingOrder.traderAmount,
        netCompanyAmount: this.editingOrder.netCompanyAmount,
        comment: this.editingOrder.comment
      };

      console.log('Saving order:', orderToUpdate);
      OrderService.updateOrder(orderToUpdate)
        .then(() => {
          this.showEditDialog = false;
          this.loadOrders();
          this.$notify({
            message: 'Order updated successfully',
            icon: 'check',
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
      if (confirm("Are you sure you want to delete this order?")) {
        try {
          await OrderService.deleteOrder(order.orderId);
          await this.loadOrders(); // Refresh the list
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
      try {
        this.loading = true;
        const response = await OrderService.getAllOrders();
        this.orders = response.orders || [];
        this.filteredOrders = response.orders || [];
      } catch (error) {
        console.error('Error loading orders:', error);
        this.$notify({
          message: 'Failed to load orders',
          icon: 'error',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    async applyFilters() {
      try {
        this.loading = true;
        const response = await OrderService.getAllOrders(this.filters);
        this.orders = response.orders || [];
        this.filteredOrders = response.orders || [];
        
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
        deliveryStatus: "",
        deliveryAgent: "",
        invoiceNo: "",
        customerPhoneNo: "",
        address: "",
        traderName: "",
        traderPhoneNumber: "",
        email: "",
        fromOrderDate: "",
        toOrderDate: "",
        fromDeliveryDate: "",
        toDeliveryDate: "",
        fromTotalAmount: "",
        toTotalAmount: "",
        fromTraderAmount: "",
        toTraderAmount: "",
        fromDeliveryAmount: "",
        toDeliveryAmount: "",
        fromAgentAmount: "",
        toAgentAmount: "",
        fromNetCompanyAmount: "",
        toNetCompanyAmount: ""
      };
      
      // Clear the current orders
      this.orders = [];
      this.filteredOrders = [];
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
        'UNDER_DELIVERY': 'text-blue',
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
        deliveryAmount: selectedOrder.deliveryAmount || 0
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
          deliveryAmount: this.statusAmountOrder.deliveryAmount
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
    }
  }
};
</script>

<style scoped>
/* Optimize will-change usage */
.md-dialog,
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

</style>
