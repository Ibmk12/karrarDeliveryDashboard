<template>
  <div class="login-page">
    <form class="action" @submit.prevent>
      <div class="login-card">
        <div class="login-brand">
          <img src="@/assets/img/karrar-logo2.jpg" alt="Karrar" class="login-logo" />
          <div>
            <h1 class="login-title">Karrar Delivery</h1>
            <p class="login-subtitle">Sign in to the operations dashboard</p>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <md-icon>error_outline</md-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <md-field :class="{'md-error': hasPhoneError}">
          <md-icon>phone_iphone</md-icon>
          <label>Phone number</label>
          <md-input v-model="user.phone" type="text" autocomplete="username" @focus="clearErrors"></md-input>
        </md-field>

        <md-field :class="{'md-error': hasPasswordError}" md-toggle-password>
          <md-icon>lock_outline</md-icon>
          <label>Password</label>
          <md-input v-model="user.password" type="password" autocomplete="current-password" @focus="clearErrors" @keyup.enter="signIn"></md-input>
        </md-field>

        <md-button class="md-raised md-primary login-btn" @click="signIn()" :disabled="isLoading">
          <md-progress-spinner v-if="isLoading" :md-diameter="20" :md-stroke="3" md-mode="indeterminate" class="login-spinner"></md-progress-spinner>
          <span v-else>Sign in</span>
        </md-button>
        <!-- <router-link to="/forgotPassword">forgot password</router-link> -->
      </div>
      <p class="login-footer">&copy; {{ new Date().getFullYear() }} Karrar Delivery Services</p>
    </form>
  </div>
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
.login-page {
  min-height: 100vh;
  width: 100%;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.7) 55%, rgba(245, 124, 0, 0.55) 100%),
    url('@/assets/img/karrar background-blur.png') no-repeat center center fixed;
  background-size: cover;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 18px;
  padding: 32px 32px 28px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.login-logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 0 0 3px #fff4e6;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.login-subtitle {
  margin: 4px 0 0;
  font-size: 13.5px;
  color: #6b7280;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
}

.error-message .md-icon {
  color: #dc2626 !important;
  font-size: 20px !important;
  margin: 0;
}

.login-btn {
  width: 100%;
  height: 44px !important;
  margin: 18px 0 0 !important;
  font-size: 15px !important;
}

.login-spinner {
  display: inline-block;
  vertical-align: middle;
}

.login-spinner >>> .md-progress-spinner-circle {
  stroke: #fff !important;
}

.login-footer {
  margin-top: 20px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }
}
</style>
