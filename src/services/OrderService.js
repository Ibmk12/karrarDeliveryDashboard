import axios from 'axios';
import {Config} from './Config';
import {AuthenticationService as UserSession} from "@/services/AuthenticationService";

export class OrderService {
    
    static uploadOrders(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        return new Promise((resolve, reject) => {
            axios.post(Config.orders_url() + '/upload-orders', formData, {
                headers: { 
                    "Authorization": `Bearer ${UserSession.getUserToken()}`,
                    "Content-Type": "multipart/form-data"
                }
            }).then(response => {
                resolve(response.data);
            }).catch(err => {
                console.error('Error uploading orders:', err);
                reject(err);
            });
        });
    }
    
    static exportOrderReport(filters = {}) {
        return new Promise((resolve, reject) => {
            const params = this.convertFiltersToParams(filters);
            const url = `${Config.export_orders_url()}?${params.toString()}`;
            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders-report-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            
            // Add authorization header through axios interceptor or as a query parameter
            axios.get(url, {
                responseType: 'blob',
                headers: { 
                    'Authorization': `Bearer ${UserSession.getUserToken()}`,
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                link.href = url;
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                resolve();
            })
            .catch(error => {
                console.error('Export failed:', error);
                document.body.removeChild(link);
                reject(error);
            });
        });
    }

    static addNewOrder(order){
        return new Promise((resolve , reject)=>{
            axios.post(Config.orders_url() , {
                invoiceNo: order.invoiceNo,
                agentId: order.agentId,
                orderDate: order.orderDate,
                deliveryDate: order.deliveryDate,
                address: order.address,
                emirate: order.emirate,
                traderId: order.traderId,
                traderAmount: order.traderAmount,
                deliveryAmount: order.deliveryAmount,
                agentAmount: order.agentAmount,
                customerPhoneNo: order.customerPhoneNo,
                comment : order.comment,
                deliveryStatus: order.deliveryStatus || 'PENDING'
            },{headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                resolve(response.data);
            }).catch(err =>{
                reject(err);
            });
        });
    }

    static deleteOrder(id){
        return new Promise((resolve,reject)=>{
            axios.delete(Config.orders_url()+`/${id}` ,{headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}})
                .then(response=>{
                    resolve(response);
                }) .catch(err=>{
                reject(err);
            });
        });
    }

    static updateOrder(order){
        return new Promise((resolve ,reject)=>{
            axios.put(Config.orders_url()+`/${order.orderId}` , {
                invoiceNo: order.invoiceNo,
                agentId: order.agentId,
                orderDate: order.orderDate,
                deliveryDate: order.deliveryDate,
                address: order.address,
                emirate: order.emirate,
                traderId: order.traderId,
                traderAmount: order.traderAmount,
                deliveryAmount: order.deliveryAmount,
                agentAmount: order.agentAmount,
                customerPhoneNo: order.customerPhoneNo,
                deliveryStatus: order.deliveryStatus
            } , {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                resolve(response.data);
            }).catch(err=>{
                console.log(err);
                reject(err);
            });
        });
    }

    static updateOrderStatus({orderList, deliveryStatus}){
        return new Promise((resolve ,reject)=>{
            axios.patch(Config.orders_url(), {
                orderList,
                deliveryStatus
            }, {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                resolve(response);
            }).catch(err=>{
                console.log(err);
                reject(err);
            });
        });
    }

