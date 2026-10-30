import axios from 'axios';
import { Config } from './Config';
import { AuthenticationService as UserSession } from './AuthenticationService';

const auth = () => ({ headers: { "Authorization": `Bearer ${UserSession.getUserToken()}` } });
const data = (response) => response.data && response.data.data;

/** Dashboard numbers (see the backend's DashboardController) */
export class DashboardService {
    /** today's KPIs: createdToday, createdSameDayLastWeek, deliveredToday, deliveredSameDayLastWeek, underDelivery, delayed, delayedDays */
    static getSummary(days) {
        return axios.get(`${Config.dashboard_url()}/summary`, { ...auth(), params: { days } }).then(data);
    }

    /** { month, deliveredCount, revenue, netProfit, previous: {...} } — DELIVERED orders only */
    static getMoney(month) {
        return axios.get(`${Config.dashboard_url()}/money`, { ...auth(), params: month ? { month } : {} }).then(data);
    }

    /** [{ agentId, agentName, phoneNumber, assignedToday, deliveredToday, underDelivery, cashToCollect }] */
    static getAgentsToday() {
        return axios.get(`${Config.dashboard_url()}/agents-today`, auth()).then((r) => data(r) || []);
    }
}
