<template>
  <div class="k-phone k-phone-field" :class="{ 'has-error': showError }">
    <label v-if="label" class="k-phone-label" :for="inputId">{{ label }}</label>
    <div class="k-phone-row">
      <div class="k-phone-country">
        <k-search-select
          :value="code"
          :options="countries"
          value-key="code"
          label-key="label"
          sub-key="name"
          :searchable="false"
          :clearable="false"
          @input="onCode"
        ></k-search-select>
      </div>
      <div class="k-phone-input">
        <input
          :id="inputId"
          :value="local"
          type="tel"
          inputmode="numeric"
          maxlength="9"
          :placeholder="country.placeholder"
          :aria-invalid="showError ? 'true' : 'false'"
          @input="onLocal"
          @blur="touched = true"
        />
        <span class="k-phone-count">{{ local.length }}/9</span>
      </div>
    </div>
    <p v-if="showError" class="k-phone-hint">
      <md-icon>error</md-icon>
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export const PHONE_COUNTRIES = [
  { code: "971", label: "🇦🇪 +971", name: "UAE", first: ["5"], firstText: "5", placeholder: "5XXXXXXXX" },
  { code: "966", label: "🇸🇦 +966", name: "KSA", first: ["5"], first2: null, firstText: "5", placeholder: "5XXXXXXXX" },
  { code: "249", label: "🇸🇩 +249", name: "Sudan", first: ["9", "1"], firstText: "9 / 1", placeholder: "9XXXXXXXX" },
];

/** "+971501234567" / "0501234567" / "971501234567" -> { code: "971", local: "501234567" } */
export function splitPhone(value) {
  const raw = String(value || "").trim();
  let d = raw.replace(/\D/g, "");
  const international = raw.startsWith("+") || d.startsWith("00");
  if (d.startsWith("00")) d = d.slice(2);
  // "+971..." always carries the code; a bare "971501234567" only when it's long enough
  const c = PHONE_COUNTRIES.find((x) => d.startsWith(x.code) && (international || d.length > 9));
  if (c) return { code: c.code, local: d.slice(c.code.length) };
  if (d.startsWith("0")) d = d.slice(1);
  return { code: "971", local: d };
}

/** true when the number is a full, valid local number for its country */
export function isValidPhone(value) {
  const { code, local } = splitPhone(value);
  const c = PHONE_COUNTRIES.find((x) => x.code === code) || PHONE_COUNTRIES[0];
  return /^\d{9}$/.test(local) && c.first.includes(local[0]);
}

let uid = 0;

/** Country code + 9-digit number, checked as you type. v-model is "+971501234567". */
export default {
  name: "KPhoneInput",
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  data() {
    uid += 1;
    const p = splitPhone(this.value);
    return { inputId: `k-phone-${uid}`, code: p.code, local: p.local, touched: false, lastEmitted: null, countries: PHONE_COUNTRIES };
  },
  computed: {
    country() {
      return this.countries.find((c) => c.code === this.code) || this.countries[0];
    },
    errorText() {
      if (!this.local) return this.$tt("Enter the customer's phone number");
      if (!this.country.first.includes(this.local[0])) return this.$tt("Numbers in {c} start with {d}", { c: this.country.name, d: this.country.firstText });
      if (this.local.length < 9) return this.$tt("Enter 9 digits after +{code} ({n} so far)", { code: this.code, n: this.local.length });
      return "";
    },
    showError() {
      // complain early about a wrong first digit, otherwise once the field is left
      const wrongStart = this.local && !this.country.first.includes(this.local[0]);
      return !!this.errorText && (wrongStart || this.touched);
    },
  },
  watch: {
    value(v) {
      if (v === this.lastEmitted) return; // our own update coming back
      this.touched = false;
      const p = splitPhone(v);
      if (p.local !== this.local || p.code !== this.code) {
        this.code = p.code;
        this.local = p.local;
      }
    },
  },
  methods: {
    onCode(code) {
      this.code = code || "971";
      this.emit();
    },
    onLocal(e) {
      let v = e.target.value.replace(/\D/g, "");
      if (v.startsWith("0")) v = v.slice(1); // people often type the leading 0
      v = v.slice(0, 9);
      e.target.value = v;
      this.local = v;
      this.emit();
    },
    emit() {
      this.lastEmitted = this.local ? `+${this.code}${this.local}` : "";
      this.$emit("input", this.lastEmitted);
    },
    isValid() {
      this.touched = true;
      return !this.errorText;
    },
  },
};
</script>
