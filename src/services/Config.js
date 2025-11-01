// eslint-disable-next-line no-unused-vars
export class Config {
    static base_url () {
        // Use environment variable first, then check environment, fallback to production URL
        const API_BASE_URL = process.env.VUE_APP_API_URL || 
            (process.env.NODE_ENV === 'development' 
                ? 'http://localhost:8080'
                : 'https://karrardelivery.onrender.com');
        return `${API_BASE_URL}/api/v1`;
    }

    static traders_url () {
         return this.base_url()+`/traders`;
    }

    static agents_url () {
        return this.base_url()+`/agents`;
    }

    static users_url () {
        return this.base_url()+`/users`;
    }

    static orders_url () {
        return this.base_url()+`/orders`;
   }

    static export_daily_orders_url () {
        return this.base_url()+`/export/orders/daily-report`;
   }

   static export_orders_url () {
    return this.base_url()+`/export/orders/order-report`;
   }

    static auth_URL(){
        return this.base_url()+`/auth/login`;
    }
    static forgot_password(){
        return this.base_url()+`/forgotPassword`;
    }

    static new_Password_Url(){
        return this.base_url()+`/resetPassword`;
    }

    static logout_url() {
        return this.base_url() + `/logout`;
    }
}
