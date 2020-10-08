import {api, baseURL, firebaseConfig} from '@/constants/config';
import { generateChart } from 'vue-chartjs';
import Firebase from 'firebase';


export default {
  state: {
    awaitingOrders: null,
    erpNotifications: null
  },
  getters: {
    awaitingOrders: state => state.awaitingOrders,
    erpNotifications: state => state.erpNotifications,
  },
  mutations: {
    setAwaitingOrders(state, payload) {
      state.awaitingOrders = payload
    },
    setErpNotifications(state, payload) {
      state.erpNotifications = payload
    },
  },
  actions: {
    async getAwaitingOrders({commit}, payload){
      const response = await api.get('/order', {
        params: {
          status: 'awaiting',
        }
      });

      if(response.data.data.orders){
        commit('setAwaitingOrders', response.data.data.orders.map(r => {r.item = false; return r;}));
      }
    },
    async getErpNotifications({commit}, payload){
      const response = await api.get('/sac/notifications');

      if(response.data.data.sac){
        commit('setErpNotifications', response.data.data.sac);
      }
    },

    async sendAwaitingOrders({commit}, payload) {
      let items = [];
      payload.items.forEach(e => {
        items.push(e.id);
      });

      const response = await api.put('/order/awaiting', {items});
      return true;
    },
  }
}
