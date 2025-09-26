import axios from 'axios';
import { Config } from './Config';

// Create an axios instance for auth requests
const authAxios = axios.create();

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Store callbacks to be executed after token refresh
let refreshSubscribers = [];

// Add a request interceptor to include the auth token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to add callbacks to be executed after token refresh
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Function to execute all callbacks after token refresh
const onTokenRefreshed = (token) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Add a response interceptor to handle token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, wait for it to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(authAxios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        
        // Try to refresh the token
        const response = await axios.post(`${Config.base_url()}/auth/refresh`, { refreshToken });
        
        if (response.data && response.data.accessToken) {
          // Save the new tokens
          AuthenticationService.setToken(response.data.accessToken, response.data.refreshToken);
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Notify all subscribers that the token has been refreshed
          onTokenRefreshed(response.data.accessToken);
          isRefreshing = false;
          
          // Retry the original request
          return authAxios(originalRequest);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, clear storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        isRefreshing = false;
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Apply the interceptor to the main axios instance as well
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, wait for it to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        
        // Try to refresh the token
        const response = await axios.post(`${Config.base_url()}/auth/refresh`, { refreshToken });
        
        if (response.data && response.data.accessToken) {
          // Save the new tokens
          AuthenticationService.setToken(response.data.accessToken, response.data.refreshToken);
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Notify all subscribers that the token has been refreshed
          onTokenRefreshed(response.data.accessToken);
          isRefreshing = false;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, clear storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        isRefreshing = false;
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export class AuthenticationService {
    static async refreshToken() {
        // If a refresh is already in progress, wait for it to complete
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh(() => {
                    resolve(true);
                });
            });
        }
        
        isRefreshing = true;
        try {
            console.log("hit refresh token!!");
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                throw new Error('No refresh token available');
            }
            
            // Try to refresh the token
            const response = await axios.post(`${Config.base_url()}/auth/refresh`, { refreshToken });
            
            if (response.data && response.data.accessToken) {
                console.log("refresh token success!!");
                // Save the new tokens
                this.setToken(response.data.accessToken, response.data.refreshToken || refreshToken);
                
                // Notify all subscribers that the token has been refreshed
                onTokenRefreshed(response.data.accessToken);
                isRefreshing = false;
                return true;
            }
            isRefreshing = false;
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Don't logout automatically - let the user continue their session
            // until they actually need to make an authenticated request
            isRefreshing = false;
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
            console.log("hit log out!!",Config.logout_url())

            // Call the logout API
            await axios.post(Config.logout_url(), {}, {
                headers: { 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with logout even if API call fails
        } finally {
            // Clear the token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
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