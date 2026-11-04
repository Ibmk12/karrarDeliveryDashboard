import axios from 'axios';
import { clearRole, setRole, roleFromCurrentToken } from "@/plugins/auth";
import { Config } from './Config';
import { NotificationStore } from "@/components/NotificationPlugin";

// Tell the login page that the session ran out, and where the user was,
// so it can explain it and bring them back after signing in.
function markSessionExpired() {
  try {
    const current = (window.location.hash || "").replace(/^#/, "") || "/";
    sessionStorage.setItem("karrar.sessionExpired", current.startsWith("/login") ? "" : current);
  } catch (e) {
    /* ignore */
  }
}

// Plain instance with no interceptors: the refresh and logout calls go
// through it, so a failing refresh can never wait on itself.
const plainAxios = axios.create();

// Instance for auth requests (kept for existing imports)
const authAxios = axios.create();
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function clearSession() {
  ['token', 'refreshToken', 'tokenTime'].forEach((k) => {
    try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
  });
  clearRole();
}

function isAuthCall(config) {
  const url = (config && config.url) || '';
  return /\/auth\/(login|refresh)|\/logout(\/|\?|$)/.test(url);
}

// One refresh at a time; every request that got a 401 waits on the same one.
let refreshPromise = null;
function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  const refreshToken = localStorage.getItem('refreshToken');
  refreshPromise = (refreshToken
    ? plainAxios.post(`${Config.base_url()}/auth/refresh`, { refreshToken })
    : Promise.reject(new Error('No refresh token available')))
    .then((res) => {
      const token = res.data && res.data.accessToken;
      if (!token) throw new Error('No access token in the refresh answer');
      AuthenticationService.setToken(token, res.data.refreshToken || refreshToken);
      return token;
    })
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
}

// Session is over: forget it, hide the page's "failed to load" errors and go to sign-in.
let ending = false;
function endSession() {
  window.__kSessionEnded = true;
  if (ending) return;
  ending = true;
  clearSession();
  markSessionExpired();
  window.location.href = '/#/login';
  setTimeout(() => { ending = false; }, 1500);
}

function addRefresh(instance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (!error.response || error.response.status !== 401 || !original || original._retry || isAuthCall(original)) {
        return Promise.reject(error);
      }
      original._retry = true;
      original.headers = original.headers || {};
      const current = localStorage.getItem('token');
      const sent = String(original.headers.Authorization || '');
      try {
        // sent with an older token (e.g. before signing in again): just retry with the new one
        const token = current && !sent.endsWith(current) ? current : await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return instance(original);
      } catch (e) {
        console.error('Token refresh failed:', e);
        endSession();
        error.sessionExpired = true;
        return Promise.reject(error);
      }
    }
  );
}
addRefresh(authAxios);
addRefresh(axios);

export class AuthenticationService {
    static async refreshToken() {
        try {
            await refreshAccessToken();
            return true;
        } catch (error) {
            // Don't sign out here; a real request that fails will do it
            return false;
        }
    }
    static async login(user) {
        try {
            const response = await axios.post(Config.auth_URL(), {
                phone: user.phone,
                password: user.password,
            });
            
            if (response.data && response.data.accessToken) {
                // Store both access token and refresh token
                this.setToken(
                    response.data.accessToken,
                    response.data.refreshToken
                );
                // Forget any previous user's role and read the new one from the JWT,
                // so the first page after login is already the right one.
                clearRole();
                window.__kSessionEnded = false;
                NotificationStore.state.splice(0);
                const role = roleFromCurrentToken();
                if (role) setRole(role);
            }
            
            return response;
        } catch (error) {
            // Check if this is a bad credentials error (403)
            if (error.response && 
                error.response.data && 
                error.response.data.errorDtoList && 
                error.response.data.errorDtoList.length > 0 &&
                error.response.data.errorDtoList[0].errorCode === '403') {
                
                // Create a more user-friendly error object
                const errorMessage = error.response.data.errorDtoList[0].errorMessage;
                const badCredentialsError = new Error(errorMessage);
                badCredentialsError.isAuthError = true;
                throw badCredentialsError;
            }
            
            // For other errors, just pass them through
            throw error;
        }
    }

    static async logout() {
        try {
            // plain call: an expired token must not start a refresh here
            await plainAxios.post(Config.logout_url(), { refreshToken: localStorage.getItem('refreshToken') }, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (error) {
            // Continue with logout even if the API call fails
        } finally {
            clearSession();
            try { sessionStorage.setItem('karrar.signedOut', '1'); } catch (e) { /* ignore */ }
            window.location.href = '/#/login';
        }
    }

    static setToken(token, refreshToken) {
        localStorage.setItem("token", token);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        const tokenPushedTime = (new Date()).getTime();
        localStorage.setItem("tokenTime", tokenPushedTime);
    }
    static isExpired() {
        const tokenTime = parseInt(localStorage.getItem('tokenTime') || '0');
        const timeNow = (new Date()).getTime();
        const twentyMinutesInMs = 20 * 60 * 1000; // 20 minutes in milliseconds
        
        // If token doesn't exist or is expired
        if (!tokenTime || (timeNow - tokenTime) > twentyMinutesInMs) {
            // Instead of just returning true, try to refresh the token
            this.refreshToken();
            return true; // Token is expired
        }
        return false; // Token is valid
    }
    static getUserToken() {
        return localStorage.getItem("token"); 
     }
     static async ensureValidToken() {
        const hasToken = this.getUserToken() !== "undefined" && this.getUserToken() !== null;
        if (!hasToken) return false;
        
        // If token is expired, try to refresh it
        if (this.isExpired()) {
            return await this.refreshToken();
        }
        
        return true;
    }
    
    static isAuth() {
        const hasToken = this.getUserToken() !== "undefined" && this.getUserToken() !== null;
        if (!hasToken) return false;
        
        // If token is expired, try to refresh it
        if (this.isExpired()) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                this.logout();
                return false;
            }
            // We'll handle refresh in refreshToken method
            // Don't immediately return false - let the refresh happen
            return true;
        }
        
        return true;
    }
}
