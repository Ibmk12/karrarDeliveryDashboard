<template>
  <div class="k-oform" :class="{ 'is-quick': quick }">
    <!-- quick layout (Add Order): same field order as the old dashboard, 3 per row, for fast keyboard entry -->
    <div v-if="quick" class="k-oform-fields">
      <div class="k-oform-grid is-3 k-oform-quick">
        <k-date-field v-model="form.orderDate" :label="$tt('Order Date')" :placeholder="$tt('Select date')"></k-date-field>
        <k-date-field v-model="form.deliveryDate" :label="$tt('Delivery Date')" :placeholder="$tt('Not delivered yet')"></k-date-field>
        <div class="status-select">
          <label>{{ $tt("Status") }}</label>
          <k-search-select v-model="form.deliveryStatus" :options="statusChoices" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('Select status')"></k-search-select>
        </div>

        <div class="k-ofield">
          <label>{{ $tt("Invoice No") }}</label>
          <input ref="firstInput" v-model="form.invoiceNo" class="k-oinput" type="text" autofocus />
        </div>
        <div class="status-select">
          <label>{{ $tt("Emirate") }}</label>
          <k-search-select v-model="form.emirate" :options="emirateChoices" value-key="value" label-key="label" :clearable="false" :placeholder="$tt('Select emirate')" :noun="$tt('emirates')"></k-search-select>
        </div>
        <k-phone-input ref="phone" v-model="form[phoneKey]" :label="$tt('Customer Phone')"></k-phone-input>

        <div class="status-select">
          <label>{{ $tt("Delivery Agent") }}</label>
          <k-search-select v-model="form.agentId" :options="agents" value-key="id" sub-key="code" :placeholder="$tt('Select agent')" :noun="$tt('agents')"></k-search-select>
        </div>
        <div class="status-select">
          <label>{{ $tt("Trader Name") }}</label>
          <k-search-select v-model="form.traderId" :options="traders" value-key="id" sub-key="code" :placeholder="$tt('Select trader')" :noun="$tt('traders')"></k-search-select>
        </div>
        <div class="k-ofield">
          <label>{{ $tt("Trader Amount") }}</label>
          <div class="k-oinput-wrap"><input v-model="form.traderAmount" class="k-oinput" type="number" step="any" /><span>{{ $tt("AED") }}</span></div>
        </div>

        <div class="k-ofield">
          <label>{{ $tt("Delivery Amount") }}</label>
          <div class="k-oinput-wrap"><input v-model="form.deliveryAmount" class="k-oinput" type="number" step="any" min="0" /><span>{{ $tt("AED") }}</span></div>
        </div>
        <div class="k-ofield">
          <label>{{ $tt("Agent Amount") }}</label>
          <div class="k-oinput-wrap"><input v-model="form.agentAmount" class="k-oinput" type="number" step="any" min="0" /><span>{{ $tt("AED") }}</span></div>
        </div>
        <div class="k-ofield">
          <label>{{ $tt("Address") }}</label>
          <input v-model="form.address" class="k-oinput" type="text" />
        </div>

        <div class="k-ofield k-span-2">
          <label>{{ $tt("Comment") }}</label>
          <input v-model="form.comment" class="k-oinput" type="text" />
        </div>
      </div>

      <!-- one-line live summary -->
      <div class="k-qsum" aria-live="polite">
        <span>{{ $tt("Customer pays") }} <b>{{ money(total) }} {{ $tt("AED") }}</b></span>
        <span>{{ $tt("Agent earns") }} <b>{{ money(agent) }}</b></span>
        <span>{{ $tt("Company net") }} <b :class="net < 0 ? 'is-bad' : 'is-good'">{{ money(net) }}</b></span>
        <span class="k-qsum-check" :class="checkClass"><md-icon>{{ checkIcon }}</md-icon>{{ $tt(checkText) }}</span>
      </div>
    </div>

    <div v-else class="k-oform-fields">
      <!-- customer -->
      <section class="k-oform-sec">
        <h5><md-icon>person</md-icon>{{ $tt("Customer") }}</h5>
        <div class="k-oform-grid">
          <k-phone-input ref="phone" v-model="form[phoneKey]" :label="$tt('Customer Phone')"></k-phone-input>
          <div class="status-select">
            <label>{{ $tt("Emirate") }}</label>
            <k-search-select v-model="form.emirate" :options="emirateChoices" value-key="value" label-key="label" :clearable="false" :placeholder="$tt('Select emirate')" :noun="$tt('emirates')"></k-search-select>
          </div>
          <div class="k-ofield k-span-2">
            <label>{{ $tt("Address") }}</label>
            <input v-model="form.address" class="k-oinput" type="text" />
          </div>
        </div>
      </section>

      <!-- delivery -->
      <section class="k-oform-sec">
        <h5><md-icon>local_shipping</md-icon>{{ $tt("Delivery") }}</h5>
        <div class="k-oform-grid">
          <div class="k-ofield">
            <label>{{ $tt("Invoice No") }}</label>
            <input v-model="form.invoiceNo" class="k-oinput" type="text" />
          </div>
          <div class="status-select">
            <label>{{ $tt("Status") }}</label>
            <k-search-select v-model="form.deliveryStatus" :options="statusChoices" value-key="value" label-key="label" :searchable="false" :clearable="false" status-dots :noun="$tt('statuses')" :placeholder="$tt('Select status')"></k-search-select>
          </div>
          <div class="status-select">
            <label>{{ $tt("Trader Name") }}</label>
            <k-search-select v-model="form.traderId" :options="traders" value-key="id" sub-key="code" :placeholder="$tt('Select trader')" :noun="$tt('traders')"></k-search-select>
          </div>
          <div class="status-select">
            <label>{{ $tt("Delivery Agent") }}</label>
            <k-search-select v-model="form.agentId" :options="agents" value-key="id" sub-key="code" :placeholder="$tt('Select agent')" :noun="$tt('agents')"></k-search-select>
          </div>
          <k-date-field v-model="form.orderDate" :label="$tt('Order Date')" :placeholder="$tt('Select date')"></k-date-field>
          <k-date-field v-model="form.deliveryDate" :label="$tt('Delivery Date')" :placeholder="$tt('Not delivered yet')"></k-date-field>
        </div>
      </section>

      <!-- amounts -->
      <section class="k-oform-sec">
        <h5><md-icon>payments</md-icon>{{ $tt("Amounts") }}</h5>
        <div class="k-oform-grid is-3">
          <div class="k-ofield">
            <label>{{ $tt("Trader Amount") }}</label>
            <div class="k-oinput-wrap"><input v-model="form.traderAmount" class="k-oinput" type="number" step="any" /><span>{{ $tt("AED") }}</span></div>
          </div>
          <div class="k-ofield">
            <label>{{ $tt("Delivery Fee") }}</label>
            <div class="k-oinput-wrap"><input v-model="form.deliveryAmount" class="k-oinput" type="number" step="any" min="0" /><span>{{ $tt("AED") }}</span></div>
          </div>
          <div class="k-ofield">
            <label>{{ $tt("Agent Fee") }}</label>
            <div class="k-oinput-wrap"><input v-model="form.agentAmount" class="k-oinput" type="number" step="any" min="0" /><span>{{ $tt("AED") }}</span></div>
          </div>
        </div>
      </section>

      <div class="k-ofield">
        <label>{{ $tt("Comment") }}</label>
        <input v-model="form.comment" class="k-oinput" type="text" />
      </div>
    </div>

    <!-- live summary -->
    <aside v-if="!quick" class="k-oform-sum" aria-live="polite">
      <h5>{{ $tt("Summary") }}</h5>
      <div class="k-sline"><span>{{ $tt("Trader Amount") }}</span><b>{{ money(trader) }}</b></div>
      <div class="k-sline"><span>+ {{ $tt("Delivery Fee") }}</span><b>{{ money(delivery) }}</b></div>
      <div class="k-sline is-total"><span>{{ $tt("Customer pays") }}</span><b>{{ money(total) }} <small>{{ $tt("AED") }}</small></b></div>
      <div class="k-sline"><span>{{ $tt("Agent earns") }}</span><b>{{ money(agent) }}</b></div>
      <div class="k-sline"><span>{{ $tt("Company net") }}</span><b :class="net < 0 ? 'is-bad' : 'is-good'">{{ money(net) }}</b></div>
      <div class="k-sum-check" :class="checkClass">
        <md-icon>{{ checkIcon }}</md-icon>
        <span>{{ $tt(checkText) }}</span>
      </div>
    </aside>
  </div>
