<template>
  <md-card class="k-trend-card">
    <md-card-content>
      <div class="k-trend-head">
        <div>
          <h4 class="k-age-title">{{ $tt('Orders per month') }}</h4>
          <p class="k-age-sub">{{ $tt('Last {n} months compared with the same months a year earlier', { n: monthsToDisplay }) }}</p>
        </div>
        <div class="k-trend-legend" aria-hidden="true">
          <span><i class="is-now"></i>{{ $tt('This period') }}</span>
          <span><i class="is-prev"></i>{{ $tt('A year earlier') }}</span>
        </div>
      </div>

      <div class="k-trend-filters">
        <k-search-select
          v-model="monthsToDisplay"
          :options="monthOptions"
          value-key="value"
          label-key="text"
          :searchable="false"
          :clearable="false"
          @input="$nextTick(loadData)"
        ></k-search-select>
        <k-search-select
          v-model="selectedStatus"
          :options="statusOptions"
          value-key="value"
          label-key="text"
          :placeholder="$tt('All statuses')"
          :searchable="false"
          :clearable="false"
          status-dots
          @input="$nextTick(loadData)"
        ></k-search-select>
      </div>

      <div ref="box" class="k-trend-box" @mouseleave="hover = -1">
        <div v-if="loading && !points.length" class="k-age-msg">{{ $tt('Loading…') }}</div>
        <div v-else-if="error" class="k-age-msg">{{ $tt("Couldn't load the monthly numbers.") }}</div>
        <svg
          v-else
          :width="width"
          :height="height"
          :viewBox="`0 0 ${width} ${height}`"
          role="img"
          :aria-label="ariaLabel"
          @mousemove="onMove"
          @touchstart.passive="onMove"
        >
          <defs>
            <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="var(--k-primary)" stop-opacity="0.2" />
              <stop offset="1" stop-color="var(--k-primary)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <!-- grid + y labels -->
          <g v-for="t in ticks" :key="'t' + t">
            <line class="k-trend-grid" :x1="padL" :x2="width - padR" :y1="y(t)" :y2="y(t)" />
            <text class="k-trend-ylbl" :x="padL - 8" :y="y(t) + 4" text-anchor="end">{{ t }}</text>
          </g>
          <!-- x labels -->
          <text
            v-for="(p, i) in points"
            v-show="i % labelStep === 0 || i === points.length - 1"
            :key="'x' + i"
            class="k-trend-xlbl"
            :class="{ 'is-on': i === hover }"
            :x="x(i)"
            :y="height - 8"
            text-anchor="middle"
          >{{ p.short }}</text>
          <!-- last year: dashed grey -->
          <polyline class="k-trend-prev" :points="line('prev')" />
          <!-- this period: orange line + soft area -->
          <path :d="area" :fill="`url(#${gradId})`" />
          <polyline class="k-trend-now" :points="line('now')" />
          <circle
            v-for="(p, i) in points"
            :key="'d' + i"
            class="k-trend-dot"
            :class="{ 'is-on': i === hover }"
            :cx="x(i)"
            :cy="y(p.now)"
            :r="i === hover ? 5.5 : points.length > 14 ? 0 : 3.5"
          />
          <!-- hover guide -->
          <line v-if="hover >= 0" class="k-trend-guide" :x1="x(hover)" :x2="x(hover)" :y1="padT" :y2="height - padB" />
          <circle v-if="hover >= 0" class="k-trend-dot is-prev" :cx="x(hover)" :cy="y(points[hover].prev)" r="4" />
        </svg>

        <div v-if="hover >= 0 && points[hover]" class="k-trend-tip" :style="tipStyle">
          <b>{{ points[hover].long }}</b>
          <div><i class="is-now"></i>{{ $tt('{n} orders', { n: points[hover].now }) }}</div>
          <div><i class="is-prev"></i>{{ $tt('{n} a year earlier', { n: points[hover].prev }) }}</div>
          <div v-if="change(points[hover]) !== null" class="k-trend-chg" :class="change(points[hover]) >= 0 ? 'is-up' : 'is-down'">
            {{ change(points[hover]) >= 0 ? '▲' : '▼' }} {{ Math.abs(change(points[hover])) }}%
          </div>
        </div>
      </div>

      <div class="k-trend-foot">
        <span><md-icon>access_time</md-icon>{{ $tt('updated {t}', { t: lastUpdated }) }}</span>
        <span v-if="totals.prev">
          {{ $tt('Total {a} vs {b}', { a: totals.now.toLocaleString('en-US'), b: totals.prev.toLocaleString('en-US') }) }}
          <b :class="totals.now >= totals.prev ? 'k-trend-up' : 'k-trend-down'">
            {{ totals.now >= totals.prev ? '▲' : '▼' }} {{ Math.abs(Math.round(((totals.now - totals.prev) / totals.prev) * 100)) }}%
          </b>
        </span>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import { OrderService } from "@/services/OrderService";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let uid = 0;

/**
 * Orders per month as a light line chart, with the same months a year earlier
 * as a dashed line (uses GET /orders/count-per-month for months + 12).
 */
