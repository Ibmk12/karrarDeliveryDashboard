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
          <span class="status-badge" :class="statusClass">{{ $tt($statusLabel(order.deliveryStatus)) }}</span>
          <span v-if="$daysUnderDelivery(order)" class="k-late">{{ $tt('{n} days with agent', { n: $daysUnderDelivery(order) }) }}</span>
          <span class="k-drawer-total">
            {{ order.totalAmount | money }} <small>{{ $tt("AED") }}</small>
          </span>
        </div>

        <div class="k-drawer-body">
          <!-- customer -->
          <section class="k-drawer-card">
            <h4>{{ $tt("Customer") }}</h4>
            <div class="k-who">
              <span class="k-who-av is-blue"><md-icon>person</md-icon></span>
              <div class="k-who-text">
                <b dir="ltr">{{ displayPhone(order.customerPhoneNo) || "—" }}</b>
                <span>{{ [order.address, $tt(order.emirate)].filter(Boolean).join(" · ") || "—" }}</span>
              </div>
              <template v-if="order.customerPhoneNo">
                <a class="k-contact is-call" :href="telLink(order.customerPhoneNo)" :aria-label="$tt('Call customer')" :title="$tt('Call customer')"><md-icon>call</md-icon></a>
                <a class="k-contact is-wa" :href="waLink(order.customerPhoneNo)" target="_blank" rel="noopener" :aria-label="$tt('WhatsApp customer')" :title="$tt('WhatsApp customer')"><md-icon>chat</md-icon></a>
              </template>
            </div>
          </section>

          <!-- agent -->
          <section class="k-drawer-card">
            <h4>{{ $tt("Delivery agent") }}</h4>
            <div class="k-who">
              <span class="k-who-av">{{ initials(order.agentName) }}</span>
              <div class="k-who-text">
                <b>{{ order.agentName || $tt("Not assigned") }}</b>
                <span dir="ltr">{{ displayPhone(agentPhone) || "" }}</span>
              </div>
              <template v-if="agentPhone">
                <a class="k-contact is-call" :href="telLink(agentPhone)" :aria-label="$tt('Call agent')" :title="$tt('Call agent')"><md-icon>call</md-icon></a>
                <a class="k-contact is-wa" :href="waLink(agentPhone)" target="_blank" rel="noopener" :aria-label="$tt('WhatsApp agent')" :title="$tt('WhatsApp agent')"><md-icon>chat</md-icon></a>
              </template>
            </div>
            <dl class="k-drawer-dl">
              <dt>{{ $tt("Trader") }}</dt>
              <dd>{{ order.traderName || "—" }}</dd>
              <dt>{{ $tt("Ordered on") }}</dt>
              <dd>{{ order.orderDate | kDate }}</dd>
              <dt>{{ $tt("Delivered on") }}</dt>
              <dd>{{ order.deliveryDate ? $options.filters.kDate(order.deliveryDate) : $tt("Not delivered yet") }}</dd>
            </dl>
          </section>

          <!-- amounts -->
          <section class="k-drawer-card">
            <h4>{{ $tt("Amounts") }}</h4>
            <div class="k-split">
              <span>{{ $tt("Trader Amount") }}</span><b>{{ order.traderAmount | money }}</b>
              <span>+ {{ $tt("Delivery Fee") }}</span><b>{{ order.deliveryAmount | money }}</b>
              <span class="is-total">{{ $tt("Customer pays") }}</span><b class="is-total">{{ order.totalAmount | money }} <small>{{ $tt("AED") }}</small></b>
              <span>{{ $tt("Agent Fee") }}</span><b>{{ order.agentAmount | money }}</b>
              <span>{{ $tt("Company net") }}</span><b class="is-net">{{ order.netCompanyAmount | money }}</b>
            </div>
          </section>

          <section v-if="order.comment" class="k-drawer-card">
            <h4>{{ $tt("Comment") }}</h4>
            <p class="k-drawer-comment">{{ order.comment }}</p>
          </section>

          <!-- history -->
          <section class="k-drawer-card">
            <h4>{{ $tt("History") }}</h4>
            <div v-if="history.loading" class="k-hist-msg">{{ $tt("Loading…") }}</div>
            <div v-else-if="history.error" class="k-hist-msg">{{ $tt("History isn't available yet.") }}</div>
            <div v-else-if="!history.items.length" class="k-hist-msg">{{ $tt("No changes recorded yet.") }}</div>
            <ol v-else class="k-timeline">
              <li v-for="(h, i) in history.items" :key="h.id" :class="{ 'is-now': i === 0 }">
                <b>{{ historyText(h) }}</b>
                <small>{{ h.changedAt | kDate }}<template v-if="h.changedBy"> · {{ $tt("by {name}", { name: h.changedBy }) }}</template></small>
              </li>
            </ol>
          </section>
        </div>

        <footer class="k-drawer-footer">
          <button
            v-if="canMarkDelivered"
            type="button"
            class="k-btn k-btn-primary k-btn-wide"
            :disabled="saving"
            @click="markDelivered"
          >
            <md-icon>check_circle</md-icon> {{ saving ? $tt("Saving…") : $tt("Mark delivered") }}
          </button>
          <button type="button" class="k-btn k-btn-ghost" :aria-label="$tt('Edit')" @click="emitAndClose('edit')">
            <md-icon>edit</md-icon> <span>{{ $tt("Edit") }}</span>
          </button>
          <button type="button" class="k-btn k-btn-ghost k-btn-danger-text" :aria-label="$tt('Delete')" :title="$tt('Delete')" @click="emitAndClose('delete')">
            <md-icon>delete_outline</md-icon>
          </button>
        </footer>
      </aside>
    </transition>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";