</template>

<script>
import { displayMoney } from "@/plugins/ui";
import KPhoneInput from "./PhoneInput.vue";

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

/**
 * The order fields grouped as Customer / Delivery / Amounts, with a live money summary.
 * v-model-ish: edits the object passed as `value` in place (same as the old forms did).
 */
export default {
  name: "OrderForm",
  components: { KPhoneInput },
  props: {
    value: { type: Object, required: true },
    phoneKey: { type: String, default: "customerPhoneNo" },
    // flat 3-per-row layout in the old dashboard's order (Add Order)
    quick: { type: Boolean, default: false },
    agents: { type: Array, default: () => [] },
    traders: { type: Array, default: () => [] },
    statusOptions: { type: Array, default: () => [] },
    emirateOptions: { type: Array, default: () => [] },
  },
  data() {
    // same object as `value` (the parent's order); edited in place
    return { form: this.value };
  },
  watch: {
    value(v) {
      this.form = v;
    },
  },
  computed: {
    statusChoices() {
      return this.statusOptions.filter((o) => o.value);
    },
    emirateChoices() {
      return this.emirateOptions.filter((o) => o.value);
    },
    trader() {
      return num(this.form.traderAmount);
    },
    delivery() {
      return num(this.form.deliveryAmount);
    },
    agent() {
      return num(this.form.agentAmount);
    },
    // same rules as the backend (OrderServiceImpl.calculateOrderAmounts)
    total() {
      return this.trader + this.delivery;
    },
    net() {
      return this.delivery - this.agent;
    },
    problem() {
      if (this.form.deliveryAmount === "" || this.form.deliveryAmount == null) return "Enter the delivery fee";
      if (this.agent > this.delivery) return "The agent fee is higher than the delivery fee";
      if (this.trader < 0 || this.delivery < 0 || this.agent < 0) return "Amounts can't be negative";
      return "";
    },
    checkText() {
      return this.problem || "Amounts add up";
    },
    checkClass() {
      return this.problem ? "is-warn" : "is-ok";
    },
    checkIcon() {
      return this.problem ? "warning_amber" : "check_circle";
    },
  },
  methods: {
    money(v) {
      return displayMoney(v);
    },
    /** call before saving */
    focusFirst() {
      if (this.$refs.firstInput) this.$refs.firstInput.focus();
    },
    isValid() {
      return this.$refs.phone ? this.$refs.phone.isValid() : true;
    },
  },
};
</script>
