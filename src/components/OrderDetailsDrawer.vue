<template>
  <div class="k-drawer-root">
    <transition name="k-drawer-fade">
      <div v-if="order" class="k-drawer-overlay" @click="close"></div>
    </transition>
    <transition name="k-drawer-slide">
      <aside
        v-if="order"
        class="k-drawer"
        role="dialog"
        aria-modal="true"
        :aria-label="$tt('Order details')"
        tabindex="-1"
        ref="panel"
        @keydown.esc="close"
      >
        <header class="k-drawer-header">
          <div>
            <div class="k-drawer-eyebrow">{{ $tt("Order details") }}</div>
            <h3 class="k-drawer-title">
              #{{ order.orderId }}
              <span v-if="order.invoiceNo" class="k-drawer-invoice">{{ $tt("Invoice") }} {{ order.invoiceNo }}</span>
            </h3>
          </div>
          <button type="button" class="k-drawer-close" :aria-label="$tt('Close')" @click="close">
            <md-icon>close</md-icon>
          </button>
        </header>

        <div class="k-drawer-status">
          <span class="status-badge" :class="statusClass">{{ $tt(order.deliveryStatus) }}</span>
          <span class="k-drawer-total">
            {{ order.totalAmount | money }} <small>{{ $tt("AED") }}</small>
          </span>
        </div>

        <div class="k-drawer-body">
          <section class="k-drawer-section">
            <h4><md-icon>person</md-icon> {{ $tt("Customer") }}</h4>
            <dl>
              <dt>{{ $tt("Customer Phone") }}</dt>
              <dd><a v-if="order.customerPhoneNo" :href="'tel:' + order.customerPhoneNo">{{ order.customerPhoneNo }}</a><span v-else>—</span></dd>
              <dt>{{ $tt("Emirate") }}</dt>
              <dd>{{ $tt(order.emirate) || "—" }}</dd>
              <dt>{{ $tt("Address") }}</dt>
              <dd>{{ order.address || "—" }}</dd>
            </dl>
          </section>

          <section class="k-drawer-section">
            <h4><md-icon>local_shipping</md-icon> {{ $tt("Delivery & agent") }}</h4>
            <dl>
              <dt>{{ $tt("Trader") }}</dt>
              <dd>{{ order.traderName || "—" }}</dd>
              <dt>{{ $tt("Agent") }}</dt>
              <dd>{{ order.agentName || "—" }}</dd>
              <dt>{{ $tt("Ordered on") }}</dt>
              <dd>{{ order.orderDate | kDate }}</dd>
              <dt>{{ $tt("Delivered on") }}</dt>
              <dd>{{ order.deliveryDate ? $options.filters.kDate(order.deliveryDate) : $tt("Not delivered yet") }}</dd>
            </dl>
          </section>

          <section class="k-drawer-section">
            <h4><md-icon>payments</md-icon> {{ $tt("Amounts") }}</h4>
            <div class="k-drawer-amounts">
              <div><span>{{ $tt("Total") }}</span><strong>{{ order.totalAmount | money }}</strong></div>
              <div><span>{{ $tt("Trader Amount") }}</span><strong>{{ order.traderAmount | money }}</strong></div>
              <div><span>{{ $tt("Delivery Fee") }}</span><strong>{{ order.deliveryAmount | money }}</strong></div>
              <div><span>{{ $tt("Agent Fee") }}</span><strong>{{ order.agentAmount | money }}</strong></div>
              <div class="is-net"><span>{{ $tt("Net Company") }}</span><strong>{{ order.netCompanyAmount | money }}</strong></div>
            </div>
          </section>

          <section class="k-drawer-section">
            <h4><md-icon>sticky_note_2</md-icon> {{ $tt("Comment") }}</h4>
            <p class="k-drawer-comment" :class="{ 'is-empty': !order.comment }">
              {{ order.comment || $tt("No comment") }}
            </p>
          </section>
        </div>

        <footer class="k-drawer-footer">
          <button type="button" class="k-btn k-btn-ghost k-btn-danger-text" @click="emitAndClose('delete')">
            <md-icon>delete_outline</md-icon> {{ $tt("Delete") }}
          </button>
          <button type="button" class="k-btn k-btn-primary" @click="emitAndClose('edit')">
            <md-icon>edit</md-icon> {{ $tt("Edit") }}
          </button>
        </footer>
      </aside>
    </transition>
  </div>
</template>

<script>
/**
 * Side panel with every field of an order.
 * Open it from a parent with this.$refs.details.open(order);
 * it emits "edit" / "delete" with the order.
 */
export default {
  name: "OrderDetailsDrawer",
  data() {
    return { order: null };
  },
  computed: {
    statusClass() {
      const v = String((this.order && this.order.deliveryStatus) || "").toUpperCase().replace(/\s+/g, "_");
      return {
        DELIVERED: "text-green",
        PENDING: "text-orange",
        UNDER_DELIVERY: "text-blue",
        CANCELED: "text-red",
        CANCELLED: "text-red",
        EXCHANGED: "text-yellow",
      }[v] || "";
    },
  },
  methods: {
    open(order) {
      this.order = order;
      this.$nextTick(() => this.$refs.panel && this.$refs.panel.focus());
    },
    close() {
      this.order = null;
    },
    emitAndClose(event) {
      const o = this.order;
      this.close();
      this.$emit(event, o);
    },
  },
};
</script>
