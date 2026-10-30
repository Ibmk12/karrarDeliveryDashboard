<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <!-- page header: count + actions -->
        <div class="k-page-head">
          <div class="k-page-count">
            <b>{{ $tt('{n} orders', { n: formatCount(pagination.totalElements) }) }}</b>
            <span>{{ hasActiveFilters ? $tt('match your filters') : $tt('in total') }}</span>
          </div>
          <div class="k-page-actions">
            <div class="k-view-menu" v-click-outside="closeIoMenu">
              <md-button class="md-raised" :aria-expanded="showIoMenu ? 'true' : 'false'" :disabled="exporting" @click="showIoMenu = !showIoMenu">
                <md-progress-spinner v-if="exporting" class="k-btn-spinner" :md-diameter="16" :md-stroke="2" md-mode="indeterminate"></md-progress-spinner>
                <md-icon v-else>more_horiz</md-icon>
                <span class="k-hide-xs">{{ exporting ? $tt('Exporting…') : $tt('Import / Export') }}</span>
              </md-button>
              <transition name="k-pop">
                <div v-if="showIoMenu" class="k-view-panel k-io-panel" role="menu">
                  <button type="button" class="k-menu-item" role="menuitem" @click="showIoMenu = false; exportOrderReport()">
                    <md-icon>file_download</md-icon>
                    <span><b>{{ $tt('Export to Excel') }}</b><small>{{ $tt('Orders matching the current filters') }}</small></span>
                  </button>
                  <button type="button" class="k-menu-item" role="menuitem" @click="showIoMenu = false; openUploadDialog()">
                    <md-icon>file_upload</md-icon>
                    <span><b>{{ $tt('Upload Orders') }}</b><small>{{ $tt('Import orders from an Excel file') }}</small></span>
                  </button>
                </div>
              </transition>
            </div>
            <!-- table view options -->
            <div class="k-view-menu k-hide-sm" v-click-outside="closeColMenu">
              <md-button class="md-raised" :aria-expanded="showColMenu ? 'true' : 'false'" @click="showColMenu = !showColMenu">
                <md-icon>view_column</md-icon> {{ $tt('Columns') }}
              </md-button>
              <transition name="k-pop">
                <div v-if="showColMenu" class="k-view-panel" role="menu">
                  <div class="k-view-title">{{ $tt('Show columns') }}</div>
                  <label v-for="c in orderColumns" :key="c.key" class="k-view-option">
                    <input type="checkbox" :checked="col(c.key)" @change="toggleCol(c.key)" />
                    <span>{{ $tt(c.label) }}</span>
                  </label>
                  <div class="k-view-title">{{ $tt('Row spacing') }}</div>
                  <div class="k-density">
                    <button type="button" :class="{ active: density === 'comfortable' }" @click="setDensity('comfortable')">{{ $tt('Comfortable') }}</button>
                    <button type="button" :class="{ active: density === 'compact' }" @click="setDensity('compact')">{{ $tt('Compact') }}</button>
                  </div>
                  <button type="button" class="k-view-reset" @click="resetView">{{ $tt('Reset view') }}</button>
                </div>
              </transition>
            </div>
            <md-button class="md-raised md-primary k-add-order" @click="showAddDialog = true">
              <md-icon>add</md-icon> {{ $tt('Add Order') }}
            </md-button>
          </div>
        </div>

        <!-- quick views -->
        <div class="k-views-wrap">
          <div class="k-views" role="tablist" :aria-label="$tt('Views')">
            <button
              v-for="v in views"
              :key="v.key"
              type="button"
              role="tab"
              :aria-selected="activeView === v.key ? 'true' : 'false'"
              :class="{ on: activeView === v.key, warn: v.key === 'delayed' }"
              @click="setView(v.key)"
            >
              <md-icon>{{ v.icon }}</md-icon>{{ $tt(v.label) }}
              <span v-if="activeView === v.key && !loading" class="n">{{ formatCount(pagination.totalElements) }}</span>
            </button>

            <!-- the user's own saved views (kept in this browser) -->
            <span
              v-for="sv in savedViews"
              :key="sv.id"
              class="k-saved-tab"
              :class="{ on: activeView === 'saved:' + sv.id }"
            >
              <button
                type="button"
                role="tab"
                :aria-selected="activeView === 'saved:' + sv.id ? 'true' : 'false'"
                :title="savedViewSummary(sv)"
                @click="applySavedView(sv)"
              >
                <md-icon>bookmark</md-icon>{{ sv.name }}
                <span v-if="activeView === 'saved:' + sv.id && !loading" class="n">{{ formatCount(pagination.totalElements) }}</span>
              </button>
              <button type="button" class="k-saved-x" :aria-label="$tt('Delete view {name}', { name: sv.name })" :title="$tt('Delete view')" @click="deleteSavedView(sv)">
                <md-icon>close</md-icon>
              </button>
            </span>

            <button
              v-if="canSaveView"
              type="button"
              class="k-save-view"
              :aria-expanded="saveViewOpen ? 'true' : 'false'"
              @click="openSaveView"
            >
              <md-icon>bookmark_add</md-icon>{{ $tt('Save view') }}
            </button>
          </div>

          <transition name="k-pop">
            <form v-if="saveViewOpen" class="k-save-pop" data-k-modal role="dialog" :aria-label="$tt('Save view')" @submit.prevent="saveCurrentView" @keydown.esc="saveViewOpen = false">
              <label for="k-save-view-name">{{ $tt('Name this view') }}</label>
              <input id="k-save-view-name" ref="saveViewInput" v-model="saveViewName" type="text" maxlength="30" autofocus :placeholder="$tt('e.g. Noor Store – under delivery')" />
              <p class="k-save-hint">{{ $tt('Saves the current filters as a tab in this browser.') }}</p>
              <div class="k-save-chips">
                <span v-for="c in activeChips" :key="c.key">{{ c.text }}</span>
              </div>
              <div class="k-save-actions">
                <button type="button" class="k-btn k-btn-ghost" @click="saveViewOpen = false">{{ $tt('Cancel') }}</button>
                <button type="submit" class="k-btn k-btn-primary" :disabled="!saveViewName.trim()">{{ $tt('Save') }}</button>
              </div>
            </form>
          </transition>
        </div>

        <md-card class="k-orders-card">
          <!-- filters: one row + chips -->
          <div class="k-fbar" v-enter-submit="applyFilters">
            <div class="k-search-box k-fsearch">
              <md-icon>search</md-icon>
              <input
                v-model="searchText"
                type="search"
                :placeholder="$tt('Search by invoice number…')"
                :aria-label="$tt('Search by invoice number…')"
              />
            </div>
            <div class="k-fsel k-hide-sm">
              <k-search-select v-model="filters.deliveryStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('All statuses')"></k-search-select>
            </div>
            <div class="k-fsel k-hide-sm">
              <k-search-select v-model="filters.traderName" :options="traders" value-key="name" sub-key="code" :placeholder="$tt('All traders')" :noun="$tt('traders')"></k-search-select>
            </div>
            <md-button class="md-raised k-more-btn" :class="{ 'is-on': showMoreFilters }" :aria-expanded="showMoreFilters ? 'true' : 'false'" @click="showMoreFilters = !showMoreFilters">
              <md-icon>tune</md-icon>
              <span class="k-hide-xs">{{ $tt('More filters') }}</span>
              <span v-if="moreFilterCount" class="k-badge-n">{{ moreFilterCount }}</span>
            </md-button>
            <md-button class="md-raised md-primary k-apply-btn" @click="applyFilters">
              <md-icon>search</md-icon><span class="k-hide-xs">{{ $tt('Search') }}</span>
            </md-button>
          </div>

          <transition name="k-pop">
            <div v-if="showMoreFilters" class="k-fmore" v-enter-submit="applyFilters">
              <div class="k-fmore-item k-show-sm">
                <label>{{ $tt('Status') }}</label>
                <k-search-select v-model="filters.deliveryStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('All statuses')"></k-search-select>
              </div>
              <div class="k-fmore-item k-show-sm">
                <label>{{ $tt('Trader Name') }}</label>
                <k-search-select v-model="filters.traderName" :options="traders" value-key="name" sub-key="code" :placeholder="$tt('All traders')" :noun="$tt('traders')"></k-search-select>
              </div>
              <div class="k-fmore-item">
                <label for="k-f-phone">{{ $tt('Customer Phone') }}</label>
                <div class="k-search-box">
                  <md-icon>phone</md-icon>
                  <input id="k-f-phone" v-model="filters.customerPhoneNo" type="tel" inputmode="tel" :placeholder="$tt('Part of the number, e.g. 501234')" />
                </div>
              </div>
              <div class="k-fmore-item">
                <k-date-field v-model="filters.fromOrderDate" :label="$tt('From Order Date')" :placeholder="$tt('Any date')"></k-date-field>
              </div>
              <div class="k-fmore-item">
                <k-date-field v-model="filters.toOrderDate" :label="$tt('To Order Date')" :placeholder="$tt('Any date')"></k-date-field>
              </div>
              <div class="k-fmore-item">
                <label>{{ $tt('Total Amount') }} ({{ $tt('AED') }})</label>
                <div class="k-search-box"><input v-model="filters.totalAmount" type="number" min="0" :placeholder="$tt('Exact amount')" /></div>
              </div>
            </div>
          </transition>

          <div v-if="activeChips.length" class="k-chips">
            <span class="k-chips-label">{{ $tt('Active:') }}</span>
            <button v-for="c in activeChips" :key="c.key" type="button" class="k-chip" :aria-label="$tt('Remove filter {f}', { f: c.text })" @click="removeChip(c.key)">
              {{ c.text }} <md-icon>close</md-icon>
            </button>
            <button type="button" class="k-chips-clear" @click="resetFilters">{{ $tt('Clear all') }}</button>
          </div>

          <md-card-content>
            <!-- phones: orders as cards -->
            <div class="k-order-cards">
              <article
                v-for="item in filteredOrders"
                :key="'card-' + item.orderId"
                class="k-order-card"
                :class="{ 'is-selected': isSelected(item) }"
              >
                <header>
                  <label class="k-card-check" @click.stop>
                    <input type="checkbox" :checked="isSelected(item)" @change="toggleCardSelection(item)" />
                  </label>
                  <div class="k-order-card-id">
                    <strong>#{{ item.orderId }}</strong>
                    <span>{{ item.invoiceNo }}</span>
                  </div>
                  <button
                    type="button"
                    :class="['status-badge', 'k-st-btn', statusClass(item.deliveryStatus)]"
                    :aria-label="$tt('Change status of order #{id}', { id: item.orderId })"
                    @click.stop="openStatusMenu(item, $event)"
                  >{{ $tt($statusLabel(item.deliveryStatus)) }}<md-icon>expand_more</md-icon></button>
                </header>
                <div class="k-order-card-body" @click="$refs.details.open(item)">
                  <div><md-icon>storefront</md-icon>{{ item.traderName || '—' }}</div>
                  <div><md-icon>phone</md-icon>{{ item.customerPhoneNo || '—' }}</div>
                  <div><md-icon>place</md-icon>{{ $tt(item.emirate) || '—' }}</div>
                  <div><md-icon>event</md-icon>{{ item.orderDate | kDay }}</div>
                </div>
                <footer>
                  <span class="k-money">
                    <strong>{{ item.totalAmount | money }}</strong> <small>{{ $tt('AED') }}</small>
                    <span v-if="isLate(item)" class="k-late">{{ $tt('{n}d late', { n: $daysUnderDelivery(item) }) }}</span>
                  </span>
                  <div class="k-order-card-actions">
                    <template v-if="item.customerPhoneNo">
                      <a class="is-call" :href="telLink(item.customerPhoneNo)" :aria-label="$tt('Call customer')"><md-icon>call</md-icon></a>
                      <a class="is-wa" :href="waLink(item.customerPhoneNo)" target="_blank" rel="noopener" :aria-label="$tt('WhatsApp customer')"><md-icon>chat</md-icon></a>
                    </template>
                    <button type="button" :aria-label="$tt('Edit')" @click="openEditDialog(item)"><md-icon>edit</md-icon></button>
                  </div>
                </footer>
              </article>
            </div>
           
            
            <md-table :key="tableKey" class="orders-table" :class="{ 'is-compact': density === 'compact' }" v-model="filteredOrders" :table-header-color="tableHeaderColor" @md-selected="onSelect" @md-selection-change="onSelectionChange" :md-selected-value="selectedOrders">
              <md-table-row
                slot="md-table-row"
                slot-scope="{ item }"
                md-selectable="multiple"
                :md-selected="isSelected(item)"
                :class="{ 'is-menu-open': rowMenu.order === item }"
                @dblclick.native="$refs.details.open(item)"
              >
                <md-table-cell class="cell-small k-sticky-inv" :md-label="$tt('Invoice')"><span class="k-inv">{{ item.invoiceNo || '—' }}</span></md-table-cell>
                <md-table-cell class="cell-small" v-if="col('id')" :md-label="$tt('ID')"><span class="k-id">#{{ item.orderId }}</span></md-table-cell>
                <md-table-cell class="cell-small" v-if="col('trader')" :md-label="$tt('Trader Name')">{{ item.traderName }}</md-table-cell>
                <md-table-cell class="cell-small" md-numeric v-if="col('total')" :md-label="$tt('Total') + ' (' + $tt('AED') + ')'"><b class="k-num">{{ item.totalAmount | money }}</b></md-table-cell>
                <md-table-cell class="cell-small" v-if="col('emirate')" :md-label="$tt('Emirate')">{{ $tt(item.emirate) }}</md-table-cell>
                <md-table-cell class="cell-small" v-if="col('phone')" :md-label="$tt('Customer Phone')">{{ item.customerPhoneNo }}</md-table-cell>
                <md-table-cell class="cell-small" v-if="col('status')" :md-label="$tt('Status')">
                  <button
                    type="button"
                    :class="['status-badge', 'k-st-btn', statusClass(item.deliveryStatus)]"
                    :aria-label="$tt('Change status of order #{id}', { id: item.orderId })"
                    aria-haspopup="menu"
                    @click.stop="openStatusMenu(item, $event)"
                  >{{ $tt($statusLabel(item.deliveryStatus)) }}<md-icon>expand_more</md-icon></button>
                  <span v-if="isLate(item)" class="k-late">{{ $tt('{n}d late', { n: $daysUnderDelivery(item) }) }}</span>
                </md-table-cell>
                <md-table-cell class="cell-small" v-if="col('agent')" :md-label="$tt('Agent')">{{ item.agentName || '—' }}</md-table-cell>
                <md-table-cell class="cell-normal" v-if="col('orderDate')" :md-label="$tt('Order Date')">{{ item.orderDate | kDay }}</md-table-cell>
                <md-table-cell class="cell-normal" v-if="col('deliveryDate')" :md-label="$tt('Delivery Date')">{{ item.deliveryDate | kDay }}</md-table-cell>
                <md-table-cell class="cell-normal" v-if="col('address')" :md-label="$tt('Address')">{{ item.address }}</md-table-cell>
                <md-table-cell class="cell-small" md-numeric v-if="col('traderAmount')" :md-label="$tt('Trader Amount') + ' (' + $tt('AED') + ')'"><span class="k-num">{{ item.traderAmount | money }}</span></md-table-cell>
                <md-table-cell class="cell-small" md-numeric v-if="col('deliveryFee')" :md-label="$tt('Delivery Fee') + ' (' + $tt('AED') + ')'"><span class="k-num">{{ item.deliveryAmount | money }}</span></md-table-cell>
                <md-table-cell class="cell-small" md-numeric v-if="col('agentFee')" :md-label="$tt('Agent Fee') + ' (' + $tt('AED') + ')'"><span class="k-num">{{ item.agentAmount | money }}</span></md-table-cell>
                <md-table-cell class="cell-small" md-numeric v-if="col('net')" :md-label="$tt('Net Company') + ' (' + $tt('AED') + ')'"><span class="k-num">{{ item.netCompanyAmount | money }}</span></md-table-cell>
                <md-table-cell class="cell-small" v-if="col('comment')" :md-label="$tt('Comment')">{{ item.comment }}</md-table-cell>
                <md-table-cell class="k-sticky-actions" md-label="">
                  <button
                    type="button"
                    class="k-row-dots"
                    :class="{ 'is-open': rowMenu.order === item }"
                    :aria-label="$tt('Actions for {inv}', { inv: item.invoiceNo || '#' + item.orderId })"
                    aria-haspopup="menu"
                    :aria-expanded="rowMenu.order === item ? 'true' : 'false'"
                    @click.stop="openRowMenu(item, $event)"
                  ><md-icon>more_horiz</md-icon></button>
                </md-table-cell>
                
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
              <h4>{{ $tt('No orders found') }}</h4>
              <p>{{ $tt('Try changing or clearing the filters above.') }}</p>
              <md-button class="md-raised" @click="resetFilters"><md-icon>filter_alt_off</md-icon> {{ $tt('Clear filters') }}</md-button>
            </div>
            
            <!-- Pagination Controls -->
            <div class="pagination-container" v-if="pagination.totalPages > 0">
              <div class="pagination-info">
                {{ $tt('Showing {a} of {b} orders', { a: filteredOrders.length, b: pagination.totalElements }) }} · {{ $tt('Page {a} of {b}', { a: pagination.pageNumber + 1, b: pagination.totalPages }) }}
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

            <!-- Edit Order Dialog -->
            <md-dialog :md-active.sync="showEditDialog" :md-fullscreen="false" class="k-order-dialog">
              <md-dialog-title>{{ $tt('Edit order #{id}', { id: editingOrder.orderId }) }} <small v-if="editingOrder.invoiceNo" class="k-dlg-sub">· {{ editingOrder.invoiceNo }}</small></md-dialog-title>

              <md-dialog-content>
                <order-form
                  ref="editForm"
                  :value="editingOrder"
                  phone-key="customerPhoneNo"
                  :agents="agents"
                  :traders="traders"
                  :status-options="statusOptions"
                  :emirate-options="emirateOptions"
                ></order-form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showEditDialog = false">{{ $tt('Cancel') }}</md-button>
                <md-button class="md-primary" @click="saveEditOrder">{{ $tt('Save') }}</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Add Order Dialog -->
            <md-dialog :md-active.sync="showAddDialog" :md-fullscreen="false" class="add-order-dialog k-order-dialog">
              <md-dialog-title>{{ $tt('Add New Order') }}</md-dialog-title>

              <md-dialog-content class="add-order-content">
                <order-form
                  ref="addForm"
                  quick
                  :value="newOrder"
                  phone-key="customerPhone"
                  :agents="agents"
                  :traders="traders"
                  :status-options="statusOptions"
                  :emirate-options="emirateOptions"
                ></order-form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showAddDialog = false">{{ $tt('Cancel') }}</md-button>
                <md-button class="md-primary" @click="saveNewOrder">{{ $tt('Save') }}</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Upload Orders Dialog -->
            <md-dialog :md-active.sync="showUploadDialog" :md-fullscreen="false">
              <md-dialog-title>{{ $tt('Upload Orders') }}</md-dialog-title>

              <md-dialog-content>
                <form>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100">
                      <p>{{ $tt('Please select an Excel file to upload orders.') }}</p>
                      <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx, .xls" />
                      <p v-if="selectedFile" class="file-selected">{{ $tt('Selected file: {name}', { name: selectedFile.name }) }}</p>
                    </div>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="cancelUpload">{{ $tt('Cancel') }}</md-button>
                <md-button class="md-primary" @click="uploadOrders" :disabled="!selectedFile">{{ $tt('Upload') }}</md-button>
              </md-dialog-actions>
            </md-dialog>

            <!-- Update Status and Amount Dialog -->
            <md-dialog :md-active.sync="showStatusAndAmountDialog" :md-fullscreen="false">
              <md-dialog-title>{{ $tt('Update Order Status and Amount') }}</md-dialog-title>

              <md-dialog-content>
                <form>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100">
                      <p class="order-info">{{ $tt('Order #{id} - Invoice: {inv}', { id: statusAmountOrder.orderId, inv: statusAmountOrder.invoiceNo }) }}</p>
                    </div>
                    
                    <div class="md-layout-item md-size-100">
                      <div class="status-select">
                        <label>{{ $tt('Status') }}</label>
                        <k-search-select v-model="statusAmountOrder.deliveryStatus" :options="statusOptions.filter(s => s.value)" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots noun="statuses" placeholder="Select status"></k-search-select>
                      </div>
                    </div>
                    
                    <div class="md-layout-item md-size-100">
                      <md-field>
                        <label>{{ $tt('Trader Amount') }} ({{ $tt('AED') }})</label>
                        <md-input type="number" v-model="statusAmountOrder.traderAmount"></md-input>
                      </md-field>
                      <md-field>
                        <label>{{ $tt('Delivery Fee') }} ({{ $tt('AED') }})</label>
                        <md-input type="number" v-model="statusAmountOrder.deliveryAmount"></md-input>
                      </md-field>
                      <md-field>
                        <label>{{ $tt('Agent Fee') }} ({{ $tt('AED') }})</label>
                        <md-input type="number" v-model="statusAmountOrder.agentAmount"></md-input>
                      </md-field>
                    </div>
                  </div>
                </form>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showStatusAndAmountDialog = false">{{ $tt('Cancel') }}</md-button>
                <md-button class="md-primary" @click="updateOrderStatusAndAmount">{{ $tt('Update') }}</md-button>
              </md-dialog-actions>
            </md-dialog>

             <!-- Update Status Dialog -->
            <md-dialog :md-active.sync="showUpdateDialog">
              <md-dialog-title>{{ $tt('Update Order Status') }}</md-dialog-title>

              <md-dialog-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-size-100">
                    <div class="status-select">
                      <label>{{ $tt('Select New Status') }}</label>
                      <k-search-select v-model="selectedStatus" :options="statusOptions" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('Select status')"></k-search-select>
                    </div>
                    <p class="selected-orders-info">{{ $tt('Selected Orders: {n}', { n: selectedOrders.length }) }}</p>
                  </div>
                </div>
              </md-dialog-content>

              <md-dialog-actions>
                <md-button class="md-secondary" @click="showUpdateDialog = false">{{ $tt('Cancel') }}</md-button>
                <md-button class="md-primary" @click="updateSelectedOrdersStatus" :disabled="!selectedStatus">{{ $tt('Update') }}</md-button>
              </md-dialog-actions>
            </md-dialog>

          </md-card-content>
        </md-card>              
      </div>
    </div>

    <!-- Order details side panel -->
    <order-details-drawer ref="details" :agents="agents" @edit="openEditDialog" @delete="deleteOrder" @changed="loadOrders"></order-details-drawer>

    <!-- Bulk action bar (appears when rows are selected) -->
    <transition name="k-bulk">
      <div v-if="selectedOrders.length" class="k-bulk-bar" role="region" :aria-label="$tt('{n} selected', { n: selectedOrders.length })">
        <span class="k-bulk-count">
          <span class="k-bulk-num">{{ selectedOrders.length }}</span>
          {{ $tt('selected') }}
        </span>
        <span class="k-bulk-sep"></span>
        <button type="button" class="k-bulk-btn k-show-sm" @click="openBulkSheet">
          <md-icon>bolt</md-icon> {{ $tt('Actions') }}
        </button>
        <button type="button" class="k-bulk-btn k-hide-sm" @click="openUpdateDialog">
          <md-icon>sync_alt</md-icon> {{ $tt('Update Status') }}
        </button>
        <button v-if="selectedOrders.length === 1" type="button" class="k-bulk-btn k-hide-sm" @click="openStatusAndAmountDialog">
          <md-icon>price_change</md-icon> {{ $tt('Update Status and amount') }}
        </button>
        <button type="button" class="k-bulk-btn is-ghost k-hide-sm" @click="clearSelection">
          <md-icon>close</md-icon> {{ $tt('Clear selection') }}
        </button>
      </div>
    </transition>

    <!-- phones: add order button -->
    <button v-if="!selectedOrders.length" type="button" class="k-fab" :aria-label="$tt('Add Order')" @click="showAddDialog = true">
      <md-icon>add</md-icon>
    </button>

    <!-- phones: actions for the selected orders -->
    <transition name="k-sheet">
      <div v-if="showBulkSheet" class="k-sheet-root" @mousedown.self="showBulkSheet = false">
        <div class="k-sheet" data-k-modal role="dialog" aria-modal="true" :aria-label="$tt('{n} selected', { n: selectedOrders.length })" @keydown.esc="showBulkSheet = false">
          <div class="k-sheet-grab"></div>
          <h3>{{ $tt('{n} orders selected', { n: selectedOrders.length }) }}</h3>
          <p class="k-sheet-sub">{{ selectedOrders.slice(0, 6).map((o) => '#' + o.orderId).join(', ') }}<template v-if="selectedOrders.length > 6">…</template></p>
          <div class="k-sheet-label">{{ $tt('Set status') }}</div>
          <div class="k-sheet-statuses">
            <button
              v-for="s in statusChoices"
              :key="s.value"
              type="button"
              :class="['status-badge', statusClass(s.value), { 'is-picked': sheetStatus === s.value }]"
              @click="sheetStatus = s.value"
            >{{ $tt(s.label) }}</button>
          </div>
          <button v-if="selectedOrders.length === 1" type="button" class="k-sheet-row" @click="showBulkSheet = false; openStatusAndAmountDialog()">
            <md-icon>price_change</md-icon>{{ $tt('Update Status and amount') }}
          </button>
          <button type="button" class="k-sheet-row" @click="showBulkSheet = false; clearSelection()">
            <md-icon>close</md-icon>{{ $tt('Clear selection') }}
          </button>
          <button type="button" class="k-sheet-go" :disabled="!sheetStatus || statusSaving" @click="applySheetStatus">
            {{ sheetStatus ? $tt('Set {n} orders to {s}', { n: selectedOrders.length, s: $tt($statusLabel(sheetStatus)) }) : $tt('Choose a status') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- ⋯ row actions -->
    <div v-if="rowMenu.order" class="k-st-backdrop" @mousedown="closeRowMenu"></div>
    <transition name="k-pop">
      <div
        v-if="rowMenu.order"
        class="k-row-menu"
        data-k-modal
        role="menu"
        :aria-label="$tt('Actions for {inv}', { inv: rowMenu.order.invoiceNo || '#' + rowMenu.order.orderId })"
        :style="{ top: rowMenu.top + 'px', left: rowMenu.left + 'px' }"
        @keydown.esc="closeRowMenu"
      >
        <div class="k-row-menu-head">{{ rowMenu.order.invoiceNo || '#' + rowMenu.order.orderId }}</div>
        <button type="button" role="menuitem" @click="rowAction('view')"><md-icon>visibility</md-icon>{{ $tt('View details') }}</button>
        <button type="button" role="menuitem" @click="rowAction('edit')"><md-icon>edit</md-icon>{{ $tt('Edit order') }}</button>
        <div class="k-row-menu-sep" role="separator"></div>
        <button type="button" role="menuitem" class="is-danger" @click="rowAction('delete')"><md-icon>delete_outline</md-icon>{{ $tt('Delete order') }}</button>
      </div>
    </transition>

    <!-- one-click status change (opened from a status badge) -->
    <div v-if="statusMenu.order" class="k-st-backdrop" @mousedown="closeStatusMenu"></div>
    <transition name="k-pop">
      <div
        v-if="statusMenu.order"
        class="k-st-menu"
        data-k-modal
        role="menu"
        :aria-label="$tt('Change status')"
        :style="{ top: statusMenu.top + 'px', left: statusMenu.left + 'px' }"
        @keydown.esc="closeStatusMenu"
      >
        <div class="k-st-menu-head">{{ $tt('Change status') }} · #{{ statusMenu.order.orderId }}</div>
        <button
          v-for="s in statusChoices"
          :key="s.value"
          type="button"
          role="menuitemradio"
          class="k-st-opt"
          :aria-checked="$statusKey(statusMenu.order.deliveryStatus) === s.value ? 'true' : 'false'"
          :disabled="statusSaving"
          @click="changeStatus(statusMenu.order, s.value)"
        >
          <span :class="['status-badge', statusClass(s.value)]">{{ $tt(s.label) }}</span>
          <md-icon v-if="$statusKey(statusMenu.order.deliveryStatus) === s.value" class="k-st-check">check</md-icon>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";
import { TraderService } from "@/services/TraderService";
import { DeliveryAgentService } from "@/services/DeliveryAgentService";
import OrderForm from "@/components/OrderForm.vue";

// filters a saved view keeps (same as the URL keys)
const VIEW_KEYS = ["invoiceNo", "customerPhoneNo", "fromOrderDate", "toOrderDate", "totalAmount", "deliveryStatus", "traderName"];
const SAVED_VIEWS_KEY = "karrar.orders.savedViews";
const MAX_SAVED_VIEWS = 8;
function loadSavedViews() {
  try {
    const list = JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY) || "[]");
    return Array.isArray(list) ? list.filter((v) => v && v.id && v.name && v.filters) : [];
  } catch (e) {
    return [];
  }
}

