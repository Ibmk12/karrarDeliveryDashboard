// eslint-disable-next-line no-unused-vars
export class Config {
    static base_url () {
        return '/api/v1';
    }

    static traders_url () {
         return this.base_url()+`/traders`;
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
        return this.base_url() + `/auth/logout`;
    }
}