export default {
  name: "MonthlyDeliveryChart",
  data() {
    uid += 1;
    return {
      gradId: `k-trend-grad-${uid}`,
      monthsToDisplay: 6, // default: last 6 months
      selectedStatus: "",
      lastUpdated: "-",
      loading: true,
      error: false,
      points: [],
      hover: -1,
      width: 600,
      height: 260,
      padL: 44,
      padR: 16,
      padT: 16,
      padB: 30,
      monthOptions: [
        { value: 6, text: "Last 6 months" },
        { value: 12, text: "Last 12 months" },
        { value: 24, text: "Last 24 months" },
      ],
      statusOptions: [
        { value: "", text: "All statuses" },
        { value: "DELIVERED", text: "Delivered" },
        { value: "UNDER_DELIVERY", text: "Under Delivery" },
        { value: "PENDING", text: "Pending" },
        { value: "CANCELED", text: "Canceled" },
      ],
    };
  },
  computed: {
    max() {
      const m = Math.max(1, ...this.points.map((p) => Math.max(p.now, p.prev)));
      const step = this.niceStep(m);
      return Math.ceil(m / step) * step;
    },
    ticks() {
      const step = this.niceStep(this.max);
      const out = [];
      for (let v = 0; v <= this.max; v += step) out.push(v);
      return out;
    },
    labelStep() {
      const room = (this.width - this.padL - this.padR) / Math.max(1, this.points.length);
      return Math.max(1, Math.ceil(56 / room));
    },
    area() {
      if (!this.points.length) return "";
      const base = this.height - this.padB;
      const pts = this.points.map((p, i) => `${this.x(i)},${this.y(p.now)}`).join(" L");
      return `M${this.x(0)},${base} L${pts} L${this.x(this.points.length - 1)},${base} Z`;
    },
    totals() {
      return this.points.reduce((t, p) => ({ now: t.now + p.now, prev: t.prev + p.prev }), { now: 0, prev: 0 });
    },
    tipStyle() {
      const left = Math.min(Math.max(this.x(this.hover) - 80, 0), this.width - 170);
      return { left: left + "px", top: "8px" };
    },
    ariaLabel() {
      return this.points.map((p) => `${p.long}: ${p.now} (${p.prev})`).join(", ");
    },
  },
  mounted() {
    this.measure();
    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.measure());
      this.ro.observe(this.$refs.box);
    } else {
      window.addEventListener("resize", this.measure);
    }
    this.loadData();
    // month names and the left/right direction follow the language
    this.$watch(() => this.$lang, () => this.loadData());
  },
  beforeDestroy() {
    if (this.ro) this.ro.disconnect();
    window.removeEventListener("resize", this.measure);
  },
  methods: {
    // re-render charts after a refresh from the dashboard
    load() {
      this.loadData();
    },
    measure() {
      const w = this.$refs.box ? this.$refs.box.clientWidth : 0;
      if (w > 0) this.width = w;
    },
    niceStep(max) {
      const raw = max / 4;
      const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
      const n = raw / mag;
      return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
    },
    x(i) {
      const n = Math.max(1, this.points.length - 1);
      const w = this.width - this.padL - this.padR;
      const pos = this.points.length === 1 ? w / 2 : (i / n) * w;
      // right-to-left in Arabic
      return document.documentElement.dir === "rtl" ? this.width - this.padR - pos : this.padL + pos;
    },
    y(v) {
      const h = this.height - this.padT - this.padB;
      return this.padT + h - (v / this.max) * h;
    },
    line(key) {
      return this.points.map((p, i) => `${this.x(i)},${this.y(p[key])}`).join(" ");
    },
    change(p) {
      return p.prev ? Math.round(((p.now - p.prev) / p.prev) * 100) : null;
    },
    onMove(e) {
      if (!this.points.length) return;
      const t = e.touches ? e.touches[0] : e;
      const r = this.$refs.box.getBoundingClientRect();
      const px = t.clientX - r.left;
      let best = 0;
      let dist = Infinity;
      this.points.forEach((p, i) => {
        const d = Math.abs(this.x(i) - px);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      this.hover = best;
    },
    monthKey(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    },
    async loadData() {
      this.loading = true;
      this.error = false;
      this.hover = -1;
      try {
        // ask for 12 extra months so we also get "a year earlier"
        const response = await OrderService.getOrderCountPerMonth(this.monthsToDisplay + 12, this.selectedStatus || null);
        const counts = {};
        ((response && response.data) || []).forEach((r) => (counts[r.month] = Number(r.totalOrders) || 0));
        const now = new Date();
        const points = [];
        for (let i = this.monthsToDisplay - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const prev = new Date(d.getFullYear() - 1, d.getMonth(), 1);
          const name = this.$tt(MONTHS[d.getMonth()]);
          const shortName = this.$lang === "ar" ? name : name.slice(0, 3);
          points.push({
            now: counts[this.monthKey(d)] || 0,
            prev: counts[this.monthKey(prev)] || 0,
            short: this.monthsToDisplay > 12 ? `${shortName} ${String(d.getFullYear()).slice(2)}` : shortName,
            long: `${name} ${d.getFullYear()}`,
          });
        }
        this.points = points;
        this.lastUpdated = new Date().toLocaleTimeString();
      } catch (e) {
        console.error("Error loading monthly delivery data:", e);
        this.error = true;
      } finally {
        this.loading = false;
        this.$nextTick(this.measure);
      }
    },
  },
};
</script>
