<template>
  <form class="action">
    <md-card>
      <md-card-header data-background-color="orange">
        <h4 class="title">Karrar delivery services</h4>
      </md-card-header>
      <md-card-content>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="{'md-error': hasPhoneError}">
              <label>phone</label>
              <md-input v-model="user.phone" type="text" @focus="clearErrors"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="{'md-error': hasPasswordError}">
              <label>password</label>
              <md-input v-model="user.password" type="password" @focus="clearErrors" @keyup.enter="signIn"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button data-background-color="orange" class="md-raised md-success" @click="signIn()" :disabled="isLoading">
              <md-progress-spinner v-if="isLoading" :md-diameter="20" md-mode="indeterminate" class="md-accent login-spinner"></md-progress-spinner>
              <span v-else>sign in</span>
            </md-button>
          </div>
        </div>
      </md-card-content>
      <!-- <router-link to="/forgotPassword">forgot password</router-link> -->
    </md-card>
  </form>
</template>

<script>
import {AuthenticationService} from "@/services/AuthenticationService";

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone: null,
        password: null
      },
      errorMessage: null,
      hasPhoneError: false,
      hasPasswordError: false,
      isLoading: false
    }
  },
  methods: {
    clearErrors() {
      this.errorMessage = null;
      this.hasPhoneError = false;
      this.hasPasswordError = false;
    },
    signIn() {
      // Validate inputs
      if (!this.user.phone || !this.user.password) {
        if (!this.user.phone) this.hasPhoneError = true;
        if (!this.user.password) this.hasPasswordError = true;
        this.errorMessage = "Please enter both phone number and password";
        return;
      }

      this.isLoading = true;
      this.clearErrors();

      AuthenticationService.login(this.user)
        .then(response => {
          this.isLoading = false;
          if (response.data && response.data.accessToken) {
            if (AuthenticationService.isAuth()) {
              this.$router.push("/");
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          
          // Handle authentication errors
          if (err.isAuthError) {
            // This is our custom error for bad credentials
            this.errorMessage = err.message;
            this.hasPhoneError = true;
            this.hasPasswordError = true;
          } else {
            // Handle other types of errors
            this.errorMessage = "An error occurred during login. Please try again later.";
            console.error("Login error:", err);
          }
        });
    }
  },
}
</script>
<style scoped>
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  background: url('@/assets/img/karrar background-blur.png') no-repeat center center fixed;
  background-size: cover;
}

.md-card {
  width: 80vh;
  max-width: 100%;
  margin: 20px;
  background: rgba(255, 255, 255, 0.95);
}

.error-message {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.login-spinner {
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
}
</style>