const FIELD_LABELS = {
  deliveryStatus: "Status",
  agent: "Agent",
  trader: "Trader",
  traderAmount: "Trader Amount",
  deliveryAmount: "Delivery Fee",
  agentAmount: "Agent Fee",
  invoiceNo: "Invoice",
  customerPhoneNo: "Customer Phone",
  emirate: "Emirate",
  address: "Address",
  orderDate: "Order Date",
  deliveryDate: "Delivery Date",
  comment: "Comment",
};

/**
 * Side panel with every field of an order.
 * Open it from a parent with this.$refs.details.open(order);
 * it emits "edit" / "delete" with the order, and "changed" after it updated the order itself.
 */
export default {
  name: "OrderDetailsDrawer",
  props: {
    // agents list (for the agent's phone number)
    agents: { type: Array, default: () => [] },
  },
  data() {
    return { order: null, saving: false, history: { loading: false, error: false, items: [] } };
  },
  computed: {
    statusClass() {
      return this.$statusBadge(this.order && this.order.deliveryStatus);
    },
    agentPhone() {
      if (!this.order) return "";
      const a = this.agents.find((x) => x.id === this.order.agentId || (x.name && x.name === this.order.agentName));
      return (a && a.phoneNumber) || "";
    },
    canMarkDelivered() {
      const k = this.$statusKey(this.order && this.order.deliveryStatus);
      return k && k !== "DELIVERED" && k !== "CANCELED";
    },
  },
  methods: {
    open(order) {
      this.order = order;
      this.loadHistory();
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
    async loadHistory() {
      const id = this.order && this.order.orderId;
      this.history = { loading: true, error: false, items: [] };
      if (!id) return (this.history.loading = false);
      try {
        const items = await OrderService.getOrderHistory(id);
        if (this.order && this.order.orderId === id) this.history = { loading: false, error: false, items };
      } catch (e) {
        this.history = { loading: false, error: true, items: [] };
      }
    },
    async markDelivered() {
      const o = this.order;
      this.saving = true;
      try {
        await OrderService.updateOrderStatus({ orderList: [o.invoiceNo], deliveryStatus: "DELIVERED" });
        this.$toast.success(this.$tt("Order #{id} is now {s}", { id: o.orderId, s: this.$tt("Delivered") }));
        this.close();
        this.$emit("changed", o);
      } catch (e) {
        this.$toast.error("Failed to update orders status");
      } finally {
        this.saving = false;
      }
    },
    // ---- phones: +971 50 123 4567, tel: and WhatsApp links
    digits(phone) {
      let d = String(phone || "").replace(/\D/g, "");
      if (d.startsWith("00")) d = d.slice(2);
      if (d.startsWith("0")) d = "971" + d.slice(1);
      if (d.length === 9 && /^5/.test(d)) d = "971" + d;
      return d;
    },
    displayPhone(phone) {
      const d = this.digits(phone);
      if (!d) return "";
      const m = d.match(/^(971|966|249)(\d{2})(\d{3})(\d{4})$/);
      return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : "+" + d;
    },
    telLink(phone) {
      return "tel:+" + this.digits(phone);
    },
    waLink(phone) {
      return "https://wa.me/" + this.digits(phone);
    },
    initials(name) {
      const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
      return parts.length ? (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase() : "—";
    },
    historyText(h) {
      const tt = this.$tt;
      const status = (v) => tt(this.$statusLabel(v));
      switch (h.action) {
        case "CREATED":
          return tt("Order created");
        case "UPLOADED":
          return tt("Order created from an Excel upload");
        case "DELETED":
          return tt("Order deleted");
        case "STATUS_CHANGED":
          return tt("Status: {a} → {b}", { a: status(h.oldValue) || "—", b: status(h.newValue) || "—" });
        case "AGENT_ASSIGNED":
          return h.oldValue ? tt("Agent: {a} → {b}", { a: h.oldValue, b: h.newValue || "—" }) : tt("Agent assigned: {b}", { b: h.newValue || "—" });
        default: {
          const field = tt(FIELD_LABELS[h.fieldName] || h.fieldName || "Order");
          if (h.oldValue == null && h.newValue == null) return tt("{f} changed", { f: field });
          return tt("{f}: {a} → {b}", { f: field, a: h.oldValue || "—", b: h.newValue || "—" });
        }
      }
    },
  },
};
</script>
