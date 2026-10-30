<template>
  <div class="k-kpis k-kpis-v2">
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
          <template v-else-if="summary">{{ Math.round(display[kpi.key] || 0) }}</template>
          <template v-else>—</template>
        </div>
        <div class="k-kpi-hint">
          <template v-if="!loading && summary && kpi.trend">
            <span class="k-trend" :class="kpi.trend.cls">{{ kpi.trend.arrow }} {{ kpi.trend.text }}</span>
            {{ $tt(kpi.trend.vs) }}
          </template>
          <template v-else>{{ $tt(kpi.hint) }}</template>
        </div>
      </div>
    </component>

    <!-- money: revenue (delivery fees) + net profit of delivered orders this month -->
    <router-link to="/reports" class="k-kpi k-kpi-money is-navy" :style="{ animationDelay: kpis.length * 0.06 + 's' }">
      <div class="k-kpi-icon"><md-icon>payments</md-icon></div>
      <div class="k-kpi-body">
        <div class="k-kpi-label">{{ $tt('{m} so far', { m: monthName }) }}</div>
        <div v-if="loading" class="k-kpi-value"><span class="k-kpi-skeleton"></span></div>
        <div v-else-if="!money" class="k-kpi-value">—</div>
        <div v-else class="k-money-row">
          <div>
            <div class="k-money-lbl">{{ $tt("Revenue") }} <span>· {{ $tt("delivery fees") }}</span></div>
            <div class="k-kpi-value">{{ $options.filters.money(Math.round(display.revenue)) }} <small>{{ $tt("AED") }}</small></div>
            <div class="k-kpi-hint"><span class="k-trend" :class="moneyTrend('revenue').cls">{{ moneyTrend('revenue').arrow }} {{ moneyTrend('revenue').text }}</span> {{ $tt('vs {m}', { m: prevMonthName }) }}</div>
          </div>
          <div class="k-money-sep"></div>
          <div>
            <div class="k-money-lbl">{{ $tt("Net profit") }}</div>
            <div class="k-kpi-value is-profit">{{ $options.filters.money(Math.round(display.netProfit)) }} <small>{{ $tt("AED") }}</small></div>
            <div class="k-kpi-hint"><span class="k-trend" :class="moneyTrend('netProfit').cls">{{ moneyTrend('netProfit').arrow }} {{ moneyTrend('netProfit').text }}</span> {{ $tt('vs {m}', { m: prevMonthName }) }}</div>
          </div>
        </div>
        <div v-if="!loading && money" class="k-margin">
          <span class="k-margin-bar"><span :style="{ width: Math.max(0, Math.min(100, margin)) + '%' }"></span></span>
          {{ $tt('{p}% margin · {a} AED profit / order', { p: Math.round(margin), a: perOrder }) }}
        </div>
        <div v-if="!loading && !money" class="k-kpi-hint">{{ $tt("Couldn't load the money figures.") }}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { DashboardService } from "@/services/DashboardService";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** KPI cards at the top of the dashboard (GET /dashboard/summary and /dashboard/money). */
export default {
  name: "DashboardKpis",
  props: {
    daysThreshold: { type: Number, default: 2 },
  },
  data() {
    return {
      loading: true,
      summary: null,
      money: null,
      display: { today: 0, deliveredToday: 0, underDelivery: 0, delayed: 0, revenue: 0, netProfit: 0 },
    };
  },
  computed: {
    monthName() {
      return this.$tt(MONTHS[new Date().getMonth()]);
    },
    prevMonthName() {
      const d = new Date();
      return this.$tt(MONTHS[(d.getMonth() + 11) % 12]);
    },
    margin() {
      const m = this.money;
      return m && m.revenue ? (m.netProfit / m.revenue) * 100 : 0;
    },
    perOrder() {
      const m = this.money;
      return m && m.deliveredCount ? (Math.round((m.netProfit / m.deliveredCount) * 10) / 10).toLocaleString("en-US") : "0";
    },
    kpis() {
      const s = this.summary || {};
      const today = ymd(new Date());
      return [
        { key: "today", label: "Orders today", hint: "New orders created today", icon: "add_shopping_cart", tone: "orange",
          trend: this.countTrend(s.createdToday, s.createdSameDayLastWeek, this.$tt("vs last {d}", { d: this.$tt(this.weekday()) })),
          to: { path: "/orders", query: { fromOrderDate: today, toOrderDate: today } } },
        { key: "deliveredToday", label: "Delivered today", hint: "Orders delivered today", icon: "task_alt", tone: "green",
          trend: this.countTrend(s.deliveredToday, s.deliveredSameDayLastWeek, this.$tt("vs last {d}", { d: this.$tt(this.weekday()) })),
          to: { path: "/orders", query: { deliveryStatus: "DELIVERED" } } },
        { key: "underDelivery", label: "Under delivery now", hint: "Out with agents right now", icon: "two_wheeler", tone: "blue",
          to: { path: "/orders", query: { deliveryStatus: "UNDER_DELIVERY" } } },
        { key: "delayed", label: "Delayed deliveries", hint: this.$tt("Under delivery for more than {n} days", { n: this.daysThreshold }), icon: "schedule", tone: "amber",
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
    weekday() {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
    },
    /** "▲ 12%" against a previous count (or "▲ 3" when the previous was 0) */
    countTrend(now, before, vs) {
      if (now == null || before == null) return null;
      const diff = now - before;
      const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "•";
      const cls = diff > 0 ? "is-up" : diff < 0 ? "is-down" : "is-flat";
      const text = before ? `${Math.round(Math.abs(diff / before) * 100)}%` : String(Math.abs(diff));
      return { arrow, cls, text, vs };
    },
    moneyTrend(key) {
      const m = this.money || {};
      const t = this.countTrend(m[key], m.previous ? m.previous[key] : null, "");
      return t || { arrow: "", cls: "", text: "" };
    },
    async load() {
      this.loading = true;
      const [summary, money] = await Promise.allSettled([
        DashboardService.getSummary(this.daysThreshold),
        DashboardService.getMoney(),
      ]);
      this.summary = summary.status === "fulfilled" && summary.value ? summary.value : null;
      this.money = money.status === "fulfilled" && money.value ? money.value : null;
      this.loading = false;
      this.countUp({
        today: this.summary ? this.summary.createdToday : 0,
        deliveredToday: this.summary ? this.summary.deliveredToday : 0,
        underDelivery: this.summary ? this.summary.underDelivery : 0,
        delayed: this.summary ? this.summary.delayed : 0,
        revenue: this.money ? this.money.revenue : 0,
        netProfit: this.money ? this.money.netProfit : 0,
      });
    },
    scrollToDelayed() {
      const el = document.querySelector(".k-delayed-details");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    // numbers count up from 0 (skipped when the user prefers reduced motion)
    countUp(values) {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const keys = Object.keys(values);
      if (reduce) {
        keys.forEach((k) => (this.display[k] = values[k]));
        return;
      }
      const start = performance.now();
      const dur = 900;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        keys.forEach((k) => (this.display[k] = values[k] * e));
        if (p < 1) requestAnimationFrame(step);
        else keys.forEach((k) => (this.display[k] = values[k]));
      };
      requestAnimationFrame(step);
    },
  },
};
</script>
