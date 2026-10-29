<template>
  <div class="k-search-select">
    <label v-if="label" :for="inputId" class="k-search-select-label">{{ label }}</label>
    <v-select
      :input-id="inputId"
      :value="selectedValue"
      :options="options"
      :label="labelKey"
      :reduce="reduceOption"
      :filter-by="filterBy"
      :placeholder="$tt(placeholder)"
      :clearable="clearable"
      :searchable="searchable"
      :append-to-body="true"
      :calculate-position="calculatePosition"
      @input="onInput"
    >
      <template #selected-option="option">
        <span class="k-ss-selected">
          <i v-if="statusDots" class="k-ss-dot" :class="dotClass(option[valueKey])"></i>
          {{ $tt(option[labelKey]) }}
        </span>
      </template>
      <template #option="option">
        <div class="k-ss-option">
          <span class="k-ss-name">
            <i v-if="statusDots" class="k-ss-dot" :class="dotClass(option[valueKey])"></i>
            {{ $tt(option[labelKey]) }}
          </span>
          <span v-if="subKey && option[subKey]" class="k-ss-sub">{{ option[subKey] }}</span>
        </div>
      </template>
      <template #no-options="{ search }">
        <span class="k-ss-empty">
          {{ search ? $tt('No matching {noun} for “{q}”', { noun: $tt(noun), q: search }) : $tt('No matching {noun}', { noun: $tt(noun) }) }}
        </span>
      </template>
    </v-select>
  </div>
</template>

<script>
import vSelect from "vue-select";

let uid = 0;

/**
 * Searchable dropdown (wraps vue-select).
 * v-model works like the old <select>: it holds option[valueKey],
 * and an empty selection is `emptyValue` ("" by default).
 */
export default {
  name: "SearchSelect",
  components: { vSelect },
  props: {
    value: { type: [String, Number, Boolean], default: "" },
    options: { type: Array, default: () => [] },
    valueKey: { type: String, default: "id" },
    labelKey: { type: String, default: "name" },
    subKey: { type: String, default: "" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "Search…" },
    noun: { type: String, default: "results" },
    clearable: { type: Boolean, default: true },
    searchable: { type: Boolean, default: true },
    // show a coloured dot per delivery status (DELIVERED, PENDING, ...)
    statusDots: { type: Boolean, default: false },
    emptyValue: { type: [String, Number], default: "" },
  },
  data() {
    uid += 1;
    return { inputId: `k-search-select-${uid}` };
  },
  computed: {
    selectedValue() {
      return this.value === "" || this.value === null || this.value === undefined
        ? null
        : this.value;
    },
  },
  methods: {
    dotClass(val) {
      const v = String(val || "").toUpperCase().replace(/\s+/g, "_");
      const map = {
        DELIVERED: "is-green",
        PENDING: "is-orange",
        UNDER_DELIVERY: "is-blue",
        CANCELED: "is-red",
        CANCELLED: "is-red",
        EXCHANGED: "is-purple",
        FAILED: "is-brown",
      };
      return map[v] || "is-gray";
    },
    reduceOption(option) {
      return option[this.valueKey];
    },
    filterBy(option, label, search) {
      const q = (search || "").toLowerCase().trim();
      if (!q) return true;
      const text = [label, this.subKey ? option[this.subKey] : ""]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.indexOf(q) !== -1;
    },
    onInput(val) {
      this.$emit("input", val === null || val === undefined ? this.emptyValue : val);
    },
    // Dropdown is appended to <body> so it is never clipped by dialogs/cards
    calculatePosition(dropdownList, component, { width, top, left }) {
      dropdownList.style.top = top;
      dropdownList.style.left = left;
      dropdownList.style.width = width;
      dropdownList.style.minWidth = "260px";
    },
  },
};
</script>
