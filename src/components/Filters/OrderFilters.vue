<template>
  <div class="order-filters md-layout">
    <template v-if="type === 'trader'">
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Select Trader</label>
          <md-select v-model="filters.trader" @change="emitFilters">
            <md-option value="">All Traders</md-option>
            <md-option v-for="trader in traders" :key="trader" :value="trader">
              {{ trader }}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Status</label>
          <md-select v-model="filters.status" @change="emitFilters">
            <md-option value="">All Status</md-option>
            <md-option value="Delivered">Delivered</md-option>
            <md-option value="Pending">Pending</md-option>
            <md-option value="Cancelled">Cancelled</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Date</label>
          <md-input type="date" v-model="filters.date" @change="emitFilters"/>
        </md-field>
      </div>
    </template>

    <template v-else>
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Order ID</label>
          <md-input v-model="filters.orderId" @input="emitFilters"/>
        </md-field>
      </div>
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Delivery Agent</label>
          <md-select v-model="filters.deliveryAgent" @change="emitFilters">
            <md-option value="">All Agents</md-option>
            <md-option v-for="agent in deliveryAgents" :key="agent" :value="agent">
              {{ agent }}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Emirate</label>
          <md-select v-model="filters.emirate" @change="emitFilters">
            <md-option value="">All Emirates</md-option>
            <md-option value="Dubai">Dubai</md-option>
            <md-option value="Abu Dhabi">Abu Dhabi</md-option>
            <md-option value="Sharjah">Sharjah</md-option>
            <md-option value="Ajman">Ajman</md-option>
            <md-option value="RAK">RAK</md-option>
            <md-option value="Fujairah">Fujairah</md-option>
            <md-option value="UAQ">UAQ</md-option>
          </md-select>
        </md-field>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "OrderFilters",
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['trader', 'all'].includes(value)
    },
    traders: {
      type: Array,
      default: () => []
    },
    deliveryAgents: {
      type: Array,
      default: () => ['Agent 1', 'Agent 2', 'Agent 3'] // Replace with actual agents
    }
  },
  data() {
    return {
      filters: {
        trader: '',
        status: '',
        date: '',
        orderId: '',
        deliveryAgent: '',
        emirate: ''
      }
    }
  },
  methods: {
    emitFilters() {
      this.$emit('filter-changed', this.filters)
    }
  }
}
</script>

<style scoped>
.order-filters {
  margin-bottom: 24px;
}
.md-layout-item {
  padding: 0 8px;
}
</style>>
