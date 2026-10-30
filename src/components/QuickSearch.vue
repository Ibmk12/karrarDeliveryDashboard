<template>
  <transition name="k-qs">
    <div v-if="open" class="k-qs" @mousedown.self="close">
      <div
        class="k-qs-panel"
        data-k-modal
        role="dialog"
        aria-modal="true"
        :aria-label="$tt('Quick search')"
        @keydown="onKey"
      >
        <div class="k-qs-input">
          <md-icon>search</md-icon>
          <input
            ref="input"
            v-model="q"
            type="text"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-expanded="true"
            aria-controls="k-qs-list"
            :aria-activedescendant="flat.length ? 'k-qs-' + active : null"
            :placeholder="$tt('Go to a page, or type an invoice or phone number…')"
          />
          <kbd>Esc</kbd>
        </div>

        <ul id="k-qs-list" ref="list" class="k-qs-list" role="listbox">
          <template v-for="g in groups">
            <li :key="'g-' + g.name" class="k-qs-group" role="presentation">{{ $tt(g.name) }}</li>
            <li
              v-for="item in g.items"
              :id="'k-qs-' + item.i"
              :key="'i-' + item.i"
              role="option"
              :aria-selected="item.i === active ? 'true' : 'false'"
              :class="{ active: item.i === active }"
              @mousemove="active = item.i"
              @click="run(item)"
            >
              <span class="k-qs-icon"><md-icon>{{ item.icon }}</md-icon></span>
              <span class="k-qs-label">{{ item.label }}</span>
              <small v-if="item.hint">{{ item.hint }}</small>
              <md-icon class="k-qs-go">keyboard_return</md-icon>
            </li>
          </template>
          <li v-if="!flat.length" class="k-qs-empty" role="presentation">{{ $tt('No matches') }}</li>
        </ul>

        <footer class="k-qs-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> {{ $tt('to move') }}</span>
          <span><kbd>Enter</kbd> {{ $tt('to open') }}</span>
          <span><kbd>{{ modKey }}</kbd><kbd>K</kbd> {{ $tt('to open search') }}</span>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
const PAGES = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard", admin: true, words: "home kpi charts" },
  { label: "Orders", icon: "content_paste", to: "/orders", words: "deliveries invoices" },
  { label: "Delivery Agents", icon: "delivery_dining", to: "/delivery-agents", words: "drivers riders" },
  { label: "Traders", icon: "people", to: "/traders", words: "merchants shops" },
  { label: "Users", icon: "group", to: "/users", admin: true, words: "accounts admins" },
  { label: "Reports", icon: "assessment", to: "/reports", words: "daily export excel" },
  { label: "Traders Financial Report", icon: "account_balance", to: "/traders-financial-report", admin: true, words: "finance money" },
];

export default {
  name: "QuickSearch",
  data() {
    return { open: false, q: "", active: 0 };
  },
  computed: {
    modKey() {
      return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl";
    },
    groups() {
      const q = this.q.trim();
      const ql = q.toLowerCase();
      const groups = [];
      let i = 0;
      const add = (name, items) => {
        if (!items.length) return;
        groups.push({ name, items: items.map((it) => ({ ...it, i: i++ })) });
      };

      const pages = PAGES.filter((p) => !p.admin || this.$isAdmin)
        .map((p) => ({ ...p, en: p.label.toLowerCase(), label: this.$tt(p.label), hint: p.to === this.$route.path ? this.$tt("You are here") : "" }))
        .filter((p) => !ql || p.label.toLowerCase().includes(ql) || p.en.includes(ql) || p.words.includes(ql) || p.to.includes(ql))
        .map((p) => ({ ...p, run: () => this.go(p.to) }));
      add("Pages", pages);

      // look up orders
      if (q) {
        const finds = [];
        const digits = q.replace(/[\s+-]/g, "");
        finds.push({
          label: this.$tt("Orders with invoice “{q}”", { q }),
          icon: "receipt_long",
          run: () => this.goOrders("invoiceNo", q),
        });
        if (/^\d{4,}$/.test(digits)) {
          finds.push({
            label: this.$tt("Orders for customer phone {q}", { q: digits }),
            icon: "phone",
            run: () => this.goOrders("customerPhoneNo", digits),
          });
        }
        add("Find orders", finds);
      }


      const actions = [
        {
          label: this.$tt(this.$theme === "dark" ? "Switch to light mode" : "Switch to dark mode"),
          icon: this.$theme === "dark" ? "light_mode" : "dark_mode",
          words: "theme dark light night",
          run: () => this.$toggleTheme(),
        },
        {
          label: this.$lang === "ar" ? "English" : "العربية",
          icon: "translate",
          words: "language arabic english عربي",
          run: () => this.$setLang(this.$lang === "ar" ? "en" : "ar"),
        },
      ].filter((a) => !ql || a.label.toLowerCase().includes(ql) || a.words.includes(ql));
      add("Actions", actions);
      return groups;
    },
    flat() {
      return this.groups.reduce((all, g) => all.concat(g.items), []);
    },
  },
  watch: {
    q() {
      this.active = 0;
    },
    active() {
      this.$nextTick(() => {
        const el = this.$refs.list && this.$refs.list.querySelector(".active");
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
      });
    },
  },
  mounted() {
    this.onGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        this.open ? this.close() : this.show();
      }
    };
    this.onOpenEvent = () => this.show();
    document.addEventListener("keydown", this.onGlobalKey);
    window.addEventListener("k-quick-search", this.onOpenEvent);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onGlobalKey);
    window.removeEventListener("k-quick-search", this.onOpenEvent);
  },
  methods: {
    show() {
      this.q = "";
      this.active = 0;
      this.open = true;
      this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
    },
    close() {
      this.open = false;
    },
    onKey(e) {
      const n = this.flat.length;
      if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (n) this.active = (this.active + 1) % n;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (n) this.active = (this.active - 1 + n) % n;
      } else if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        const item = this.flat[this.active];
        if (item) this.run(item);
      }
    },
    run(item) {
      this.close();
      item.run();
    },
    go(path) {
      if (this.$route.path !== path) this.$router.push(path);
    },
    goOrders(key, value) {
      const route = this.$route;
      if (route.path === "/orders") {
        // already on Orders: change the filters in place and search
        const record = route.matched[route.matched.length - 1];
        const vm = record && record.instances && record.instances.default;
        if (vm && vm.filters && typeof vm.applyFilters === "function") {
          Object.keys(vm.filters).forEach((k) => {
            if (typeof vm.filters[k] === "string" || vm.filters[k] === null) vm.filters[k] = "";
          });
          vm.$set(vm.filters, key, value);
          vm.applyFilters();
          return;
        }
      }
      this.$router.push({ path: "/orders", query: { [key]: value } });
    },
  },
};
</script>
