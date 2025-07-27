import axios from 'axios';
import {Config} from './Config';
import {AuthenticationService as UserSession} from "@/services/AuthenticationService";

export class TraderService {

    static addNewTrader(trader){
        return new Promise((resolve , reject)=>{
            console.log('Adding new trader:', trader);
            
            axios.post(Config.traders_url() , {
                code: trader.code,
                name: trader.name,
                email: trader.email,
                phoneNumber: trader.phoneNumber,
                description: trader.description,
            },{headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
            .then(response=>{
                // Check if the response contains error information
                if (response.data && response.data.errorDtoList && response.data.errorDtoList.length > 0) {
                    // Format the error for easier handling in the component
                    const error = {
                        isApiError: true,
                        errorCode: response.data.errorDtoList[0].errorCode,
                        errorMessage: response.data.errorDtoList[0].errorMessage
                    };
                    console.log('API error in response:', error);
                    reject(error);
                } else {
                    resolve(response.data);
                }
            }).catch(err =>{
                console.log('Error in addNewTrader:', err);
                // Check if the error response contains the errorDtoList
                if (err.response && err.response.data && err.response.data.errorDtoList) {
                    const apiError = {
                        isApiError: true,
                        errorCode: err.response.data.errorDtoList[0].errorCode,
                        errorMessage: err.response.data.errorDtoList[0].errorMessage
                    };
                    console.log('Formatted API error:', apiError);
                    reject(apiError);
                } else {
                    reject(err);
                }
            });
        });
    }

    static deleteTrader(id){
        return new Promise((resolve,reject)=>{
            console.log('Deleting trader with ID:', id);
            axios.delete(Config.traders_url()+`/${id}` ,{headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
                .then(response=>{
                    resolve(response.data);
                }) .catch(err=>{
                console.error('Error deleting trader:', err);
                reject(err);
            });
        });
    }

    static updateTrader(traderId, updatedFields){
        return new Promise((resolve ,reject)=>{
            console.log('Updating trader with ID:', traderId);
            console.log('Updated fields:', updatedFields);
            
            axios.put(Config.traders_url()+`/${traderId}`, updatedFields, 
                {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
                .then(response=>{
                    // Check if the response contains error information
                    if (response.data && response.data.errorDtoList && response.data.errorDtoList.length > 0) {
                        // Format the error for easier handling in the component
                        const error = {
                            isApiError: true,
                            errorCode: response.data.errorDtoList[0].errorCode,
                            errorMessage: response.data.errorDtoList[0].errorMessage
                        };
                        reject(error);
                    } else {
                        resolve(response.data);
                    }
                }).catch(err=>{
                    console.log('Error in updateTrader:', err);
                    // Check if the error response contains the errorDtoList
                    if (err.response && err.response.data && err.response.data.errorDtoList) {
                        const apiError = {
                            isApiError: true,
                            errorCode: err.response.data.errorDtoList[0].errorCode,
                            errorMessage: err.response.data.errorDtoList[0].errorMessage
                        };
                        reject(apiError);
                    } else {
                        reject(err);
                    }
                });
        });
    }

   /* static getAppIds(){
        return new Promise((resolve , reject)=> {
        axios.get(Config.appIds_URL() , {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}} )
            .then(response => {
                resolve(response.data);
            } ).catch(err=>{
            console.log(err);
            reject(err);
        });
    });
    }*/

    static getAllTraders(filters = {}){
        return new Promise((resolve , reject)=> {
            const params = new URLSearchParams();
            
            // Add filters to params if they exist
            if (filters.name) params.append('name', filters.name);
            if (filters.phoneNumber) params.append('phoneNumber', filters.phoneNumber);
            if (filters.email) params.append('email', filters.email);
            if (filters.deleted !== undefined) params.append('deleted', filters.deleted);
            
            const url = `${Config.traders_url()}?${params.toString()}`;
            
            axios.get(url, {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
                .then(response => {
                    resolve(response.data.data); 
                } ).catch(err=>{
                console.log(err);
                reject(err);
            });
        });
    }



}