/**
 * Keeps list filters and the current page in the URL query string, so a
 * refresh or a shared link opens the same view.
 *
 * Works for the page components below without touching their code:
 *  - before the page loads, values from the URL are copied into its `filters`
 *    (and `pagination.pageNumber`);
 *  - whenever the page shows a new set of results, the applied filters are
 *    written back to the URL (router.replace, so Back still works normally).
 */
const PAGES = {
  "/orders": {
    list: "filteredOrders",
    keys: ["invoiceNo", "fromOrderDate", "toOrderDate", "customerPhoneNo", "totalAmount", "deliveryStatus", "traderName"],
  },
  "/traders": {
    list: "filteredTraders",
    keys: ["name", "phoneNumber", "email", "deleted"],
    booleans: ["deleted"],
    defaults: { deleted: false },
  },
  "/delivery-agents": { list: "filteredAgents", keys: ["name", "phoneNumber", "email"] },
  "/reports": { list: "reportData.orderList", keys: ["traderName", "fromDeliveryDate", "toDeliveryDate"], autoApply: "applyFilters" },
};

const get = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

function configFor(vm) {
  const route = vm.$route;
  if (!route || !route.matched.length) return null;
  const record = route.matched[route.matched.length - 1];
  if (!record.instances || record.instances.default !== vm) return null;
  return PAGES[route.path] || null;
}

export default {
  install(Vue) {
    Vue.mixin({
      created() {
        const cfg = configFor(this);
        if (!cfg || !this.filters) return;
        this.__urlState = cfg;
        const q = this.$route.query || {};
        let hasFilter = false;

        cfg.keys.forEach((k) => {
          if (q[k] === undefined) return;
          let v = q[k];
          if ((cfg.booleans || []).includes(k)) v = v === "true" ? true : v === "false" ? false : "";
          this.$set(this.filters, k, v);
          hasFilter = true;
        });
        const page = parseInt(q.page, 10);
        if (page > 1 && this.pagination) this.pagination.pageNumber = page - 1;

        // pages that don't load on open (Reports) run their search when the URL has filters
        if (cfg.autoApply && hasFilter && typeof this[cfg.autoApply] === "function") {
          this.$nextTick(() => this[cfg.autoApply]());
        }

        this.$watch(
          () => get(this, cfg.list),
          () => this.__writeUrlState()
        );
      },
      methods: {
        __writeUrlState() {
          const cfg = this.__urlState;
          if (!cfg) return;
          const query = {};
          cfg.keys.forEach((k) => {
            const v = this.filters[k];
            if (v === "" || v === null || v === undefined) return;
            if (cfg.defaults && cfg.defaults[k] === v) return;
            query[k] = String(v);
          });
          const pageNo = this.pagination ? this.pagination.pageNumber : 0;
          if (pageNo > 0) query.page = String(pageNo + 1);
          const current = JSON.stringify(this.$route.query || {});
          if (JSON.stringify(query) !== current) {
            this.$router.replace({ path: this.$route.path, query }).catch(() => {});
          }
        },
      },
    });
  },
};
