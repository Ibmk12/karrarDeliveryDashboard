<template>
  <transition name="k-confirm-fade">
    <div v-if="visible" class="k-confirm-overlay" @mousedown.self="answer(false)">
      <div
        class="k-confirm"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="'k-confirm-title'"
        @keydown.esc.prevent="answer(false)"
      >
        <div class="k-confirm-icon" :class="{ 'is-danger': danger }">
          <md-icon>{{ icon || (danger ? "delete_outline" : "help_outline") }}</md-icon>
        </div>
        <h3 id="k-confirm-title" class="k-confirm-title">{{ title }}</h3>
        <p v-if="message" class="k-confirm-message">{{ message }}</p>
        <div class="k-confirm-actions">
          <button type="button" class="k-btn k-btn-ghost" @click="answer(false)">
            {{ cancelText }}
          </button>
          <button
            ref="confirmBtn"
            type="button"
            class="k-btn"
            :class="danger ? 'k-btn-danger' : 'k-btn-primary'"
            @click="answer(true)"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * Themed replacement for window.confirm().
 * Usage: if (await this.$kConfirm({ title, message, confirmText, danger: true })) { ... }
 */
export default {
  name: "ConfirmDialog",
  data() {
    return {
      visible: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      danger: false,
      icon: "",
      resolver: null,
    };
  },
  methods: {
    open(opts = {}) {
      if (this.resolver) this.resolver(false);
      Object.assign(this, {
        title: opts.title || "Are you sure?",
        message: opts.message || "",
        confirmText: opts.confirmText || "Confirm",
        cancelText: opts.cancelText || "Cancel",
        danger: !!opts.danger,
        icon: opts.icon || "",
        visible: true,
      });
      this.$nextTick(() => this.$refs.confirmBtn && this.$refs.confirmBtn.focus());
      return new Promise((resolve) => {
        this.resolver = resolve;
      });
    },
    answer(value) {
      this.visible = false;
      if (this.resolver) {
        this.resolver(value);
        this.resolver = null;
      }
    },
  },
};
</script>
