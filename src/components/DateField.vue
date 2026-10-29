<template>
  <div class="k-date-field">
    <label v-if="label" class="k-date-label">{{ label }}</label>
    <date-picker
      :value="value || null"
      type="date"
      value-type="YYYY-MM-DD"
      :format="displayFormat"
      :placeholder="$tt(placeholder)"
      :clearable="clearable"
      :editable="true"
      :shortcuts="shortcutList"
      :lang="$lang === 'ar' ? 'ar' : 'en'"
      :append-to-body="true"
      popup-class="k-date-popup"
      input-class="k-date-input"
      @input="onInput"
    >
      <template #icon-calendar>
        <md-icon>event</md-icon>
      </template>
    </date-picker>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ar";

/**
 * Themed date picker (wraps vue2-datepicker).
 * v-model is a "YYYY-MM-DD" string — the same value a native
 * <input type="date"> produces — and "" when cleared.
 */
export default {
  name: "DateField",
  components: { DatePicker },
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "Select date" },
    clearable: { type: Boolean, default: true },
    displayFormat: { type: String, default: "DD MMM YYYY" },
  },
  data() {
    return {
      shortcuts: [
        { text: "Today", onClick: () => new Date() },
        {
          text: "Yesterday",
          onClick: () => {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            return d;
          },
        },
        {
          text: "7 days ago",
          onClick: () => {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            return d;
          },
        },
      ],
    };
  },
  computed: {
    shortcutList() {
      return this.shortcuts.map((s) => ({ text: this.$tt(s.text), onClick: s.onClick }));
    },
    langAr() {
      return "ar";
    },
  },
  methods: {
    onInput(val) {
      this.$emit("input", val || "");
    },
  },
};
</script>
