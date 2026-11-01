<template>
  <!-- One button that shows the language you can switch to: "عربي" in English, "EN" in Arabic -->
  <button
    type="button"
    class="k-lang-btn"
    :class="{ 'is-dark': dark }"
    :lang="target"
    :aria-label="target === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'"
    :title="target === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'"
    @click="$setLang(target)"
  >
    <md-icon class="k-lang-globe">language</md-icon>
    <transition name="k-lang-swap" mode="out-in">
      <span :key="target" class="k-lang-label">{{ target === "ar" ? "عربي" : "EN" }}</span>
    </transition>
  </button>
</template>

<script>
export default {
  name: "LangToggle",
  props: {
    /** light text for dark backgrounds (phone menu) */
    dark: { type: Boolean, default: false },
  },
  computed: {
    target() {
      return this.$lang === "ar" ? "en" : "ar";
    },
  },
};
</script>
