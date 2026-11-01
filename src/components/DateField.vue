<template>
  <div class="k-date-field">
    <label v-if="label" class="k-date-label">{{ label }}</label>
    <date-picker
      ref="picker"
      :value="value || null"
      type="date"
      value-type="YYYY-MM-DD"
      :format="displayFormat"
      :placeholder="$tt(placeholder)"
      :clearable="clearable"
      :editable="true"
      :lang="$lang === 'ar' ? 'ar' : 'en'"
      :append-to-body="true"
      :get-classes="dayClasses"
      :disabled-date="isOutOfRange"
      popup-class="k-date-popup"
      input-class="k-date-input"
      @input="onInput"
    >
      <template #icon-calendar>
        <md-icon>event</md-icon>
      </template>

      <!-- quick picks above the month -->
      <template #header="{ emit }">
        <div class="k-cal-quick">
          <button
            v-for="q in quickList"
            :key="q.key"
            type="button"
            class="k-cal-chip"
            :class="{ 'is-on': q.on, 'is-off': q.off }"
            :disabled="q.off"
            @click="emit(q.date, 'date')"
          >
            {{ q.text }}
          </button>
        </div>
      </template>

      <!-- the picked day in words, the length of the range, and Clear -->
      <template #footer>
        <div class="k-cal-foot">
          <span class="k-cal-picked" :class="{ 'is-empty': !value }">
            <md-icon>{{ value ? "event_available" : "event" }}</md-icon>
            <span>{{ pickedText }}</span>
            <em v-if="rangeDays" class="k-cal-span">{{ rangeDays }}</em>
          </span>
          <button v-if="value && clearable" type="button" class="k-cal-clear" @click="clearDate">
            {{ $tt("Clear") }}
          </button>
        </div>
      </template>
    </date-picker>
    <small v-if="hint" class="k-date-hint">{{ hint }}</small>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ar";

const DAY = 86400000;

/** "YYYY-MM-DD" → local Date at midnight (null when empty or invalid) */
function parse(s) {
  if (!s) return null;
  const [y, m, d] = String(s).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Themed date picker (wraps vue2-datepicker).
 * v-model is a "YYYY-MM-DD" string — the same value a native
 * <input type="date"> produces — and "" when cleared.
 *
 * Pair two fields into a range by giving the "from" field `range-end`
 * (the "to" value) and the "to" field `range-start` (the "from" value):
 * the days in between are shaded, the other end is outlined, and days
 * on the wrong side of the other end can't be picked.
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
    hint: { type: String, default: "" },
    rangeStart: { type: String, default: "" },
    rangeEnd: { type: String, default: "" },
  },
  computed: {
    picked() {
      return parse(this.value);
    },
    // the two ends of the range this field belongs to (either may be missing)
    lo() {
      return this.rangeStart ? parse(this.rangeStart) : this.picked;
    },
    hi() {
      return this.rangeStart ? this.picked : parse(this.rangeEnd);
    },
    otherEnd() {
      return parse(this.rangeStart || this.rangeEnd);
    },
    quickList() {
      const today = startOfDay(new Date());
      const back = (n) => new Date(today.getTime() - n * DAY);
      const list = [
        { key: "today", text: this.$tt("Today"), date: today },
        { key: "yesterday", text: this.$tt("Yesterday"), date: back(1) },
        { key: "week", text: this.$tt("7 days ago"), date: back(7) },
        { key: "month", text: this.$tt("Start of month"), date: new Date(today.getFullYear(), today.getMonth(), 1) },
      ];
      const pickedTime = this.picked && this.picked.getTime();
      return list.map((q) => ({ ...q, on: q.date.getTime() === pickedTime, off: this.isOutOfRange(q.date) }));
    },
    locale() {
      // Latin digits, the same as the date in the box
      return this.$lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB";
    },
    pickedText() {
      if (!this.picked) return this.$tt("No date selected");
      return new Intl.DateTimeFormat(this.locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(this.picked);
    },
    rangeDays() {
      if (!this.lo || !this.hi || this.hi < this.lo) return "";
      const n = Math.round((this.hi - this.lo) / DAY) + 1;
      return n === 1 ? this.$tt("1 day") : `${n} ${this.$tt("days")}`;
    },
  },
  methods: {
    onInput(val) {
      this.$emit("input", val || "");
    },
    clearDate() {
      const p = this.$refs.picker;
      p.clear();
      p.closePopup();
    },
    // a "to" field can't go before its "from", and the other way round
    isOutOfRange(date) {
      if (this.rangeStart) {
        const s = parse(this.rangeStart);
        return !!s && date < s;
      }
      if (this.rangeEnd) {
        const e = parse(this.rangeEnd);
        return !!e && date > e;
      }
      return false;
    },
    dayClasses(date) {
      if (!this.lo || !this.hi || this.hi < this.lo) {
        return this.otherEnd && date.getTime() === this.otherEnd.getTime() ? ["k-range-edge"] : [];
      }
      const t = date.getTime();
      const out = [];
      const lo = this.lo.getTime();
      const hi = this.hi.getTime();
      if (t > lo && t < hi) out.push("k-in-range");
      if (lo !== hi) {
        if (t === lo) out.push("k-range-start");
        if (t === hi) out.push("k-range-end");
      }
      if (this.otherEnd && t === this.otherEnd.getTime()) out.push("k-range-edge");
      return out;
    },
  },
};
</script>