    static updateOrderStatusAndDeliveryAmount({order}){
        return new Promise((resolve ,reject)=>{
            axios.put(Config.orders_url(), {
                deliveryAmount: order.deliveryAmount,
                traderAmount: order.traderAmount,
                agentAmount: order.agentAmount,
                deliveryStatus: order.deliveryStatus,
                invoiceNo: order.invoiceNo
            }, {headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}}).then(response=>{
                // Handle 204 No Content response
                if (response.status === 204) {
                    // For 204 status, the API indicates success with an integer 1
                    // We resolve with true to indicate success in our application
                    resolve(true);
                } else {
                    // For other successful responses, resolve with the response data
                    resolve(response.data);
                }
            }).catch(err=>{
                console.error('Error updating order status and delivery amount:', err);
                reject(err);
            });
        });
    }

    static convertFiltersToParams(filters = {}) {
        const params = new URLSearchParams();
        
        // Basic filters
        if (filters.invoiceNo) params.append('invoiceNo', filters.invoiceNo);
        if (filters.fromOrderDate) params.append('fromOrderDate', filters.fromOrderDate);
        if (filters.toOrderDate) params.append('toOrderDate', filters.toOrderDate);
        if (filters.customerPhoneNo) params.append('customerPhoneNo', filters.customerPhoneNo);
        if (filters.totalAmount) params.append('totalAmount', filters.totalAmount);
        if (filters.deliveryStatus) params.append('deliveryStatus', filters.deliveryStatus);
        if (filters.traderId) params.append('traderId', filters.traderId);
        if (filters.traderName) params.append('traderName', filters.traderName);
        if (filters.fromDeliveryDate) params.append('fromDeliveryDate', filters.fromDeliveryDate);
        
        // Pagination parameters
        if (filters.page !== undefined) params.append('page', filters.page);
        if (filters.size !== undefined) params.append('size', filters.size);

        return params;
    }

    static exportDailyOrdersToExcel(filters = {}) {
        const params = OrderService.convertFiltersToParams(filters);
        const exportUrl = Config.export_daily_orders_url();
        
        return new Promise((resolve, reject) => {
            axios({
                url: exportUrl,
                method: 'GET',
                params: params,
                responseType: 'blob', // Important for handling binary data
                headers: { 
                    'Authorization': `Bearer ${UserSession.getUserToken()}`,
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            })
            .then(response => {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                // Determine filename from Content-Disposition header if provided by backend
                let fileName = `report-${new Date().toISOString().split('T')[0]}.xlsx`;
                const headers = response.headers || {};
                const contentDisposition = headers['content-disposition'] || headers['Content-Disposition'];
                if (contentDisposition) {
                  // Try RFC 5987 format: filename*=UTF-8''...
                  let match = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i);
                  if (match && match[1]) {
                    try {
                      fileName = decodeURIComponent(match[1]);
                    } catch (e) {
                      fileName = match[1];
                    }
                  } else {
                    // Fallback: filename="..." or filename=...
                    match = contentDisposition.match(/filename="?([^";\n]+)"?/i);
                    if (match && match[1]) {
                      fileName = match[1];
                    }
                  }
                }
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                resolve(true);
            })
            .catch(error => {
                console.error('Error exporting to Excel:', error);
                reject(error);
            });
        });
    }

    static getAllOrders(filters = {}) {
        const params = OrderService.convertFiltersToParams(filters);
        return new Promise((resolve, reject) => {
            axios.get(`${Config.orders_url()}?${params.toString()}`, {
                headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}` }
            })
                .then(response => {
                    const { data: orders, dataProperties: pagination } = response.data;
                    
                    const formattedOrders = orders.map(order => ({
                        orderId: order.id,
                        invoiceNo: order.invoiceNo,
                        agentName: order.agentName,
                        agentId: order.agentId,
                        orderDate: order.orderDate,
                        deliveryDate: order.deliveryDate,
                        address: order.address,
                        emirate: order.emirate,
                        traderId: order.traderId,
                        traderName: order.traderName,
                        deliveryStatus: order.deliveryStatus,
                        totalAmount: order.totalAmount,
                        traderAmount: order.traderAmount,
                        deliveryAmount: order.deliveryAmount,
                        agentAmount: order.agentAmount,
                        netCompanyAmount: order.netCompanyAmount,
                        customerPhoneNo: order.customerPhoneNo,
                        comment: order.comment,
                        longitude: order.longitude,
                        latitude: order.latitude
                    }));
             
                    resolve({
                        orders: formattedOrders,
                        pagination: {
                            totalElements: pagination.totalElements,
                            totalPages: pagination.totalPages,
                            pageNumber: pagination.pageNumber,
                            pageSize: pagination.totalElementsPerPage,
                            isEmpty: pagination.isEmpty,
                            sortedBy: pagination.sortedBy
                        }
                    });
                }).catch(err => {
                    console.error('Error fetching orders:', err);
                    reject(err);
                });
        });
    }

    static getDelayedDeliveryOrders(daysThreshold = 2) {
        return new Promise((resolve, reject) => {
            axios.get(`${Config.orders_url()}/under-delivery/longer-than?days=${daysThreshold}`, {
                headers: { "Authorization": `Bearer ${UserSession.getUserToken()}` }
            })
                .then(response => {
                    resolve(response.data);
                }).catch(err => {
                    console.error('Error fetching delayed delivery orders:', err);
                    reject(err);
                });
        });
    }

    static getOrderCountPerMonth(months = 50, deliveryStatus = null) {
        let url = `${Config.orders_url()}/count-per-month?months=${months}`;
        if (deliveryStatus) {
            url += `&status=${deliveryStatus}`;
        }
        return new Promise((resolve, reject) => {
            axios.get(url, {
                headers: { "Authorization": `Bearer ${UserSession.getUserToken()}` }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.error('Error fetching order counts per month:', err);
                reject(err);
            });
        });
    }

    static getReport(filters = {}){
        const params = OrderService.convertFiltersToParams(filters);
        return new Promise((resolve , reject)=> {
            axios.get(`${Config.orders_url()+'/daily-report'}?${params.toString()}`, {
                headers: { "Authorization": `Bearer  ${UserSession.getUserToken()}`}
            })
                .then(response => {
                    
                    const responseData = response.data.data;
                    const pagination = response.data.dataProperties;
                    
                    // Calculate totals from the order list
                    const orderList = responseData.map((order, index) => ({
                        sequenceNo: index + 1,
                        orderDate: order.orderDate,
                        deliveryDate: order.deliveryDate || '',
                        invoiceNo: order.invoiceNo,
                        emirate: order.emirate,
                        traderName: order.traderName,
                        traderCode: order.traderCode || '',
                        totalAmount: order.totalAmount || 0,
                        deliveryAmount: order.deliveryAmount || 0,
                        traderAmount: order.traderAmount || 0,
                        customerPhoneNo: order.customerPhoneNo,
                        deliveryStatus: order.deliveryStatus
                    }));

                    // Calculate sums
                    const sums = orderList.reduce((acc, order) => ({
                        grandTotal: acc.grandTotal + (order.totalAmount || 0),
                        deliveryTotal: acc.deliveryTotal + (order.deliveryAmount || 0),
                        traderTotal: acc.traderTotal + (order.traderAmount || 0)
                    }), { grandTotal: 0, deliveryTotal: 0, traderTotal: 0 });

                    resolve({
                        orderList,
                        grandTotalAmount: sums.grandTotal,
                        totalDeliveryAmount: sums.deliveryTotal,
                        totalTraderAmount: sums.traderTotal,
                        pagination: response.data.dataProperties
                    });
                }).catch(err=>{
                console.log(err);
                reject(err);
            });
        });
    }

}