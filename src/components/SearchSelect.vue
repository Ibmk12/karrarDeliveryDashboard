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
        <span class="k-ss-selected" :class="option.tone ? 'tone-' + option.tone : ''">
          <md-icon v-if="option.icon" class="k-ss-sel-ico">{{ option.icon }}</md-icon>
          <i v-if="statusDots" class="k-ss-dot" :class="dotClass(option[valueKey], option)"></i>
          {{ $tt(option[labelKey]) }}
        </span>
      </template>
      <template #option="option">
        <!-- rich option: coloured icon tile, name and a one-line description -->
        <div v-if="option.icon" class="k-ss-option is-rich" :class="option.tone ? 'tone-' + option.tone : ''">
          <span class="k-ss-ico"><md-icon>{{ option.icon }}</md-icon></span>
          <span class="k-ss-text">
            <span class="k-ss-name">{{ $tt(option[labelKey]) }}</span>
            <span v-if="option.desc" class="k-ss-desc">{{ $tt(option.desc) }}</span>
          </span>
          <md-icon class="k-ss-check">check_circle</md-icon>
        </div>
        <div v-else class="k-ss-option">
          <span class="k-ss-name">
            <i v-if="statusDots" class="k-ss-dot" :class="dotClass(option[valueKey], option)"></i>
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
    // show a coloured dot per delivery status (DELIVERED, PENDING, ...), or per option.dot
    statusDots: { type: Boolean, default: false },
    emptyValue: { type: [String, Number], default: "" },
    // extra class on the dropdown list (it is appended to <body>), for per-list styling
    menuClass: { type: String, default: "" },
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
    /** dot colour: the option's own `dot` ("green", "red" …) or the delivery status colour */
    dotClass(val, option) {
      if (option && option.dot) return "is-" + option.dot;
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
      if (this.menuClass) dropdownList.classList.add(this.menuClass);
    },
  },
};
</script>
