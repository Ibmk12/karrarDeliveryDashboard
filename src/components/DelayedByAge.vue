<template>
  <md-card class="k-age-card">
    <md-card-content>
      <div class="k-age-head">
        <div>
          <h4 class="k-age-title">{{ $tt("Delayed deliveries") }}</h4>
          <p class="k-age-sub">{{ $tt("Under delivery for more than {n} days", { n: daysThreshold }) }}</p>
        </div>
        <router-link class="k-age-all" :to="{ path: '/orders', query: delayedQuery }">{{ $tt("View all {n}", { n: orders.length }) }}</router-link>
      </div>

      <div v-if="loading" class="k-age-msg">{{ $tt("Loading…") }}</div>
      <div v-else-if="error" class="k-age-msg">{{ $tt("Couldn't load delayed orders.") }}</div>
      <div v-else-if="!orders.length" class="k-age-msg is-good"><md-icon>check_circle</md-icon>{{ $tt("No delayed deliveries") }}</div>
      <template v-else>
        <div v-for="b in buckets" :key="b.key" class="k-age-row">
          <span class="k-age-lbl">{{ $tt(b.label) }}</span>
          <span class="k-age-bar"><span :class="'is-' + b.key" :style="{ width: (b.count / maxCount) * 100 + '%' }"></span></span>
          <b>{{ b.count }}</b>
        </div>
        <div class="k-age-old">
          <div class="k-age-oldhead">{{ $tt("Oldest first") }}</div>
          <button v-for="o in oldest" :key="o.orderId || o.invoiceNo" type="button" class="k-age-item" @click="$emit('open', o)">
            <b>#{{ o.orderId || o.invoiceNo }}</b>
            <span>{{ [o.traderName, o.agentName].filter(Boolean).join(" · ") }}</span>
            <em>{{ $tt("{n} days", { n: o.days }) }}</em>
          </button>
        </div>
      </template>
    </md-card-content>
  </md-card>
</template>

<script>
import { OrderService } from "@/services/OrderService";

/** Delayed orders grouped by how long they've been under delivery (existing "longer-than" API). */
export default {
  name: "DelayedByAge",
  props: {
    daysThreshold: { type: Number, default: 2 },
  },
  data() {
    return { loading: true, error: false, orders: [] };
  },
  computed: {
    buckets() {
      const b = [
        { key: "a", label: "3–5 days", min: 0, max: 5, count: 0 },
        { key: "b", label: "6–10 days", min: 6, max: 10, count: 0 },
        { key: "c", label: "10+ days", min: 11, max: Infinity, count: 0 },
      ];
      this.orders.forEach((o) => {
        const x = b.find((k) => o.days >= k.min && o.days <= k.max);
        if (x) x.count += 1;
      });
      if (this.daysThreshold > 2) b[0].label = this.$tt("{a}–5 days", { a: this.daysThreshold + 1 });
      return b;
    },
    maxCount() {
      return Math.max(1, ...this.buckets.map((b) => b.count));
    },
    oldest() {
      return [...this.orders].sort((a, b) => b.days - a.days).slice(0, 3);
    },
    delayedQuery() {
      const t = new Date();
      const last = new Date(t.getFullYear(), t.getMonth(), t.getDate() - this.daysThreshold - 1);
      const p = (n) => String(n).padStart(2, "0");
      return { deliveryStatus: "UNDER_DELIVERY", toOrderDate: `${last.getFullYear()}-${p(last.getMonth() + 1)}-${p(last.getDate())}` };
    },
  },
  watch: {
    daysThreshold() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = false;
      try {
        const r = await OrderService.getDelayedDeliveryOrders(this.daysThreshold);
        const list = (r && r.data) || [];
        this.orders = list.map((o) => ({
          ...o,
          orderId: o.orderId || o.id,
          agentName: o.agentName || o.deliveryAgent,
          days: this.daysSince(o.orderDate),
        }));
      } catch (e) {
        this.error = true;
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    daysSince(value) {
      const d = this.$parseApiDate(value);
      if (!d) return 0;
      const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const n = new Date();
      const b = new Date(n.getFullYear(), n.getMonth(), n.getDate());
      return Math.max(0, Math.round((b - a) / 86400000));
    },
  },
};
</script>
