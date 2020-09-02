import {api, baseURL} from '@/constants/config';
export default {
  state: {
    awaitingOrders: null
  },
  getters: {
    awaitingOrders: state => state.awaitingOrders
  },
  mutations: {
    setAwaitingOrders(state, payload) {
      state.awaitingOrders = payload
    }
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

    async sendAwaitingOrders({commit}, payload) {
      let items = [];
      payload.items.forEach(e => {
        items.push(e.id);
      });

      const response = await api.put('/order/awaiting', {items});
      return true;
    }
  }
}
