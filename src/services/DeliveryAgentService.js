import axios from 'axios';
import {Config} from './Config';
import {AuthenticationService as UserSession} from "@/services/AuthenticationService";

export class DeliveryAgentService {

    static addNewAgent(agent){
        return new Promise((resolve, reject) => {
            console.log('Adding new agent:', agent);

            axios.post(Config.agents_url(), {
                name: agent.name,
                phoneNumber: agent.phoneNumber,
                email: agent.email,
                description: agent.description,
                code: agent.code
            }, {headers: { "Authorization": `Bearer ${UserSession.getUserToken()}`}})
            .then(response => {
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
            }).catch(err => {
                console.log('Error in addNewAgent:', err);
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

    static deleteAgent(id){
        return new Promise((resolve, reject) => {
            console.log('Deleting agent with ID:', id);
            
            // Real API implementation
            axios.delete(Config.agents_url()+`/${id}`, {headers: { "Authorization": `Bearer ${UserSession.getUserToken()}`}})
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error('Error deleting agent:', err);
                    reject(err);
                });
            
            
        });
    }

    static updateAgent(agentId, updatedFields){
        return new Promise((resolve, reject) => {
            console.log('Updating agent with ID:', agentId);
            console.log('Updated fields:', updatedFields);
            
            // Real API implementation
            axios.put(Config.agents_url()+`/${agentId}`, updatedFields, 
                {headers: { "Authorization": `Bearer ${UserSession.getUserToken()}`}})
                .then(response => {
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
                }).catch(err => {
                    console.log('Error in updateAgent:', err);
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

    static getAllAgents(filters = {}){
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams();
            
            // Add filters to params if they exist
            if (filters.name) params.append('name', filters.name);
            if (filters.phoneNumber) params.append('phoneNumber', filters.phoneNumber);
            if (filters.email) params.append('email', filters.email);
    
            params.append('deleted', 'false');
            
            // Pagination parameters
            if (filters.page !== undefined) params.append('page', filters.page);
            if (filters.size !== undefined) params.append('size', filters.size);
            
            const url = `${Config.agents_url()}?${params.toString()}`;
            
            // Real API implementation
            axios.get(url, {headers: { "Authorization": `Bearer ${UserSession.getUserToken()}`}})
                .then(response => {
                    // Process the response to extract agents and pagination data
                    const agents = response.data.data || [];
                    const pagination = response.data.dataProperties || {
                        totalElements: 0,
                        totalPages: 0,
                        pageNumber: 0,
                        totalElementsPerPage: 10,
                        isEmpty: true,
                        sortedBy: "UNSORTED"
                    };
                    
                    // Return both agents and pagination information
                    resolve({
                        data: agents,
                        dataProperties: pagination
                    });
                })
                .catch(err => {
                    console.error('Error in getAllAgents:', err);
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.error('Error response data:', err.response.data);
                        console.error('Error response status:', err.response.status);
                        console.error('Error response headers:', err.response.headers);
                    } else if (err.request) {
                        // The request was made but no response was received
                        console.error('Error request:', err.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.error('Error message:', err.message);
                    }
                    reject(err);
                });
            
      });
    }
    
    static getAgentById(id) {
        return new Promise((resolve, reject) => {
            console.log(`Fetching agent with ID: ${id}`);
            
            // Real API implementation
            axios.get(Config.agents_url()+`/${id}`, {headers: { "Authorization": `Bearer ${UserSession.getUserToken()}`}})
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error(`Error fetching agent with ID ${id}:`, err);
                    reject(err);
                });
                   
        });
    }
}
