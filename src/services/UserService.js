import axios from 'axios';
import {Config} from './Config';
import {AuthenticationService as UserSession} from "@/services/AuthenticationService";
export class userService {

    static getAllUsers(){
        return new Promise((resolve , reject)=> {
            axios.get(Config.users_url(), {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}} )
                .then(response => {
                    resolve(response.data);
                }).catch(err=>{
                console.log(err);
                reject(err);
            });
        });
    }

    static addNewUser(user){
        return new Promise((resolve , reject)=>{

            axios.post(Config.users_url(), {
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                password: user.password,
                role: user.role
            }, {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                console.log(response);
                resolve(response.data);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static forgotPassword(email) {
        return new Promise((resolve , reject)=>{
            axios.post( Config.forgot_password(),{
                userEmail: email,
            }) .then(response=>{
                resolve(response);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static changePassword(user) {
        return new Promise((resolve , reject)=>{
            axios.post( Config.new_Password_Url (),{
                confirmPassword: user.confirmedPassword,
                newPassword: user.password,
                userId:user.userId,
                token: user.token,
                uuid: user.uuid,
            }) .then(response=>{
                resolve(response);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static updateUser(userId, user){
        return new Promise((resolve, reject)=>{
            axios.put(`${Config.users_url()}/${userId}`, {
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                password: user.password,
                role: user.role
            }, {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                resolve(response.data);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static deleteUser(userId){
        return new Promise((resolve, reject)=>{
            axios.delete(`${Config.users_url()}/${userId}`, 
            {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
            .then(response=>{
                resolve(response.data);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static disableUser(userId) {
        return new Promise((resolve, reject) => {
            axios.put(
                `${Config.users_url()}/${userId}/disable`,
                {},
                { 
                    headers: { 
                        "Authorization": `Bearer ${UserSession.getUserToken()}`
                    } 
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.error('Error disabling user:', err);
                reject(err);
            });
        });
    }

    static enableUser(userId) {
        return new Promise((resolve, reject) => {
            axios.put(
                `${Config.users_url()}/${userId}/enable`,
                {},
                { 
                    headers: { 
                        "Authorization": `Bearer ${UserSession.getUserToken()}`
                    } 
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.error('Error enabling user:', err);
                reject(err);
            });
        });
    }
}