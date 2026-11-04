<template>
  <md-dialog :md-active.sync="active" class="k-pw-dialog" @md-closed="reset">
    <md-dialog-title>{{ $tt("Change password") }}</md-dialog-title>

    <md-dialog-content>
      <form class="k-pw-form" autocomplete="on" @submit.prevent="save">
        <!-- lets password managers know which account this is -->
        <input class="k-pw-user" type="text" name="username" :value="phone" autocomplete="username" readonly tabindex="-1" aria-hidden="true" />

        <md-field :class="{ 'k-warn': currentWarning }">
          <label>{{ $tt("Current password") }}</label>
          <md-input ref="current" v-model="current" type="password" autocomplete="current-password" required @input="serverError = ''"></md-input>
        </md-field>
        <p v-if="currentWarning" class="k-pw-warn" role="status"><md-icon>warning</md-icon>{{ currentWarning }}</p>

        <md-field :class="{ 'k-warn': tried && !newOk }">
          <label>{{ $tt("New password") }}</label>
          <md-input v-model="next" type="password" autocomplete="new-password" required @input="serverError = ''"></md-input>
        </md-field>

        <!-- the rule, checked while typing -->
        <ul class="k-pw-rules" :aria-label="$tt('Password rules')">
          <li v-for="r in rules" :key="r.key" :class="{ 'is-ok': r.ok, 'is-bad': !r.ok && (tried || next) }">
            <md-icon>{{ r.ok ? "check_circle" : "radio_button_unchecked" }}</md-icon>
            {{ $tt(r.text) }}
          </li>
        </ul>

        <md-field :class="{ 'k-warn': confirmWarning }">
          <label>{{ $tt("Confirm new password") }}</label>
          <md-input v-model="confirm" type="password" autocomplete="new-password" required @input="serverError = ''"></md-input>
        </md-field>
        <p v-if="confirmWarning" class="k-pw-warn" role="status"><md-icon>warning</md-icon>{{ confirmWarning }}</p>

        <p v-if="serverError" class="k-pw-server" role="alert">
          <md-icon>warning</md-icon>
          <span>{{ serverError }}</span>
        </p>

        <!-- Enter submits the form -->
        <button type="submit" class="k-pw-submit" tabindex="-1" aria-hidden="true"></button>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-simple" :disabled="saving" @click="active = false">{{ $tt("Cancel") }}</md-button>
      <md-button class="md-raised md-primary k-pw-save" :disabled="saving" @click="save">
        <md-icon>lock_reset</md-icon>
        {{ saving ? $tt("Saving…") : $tt("Change password") }}
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { userService } from "@/services/UserService";

/**
 * Password rule, the same as the backend (UserServiceImpl.PASSWORD_RULE):
 * 8–64 characters, no spaces, upper-case, lower-case, a number and a symbol.
 */
export const PASSWORD_RULES = [
  { key: "len", text: "8 to 64 characters", test: (p) => p.length >= 8 && p.length <= 64 },
  { key: "upper", text: "An upper-case letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", text: "A lower-case letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { key: "digit", text: "A number (0–9)", test: (p) => /\d/.test(p) },
  { key: "symbol", text: "A symbol (! @ # $ …)", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
  { key: "space", text: "No spaces", test: (p) => p.length > 0 && !/\s/.test(p) },
];

export function passwordMeetsRules(p) {
  return PASSWORD_RULES.every((r) => r.test(p || ""));
}

/** "Change password" for the signed-in user (their own account only). */
export default {
  name: "ChangePasswordDialog",
  data() {
    return { active: false, current: "", next: "", confirm: "", tried: false, saving: false, serverError: "" };
  },
  computed: {
    phone() {
      return (this.$profile && this.$profile.phone) || "";
    },
    rules() {
      const p = this.next || "";
      const list = PASSWORD_RULES.map((r) => ({ key: r.key, text: r.text, ok: r.test(p) }));
      list.push({ key: "diff", text: "Not your current password", ok: !!p && p !== this.current });
      return list;
    },
    newOk() {
      return this.rules.every((r) => r.ok);
    },
    currentWarning() {
      return this.tried && !this.current ? this.$tt("Enter your current password") : "";
    },
    confirmWarning() {
      if (this.confirm && this.confirm !== this.next) return this.$tt("The passwords don't match");
      if (this.tried && !this.confirm) return this.$tt("Type the new password again");
      return "";
    },
    valid() {
      return !!this.current && this.newOk && this.confirm === this.next;
    },
  },
  methods: {
    open() {
      this.reset();
      this.active = true;
      this.$nextTick(() => {
        const el = this.$refs.current && this.$refs.current.$el;
        if (el && el.focus) setTimeout(() => el.focus(), 250);
      });
    },
    reset() {
      this.current = "";
      this.next = "";
      this.confirm = "";
      this.tried = false;
      this.saving = false;
      this.serverError = "";
    },
    async save() {
      this.tried = true;
      this.serverError = "";
      if (!this.valid || this.saving) return;
      this.saving = true;
      try {
        await userService.changePassword({
          phone: this.phone,
          oldPassword: this.current,
          newPassword: this.next,
          confirmPassword: this.confirm,
        });
        this.active = false;
        this.$toast.success(this.$tt("Your password was changed"));
      } catch (err) {
        const data = err && err.response && err.response.data;
        const msg = data && data.errorDtoList && data.errorDtoList[0] && data.errorDtoList[0].errorMessage;
        this.serverError = msg || this.$tt("Could not change the password. Try again.");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
