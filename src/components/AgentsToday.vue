<template>
  <md-card class="k-agents-card">
    <md-card-content>
      <div class="k-age-head">
        <div>
          <h4 class="k-age-title">{{ $tt("Agents today") }}</h4>
          <p class="k-age-sub">{{ $tt("Deliveries done today and cash each agent still has to hand over") }}</p>
        </div>
        <button type="button" class="k-age-all" :disabled="loading" @click="load">
          <md-icon>refresh</md-icon>{{ $tt("Refresh") }}
        </button>
      </div>

      <div v-if="loading && !rows.length" class="k-age-msg">{{ $tt("Loading…") }}</div>
      <div v-else-if="error" class="k-age-msg">{{ $tt("Couldn't load agents.") }}</div>
      <div v-else-if="!rows.length" class="k-age-msg">{{ $tt("No agent activity today yet.") }}</div>
      <div v-else class="k-agents-table" role="table">
        <div class="k-agents-tr is-head" role="row">
          <span role="columnheader">{{ $tt("Agent") }}</span>
          <span role="columnheader" class="r">{{ $tt("Assigned today") }}</span>
          <span role="columnheader" class="r">{{ $tt("Delivered today") }}</span>
          <span role="columnheader" class="r">{{ $tt("Under delivery") }}</span>
          <span role="columnheader">{{ $tt("Progress") }}</span>
          <span role="columnheader" class="r">{{ $tt("Cash to collect (AED)") }}</span>
        </div>
        <div v-for="a in rows" :key="a.agentId" class="k-agents-tr" role="row">
          <span role="cell" class="k-agents-name">
            <span class="k-initials" :class="'tone-' + (a.agentId % 5)">{{ initials(a.agentName) }}</span>
            <span>
              <b>{{ a.agentName }}</b>
              <a v-if="a.phoneNumber" :href="'tel:' + a.phoneNumber" dir="ltr">{{ a.phoneNumber }}</a>
            </span>
          </span>
          <span role="cell" class="r" :data-label="$tt('Assigned today')">{{ a.assignedToday }}</span>
          <span role="cell" class="r" :data-label="$tt('Delivered today')">{{ a.deliveredToday }}</span>
          <span role="cell" class="r" :data-label="$tt('Under delivery')">{{ a.underDelivery }}</span>
          <span role="cell" class="k-agents-prog" :data-label="$tt('Progress')">
            <span class="k-margin-bar"><span :style="{ width: progress(a) + '%' }"></span></span>
            {{ progress(a) }}%
          </span>
          <span role="cell" class="r k-agents-cash" :data-label="$tt('Cash to collect (AED)')">{{ a.cashToCollect | money }}</span>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import { DashboardService } from "@/services/DashboardService";

/** Per agent: today's deliveries and cash to collect (GET /dashboard/agents-today). */
export default {
  name: "AgentsToday",
  data() {
    return { loading: true, error: false, rows: [] };
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = false;
      try {
        this.rows = await DashboardService.getAgentsToday();
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    // delivered today out of everything they handled today (delivered + still out)
    progress(a) {
      const total = (a.deliveredToday || 0) + (a.underDelivery || 0);
      return total ? Math.round((a.deliveredToday / total) * 100) : 0;
    },
    initials(name) {
      const p = String(name || "").trim().split(/\s+/).filter(Boolean);
      return p.length ? (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase() : "—";
    },
  },
};
</script>
