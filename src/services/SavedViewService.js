import axios from 'axios';
import { Config } from './Config';
import { AuthenticationService as UserSession } from './AuthenticationService';

const auth = () => ({ headers: { "Authorization": `Bearer ${UserSession.getUserToken()}` } });
const url = () => `${Config.base_url()}/saved-order-views`;

/** The logged-in user's saved filter tabs on the Orders page (stored on the server, per user). */
export class SavedViewService {
    /** [{ id, name, filters: { deliveryStatus, traderName, ... } }] */
    static list() {
        return axios.get(url(), auth()).then((r) => (r.data && r.data.data) || []);
    }

    static create(name, filters) {
        return axios.post(url(), { name, filters }, auth()).then((r) => r.data && r.data.data);
    }

    static remove(id) {
        return axios.delete(`${url()}/${id}`, auth());
    }
}
