<template>
  <div class="k-kpis">
    <component
      :is="kpi.to ? 'router-link' : 'button'"
      v-for="(kpi, i) in kpis"
      :key="kpi.key"
      :to="kpi.to"
      :type="kpi.to ? undefined : 'button'"
      class="k-kpi"
      @click="!kpi.to && scrollToDelayed()"
      :class="'is-' + kpi.tone"
      :style="{ animationDelay: i * 0.06 + 's' }"
    >
      <div class="k-kpi-icon"><md-icon>{{ kpi.icon }}</md-icon></div>
      <div class="k-kpi-body">
        <div class="k-kpi-label">{{ $tt(kpi.label) }}</div>
        <div class="k-kpi-value">
          <span v-if="loading" class="k-kpi-skeleton"></span>
          <template v-else>
            {{ kpi.money ? $options.filters.money(display[kpi.key]) : Math.round(display[kpi.key]) }}
            <small v-if="kpi.money">{{ $tt("AED") }}</small>
          </template>
        </div>
        <div class="k-kpi-hint">{{ $tt(kpi.hint) }}</div>
      </div>
    </component>
  </div>
</template>

<script>
import { OrderService } from "@/services/OrderService";

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const norm = (s) => String(s || "").toUpperCase().replace(/\s+/g, "_");

/** Summary cards at the top of the dashboard (uses existing API endpoints only). */
export default {
  name: "DashboardKpis",
  props: {
    daysThreshold: { type: Number, default: 2 },
  },
  data() {
    return {
      loading: true,
      values: { today: 0, underDelivery: 0, deliveredMonth: 0, netMonth: 0, delayed: 0 },
      display: { today: 0, underDelivery: 0, deliveredMonth: 0, netMonth: 0, delayed: 0 },
    };
  },
  computed: {
    kpis() {
      const today = ymd(new Date());
      return [
        { key: "today", label: "Orders today", hint: "New orders created today", icon: "add_shopping_cart", tone: "orange",
          to: { path: "/orders", query: { fromOrderDate: today, toOrderDate: today } } },
        { key: "underDelivery", label: "Under delivery now", hint: "Out with agents right now", icon: "local_shipping", tone: "blue",
          to: { path: "/orders", query: { deliveryStatus: "UNDER_DELIVERY" } } },
        { key: "deliveredMonth", label: "Delivered this month", hint: "Orders delivered since the 1st", icon: "task_alt", tone: "green",
          to: { path: "/orders", query: { deliveryStatus: "DELIVERED" } } },
        { key: "netMonth", label: "Net company · this month", hint: "From delivered orders", icon: "payments", tone: "navy", money: true,
          to: { path: "/reports" } },
        { key: "delayed", label: "Delayed deliveries", hint: "Over the delay threshold", icon: "schedule", tone: "red",
          to: null },
      ];
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
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const todayStr = ymd(now);
      const v = { today: 0, underDelivery: 0, deliveredMonth: 0, netMonth: 0, delayed: 0 };

      const [month, under, delayed] = await Promise.allSettled([
        OrderService.getAllOrders({ fromOrderDate: ymd(monthStart), toOrderDate: todayStr, page: 0, size: 2000 }),
        OrderService.getAllOrders({ deliveryStatus: "UNDER_DELIVERY", page: 0, size: 1 }),
        OrderService.getDelayedDeliveryOrders(this.daysThreshold),
      ]);

      if (month.status === "fulfilled") {
        const orders = month.value.orders || [];
        orders.forEach((o) => {
          const d = this.$parseApiDate(o.orderDate);
          if (d && ymd(d) === todayStr) v.today += 1;
          if (norm(o.deliveryStatus) === "DELIVERED") {
            v.deliveredMonth += 1;
            v.netMonth += Number(o.netCompanyAmount) || 0;
          }
        });
      }
      if (under.status === "fulfilled") {
        v.underDelivery = (under.value.pagination && under.value.pagination.totalElements) || 0;
      }
      if (delayed.status === "fulfilled") {
        const r = delayed.value || {};
        v.delayed = (r.dataProperties && r.dataProperties.totalElements) || (r.data || []).length || 0;
      }

      this.values = v;
      this.loading = false;
      this.countUp();
    },
    scrollToDelayed() {
      const el = document.querySelector(".k-delayed-details");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    // numbers count up from 0 (skipped when the user prefers reduced motion)
    countUp() {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const keys = Object.keys(this.values);
      if (reduce) {
        keys.forEach((k) => (this.display[k] = this.values[k]));
        return;
      }
      const start = performance.now();
      const dur = 900;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        keys.forEach((k) => (this.display[k] = this.values[k] * e));
        if (p < 1) requestAnimationFrame(step);
        else keys.forEach((k) => (this.display[k] = this.values[k]));
      };
      requestAnimationFrame(step);
    },
  },
};
</script>