export default {
  components: { OrderForm },
  data() {
    let hidden = [];
    let density = "comfortable";
    try {
      hidden = JSON.parse(localStorage.getItem("karrar.orders.hiddenCols") || "[]");
      if (!Array.isArray(hidden)) hidden = [];
      // the ID column is hidden by default (the invoice is pinned instead); applied once
      if (!localStorage.getItem("karrar.orders.cols.v2")) {
        if (!hidden.includes("id")) hidden.push("id");
        localStorage.setItem("karrar.orders.hiddenCols", JSON.stringify(hidden));
        localStorage.setItem("karrar.orders.cols.v2", "1");
      }
      density = localStorage.getItem("karrar.orders.density") || "comfortable";
    } catch (e) {
      /* defaults */
    }
    return {
      // table view options (remembered per browser)
      hiddenCols: Array.isArray(hidden) ? hidden : [],
      density,
      showColMenu: false,
      showIoMenu: false,
      tableKey: 0,
      showMoreFilters: false,
      searchText: "",
      statusMenu: { order: null, top: 0, left: 0 },
      rowMenu: { order: null, top: 0, left: 0 },
      statusSaving: false,
      showBulkSheet: false,
      savedViews: loadSavedViews(),
      saveViewOpen: false,
      saveViewName: "",
      sheetStatus: "",
      views: [
        { key: "all", label: "All", icon: "list" },
        { key: "today", label: "Today", icon: "today" },
        { key: "under", label: "Under delivery", icon: "two_wheeler" },
        { key: "delayed", label: "Delayed", icon: "schedule" },
        { key: "pending", label: "Pending", icon: "hourglass_empty" },
      ],
      statusChoices: [
        { value: "PENDING", label: "Pending" },
        { value: "UNDER_DELIVERY", label: "Under Delivery" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "EXCHANGED", label: "Exchanged" },
        { value: "CANCELED", label: "Canceled" },
        { value: "FAILED", label: "Failed" },
      ],
      exporting: false,
      orderColumns: [
        { key: "id", label: "ID" },
        { key: "trader", label: "Trader Name" },
        { key: "total", label: "Total" },
        { key: "emirate", label: "Emirate" },
        { key: "phone", label: "Customer Phone" },
        { key: "status", label: "Status" },
        { key: "agent", label: "Agent" },
        { key: "orderDate", label: "Order Date" },
        { key: "deliveryDate", label: "Delivery Date" },
        { key: "address", label: "Address" },
        { key: "traderAmount", label: "Trader Amount" },
        { key: "deliveryFee", label: "Delivery Fee" },
        { key: "agentFee", label: "Agent Fee" },
        { key: "net", label: "Net Company" },
        { key: "comment", label: "Comment" },
      ],
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
        traderName: "",
        traderId: ""
      },
    };
  },
  methods: {
    closeColMenu() {
      this.showColMenu = false;
    },
    closeIoMenu() {
      this.showIoMenu = false;
    },
    formatCount(n) {
      return Number(n || 0).toLocaleString("en-US");
    },
    // ---- search box: invoice number
    applySearchText() {
      // the search box looks for invoice numbers (partial match); phone is under "More filters"
      this.filters.invoiceNo = (this.searchText || "").trim();
    },
    // ---- quick views
    ymd(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
    delayDays() {
      try {
        const n = parseInt(localStorage.getItem("karrar.delayDays"), 10);
        return n >= 1 && n <= 60 ? n : 2;
      } catch (e) {
        return 2;
      }
    },
    viewFilters(key) {
      const today = new Date();
      if (key === "today") return { fromOrderDate: this.ymd(today), toOrderDate: this.ymd(today) };
      if (key === "under") return { deliveryStatus: "UNDER_DELIVERY" };
      if (key === "pending") return { deliveryStatus: "PENDING" };
      if (key === "delayed") {
        // same rule as the dashboard: ordered before (today - N days) and still under delivery
        const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.delayDays() - 1);
        return { deliveryStatus: "UNDER_DELIVERY", toOrderDate: this.ymd(last) };
      }
      return {};
    },
    setView(key) {
      this.searchText = "";
      this.filters = {
        invoiceNo: "",
        fromOrderDate: "",
        toOrderDate: "",
        customerPhoneNo: "",
        totalAmount: "",
        deliveryStatus: "",
        traderName: "",
        traderId: "",
        ...this.viewFilters(key),
      };
      this.selectedOrders = [];
      this.applyFilters();
    },
    // ---- the user's own saved views
    pickViewFilters(f) {
      const out = {};
      VIEW_KEYS.forEach((k) => (out[k] = f[k] || ""));
      return out;
    },
    persistSavedViews() {
      try {
        localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(this.savedViews));
      } catch (e) {
        /* storage unavailable: views last for this visit only */
      }
    },
    openSaveView() {
      this.applySearchText();
      this.saveViewName = this.activeChips.map((c) => c.text.replace(/^[^:]+:\s*/, "")).join(" · ").slice(0, 30);
      this.saveViewOpen = true;
      this.$nextTick(() => this.$refs.saveViewInput && this.$refs.saveViewInput.select());
    },
    saveCurrentView() {
      const name = this.saveViewName.trim();
      if (!name) return;
      if (this.savedViews.length >= MAX_SAVED_VIEWS) {
        this.$toast.error(this.$tt("You can save up to {n} views. Delete one first.", { n: MAX_SAVED_VIEWS }));
        return;
      }
      this.savedViews.push({ id: Date.now().toString(36), name, filters: this.pickViewFilters(this.filters) });
      this.persistSavedViews();
      this.saveViewOpen = false;
      this.$toast.success(this.$tt("View “{name}” saved", { name }));
    },
    applySavedView(sv) {
      this.filters = { ...this.filters, ...this.pickViewFilters(sv.filters), traderId: "" };
      this.searchText = this.filters.invoiceNo || "";
      this.selectedOrders = [];
      this.applyFilters();
    },
    async deleteSavedView(sv) {
      const ok = await this.$kConfirm({
        title: "Delete this view?",
        message: "The “{name}” tab will be removed. Your orders are not affected.",
        params: { name: sv.name },
        confirmText: "Delete view",
        danger: true,
      });
      if (!ok) return;
      this.savedViews = this.savedViews.filter((v) => v.id !== sv.id);
      this.persistSavedViews();
    },
    savedViewSummary(sv) {
      const f = sv.filters;
      return [
        f.deliveryStatus && this.$tt(this.$statusLabel(f.deliveryStatus)),
        f.traderName,
        f.invoiceNo,
        f.customerPhoneNo,
        (f.fromOrderDate || f.toOrderDate) && `${f.fromOrderDate || "…"} – ${f.toOrderDate || "…"}`,
        f.totalAmount && `${f.totalAmount} AED`,
      ].filter(Boolean).join(" · ");
    },
    removeChip(key) {
      if (key === "search") this.searchText = "";
      else if (key === "dates") {
        this.filters.fromOrderDate = "";
        this.filters.toOrderDate = "";
      } else this.filters[key] = "";
      this.applyFilters();
    },
    isLate(item) {
      return this.$daysUnderDelivery(item) > this.delayDays();
    },
    // ---- one-click status change
    openStatusMenu(item, event) {
      const r = event.currentTarget.getBoundingClientRect();
      const width = 220;
      const height = 300;
      let left = document.documentElement.dir === "rtl" ? r.right - width : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      let top = r.bottom + 6;
      if (top + height > window.innerHeight) top = Math.max(8, r.top - height - 6);
      this.statusMenu = { order: item, top, left };
    },
    openBulkSheet() {
      this.sheetStatus = "";
      this.showBulkSheet = true;
    },
    async applySheetStatus() {
      if (!this.sheetStatus || !this.selectedOrders.length) return;
      this.statusSaving = true;
      try {
        await OrderService.updateOrderStatus({
          orderList: this.selectedOrders.map((o) => o.invoiceNo),
          deliveryStatus: this.sheetStatus,
        });
        this.showBulkSheet = false;
        this.$toast.success("Orders status updated successfully");
        await this.loadOrders();
        this.clearSelection();
      } catch (e) {
        this.$toast.error("Failed to update orders status");
      } finally {
        this.statusSaving = false;
      }
    },
    // phone links for the cards
    phoneDigits(phone) {
      let d = String(phone || "").replace(/\D/g, "");
      if (d.startsWith("00")) d = d.slice(2);
      if (d.startsWith("0")) d = "971" + d.slice(1);
      if (d.length === 9 && /^5/.test(d)) d = "971" + d;
      return d;
    },
    telLink(phone) {
      return "tel:+" + this.phoneDigits(phone);
    },
    waLink(phone) {
      return "https://wa.me/" + this.phoneDigits(phone);
    },
    // ---- ⋯ row actions
    openRowMenu(item, event) {
      if (this.rowMenu.order === item) return this.closeRowMenu();
      const r = event.currentTarget.getBoundingClientRect();
      const width = 210;
      const height = 170;
      const rtl = document.documentElement.dir === "rtl";
      let left = rtl ? r.right + 6 : r.left - width - 6;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      let top = r.top - 6;
      if (top + height > window.innerHeight) top = Math.max(8, window.innerHeight - height - 8);
      this.rowMenu = { order: item, top, left };
    },
    closeRowMenu() {
      this.rowMenu = { order: null, top: 0, left: 0 };
    },
    rowAction(action) {
      const o = this.rowMenu.order;
      this.closeRowMenu();
      if (!o) return;
      if (action === "view") this.$refs.details.open(o);
      else if (action === "edit") this.openEditDialog(o);
      else if (action === "delete") this.deleteOrder(o);
    },
    closeStatusMenu() {
      this.statusMenu = { order: null, top: 0, left: 0 };
    },
    async changeStatus(order, status) {
      if (this.$statusKey(order.deliveryStatus) === status) return this.closeStatusMenu();
      if (status === "CANCELED") {
        const ok = await this.$kConfirm({
          title: "Cancel this order?",
          message: "Order #{id} will be marked as canceled.",
          params: { id: order.orderId },
          confirmText: "Cancel order",
          danger: true,
        });
        if (!ok) return;
      }
      this.statusSaving = true;
      try {
        await OrderService.updateOrderStatus({ orderList: [order.invoiceNo], deliveryStatus: status });
        this.closeStatusMenu();
        this.$toast.success(this.$tt("Order #{id} is now {s}", { id: order.orderId, s: this.$tt(this.$statusLabel(status)) }));
        await this.loadOrders();
      } catch (error) {
        console.error("Error updating order status:", error);
        this.$toast.error("Failed to update orders status");
      } finally {
        this.statusSaving = false;
      }
    },
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

    // ---- table view options
    col(key) {
      return !this.hiddenCols.includes(key);
    },
    toggleCol(key) {
      this.hiddenCols = this.col(key) ? [...this.hiddenCols, key] : this.hiddenCols.filter((k) => k !== key);
      this.saveView();
    },
    setDensity(d) {
      this.density = d;
      this.saveView();
    },
    resetView() {
      this.hiddenCols = ["id"];
      this.density = "comfortable";
      this.saveView();
    },
    saveView() {
      try {
        localStorage.setItem("karrar.orders.hiddenCols", JSON.stringify(this.hiddenCols));
        localStorage.setItem("karrar.orders.density", this.density);
      } catch (e) {
        /* not remembered */
      }
    },
    // selecting from the phone card view
    toggleCardSelection(item) {
      this.selectedOrders = this.isSelected(item)
        ? this.selectedOrders.filter((o) => o !== item)
        : [...this.selectedOrders, item];
    },
    // "23-10-2026 12:00 AM" (API) -> "2026-10-23" (date picker)
    apiDateToPicker(value) {
      if (!value) return "";
      const d = this.$parseApiDate(value);
      if (!d) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    },
    // picker value back to the API format; keep the original time when the date didn't change
    pickerDateToApi(value, original) {
      if (!value) return null; // cleared (the backend keeps the old value when it gets null)
      if (original && this.apiDateToPicker(original) === value) return original;
      const [y, m, d] = value.split("-");
      return `${d}-${m}-${y} 12:00 AM`;
    },
    // empty the selection everywhere: our list, the table's own ticks and the bulk bar
    clearSelection() {
      this.selectedOrders = [];
      this.tableKey += 1;
    },
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
        
        // Refresh the orders list, then clear the selection (also hides the bottom bar)
        await this.loadOrders();
        this.clearSelection();
        
        // Show success notification
        this.$toast.success('Orders status updated successfully');
      } catch (error) {
        console.error('Error updating orders status:', error);
        this.$toast.error('Failed to update orders status');
      }
    },
    async exportOrderReport() {
      if (this.exporting) return;
      this.exporting = true;
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
        this.exporting = false;
        this.$root.$emit('hide-loading');
      }
    },
    saveNewOrder() {
      if (this.$refs.addForm && !this.$refs.addForm.isValid()) {
        this.$toast.error('Check the customer phone number');
        return;
      }
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
      
      // the API expects the English label ("Under Delivery"), not the key
      const newStatus = this.$statusLabel(this.newOrder.deliveryStatus);
      
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
        deliveryStatus: newStatus,
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
        orderDate: this.apiDateToPicker(order.orderDate),
        deliveryDate: this.apiDateToPicker(order.deliveryDate),
        originalOrderDate: order.orderDate || null,
        originalDeliveryDate: order.deliveryDate || null,
        address: order.address,
        emirate: order.emirate,
        deliveryStatus: this.$statusKey(order.deliveryStatus) || '',
        deliveryAmount: order.deliveryAmount,
        agentAmount: order.agentAmount,
        customerPhoneNo: order.customerPhoneNo,
        traderId: order.traderId,
        traderAmount: order.traderAmount,
        netCompanyAmount: order.netCompanyAmount,
        comment: order.comment
      };
      this.showEditDialog = true;
    },

    saveEditOrder() {
      if (this.$refs.editForm && !this.$refs.editForm.isValid()) {
        this.$toast.error('Check the customer phone number');
        return;
      }
      // the API expects the English label ("Under Delivery"), not the key
      const editStatus = this.$statusLabel(this.editingOrder.deliveryStatus);
      
      const orderToUpdate = {
        orderId: this.editingOrder.orderId,
        invoiceNo: this.editingOrder.invoiceNo,
        agentId: this.editingOrder.agentId,
        orderDate: this.pickerDateToApi(this.editingOrder.orderDate, this.editingOrder.originalOrderDate),
        deliveryDate: this.pickerDateToApi(this.editingOrder.deliveryDate, this.editingOrder.originalDeliveryDate),
        address: this.editingOrder.address,
        emirate: this.editingOrder.emirate,
        deliveryStatus: editStatus,
        traderAmount: this.editingOrder.traderAmount,
        deliveryAmount: this.editingOrder.deliveryAmount,
        agentAmount: this.editingOrder.agentAmount,
        customerPhoneNo: this.editingOrder.customerPhoneNo,
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
      if (await this.$kConfirm({ title: "Delete order?", message: order.invoiceNo ? "Order #{id} (invoice {inv}) will be permanently deleted." : "Order #{id} will be permanently deleted.", params: { id: order.orderId, inv: order.invoiceNo }, confirmText: "Delete", danger: true })) {
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
      
      return this.loadOrdersWithFilters(filters);
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
      return OrderService.getAllOrders(filters)
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
      this.applySearchText();
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
      this.searchText = "";
      this.filters = {
        invoiceNo: "",
        fromOrderDate: "",
        toOrderDate: "",
        customerPhoneNo: "",
        totalAmount: "",
        deliveryStatus: "",
        traderName: "",
        traderId: ""
      };
      
      // Reset pagination and reload orders
      this.pagination.pageNumber = 0;
      this.loadOrders();
    },
    statusClass(status) {
      return this.$statusBadge(status);
    },
    
    openStatusAndAmountDialog() {
      // Only use the first selected order for status and amount update
      const selectedOrder = this.selectedOrders[0];
      
      // Set the order details for the status and amount update dialog
      this.statusAmountOrder = {
        orderId: selectedOrder.orderId,
        invoiceNo: selectedOrder.invoiceNo,
        deliveryStatus: this.$statusKey(selectedOrder.deliveryStatus) || '',
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
        
        // Refresh the orders list, then clear the selection (also hides the bottom bar)
        await this.loadOrders();
        this.clearSelection();
        
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
  watch: {
    // Add Order: start typing straight into the invoice number
    showAddDialog(open) {
      if (open) setTimeout(() => this.$refs.addForm && this.$refs.addForm.focusFirst(), 250);
    },
    // emptying the search box (typing it away or its ✕) shows all results again
    searchText(value, old) {
      if (!String(value || "").trim() && String(old || "").trim() && this.filters.invoiceNo) {
        this.applyFilters();
      }
    },
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
    },
    hasActiveFilters() {
      const f = this.filters;
      return !!(f.invoiceNo || f.customerPhoneNo || f.fromOrderDate || f.toOrderDate || f.totalAmount || f.deliveryStatus || f.traderName);
    },
    // which quick view the current filters match (or "" for a custom search)
    activeView() {
      const f = this.filters;
      const cur = JSON.stringify(this.pickViewFilters(f));
      const saved = this.savedViews.find((v) => JSON.stringify(this.pickViewFilters(v.filters)) === cur);
      if (saved) return "saved:" + saved.id;
      const extra = f.invoiceNo || f.customerPhoneNo || f.totalAmount || f.traderName;
      if (extra) return "";
      for (const v of this.views) {
        const want = { fromOrderDate: "", toOrderDate: "", deliveryStatus: "", ...this.viewFilters(v.key) };
        if (["fromOrderDate", "toOrderDate", "deliveryStatus"].every((k) => (f[k] || "") === (want[k] || ""))) return v.key;
      }
      return "";
    },
    // "Save view" shows when the filters are a custom combination
    canSaveView() {
      return this.hasActiveFilters && this.activeView === "";
    },
    moreFilterCount() {
      const f = this.filters;
      return [f.customerPhoneNo, f.fromOrderDate || f.toOrderDate, f.totalAmount].filter(Boolean).length;
    },
    activeChips() {
      const f = this.filters;
      const chips = [];
      if (f.invoiceNo) chips.push({ key: "search", text: this.$tt("Invoice: {v}", { v: f.invoiceNo }) });
      if (f.customerPhoneNo) chips.push({ key: "customerPhoneNo", text: this.$tt("Phone: {v}", { v: f.customerPhoneNo }) });
      if (f.deliveryStatus) chips.push({ key: "deliveryStatus", text: this.$tt("Status: {v}", { v: this.$tt(this.$statusLabel(f.deliveryStatus)) }) });
      if (f.traderName) chips.push({ key: "traderName", text: this.$tt("Trader: {v}", { v: f.traderName }) });
      if (f.fromOrderDate || f.toOrderDate) {
        const a = f.fromOrderDate ? this.$options.filters.kDay(f.fromOrderDate) : "…";
        const b = f.toOrderDate ? this.$options.filters.kDay(f.toOrderDate) : "…";
        chips.push({ key: "dates", text: f.fromOrderDate === f.toOrderDate ? this.$tt("Ordered: {v}", { v: a }) : this.$tt("Ordered: {a} – {b}", { a, b }) });
      }
      if (f.totalAmount) chips.push({ key: "totalAmount", text: this.$tt("Total: {v} AED", { v: f.totalAmount }) });
      return chips;
    },
  },
  
  created() {
    // search box shows whatever came from the URL
    this.searchText = this.filters.invoiceNo || "";
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
